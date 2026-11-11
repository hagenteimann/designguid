"""
Unit tests for composition module.

Tests lowercase derivation, accent composition, digit scaling, and symbols.
"""

import unittest
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from composition import GlyphOutline, GlyphComposer, CompositionRules


class TestGlyphOutline(unittest.TestCase):
    """Test GlyphOutline dataclass."""

    def test_creation(self):
        """Test basic glyph creation."""
        glyph = GlyphOutline(
            name='uni0041',
            unicode=0x41,
            width=600,
        )

        self.assertEqual(glyph.name, 'uni0041')
        self.assertEqual(glyph.unicode, 0x41)
        self.assertEqual(glyph.width, 600)
        self.assertEqual(glyph.paths, [])
        self.assertEqual(glyph.components, [])

    def test_with_paths(self):
        """Test glyph with SVG paths."""
        paths = ['M100,0 L500,700 Z']
        glyph = GlyphOutline(
            name='A',
            unicode=ord('A'),
            paths=paths,
        )

        self.assertEqual(glyph.paths, paths)


class TestCompositionRules(unittest.TestCase):
    """Test composition rules definitions."""

    def test_accented_chars(self):
        """Test accented character mappings."""
        self.assertIn('á', CompositionRules.ACCENTED_CHARS)
        self.assertEqual(CompositionRules.ACCENTED_CHARS['á'], ('a', 'acute'))
        self.assertEqual(CompositionRules.ACCENTED_CHARS['ñ'], ('n', 'tilde'))

    def test_digit_scales(self):
        """Test digit optical sizing scales."""
        # '1' should be narrower
        self.assertLess(
            CompositionRules.DIGIT_SCALES['1'],
            CompositionRules.DIGIT_SCALES['0']
        )

    def test_accents_defined(self):
        """Test accent definitions."""
        self.assertIn('acute', CompositionRules.ACCENTS)
        self.assertEqual(CompositionRules.ACCENTS['acute']['unicode'], 0x0301)


class TestGlyphComposer(unittest.TestCase):
    """Test GlyphComposer orchestration."""

    def setUp(self):
        """Create test composer and base glyphs."""
        self.design_tokens = {
            'weight': 'regular',
            'style': 'serif',
            'cap_height': 700,
            'x_height': 500,
            'contrast': 'medium',
        }

        self.composer = GlyphComposer(self.design_tokens)

        # Create dummy base glyphs (A-Z)
        self.base_glyphs = {}
        for char_code in range(ord('A'), ord('Z') + 1):
            char = chr(char_code)
            self.base_glyphs[char] = GlyphOutline(
                name=f'uni{char_code:04X}',
                unicode=char_code,
                width=600,
                paths=[f'M100,0 L500,700 Z'],  # Simple triangle
            )

    def test_set_base_glyphs(self):
        """Test setting base glyphs."""
        self.composer.set_base_glyphs(self.base_glyphs)
        self.assertEqual(len(self.composer.base_glyphs), 26)

    def test_compose_all(self):
        """Test full composition pipeline."""
        self.composer.set_base_glyphs(self.base_glyphs)
        all_glyphs = self.composer.compose_all()

        # Should have uppercase + derived
        self.assertGreater(len(all_glyphs), 26)

    def test_lowercase_derivation(self):
        """Test lowercase is derived from uppercase."""
        self.composer.set_base_glyphs(self.base_glyphs)
        lowercase = self.composer._derive_lowercase()

        # Should have a-z
        self.assertEqual(len(lowercase), 26)
        self.assertIn('a', lowercase)
        self.assertIn('z', lowercase)

        # Lowercase should be smaller
        self.assertLess(
            lowercase['a'].width,
            self.base_glyphs['A'].width
        )

    def test_accented_composition(self):
        """Test accented character composition."""
        self.composer.set_base_glyphs(self.base_glyphs)
        self.composer._derive_lowercase()  # Need lowercase for accents
        accented = self.composer._derive_accented()

        # Should have common accented chars
        self.assertIn('á', accented)
        self.assertIn('ñ', accented)
        self.assertIn('ü', accented)

        # Accented chars should use components
        a_acute = accented['á']
        self.assertGreater(len(a_acute.components), 0)

    def test_digits_generation(self):
        """Test digit generation."""
        self.composer.set_base_glyphs(self.base_glyphs)
        digits = self.composer._derive_digits()

        # Should have 0-9
        self.assertEqual(len(digits), 10)
        for char in '0123456789':
            self.assertIn(char, digits)

    def test_symbols_generation(self):
        """Test symbol generation."""
        self.composer.set_base_glyphs(self.base_glyphs)
        symbols = self.composer._derive_symbols()

        # Should have common punctuation
        self.assertIn('.', symbols)
        self.assertIn(',', symbols)
        self.assertIn('!', symbols)
        self.assertIn('?', symbols)

    def test_spaces_generation(self):
        """Test space glyph generation."""
        self.composer.set_base_glyphs(self.base_glyphs)
        spaces = self.composer._derive_spaces()

        # Should have space and tab
        self.assertIn(' ', spaces)
        self.assertIn('\t', spaces)

        # Space should have width, tab should have more
        self.assertGreater(spaces['\t'].width, spaces[' '].width)

    def test_statistics(self):
        """Test composition statistics."""
        self.composer.set_base_glyphs(self.base_glyphs)
        all_glyphs = self.composer.compose_all()

        stats = self.composer.get_statistics()

        self.assertEqual(stats['base_glyphs'], 26)
        self.assertGreater(stats['total_glyphs'], 95)
        self.assertEqual(stats['categories']['uppercase'], 26)
        self.assertGreaterEqual(stats['categories']['lowercase'], 20)
        self.assertEqual(stats['categories']['digits'], 10)


class TestCompositionIntegration(unittest.TestCase):
    """Integration tests for composition pipeline."""

    def test_full_latin_coverage(self):
        """Test that composition produces full basic Latin coverage."""
        design_tokens = {
            'weight': 'bold',
            'style': 'sans',
            'cap_height': 700,
            'x_height': 500,
        }

        composer = GlyphComposer(design_tokens)

        # Create base A-Z
        base = {}
        for i in range(26):
            char = chr(ord('A') + i)
            base[char] = GlyphOutline(
                name=f'uni{ord(char):04X}',
                unicode=ord(char),
                width=600,
            )

        composer.set_base_glyphs(base)
        all_glyphs = composer.compose_all()

        # Check coverage
        # Basic Latin: A-Z, a-z, 0-9, space, common punctuation
        required = set('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?')
        available = set(all_glyphs.keys())

        missing = required - available
        self.assertEqual(missing, set(), f"Missing glyphs: {missing}")

    def test_composition_preserves_style(self):
        """Test that composition maintains style coherence."""
        design_tokens = {
            'weight': 'bold',
            'style': 'serif',
            'cap_height': 700,
            'x_height': 500,
            'stroke_ratio': 0.15,
        }

        composer = GlyphComposer(design_tokens)

        base = {}
        base['A'] = GlyphOutline(
            name='uni0041',
            unicode=ord('A'),
            width=600,
            paths=['M100,0 L350,700 L600,0 Z'],
        )

        composer.set_base_glyphs(base)

        # Derived 'a' should reference base 'A'
        lowercase = composer._derive_lowercase()
        a = lowercase.get('a')

        self.assertIsNotNone(a)
        # Should use component reference or transform
        self.assertEqual(a.name, 'uni0061')


if __name__ == '__main__':
    unittest.main()
