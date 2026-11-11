"""
FontGen AI Pipeline Orchestrator

Main entry point for end-to-end font generation:
1. Generative glyph creation (VecGlypher-style prompting)
2. Composition (coverage expansion via transformations)
3. UFO construction (source format)
4. Compilation (UFO → OTF/TTF)
5. QA validation (Fontbakery checks)

Typical usage:
    from generator import FontGenerator

    generator = FontGenerator(api_key="sk-...", api_type="openai")
    result = generator.generate(
        prompt="elegant serif font with high contrast",
        design_tokens={
            'weight': 'bold',
            'contrast': 'high',
            'style': 'serif',
            'mood': 'elegant'
        }
    )
    print(result['otf_url'])  # Download link
"""

import json
import os
import tempfile
import base64
from typing import Dict, Optional, Tuple
from datetime import datetime
from pathlib import Path

from composition import GlyphComposer, GlyphOutline
from vecglypher_client import VecGlypherClient, GlyphGenerationRequest
from ufo_builder import UFOBuilder
from compiler import FontCompiler
from qa_validator import FontBakeryValidator, CheckStatus


class FontGenerator:
    """
    Main orchestration engine for font generation.
    """

    def __init__(self, api_key: str, api_type: str = "openai",
                 cache_dir: Optional[str] = None):
        """
        Args:
            api_key: OpenAI or Anthropic API key
            api_type: 'openai', 'anthropic' or 'gemini'
            cache_dir: Directory for caching intermediate files (default: /tmp)
        """
        self.api_key = api_key
        self.api_type = api_type
        self.cache_dir = cache_dir or tempfile.gettempdir()
        self.session_id = datetime.now().strftime("%Y%m%d_%H%M%S")

    def generate(self, prompt: str, design_tokens: Dict,
                 export_formats: list = ['otf', 'ufo'],
                 characters: str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ") -> Dict:
        """
        Generate a complete font from prompt and design tokens.

        Args:
            prompt: User-facing design brief (e.g., "elegant serif, high contrast")
            design_tokens: Structured constraints {
                'weight': 'light' | 'regular' | 'bold',
                'contrast': 'low' | 'medium' | 'high',
                'style': 'serif' | 'sans',
                'mood': 'elegant' | 'playful' | 'technical' | etc.,
                'cap_height': 700 (in font units),
                'x_height': 500,
                'stroke_ratio': 0.12,
            }
            export_formats: List of desired export formats
            characters: Uppercase characters to generate (default: A-Z)

        Returns:
            {
                'status': 'success' | 'error',
                'font_id': 'GenFont-Bold-20261111_120000',
                'otf_url': 'data:application/octet-stream;base64,...',
                'ttf_url': '...',
                'ufo_url': '...',
                'qa_report': {
                    'status': 'PASS' | 'WARN' | 'FAIL',
                    'checks': [...]
                },
                'metadata': {
                    'family_name': 'GenFont-Bold',
                    'glyph_count': 95,
                    'generated_at': '2026-11-11T12:00:00',
                    'generation_time_ms': 5000,
                },
                'error': None | 'error message'
            }
        """
        start_time = datetime.now()

        try:
            # Phase 1: Generate base glyphs
            print(f"[Phase 1] Generating {len(characters)} base glyphs...")
            base_glyphs = self._generate_base_glyphs(prompt, design_tokens, characters)

            # Phase 2: Compose full glyph set
            print(f"[Phase 2] Composing extended glyph set...")
            all_glyphs = self._compose_glyphs(base_glyphs, design_tokens)

            # Phase 3: Build UFO
            print(f"[Phase 3] Building UFO source...")
            ufo_path = self._build_ufo(all_glyphs, design_tokens, prompt)

            # Phase 4: Compile fonts
            print(f"[Phase 4] Compiling to OTF/TTF...")
            font_paths = self._compile_fonts(ufo_path, export_formats)

            # Phase 5: Validate
            print(f"[Phase 5] Running QA validation...")
            qa_report = self._validate_font(font_paths.get('otf'))

            # Export results
            result = self._export_results(
                font_paths,
                all_glyphs,
                qa_report,
                design_tokens
            )

            # Add timing
            result['metadata']['generation_time_ms'] = int(
                (datetime.now() - start_time).total_seconds() * 1000
            )

            return result

        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
                'font_id': self.session_id,
                'metadata': {
                    'generation_time_ms': int(
                        (datetime.now() - start_time).total_seconds() * 1000
                    )
                }
            }

    def _generate_base_glyphs(self, prompt: str, design_tokens: Dict,
                               characters: str) -> Dict[str, GlyphOutline]:
        """
        Phase 1: Call LLM to generate base uppercase glyphs.
        """
        client = VecGlypherClient(self.api_key, self.api_type)

        request = GlyphGenerationRequest(
            prompt=prompt,
            design_tokens=design_tokens,
            characters=characters,
            api_key=self.api_key,
            api_type=self.api_type,
        )

        # Call generative model
        glyph_data = client.generate_base_glyphs(request)

        # Convert to GlyphOutline objects
        glyphs = {}
        for char, data in glyph_data.items():
            glyph = GlyphOutline(
                name=data.get('name', f'uni{ord(char):04X}'),
                unicode=ord(char),
                width=data.get('width', 600),
                paths=data.get('paths', []),
            )
            glyphs[char] = glyph

        print(f"  Generated {len(glyphs)} base glyphs")
        return glyphs

    def _compose_glyphs(self, base_glyphs: Dict[str, GlyphOutline],
                        design_tokens: Dict) -> Dict[str, GlyphOutline]:
        """
        Phase 2: Expand base glyph set via composition.
        """
        composer = GlyphComposer(design_tokens)
        composer.set_base_glyphs(base_glyphs)
        all_glyphs = composer.compose_all()

        stats = composer.get_statistics()
        print(f"  Composed {stats['total_glyphs']} total glyphs:")
        for cat, count in stats['categories'].items():
            print(f"    {cat}: {count}")

        return all_glyphs

    def _build_ufo(self, glyphs: Dict[str, GlyphOutline],
                   design_tokens: Dict, prompt: str) -> str:
        """
        Phase 3: Build UFO source file.
        """
        # Create font name from tokens
        weight_name = design_tokens.get('weight', 'Regular').capitalize()
        family_name = f"GenFont-{weight_name}"

        builder = UFOBuilder(family_name, designer="FontGen AI")

        # Set metadata
        builder.set_metadata({
            'family_name': family_name,
            'style_name': weight_name,
            'weight': self._weight_to_numeric(weight_name),
            'version': '1.000',
            'unique_id': f"{family_name}-{self.session_id}",
        })

        # Add glyphs
        for char, glyph in glyphs.items():
            builder.add_glyph(
                glyph_name=glyph.name,
                unicode_value=glyph.unicode or ord(char) if len(char) == 1 else 0,
                svg_paths=glyph.paths,
                advance_width=glyph.width,
                components=glyph.components,
            )

        # Build UFO ZIP
        ufo_dir = os.path.join(self.cache_dir, self.session_id)
        os.makedirs(ufo_dir, exist_ok=True)
        ufo_path = builder.build_ufo_directory(ufo_dir)

        print(f"  Built UFO with {len(glyphs)} glyphs at {ufo_path}")
        return ufo_path

    def _compile_fonts(self, ufo_path: str,
                       formats: list) -> Dict[str, str]:
        """
        Phase 4: Compile UFO to binary formats.
        """
        compiler = FontCompiler(ufo_path)
        results = {}

        output_dir = os.path.join(self.cache_dir, self.session_id)

        if 'otf' in formats:
            otf_path = os.path.join(output_dir, 'font.otf')
            try:
                compiler.compile_otf(otf_path)
                results['otf'] = otf_path
                size_kb = os.path.getsize(otf_path) / 1024
                print(f"  Compiled OTF: {otf_path} ({size_kb:.1f} KB)")
            except Exception as e:
                print(f"  OTF compilation failed: {e}")

        if 'ttf' in formats:
            ttf_path = os.path.join(output_dir, 'font.ttf')
            try:
                compiler.compile_ttf(ttf_path)
                results['ttf'] = ttf_path
                size_kb = os.path.getsize(ttf_path) / 1024
                print(f"  Compiled TTF: {ttf_path} ({size_kb:.1f} KB)")
            except Exception as e:
                print(f"  TTF compilation failed: {e}")

        results['ufo'] = ufo_path
        return results

    def _validate_font(self, font_path: Optional[str]) -> Dict:
        """
        Phase 5: Run QA checks.
        """
        if not font_path or not os.path.exists(font_path):
            return {
                'status': 'WARN',
                'message': 'Font file not available for validation',
                'checks': [],
            }

        validator = FontBakeryValidator(font_path)
        return validator.run_all_checks()

    def _export_results(self, font_paths: Dict, glyphs: Dict[str, GlyphOutline],
                        qa_report: Dict, design_tokens: Dict) -> Dict:
        """
        Export results with data URLs or download links.
        """
        result = {
            'status': 'success',
            'font_id': self.session_id,
            'metadata': {
                'family_name': f"GenFont-{design_tokens.get('weight', 'Regular').capitalize()}",
                'glyph_count': len(glyphs),
                'generated_at': datetime.now().isoformat(),
                'design_tokens': design_tokens,
            },
            'qa_report': qa_report,
            'urls': {},
        }

        # Convert font files to data URLs (for client-side download)
        for fmt in ['otf', 'ttf', 'ufo']:
            path = font_paths.get(fmt)
            if path and os.path.exists(path):
                result['urls'][fmt] = self._file_to_data_url(path, fmt)

        return result

    def _file_to_data_url(self, file_path: str, format_type: str) -> str:
        """
        Convert file to data URL for embedding or download.
        """
        mime_types = {
            'otf': 'application/vnd.ms-fontobject',
            'ttf': 'application/x-font-ttf',
            'ufo': 'application/zip',
        }

        mime = mime_types.get(format_type, 'application/octet-stream')

        with open(file_path, 'rb') as f:
            data = base64.b64encode(f.read()).decode('utf-8')

        return f"data:{mime};base64,{data}"

    def _weight_to_numeric(self, weight_name: str) -> int:
        """Convert weight name to numeric value."""
        mapping = {
            'thin': 100,
            'extralight': 200,
            'light': 300,
            'regular': 400,
            'medium': 500,
            'semibold': 600,
            'bold': 700,
            'extrabold': 800,
            'black': 900,
        }
        return mapping.get(weight_name.lower(), 400)


class FontGeneratorAPI:
    """
    HTTP API wrapper for font generation.
    """

    def __init__(self):
        self.generator = None

    def generate_from_request(self, request_body: Dict) -> Dict:
        """
        Process generate request from API.

        Expected body:
        {
            "prompt": "elegant serif, high contrast",
            "designTokens": {
                "weight": "bold",
                "contrast": "high",
                "style": "serif"
            },
            "apiKey": "sk-..."
        }
        """
        try:
            api_key = request_body.get('apiKey')
            if not api_key:
                return {'status': 'error', 'error': 'Missing apiKey'}

            prompt = request_body.get('prompt', 'default serif font')
            design_tokens = request_body.get('designTokens', {})

            self.generator = FontGenerator(api_key, api_type='openai')
            result = self.generator.generate(
                prompt=prompt,
                design_tokens=design_tokens
            )

            return result

        except Exception as e:
            return {
                'status': 'error',
                'error': str(e),
            }


# CLI Entry Point
if __name__ == '__main__':
    import sys

    if len(sys.argv) < 3:
        print("Usage: python generator.py <api_key> <prompt>")
        print("  Example: python generator.py sk-... 'elegant serif'")
        sys.exit(1)

    api_key = sys.argv[1]
    prompt = sys.argv[2]

    generator = FontGenerator(api_key, api_type='openai')

    design_tokens = {
        'weight': 'bold',
        'contrast': 'high',
        'style': 'serif',
        'mood': 'elegant',
        'cap_height': 700,
        'x_height': 500,
    }

    result = generator.generate(prompt, design_tokens)

    print("\n=== Font Generation Result ===")
    print(json.dumps(result, indent=2))
