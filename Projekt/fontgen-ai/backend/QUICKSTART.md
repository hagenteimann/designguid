# Quick Start Guide — Font Generator Backend

Get up and running in 5 minutes.

## 1. Install Dependencies

```bash
cd /home/user/designguid/Projekt/fontgen-ai/backend

# Install core dependencies
pip install -r requirements.txt

# Optional: Install API server dependencies
pip install -r requirements-api.txt
```

**Verify installation:**
```bash
python -c "from fontTools.ttLib import TTFont; print('fontTools OK')"
python -c "from ufoLib2 import UFOReader; print('ufoLib2 OK')"
```

## 2. Test the Pipeline (CLI)

```bash
# Set your API key
export OPENAI_API_KEY="sk-..."  # or ANTHROPIC_API_KEY

# Run a simple generation
python -c "
from src.generator import FontGenerator

gen = FontGenerator(api_key='$OPENAI_API_KEY', api_type='openai')

result = gen.generate(
    prompt='clean sans serif font',
    design_tokens={
        'weight': 'regular',
        'contrast': 'medium',
        'style': 'sans',
    }
)

print(f'Status: {result[\"status\"]}')
print(f'Font ID: {result[\"font_id\"]}')
if result['status'] == 'success':
    print(f'Glyphs: {result[\"metadata\"][\"glyph_count\"]}')
    print(f'QA: {result[\"qa_report\"][\"status\"]}')
"
```

## 3. Run Tests

```bash
# Install test dependencies (if not already installed)
pip install pytest

# Run all tests
python -m pytest tests/ -v

# Run specific module
python -m pytest tests/test_composition.py -v

# Run with coverage report
pip install pytest-cov
python -m pytest tests/ --cov=src --cov-report=html
```

## 4. Start the API Server

```bash
# Development (auto-reload)
export FLASK_ENV=development
python api_server.py

# Or using Flask CLI
export FLASK_APP=api_server.py
flask run --port 5000

# Production (with Gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

**Test API health:**
```bash
curl http://localhost:5000/health
# Should return:
# {"status": "ok", "service": "FontGen AI Backend", "version": "0.1.0"}
```

## 5. Generate a Font via API

```bash
curl -X POST http://localhost:5000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "elegant serif with high contrast",
    "designTokens": {
      "weight": "bold",
      "contrast": "high",
      "style": "serif",
      "mood": "elegant"
    },
    "apiKey": "sk-...",
    "apiType": "openai"
  }'
```

**Expected response (200 OK):**
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
    "summary": {"total_checks": 10, "passed": 10, "warned": 0, "failed": 0}
  },
  "metadata": {
    "family_name": "GenFont-Bold",
    "glyph_count": 95,
    "generated_at": "2026-11-11T12:00:00Z",
    "generation_time_ms": 4800
  }
}
```

## 6. Use Design Tokens Reference

Get available design token options:

```bash
curl http://localhost:5000/api/design-tokens/schema
```

**Common design token patterns:**

```json
{
  "elegant": {
    "weight": "bold",
    "contrast": "high",
    "style": "serif",
    "mood": "elegant"
  },
  
  "modern": {
    "weight": "regular",
    "contrast": "medium",
    "style": "sans",
    "mood": "technical"
  },
  
  "playful": {
    "weight": "regular",
    "contrast": "low",
    "style": "sans",
    "mood": "playful"
  }
}
```

## 7. Inspect Generated Fonts

### Extract OTF from data URL

```bash
# Save base64 data to file
FONT_DATA="data:application/vnd.ms-fontobject;base64,AAEAAAALAIAAAwAwT1..."

# Extract base64 part (after comma)
BASE64=$(echo "$FONT_DATA" | cut -d, -f2)

# Decode to binary
echo "$BASE64" | base64 -d > font.otf

# Verify font
python -c "
from fontTools.ttLib import TTFont
font = TTFont('font.otf')
print(f'Family: {font[\"name\"]}')
print(f'Glyphs: {len(font.getGlyphOrder())}')
print(f'Tables: {list(font.keys())}')
"
```

### Inspect UFO structure

```bash
# Extract UFO ZIP
unzip font.ufo.zip

# Check contents
cd GenFont-Bold.ufo/
ls -la

# View metadata
cat fontinfo.plist

# Count glyphs
ls glyphs/*.glif | wc -l

# Inspect single glyph
cat glyphs/uni0041.glif  # See GLIF XML for glyph 'A'
```

## 8. Troubleshooting

### "ModuleNotFoundError: No module named 'fontTools'"

```bash
pip install --upgrade fonttools
```

### "API key rejected"

- Check key is valid and not expired
- Verify no typos
- Ensure key has sufficient credits
- Try with different model (`openai` vs `anthropic`)

### "UFO compilation failed"

```bash
# Check if ufo2ft is available
python -c "from ufo2ft import compileTTF; print('ufo2ft OK')"

# If not, install it
pip install ufo2ft

# If still failing, check error message
python src/generator.py "sk-..." "test prompt" 2>&1 | tail -20
```

### "QA checks failing"

Run validation separately:
```bash
python -c "
from src.qa_validator import FontBakeryValidator

validator = FontBakeryValidator('font.otf')
report = validator.run_all_checks()

import json
print(json.dumps(report, indent=2))
"
```

## 9. Development Tips

### Enable Debug Logging

```bash
export FLASK_DEBUG=1
export FLASK_ENV=development
python api_server.py
```

### Profile Performance

```bash
python -c "
import time
from src.generator import FontGenerator

gen = FontGenerator(api_key='sk-...', api_type='openai')

start = time.time()
result = gen.generate(
    prompt='test',
    design_tokens={'weight': 'regular', 'style': 'sans'}
)
elapsed = time.time() - start

print(f'Total time: {elapsed:.2f}s')
print(f'Metadata time: {result[\"metadata\"][\"generation_time_ms\"]}ms')
"
```

### Inspect Intermediate Files

```bash
# Generation creates temporary files in /tmp
ls -lah /tmp/fontgen_* 2>/dev/null || echo "No cache"

# Check specific session
FONT_ID="GenFont-Bold-20261111_120000"
ls -lah "/tmp/$FONT_ID/"
```

### Add Debug Print Statements

Edit `src/generator.py`:
```python
print(f"[DEBUG] Phase 1: Generating glyphs...")
print(f"[DEBUG] Phase 1 complete. Got {len(base_glyphs)} glyphs")
```

## 10. Next Steps

### For Frontend Integration
- Frontend will call `POST /api/generate`
- Handle async generation (maybe add polling endpoint)
- Display download links from response `urls` object
- Show QA report status (PASS/WARN/FAIL)

### For Production Deployment
- Set up `.env` file with API keys
- Use Gunicorn + Nginx for production
- Add rate limiting (Flask-Limiter)
- Add request logging (structlog)
- Monitor API usage and costs

### For Feature Development
- See `IMPLEMENTATION_SUMMARY.md` for roadmap
- New composition rules go in `src/composition.py`
- New QA checks go in `src/qa_validator.py`
- Add tests in `tests/`

---

## Useful Commands

```bash
# Check Python version
python --version

# List installed packages
pip list | grep -E "fontTools|ufo|flask"

# Run linting (optional)
pip install pylint
pylint src/generator.py

# Format code (optional)
pip install black
black src/

# Type checking (optional)
pip install mypy
mypy src/generator.py
```

---

**Status**: Ready to integrate with frontend  
**Next**: Frontend React app calls this API server  
**Questions?** See `README.md` for full documentation
