"""
Unit tests for UFO builder module.

Tests UFO structure creation, GLIF generation, and metadata handling.
"""

import unittest
import sys
import os
import tempfile
from pathlib import Path
import xml.etree.ElementTree as ET

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from ufo_builder import UFOBuilder


class TestUFOBuilder(unittest.TestCase):
    """Test UFOBuilder functionality."""

    def setUp(self):
        """Create temporary directory for UFO files."""
        self.temp_dir = tempfile.mkdtemp()
        self.builder = UFOBuilder(
            font_name='TestFont-Regular',
            designer='Test Designer',
        )

    def tearDown(self):
        """Clean up temporary files."""
        import shutil
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def test_creation(self):
        """Test UFOBuilder initialization."""
        self.assertEqual(self.builder.font_name, 'TestFont-Regular')
        self.assertEqual(self.builder.designer, 'Test Designer')
        self.assertIn('Copyright', self.builder.copyright_text)
        self.assertIn('OFL', self.builder.copyright_text)

    def test_set_metadata(self):
        """Test metadata setting."""
        metadata = {
            'family_name': 'TestFont',
            'style_name': 'Regular',
            'weight': 400,
            'version': '1.000',
        }

        self.builder.set_metadata(metadata)
        self.assertEqual(self.builder.metadata, metadata)

    def test_add_glyph(self):
        """Test adding glyphs."""
        self.builder.add_glyph(
            glyph_name='uni0041',
            unicode_value=0x41,
            svg_paths=['M100,0 L500,700 L900,0 Z'],
            advance_width=600,
        )

        self.assertIn('uni0041', self.builder.glyphs)
        glyph = self.builder.glyphs['uni0041']
        self.assertEqual(glyph['unicode'], 0x41)
        self.assertEqual(glyph['width'], 600)

    def test_add_multiple_glyphs(self):
        """Test adding multiple glyphs."""
        for i in range(5):
            self.builder.add_glyph(
                glyph_name=f'uni{0x41+i:04X}',
                unicode_value=0x41 + i,
                svg_paths=['M0,0 L100,100 Z'],
                advance_width=500,
            )

        self.assertEqual(len(self.builder.glyphs), 5)

    def test_metainfo_generation(self):
        """Test metainfo.plist generation."""
        metainfo = self.builder._generate_metainfo()

        self.assertIn('<?xml', metainfo)
        self.assertIn('plist', metainfo)
        self.assertIn('formatVersion', metainfo)
        self.assertIn('<integer>3</integer>', metainfo)

    def test_fontinfo_generation(self):
        """Test fontinfo.plist generation."""
        self.builder.set_metadata({
            'family_name': 'TestFamily',
            'style_name': 'Bold',
            'weight': 700,
        })

        fontinfo = self.builder._generate_fontinfo()

        self.assertIn('TestFamily', fontinfo)
        self.assertIn('Bold', fontinfo)
        self.assertIn('<integer>700</integer>', fontinfo)
        self.assertIn('copyright', fontinfo)

    def test_panose_weight_mapping(self):
        """Test PANOSE weight conversion."""
        test_cases = [
            (100, 2),   # Thin
            (300, 3),   # Light
            (400, 5),   # Medium/Regular
            (700, 7),   # Bold
            (900, 8),   # Extra bold
        ]

        for weight, expected_panose in test_cases:
            panose = self.builder._panose_weight(weight)
            self.assertEqual(panose, expected_panose)

    def test_contents_generation(self):
        """Test contents.plist generation."""
        self.builder.add_glyph('uni0041', 0x41, [], 600)
        self.builder.add_glyph('uni0042', 0x42, [], 600)

        contents = self.builder._generate_contents()

        self.assertIn('uni0041', contents)
        self.assertIn('uni0042', contents)
        self.assertIn('.glif', contents)

    def test_glyph_filenames(self):
        """Test glyph filename sanitization."""
        safe = self.builder._sanitize_filename('glyph/name')
        self.assertEqual(safe, 'glyph_name')

        safe = self.builder._sanitize_filename('path\\glyph')
        self.assertEqual(safe, 'path_glyph')

    def test_glif_generation(self):
        """Test single GLIF XML generation."""
        glyph_data = {
            'unicode': 0x41,
            'width': 600,
            'paths': ['M100,0 L500,700 Z'],
            'components': [],
        }

        glif = self.builder._generate_glif('uni0041', glyph_data)

        self.assertIn('<?xml', glif)
        self.assertIn('glyph name="uni0041"', glif)
        self.assertIn('unicode hex="0041"', glif)
        self.assertIn('advance width="600"', glif)
        self.assertIn('outline', glif)

    def test_glif_with_components(self):
        """Test GLIF with composite glyphs."""
        glyph_data = {
            'unicode': 0xE1,
            'width': 600,
            'paths': [],
            'components': [
                ('uni0061', 0, 0),      # base 'a'
                ('acutecomb', 300, 600),  # accent
            ],
        }

        glif = self.builder._generate_glif('uni00E1', glyph_data)

        self.assertIn('component name="uni0061"', glif)
        self.assertIn('component name="acutecomb"', glif)
        self.assertIn('xOffset="300"', glif)
        self.assertIn('yOffset="600"', glif)

    def test_svg_path_parsing(self):
        """Test SVG path to GLIF contour conversion."""
        # Simple rect: M100,0 L500,0 L500,700 L100,700 Z
        svg_path = 'M100,0 L500,0 L500,700 L100,700 Z'
        commands = self.builder._parse_svg_path(svg_path)

        # Should parse 5 commands: M, L, L, L, Z
        self.assertGreaterEqual(len(commands), 4)

        # First should be move
        self.assertEqual(commands[0][0], 'M')

    def test_lib_generation(self):
        """Test lib.plist generation."""
        self.builder.add_glyph('uni0041', 0x41, [], 600)

        lib = self.builder._generate_lib()

        self.assertIn('plist', lib)
        self.assertIn('com.fontGenerator', lib)
        self.assertIn('glyphOrder', lib)
        self.assertIn('uni0041', lib)

    def test_build_ufo_directory(self):
        """Test building UFO directory structure."""
        self.builder.add_glyph('uni0041', 0x41, ['M100,0 L500,700 Z'], 600)

        ufo_path = self.builder.build_ufo_directory(self.temp_dir)

        # Check directory structure
        self.assertTrue(os.path.isdir(ufo_path))
        self.assertTrue(os.path.exists(os.path.join(ufo_path, 'metainfo.plist')))
        self.assertTrue(os.path.exists(os.path.join(ufo_path, 'fontinfo.plist')))
        self.assertTrue(os.path.exists(os.path.join(ufo_path, 'contents.plist')))
        self.assertTrue(os.path.isdir(os.path.join(ufo_path, 'glyphs')))

    def test_build_ufo_zip(self):
        """Test building UFO as ZIP archive."""
        self.builder.add_glyph('uni0041', 0x41, ['M100,0 L500,700 Z'], 600)

        zip_path = os.path.join(self.temp_dir, 'test.ufo.zip')
        result = self.builder.build_ufo_zip(zip_path)

        self.assertEqual(result, zip_path)
        self.assertTrue(os.path.exists(zip_path))

        # Check ZIP contents
        import zipfile
        with zipfile.ZipFile(zip_path, 'r') as zf:
            names = zf.namelist()
            self.assertTrue(any('metainfo.plist' in n for n in names))
            self.assertTrue(any('glyphs' in n for n in names))


class TestUFOIntegration(unittest.TestCase):
    """Integration tests for UFO building."""

    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()

    def tearDown(self):
        import shutil
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

    def test_full_latin_set_ufo(self):
        """Test building UFO with full Latin glyph set."""
        builder = UFOBuilder('LatinFont-Regular')
        builder.set_metadata({
            'family_name': 'LatinFont',
            'style_name': 'Regular',
            'weight': 400,
        })

        # Add A-Z
        for i in range(26):
            code = 0x41 + i
            builder.add_glyph(
                glyph_name=f'uni{code:04X}',
                unicode_value=code,
                svg_paths=['M100,0 L500,700 Z'],
                advance_width=600,
            )

        # Add digits
        for i in range(10):
            code = 0x30 + i
            builder.add_glyph(
                glyph_name=f'uni{code:04X}',
                unicode_value=code,
                svg_paths=['M100,0 L500,700 Z'],
                advance_width=600,
            )

        # Build and verify
        ufo_path = builder.build_ufo_directory(self.temp_dir)
        self.assertTrue(os.path.isdir(ufo_path))

        # Verify glyph directory
        glyphs_dir = os.path.join(ufo_path, 'glyphs')
        glif_files = [f for f in os.listdir(glyphs_dir) if f.endswith('.glif')]
        self.assertEqual(len(glif_files), 36)  # 26 letters + 10 digits


if __name__ == '__main__':
    unittest.main()
