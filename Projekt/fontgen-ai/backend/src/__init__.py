"""
FontGen AI Backend — Font generation pipeline orchestration.

Main components:
- generator: Main entry point (FontGenerator orchestrator)
- vecglypher_client: LLM API calls for glyph generation
- composition: Glyph composition rules (derive lowercase, accents, digits, symbols)
- ufo_builder: UFO source file construction
- compiler: UFO to OTF/TTF compilation
- qa_validator: Font validation and QA checks
"""

__version__ = "0.1.0"
__author__ = "FontGen AI Team"
__license__ = "OFL (for fonts) / TBD (for code)"

from .generator import FontGenerator, FontGeneratorAPI
from .composition import GlyphComposer, GlyphOutline
from .ufo_builder import UFOBuilder
from .compiler import FontCompiler
from .qa_validator import FontBakeryValidator

__all__ = [
    "FontGenerator",
    "FontGeneratorAPI",
    "GlyphComposer",
    "GlyphOutline",
    "UFOBuilder",
    "FontCompiler",
    "FontBakeryValidator",
]
