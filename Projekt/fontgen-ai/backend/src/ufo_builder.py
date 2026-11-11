"""
UFO (Unified Font Object) Builder: Construct font source files from glyphs.

UFO is the standard interchange format for font source data, enabling:
- Human-readable GLIF XML for each glyph
- Cross-platform compatibility with FontLab, Glyphs, FontForge, etc.
- Clean version control and diff tracking
- Direct input to compilation pipelines

Reference: https://unifiedfontobject.org/
"""

import os
import xml.etree.ElementTree as ET
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from pathlib import Path
import zipfile
import io


class UFOBuilder:
    """
    Constructs UFO v3 font packages from glyph data.
    """

    def __init__(self, font_name: str, designer: str = "FontGen AI",
                 copyright_text: Optional[str] = None):
        """
        Args:
            font_name: Family name (e.g., "GenFont-Bold")
            designer: Designer/creator attribution
            copyright_text: Copyright notice (default: OFL notice)
        """
        self.font_name = font_name
        self.designer = designer
        self.copyright_text = copyright_text or self._default_copyright()

        self.ufo_version = 3
        self.metadata = {}
        self.glyphs = {}
        self.kerning = {}
        self.groups = {}

    def _default_copyright(self) -> str:
        """Default OFL copyright notice."""
        year = datetime.now().year
        return (
            f"Copyright {year} {self.designer}\n"
            "This Font Software is licensed under the SIL Open Font License, Version 1.1.\n"
            "See OFL.txt for details: https://openfontlicense.org/"
        )

    def set_metadata(self, metadata: Dict) -> None:
        """
        Set font metadata.

        Expected keys:
        - family_name: str
        - style_name: str (e.g., "Regular", "Bold")
        - weight: int (100-900)
        - width: float (0.5-2.0)
        - italic: bool
        - version: str (e.g., "1.000")
        - unique_id: str (for PS Name)
        - trademark: str (optional)
        - manufacturer: str (optional)
        - license: str (default: "OFL")
        """
        self.metadata = metadata

    def add_glyph(self, glyph_name: str, unicode_value: int,
                  svg_paths: List[str], advance_width: float,
                  components: Optional[List[Tuple[str, float, float]]] = None) -> None:
        """
        Add a glyph to the UFO.

        Args:
            glyph_name: Glyph name (e.g., "uni0041")
            unicode_value: Unicode code point
            svg_paths: List of SVG path strings (e.g., ["M100,0 L500,0 ..."])
            advance_width: Width for text advancement (in font units)
            components: List of (component_name, dx, dy) for composite glyphs
        """
        self.glyphs[glyph_name] = {
            'unicode': unicode_value,
            'name': glyph_name,
            'paths': svg_paths,
            'width': advance_width,
            'components': components or [],
        }

    def add_kerning_pair(self, left_glyph: str, right_glyph: str, value: float) -> None:
        """Add a kerning pair (basic, not full feature)."""
        key = (left_glyph, right_glyph)
        self.kerning[key] = value

    def build_ufo_directory(self, output_dir: str) -> str:
        """
        Build UFO as directory structure.

        Returns:
            Path to UFO directory
        """
        ufo_path = os.path.join(output_dir, f"{self.font_name}.ufo")
        os.makedirs(ufo_path, exist_ok=True)

        # Create UFO structure
        self._create_metainfo(ufo_path)
        self._create_fontinfo(ufo_path)
        self._create_contents(ufo_path)
        self._create_glyphs_directory(ufo_path)
        self._create_lib(ufo_path)

        return ufo_path

    def build_ufo_zip(self, output_path: str) -> str:
        """
        Build UFO as ZIP archive (more portable for distribution).

        Returns:
            Path to ZIP file
        """
        # Create in-memory UFO directory
        ufo_data = {}

        # Generate all UFO files
        ufo_data['metainfo.plist'] = self._generate_metainfo()
        ufo_data['fontinfo.plist'] = self._generate_fontinfo()
        ufo_data['contents.plist'] = self._generate_contents()
        ufo_data['lib.plist'] = self._generate_lib()

        glyph_files = self._generate_glyph_files()

        # Write ZIP
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
            # Add UFO root files
            for filename, content in ufo_data.items():
                zf.writestr(f"{self.font_name}.ufo/{filename}", content)

            # Add glyphs directory
            zf.writestr(f"{self.font_name}.ufo/glyphs/", "")
            for glyph_name, glif_data in glyph_files.items():
                zf.writestr(
                    f"{self.font_name}.ufo/glyphs/{glyph_name}.glif",
                    glif_data
                )

        return output_path

    def _create_metainfo(self, ufo_path: str) -> None:
        """Create metainfo.plist."""
        content = self._generate_metainfo()
        with open(os.path.join(ufo_path, 'metainfo.plist'), 'w') as f:
            f.write(content)

    def _generate_metainfo(self) -> str:
        """Generate metainfo.plist content."""
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
            '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
            '<plist version="1.0">\n'
            '<dict>\n'
            f'  <key>creator</key>\n'
            f'  <string>FontGen AI - https://github.com/.../fontgen-ai</string>\n'
            f'  <key>formatVersion</key>\n'
            f'  <integer>3</integer>\n'
            '</dict>\n'
            '</plist>'
        )

    def _create_fontinfo(self, ufo_path: str) -> None:
        """Create fontinfo.plist."""
        content = self._generate_fontinfo()
        with open(os.path.join(ufo_path, 'fontinfo.plist'), 'w') as f:
            f.write(content)

    def _generate_fontinfo(self) -> str:
        """Generate fontinfo.plist content."""
        meta = self.metadata or {}

        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
            '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
            '<plist version="1.0">\n'
            '<dict>\n'
            f'  <key>familyName</key>\n'
            f'  <string>{meta.get("family_name", self.font_name)}</string>\n'
            f'  <key>styleName</key>\n'
            f'  <string>{meta.get("style_name", "Regular")}</string>\n'
            f'  <key>unitsPerEm</key>\n'
            f'  <integer>1000</integer>\n'
            f'  <key>ascender</key>\n'
            f'  <integer>800</integer>\n'
            f'  <key>descender</key>\n'
            f'  <integer>-200</integer>\n'
            f'  <key>xHeight</key>\n'
            f'  <integer>500</integer>\n'
            f'  <key>capHeight</key>\n'
            f'  <integer>700</integer>\n'
            f'  <key>weight</key>\n'
            f'  <integer>{meta.get("weight", 400)}</integer>\n'
            f'  <key>openTypeOS2Panose</key>\n'
            f'  <array>\n'
            f'    <integer>2</integer>\n'
            f'    <integer>11</integer>\n'
            f'    <integer>{self._panose_weight(meta.get("weight", 400))}</integer>\n'
            f'    <integer>3</integer>\n'
            f'    <integer>3</integer>\n'
            f'    <integer>4</integer>\n'
            f'    <integer>3</integer>\n'
            f'    <integer>2</integer>\n'
            f'    <integer>2</integer>\n'
            f'    <integer>4</integer>\n'
            f'  </array>\n'
            f'  <key>copyright</key>\n'
            f'  <string>{self.copyright_text}</string>\n'
            f'  <key>trademark</key>\n'
            f'  <string>{meta.get("trademark", f"FontGen AI")}</string>\n'
            f'  <key>designer</key>\n'
            f'  <string>{self.designer}</string>\n'
            f'  <key>openTypeLicenseURL</key>\n'
            f'  <string>https://openfontlicense.org/</string>\n'
            f'  <key>openTypeLicense</key>\n'
            f'  <string>This Font Software is licensed under the SIL Open Font License, Version 1.1.</string>\n'
            '</dict>\n'
            '</plist>'
        )

    def _panose_weight(self, weight: int) -> int:
        """Convert weight (100-900) to PANOSE weight class (2-8)."""
        if weight < 200:
            return 2  # Very Light
        elif weight < 350:
            return 3  # Light
        elif weight < 500:
            return 4  # Semi-light
        elif weight < 600:
            return 5  # Medium
        elif weight < 700:
            return 6  # Semi-bold
        elif weight < 800:
            return 7  # Bold
        else:
            return 8  # Extra Bold

    def _create_contents(self, ufo_path: str) -> None:
        """Create contents.plist."""
        content = self._generate_contents()
        with open(os.path.join(ufo_path, 'contents.plist'), 'w') as f:
            f.write(content)

    def _generate_contents(self) -> str:
        """Generate contents.plist mapping glyph names to filenames."""
        plist = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
            '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
            '<plist version="1.0">\n'
            '<dict>\n'
        )

        for glyph_name in sorted(self.glyphs.keys()):
            safe_name = self._sanitize_filename(glyph_name)
            plist += f'  <key>{glyph_name}</key>\n'
            plist += f'  <string>{safe_name}.glif</string>\n'

        plist += '</dict>\n</plist>'
        return plist

    def _create_glyphs_directory(self, ufo_path: str) -> None:
        """Create glyphs directory with GLIF files."""
        glyphs_dir = os.path.join(ufo_path, 'glyphs')
        os.makedirs(glyphs_dir, exist_ok=True)

        for glyph_name, glif_data in self._generate_glyph_files().items():
            safe_name = self._sanitize_filename(glyph_name)
            with open(os.path.join(glyphs_dir, f"{safe_name}.glif"), 'w') as f:
                f.write(glif_data)

    def _generate_glyph_files(self) -> Dict[str, str]:
        """Generate GLIF (glyph interchange format) XML for all glyphs."""
        glif_files = {}

        for glyph_name, glyph_data in self.glyphs.items():
            glif_xml = self._generate_glif(glyph_name, glyph_data)
            glif_files[glyph_name] = glif_xml

        return glif_files

    def _generate_glif(self, glyph_name: str, glyph_data: Dict) -> str:
        """Generate single GLIF XML file."""
        unicode_val = glyph_data.get('unicode', 0)
        paths = glyph_data.get('paths', [])
        width = glyph_data.get('width', 600)
        components = glyph_data.get('components', [])

        glif = (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<glyph name="{}" format="2">\n'
            '  <advance width="{}"/>\n'
        ).format(glyph_name, int(width))

        # Add unicode mapping
        if unicode_val:
            glif += f'  <unicode hex="{unicode_val:04X}"/>\n'

        # Add outline
        if paths:
            glif += self._generate_glif_outline(paths)

        # Add components (for composite glyphs)
        if components:
            glif += '  <component name="{}" xOffset="{}" yOffset="{}"/>\n' * len(components)
            for comp_name, dx, dy in components:
                glif += f'  <component name="{comp_name}" xOffset="{int(dx)}" yOffset="{int(dy)}"/>\n'

        glif += '</glyph>'
        return glif

    def _generate_glif_outline(self, paths: List[str]) -> str:
        """Generate outline element from SVG paths."""
        outline = '  <outline>\n'

        for path in paths:
            outline += self._svg_path_to_glif_contour(path)

        outline += '  </outline>\n'
        return outline

    def _svg_path_to_glif_contour(self, svg_path: str) -> str:
        """
        Convert SVG path to GLIF contour.

        Simplified converter handling: M(move), L(line), C(cubic), Z(close)
        For production, use a full converter like svgpath2mpl.
        """
        contour = '    <contour>\n'

        # Parse SVG path commands
        commands = self._parse_svg_path(svg_path)

        for cmd_type, args in commands:
            if cmd_type == 'M':  # Move
                x, y = args
                contour += f'      <point x="{int(x)}" y="{int(y)}" type="move"/>\n'
            elif cmd_type == 'L':  # Line
                x, y = args
                contour += f'      <point x="{int(x)}" y="{int(y)}" type="line"/>\n'
            elif cmd_type == 'C':  # Cubic Bezier
                # C has 3 point pairs: cp1, cp2, end
                x1, y1, x2, y2, x, y = args
                contour += f'      <point x="{int(x1)}" y="{int(y1)}" type="offcurve"/>\n'
                contour += f'      <point x="{int(x2)}" y="{int(y2)}" type="offcurve"/>\n'
                contour += f'      <point x="{int(x)}" y="{int(y)}" type="curve"/>\n'
            elif cmd_type == 'Z':  # Close path
                contour += '      <point name="end" type="move"/>\n'

        contour += '    </contour>\n'
        return contour

    def _parse_svg_path(self, path: str) -> List[Tuple[str, List]]:
        """
        Parse SVG path string into commands.

        Returns list of (command_type, arguments) tuples.
        For production, use svgpathtools library.
        """
        # Simplified regex-based parser
        import re

        commands = []
        # Split on command letters, keeping the letters
        parts = re.findall(r'([MmLlCcZz])([^MmLlCcZz]*)', path)

        for cmd, args in parts:
            cmd_upper = cmd.upper()
            # Parse numbers
            numbers = re.findall(r'-?\d+(?:\.\d+)?', args)
            coords = [float(n) for n in numbers]

            if cmd_upper == 'M':
                if len(coords) >= 2:
                    commands.append(('M', coords[:2]))
            elif cmd_upper == 'L':
                if len(coords) >= 2:
                    commands.append(('L', coords[:2]))
            elif cmd_upper == 'C':
                if len(coords) >= 6:
                    commands.append(('C', coords[:6]))
            elif cmd_upper == 'Z':
                commands.append(('Z', []))

        return commands

    def _create_lib(self, ufo_path: str) -> None:
        """Create lib.plist (library/metadata)."""
        content = self._generate_lib()
        with open(os.path.join(ufo_path, 'lib.plist'), 'w') as f:
            f.write(content)

    def _generate_lib(self) -> str:
        """Generate lib.plist with custom data."""
        return (
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
            '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
            '<plist version="1.0">\n'
            '<dict>\n'
            f'  <key>com.fontGenerator.generatedAt</key>\n'
            f'  <string>{datetime.now().isoformat()}</string>\n'
            f'  <key>com.fontGenerator.glyphCount</key>\n'
            f'  <integer>{len(self.glyphs)}</integer>\n'
            f'  <key>public.glyphOrder</key>\n'
            f'  <array>\n'
        ) + ''.join([
            f'    <string>{name}</string>\n'
            for name in sorted(self.glyphs.keys())
        ]) + (
            '  </array>\n'
            '</dict>\n'
            '</plist>'
        )

    def _sanitize_filename(self, glyph_name: str) -> str:
        """Make glyph name safe for filesystem."""
        return glyph_name.replace('/', '_').replace('\\', '_')
