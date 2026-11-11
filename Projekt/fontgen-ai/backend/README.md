# FontGen AI - Backend Font Generation Pipeline

Production-grade font generation orchestration engine converting design briefs into OTF/TTF files via AI + compositional rules.

## Architecture Overview

```
                    ┌─────────────────────────┐
                    │   FontGenerator         │
                    │   (Orchestrator)        │
                    └────────┬────────────────┘
                             │
        ┌────────────┬────────┼────────┬─────────────┐
        ▼            ▼        ▼        ▼             ▼
   Phase 1:    Phase 2:  Phase 3:  Phase 4:    Phase 5:
   VecGlypher  Composer  UFOBuilder Compiler   Validator
   (LLM Gen)   (Derive)  (Source)   (Compile)  (QA)
        │            │        │        │             │
        └────────────┴────────┴────────┴─────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Binary Fonts    │
                    │  + UFO Source    │
                    │  + QA Report     │
                    └──────────────────┘
```

## Core Modules

### 1. `generator.py` — Main Orchestration
**Coordinates all phases of font generation.**

```python
from src.generator import FontGenerator

generator = FontGenerator(
    api_key="sk-...",
    api_type="openai"
)

result = generator.generate(
    prompt="elegant serif with high contrast",
    design_tokens={
        'weight': 'bold',
        'contrast': 'high',
        'style': 'serif',
        'mood': 'elegant',
    }
)

# Returns:
{
    'status': 'success',
    'font_id': 'GenFont-Bold-20261111_120000',
    'urls': {
        'otf': 'data:application/vnd.ms-fontobject;base64,...',
        'ttf': '...',
        'ufo': '...',
    },
    'qa_report': {...},
    'metadata': {...}
}
```

### 2. `vecglypher_client.py` — Generative Glyph Creation
**Calls LLM (Claude/GPT-4V) to generate base Latin uppercase glyphs.**

- **Input**: Prompt + design tokens as scaffolding
- **Output**: SVG path data for A-Z
- **Key insight**: Design tokens constrain output; reduce hallucinations
- **Fallback**: Returns placeholder glyphs if LLM fails

```python
from src.vecglypher_client import VecGlypherClient, GlyphGenerationRequest

client = VecGlypherClient(api_key="sk-...", api_type="openai")

glyphs = client.generate_base_glyphs(
    GlyphGenerationRequest(
        prompt="elegant, high contrast",
        design_tokens={'weight': 'bold', ...},
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )
)
```

### 3. `composition.py` — Glyph Coverage via Composition
**Derives lowercase, accented characters, digits, and symbols from base glyphs.**

Techniques:
- **Lowercase**: Scale uppercase to x-height (~70%), keep width proportional
- **Accents**: Combine base glyphs + diacritics (é = e + acute)
- **Digits**: Optical sizing rules (e.g., '1' narrower than '0')
- **Symbols**: Mirror/transform brackets, derive punctuation

**Coverage**: 95+ glyphs from 26 base glyphs

```python
from src.composition import GlyphComposer

composer = GlyphComposer(design_tokens)
composer.set_base_glyphs(base_glyphs)  # {A-Z: GlyphOutline}
all_glyphs = composer.compose_all()     # {A-Z, a-z, 0-9, symbols}
```

### 4. `ufo_builder.py` — UFO (Unified Font Object) Construction
**Builds UFO v3 source files (XML-based, human-readable).**

- **Format**: UFO is the industry standard for font sources
- **Outputs**: Directory structure or ZIP archive
- **Portability**: Editable in FontLab, Glyphs, FontForge, etc.
- **Version control**: Git-friendly XML, not binary

```python
from src.ufo_builder import UFOBuilder

builder = UFOBuilder('GenFont-Bold')
builder.set_metadata({
    'family_name': 'GenFont',
    'style_name': 'Bold',
    'weight': 700,
})

for char, glyph in all_glyphs.items():
    builder.add_glyph(
        glyph_name=glyph.name,
        unicode_value=glyph.unicode,
        svg_paths=glyph.paths,
        advance_width=glyph.width,
    )

ufo_path = builder.build_ufo_directory('./output/')
# or
zip_path = builder.build_ufo_zip('./output/font.ufo.zip')
```

### 5. `compiler.py` — UFO → OTF/TTF Compilation
**Converts UFO source to binary OpenType fonts.**

- **ufo2ft integration**: Uses fontTools under the hood
- **Formats**: CFF (PostScript OTF) or TrueType (TTF)
- **Fallback**: Manual compilation if ufo2ft unavailable
- **Validation**: Builds required tables (cmap, hmtx, head, OS/2, name, post)

```python
from src.compiler import FontCompiler

compiler = FontCompiler(ufo_path)

# Compile to OTF (CFF flavor)
otf_path = compiler.compile_otf('./output/font.otf')

# Compile to TTF
ttf_path = compiler.compile_ttf('./output/font.ttf')

# Validate
validation = compiler.validate()
```

### 6. `qa_validator.py` — Fontbakery QA Checks
**Automated quality assurance before delivery.**

Checks:
- **Structure**: Required tables, glyph count
- **Coverage**: ASCII, Latin-1, Extended-A ranges
- **Licensing**: OFL compliance, copyright notices
- **Metrics**: Baseline, ascender/descender, advance widths
- **Rendering**: Glyph outlines present, outline format (TTF/CFF)

```python
from src.qa_validator import FontBakeryValidator

validator = FontBakeryValidator('./output/font.otf')
report = validator.run_all_checks()

# Returns:
{
    'status': 'PASS' | 'WARN' | 'FAIL',
    'summary': {'total_checks': 10, 'passed': 9, 'warned': 1, 'failed': 0},
    'checks': [{...}, ...],
    'blockers': [...]  # FAIL checks only
}
```

## REST API

### Endpoint: `POST /api/generate`

**Generate a font from prompt and design tokens.**

**Request:**
```json
{
  "prompt": "elegant serif with high contrast",
  "designTokens": {
    "weight": "bold",
    "contrast": "high",
    "style": "serif",
    "mood": "elegant",
    "cap_height": 700,
    "x_height": 500
  },
  "apiKey": "sk-...",
  "apiType": "openai"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "fontId": "GenFont-Bold-20261111_120000",
  "urls": {
    "otf": "data:application/vnd.ms-fontobject;base64,...",
    "ttf": "data:application/x-font-ttf;base64,...",
    "ufo": "data:application/zip;base64,..."
  },
  "qaReport": {
    "status": "PASS",
    "summary": {
      "total_checks": 10,
      "passed": 10,
      "warned": 0,
      "failed": 0
    },
    "checks": [...]
  },
  "metadata": {
    "family_name": "GenFont-Bold",
    "glyph_count": 95,
    "generated_at": "2026-11-11T12:00:00.000Z",
    "generation_time_ms": 4800,
    "design_tokens": {...}
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "error": "Invalid API key",
  "font_id": "GenFont-Bold-20261111_120000",
  "metadata": {
    "generation_time_ms": 150
  }
}
```

### Other Endpoints

- `GET /health` — Service health check
- `GET /api/design-tokens/schema` — Design tokens reference
- `GET /api/design-tokens/schema` — Available token options
- `GET /api/errors` — Error code reference

## Installation & Setup

### 1. Install Dependencies

```bash
cd /home/user/designguid/Projekt/fontgen-ai/backend
pip install -r requirements.txt
```

Required packages:
- `fonttools>=4.58.4` — Font compilation and validation
- `uharfbuzz>=0.16.0` — Text shaping
- `fontbakery>=0.9.0` — QA checks
- `ufoLib2>=0.17.0` — UFO handling
- `requests>=2.31.0` — HTTP client
- `Pillow>=10.0.0` — Image processing
- `flask` & `flask-cors` — REST API

### 2. Run API Server

```bash
# Development
export FLASK_ENV=development
export FLASK_APP=api_server.py
python -m flask run --port 5000

# Or directly
python api_server.py
```

Server listens on `http://0.0.0.0:5000`

### 3. Test the Pipeline

```bash
# CLI test
python -c "
from src.generator import FontGenerator

gen = FontGenerator(api_key='sk-test', api_type='openai')
result = gen.generate(
    prompt='clean sans serif',
    design_tokens={'weight': 'regular', 'contrast': 'medium', 'style': 'sans'}
)
print(result)
"

# Or run unit tests
python -m pytest tests/
```

## Design Tokens Reference

All tokens are optional; defaults are provided for missing values.

| Token | Type | Options | Default | Notes |
|-------|------|---------|---------|-------|
| `weight` | string | `light`, `regular`, `bold` | `regular` | Affects stroke width & spacing |
| `contrast` | string | `low`, `medium`, `high` | `medium` | Serif thickness variation |
| `style` | string | `serif`, `sans`, `display` | `sans` | Font family category |
| `mood` | string | `elegant`, `playful`, `technical`, `bold`, `neutral` | `neutral` | Affects character personality |
| `cap_height` | number | 600–800 | 700 | Height of uppercase letters (font units) |
| `x_height` | number | 400–600 | 500 | Height of lowercase x (font units) |
| `stroke_ratio` | number | 0.08–0.20 | 0.12 | Stroke width as % of cap height |

Example with all tokens:
```json
{
  "weight": "bold",
  "contrast": "high",
  "style": "serif",
  "mood": "elegant",
  "cap_height": 700,
  "x_height": 500,
  "stroke_ratio": 0.15
}
```

## Glyph Coverage

**MVP Scope (95+ glyphs):**

| Category | Count | Examples |
|----------|-------|----------|
| Uppercase | 26 | A-Z |
| Lowercase | 26 | a-z |
| Digits | 10 | 0-9 |
| Punctuation | 15 | . , ! ? : ; |
| Symbols | 10 | ( ) [ ] { } @ # % |
| Accented | 10 | á é ñ ü ç |
| Spaces | 2 | space, tab |

Total: **99 glyphs**

## Output Formats

### OTF (OpenType Font)
- **Flavor**: CFF (PostScript) or TTF
- **Size**: ~50–100 KB (typical)
- **Compatibility**: All modern systems, web browsers
- **Best for**: Web delivery, universal compatibility

### TTF (TrueType Font)
- **Size**: ~60–120 KB
- **Compatibility**: All systems
- **Best for**: Maximum compatibility, embedded fonts

### UFO (Unified Font Object)
- **Format**: ZIP archive with XML structure
- **Purpose**: Editable source for designers
- **Portability**: Cross-platform, version-control-friendly
- **Best for**: Downstream editing in font editors

## Error Handling

The API returns structured error responses:

```json
{
  "status": "error",
  "error": "Error description",
  "error_code": "INVALID_API_KEY"
}
```

Common error codes:
- `INVALID_API_KEY` — API key is invalid/expired
- `RATE_LIMITED` — Rate limit exceeded (provider side)
- `INVALID_PROMPT` — Prompt too vague or invalid
- `INVALID_TOKENS` — Design tokens malformed
- `GENERATION_FAILED` — Glyph generation failed
- `COMPILATION_FAILED` — Font compilation failed
- `VALIDATION_FAILED` — Font failed QA checks

## Performance Characteristics

Typical generation time: **4–6 seconds**

Breakdown:
- Glyph generation (LLM call): 2–3 seconds
- Composition: 0.1 seconds
- UFO building: 0.2 seconds
- Compilation: 1–2 seconds
- Validation: 0.5 seconds

Optimization opportunities (post-MVP):
- Cache base glyph templates
- Parallel compilation (OTF + TTF)
- Async LLM calls with polling
- Pre-generate common prompt variants

## Development Roadmap

### Phase 1 (MVP) — Current
- Single-weight Latin fonts (A-Z, a-z, 0-9, basic symbols)
- Basic composition rules
- No hinting or advanced GSUB/GPOS
- Manual QA checks sufficient

### Phase 2 (Post-MVP)
- Multi-weight variable fonts
- Extended character coverage (Latin Extended-A/B)
- Kerning pair generation
- Advanced OpenType features (ligatures, alternates)

### Phase 3 (Research)
- Skeleton-based glyph structure (coherence enforcement)
- Parametric design token encoding
- Diffusion model conditioning for cross-glyph consistency
- ML-based coherence metrics

## Licensing

All generated fonts under **OFL (SIL Open Font License)**:
- Fonts are free to use, modify, redistribute
- Designer attribution required
- Reserved font names must be changed
- No selling fonts; can sell design services

See `/GUIDES/03_EXECUTION/components.md` for licensing details.

## Testing

### Unit Tests
```bash
python -m pytest tests/ -v

# Specific module
python -m pytest tests/test_composition.py -v
```

### Integration Test
```bash
# Full pipeline end-to-end
python src/generator.py "sk-test-key" "elegant serif"
```

### API Test
```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "elegant serif",
    "designTokens": {"weight": "bold", "contrast": "high"},
    "apiKey": "sk-..."
  }'
```

## Troubleshooting

### `ModuleNotFoundError: No module named 'fontTools'`
```bash
pip install -r requirements.txt
```

### `ufo2ft not available` (fallback to manual compilation)
The system falls back to manual UFO compilation. Results are functional but less optimized.

### `ImportError: cannot import name 'TTFont'`
Update fontTools:
```bash
pip install --upgrade fonttools
```

### API key rejected
Check:
- Key is valid and not expired
- Key has sufficient API credits
- No typos in key string

## Contributing

Submit improvements via pull request to `/Projekt/fontgen-ai/backend/`:
1. Write unit tests for new modules
2. Follow existing code style (docstrings, type hints)
3. Update README if adding features
4. Test on Python 3.11+

## References

- **VecGlypher (Meta, Feb 2026)**: https://www.alphaxiv.org/abs/2602.21461
- **UFO Specification**: https://unifiedfontobject.org/
- **fontTools Documentation**: https://fonttools.readthedocs.io/
- **OpenType Spec**: https://learn.microsoft.com/typography/opentype/spec/
- **SIL Open Font License**: https://openfontlicense.org/

---

**Status**: Production-ready MVP (v0.1.0)  
**Last updated**: 2026-11-11  
**Next review**: Post-MVP research on glyph coherence
