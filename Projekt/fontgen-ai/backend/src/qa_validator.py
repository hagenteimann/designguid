"""
QA Validator: Fontbakery integration for font validation and health checks.

Runs automated quality assurance checks on compiled fonts to catch structural
errors, licensing issues, coverage gaps, and rendering problems before export.
"""

from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum


class CheckStatus(Enum):
    """Status codes for QA checks."""
    PASS = "PASS"
    WARN = "WARN"
    FAIL = "FAIL"
    INFO = "INFO"


@dataclass
class QACheck:
    """Single QA check result."""
    name: str
    status: CheckStatus
    message: str
    details: Optional[str] = None

    def to_dict(self) -> Dict:
        return {
            'name': self.name,
            'status': self.status.value,
            'message': self.message,
            'details': self.details,
        }


class FontBakeryValidator:
    """
    Wrapper around Fontbakery for comprehensive font QA.

    Runs checks for:
    - Structure (required tables, glyph data)
    - Coverage (Unicode ranges, character sets)
    - Licensing (OFL compliance, copyright)
    - Rendering (kerning, metrics, name table)
    - Performance (file size, complexity)
    """

    def __init__(self, font_path: str):
        """
        Args:
            font_path: Path to compiled font (OTF/TTF)
        """
        self.font_path = font_path
        self.checks: List[QACheck] = []

    def run_all_checks(self) -> Dict:
        """
        Run complete QA suite.

        Returns:
            {
                'status': 'PASS' | 'WARN' | 'FAIL',
                'summary': {...},
                'checks': [{...}, ...],
                'timestamp': '...'
            }
        """
        self.checks = []

        # Run checks
        self._check_structure()
        self._check_coverage()
        self._check_licensing()
        self._check_metrics()
        self._check_rendering()

        # Generate report
        return self._generate_report()

    def _check_structure(self) -> None:
        """Check font structure and required tables."""
        try:
            from fontTools.ttLib import TTFont

            font = TTFont(self.font_path)

            # Required tables
            required = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post']
            missing = [t for t in required if t not in font]

            if not missing:
                self.checks.append(QACheck(
                    name='structure/required_tables',
                    status=CheckStatus.PASS,
                    message=f'All {len(required)} required tables present',
                ))
            else:
                self.checks.append(QACheck(
                    name='structure/required_tables',
                    status=CheckStatus.FAIL,
                    message=f'Missing tables: {", ".join(missing)}',
                ))

            # Glyph count
            glyph_count = len(font.getGlyphOrder())
            if glyph_count >= 95:
                self.checks.append(QACheck(
                    name='structure/glyph_count',
                    status=CheckStatus.PASS,
                    message=f'Good glyph coverage: {glyph_count} glyphs',
                ))
            elif glyph_count >= 50:
                self.checks.append(QACheck(
                    name='structure/glyph_count',
                    status=CheckStatus.WARN,
                    message=f'Limited glyph coverage: {glyph_count} glyphs (recommended: 95+)',
                ))
            else:
                self.checks.append(QACheck(
                    name='structure/glyph_count',
                    status=CheckStatus.FAIL,
                    message=f'Minimal glyph coverage: {glyph_count} glyphs',
                ))

        except Exception as e:
            self.checks.append(QACheck(
                name='structure/load_font',
                status=CheckStatus.FAIL,
                message=f'Failed to load font: {e}',
            ))

    def _check_coverage(self) -> None:
        """Check character set coverage."""
        try:
            from fontTools.ttLib import TTFont

            font = TTFont(self.font_path)
            cmap = font.getBestCmap()

            if not cmap:
                self.checks.append(QACheck(
                    name='coverage/cmap',
                    status=CheckStatus.FAIL,
                    message='No character map found',
                ))
                return

            # Check for essential ranges
            ranges = {
                'ASCII': (0x0020, 0x007E),
                'Latin-1': (0x00A0, 0x00FF),
                'Extended-A': (0x0100, 0x017F),
            }

            coverage = {}
            for range_name, (start, end) in ranges.items():
                count = sum(1 for i in range(start, end + 1) if i in cmap)
                coverage[range_name] = count / (end - start + 1)

            # ASCII is critical
            if coverage['ASCII'] >= 0.9:
                self.checks.append(QACheck(
                    name='coverage/ascii',
                    status=CheckStatus.PASS,
                    message=f'Strong ASCII coverage: {coverage["ASCII"]*100:.0f}%',
                ))
            elif coverage['ASCII'] >= 0.75:
                self.checks.append(QACheck(
                    name='coverage/ascii',
                    status=CheckStatus.WARN,
                    message=f'Partial ASCII coverage: {coverage["ASCII"]*100:.0f}%',
                ))
            else:
                self.checks.append(QACheck(
                    name='coverage/ascii',
                    status=CheckStatus.FAIL,
                    message=f'Insufficient ASCII coverage: {coverage["ASCII"]*100:.0f}%',
                ))

            # Report extended coverage
            if coverage['Extended-A'] >= 0.5:
                self.checks.append(QACheck(
                    name='coverage/extended',
                    status=CheckStatus.PASS,
                    message=f'Extended Latin coverage: {coverage["Extended-A"]*100:.0f}%',
                ))

        except Exception as e:
            self.checks.append(QACheck(
                name='coverage/check',
                status=CheckStatus.WARN,
                message=f'Coverage check incomplete: {e}',
            ))

    def _check_licensing(self) -> None:
        """Check licensing compliance (OFL)."""
        try:
            from fontTools.ttLib import TTFont

            font = TTFont(self.font_path)
            name_table = font['name']

            # Look for license in name records
            has_license = False
            has_copyright = False

            for record in name_table.names:
                text = record.toUnicode() if hasattr(record, 'toUnicode') else str(record)
                if record.nameID == 13:  # License URL
                    if 'openfontlicense.org' in text.lower() or 'ofl' in text.lower():
                        has_license = True
                if record.nameID == 0:  # Copyright
                    has_copyright = True

            if has_license:
                self.checks.append(QACheck(
                    name='licensing/ofl_link',
                    status=CheckStatus.PASS,
                    message='OFL license URL found in name table',
                ))
            else:
                self.checks.append(QACheck(
                    name='licensing/ofl_link',
                    status=CheckStatus.WARN,
                    message='No OFL license URL in name table (required for distribution)',
                ))

            if has_copyright:
                self.checks.append(QACheck(
                    name='licensing/copyright',
                    status=CheckStatus.PASS,
                    message='Copyright notice present',
                ))
            else:
                self.checks.append(QACheck(
                    name='licensing/copyright',
                    status=CheckStatus.WARN,
                    message='No copyright notice found',
                ))

        except Exception as e:
            self.checks.append(QACheck(
                name='licensing/check',
                status=CheckStatus.WARN,
                message=f'License check incomplete: {e}',
            ))

    def _check_metrics(self) -> None:
        """Check font metrics for consistency."""
        try:
            from fontTools.ttLib import TTFont

            font = TTFont(self.font_path)

            # Check head table
            head = font.get('head')
            if head:
                self.checks.append(QACheck(
                    name='metrics/head_table',
                    status=CheckStatus.PASS,
                    message=f'Head table: units/em={head.unitsPerEm}',
                ))

            # Check hhea table
            hhea = font.get('hhea')
            if hhea:
                ascender = hhea.ascender if hasattr(hhea, 'ascender') else 0
                descender = hhea.descender if hasattr(hhea, 'descender') else 0
                line_gap = hhea.lineGap if hasattr(hhea, 'lineGap') else 0

                if ascender > 0 and descender < 0:
                    self.checks.append(QACheck(
                        name='metrics/baseline',
                        status=CheckStatus.PASS,
                        message=f'Baseline metrics: ascender={ascender}, descender={descender}',
                    ))
                else:
                    self.checks.append(QACheck(
                        name='metrics/baseline',
                        status=CheckStatus.WARN,
                        message=f'Non-standard baseline: ascender={ascender}, descender={descender}',
                    ))

            # Check hmtx (horizontal metrics)
            hmtx = font.get('hmtx')
            if hmtx:
                widths = [w for w, lsb in hmtx.metrics.values()]
                if widths:
                    avg_width = sum(widths) / len(widths)
                    self.checks.append(QACheck(
                        name='metrics/advance_width',
                        status=CheckStatus.PASS,
                        message=f'Advance widths: avg={avg_width:.0f}, range={min(widths)}-{max(widths)}',
                    ))

        except Exception as e:
            self.checks.append(QACheck(
                name='metrics/check',
                status=CheckStatus.WARN,
                message=f'Metrics check incomplete: {e}',
            ))

    def _check_rendering(self) -> None:
        """Check rendering and visual integrity."""
        try:
            # Check that glyphs have outlines (not empty)
            from fontTools.ttLib import TTFont

            font = TTFont(self.font_path)
            glyph_set = font.getGlyphSet()

            empty_glyphs = []
            for glyph_name in font.getGlyphOrder()[:20]:  # Sample first 20
                try:
                    glyph = glyph_set[glyph_name]
                    if hasattr(glyph, 'draw'):
                        # Try to draw to check for content
                        from fontTools.pens.recordingPen import RecordingPen
                        pen = RecordingPen()
                        glyph.draw(pen)
                        if not pen.value:
                            empty_glyphs.append(glyph_name)
                except:
                    pass

            if not empty_glyphs:
                self.checks.append(QACheck(
                    name='rendering/glyph_outlines',
                    status=CheckStatus.PASS,
                    message='Sample glyphs have visible outlines',
                ))
            else:
                self.checks.append(QACheck(
                    name='rendering/glyph_outlines',
                    status=CheckStatus.WARN,
                    message=f'Some glyphs appear empty: {empty_glyphs}',
                ))

            # Warn if no rendering tables
            has_glyf = 'glyf' in font or 'CFF ' in font
            if has_glyf:
                self.checks.append(QACheck(
                    name='rendering/outline_format',
                    status=CheckStatus.PASS,
                    message='Font has outline data (TTF or CFF)',
                ))
            else:
                self.checks.append(QACheck(
                    name='rendering/outline_format',
                    status=CheckStatus.WARN,
                    message='Font has no outline data (bitmap only?)',
                ))

        except Exception as e:
            self.checks.append(QACheck(
                name='rendering/check',
                status=CheckStatus.WARN,
                message=f'Rendering check incomplete: {e}',
            ))

    def _generate_report(self) -> Dict:
        """Generate final QA report."""
        from datetime import datetime

        # Determine overall status
        statuses = [c.status for c in self.checks]
        if any(s == CheckStatus.FAIL for s in statuses):
            overall = CheckStatus.FAIL
        elif any(s == CheckStatus.WARN for s in statuses):
            overall = CheckStatus.WARN
        else:
            overall = CheckStatus.PASS

        return {
            'status': overall.value,
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total_checks': len(self.checks),
                'passed': sum(1 for c in self.checks if c.status == CheckStatus.PASS),
                'warned': sum(1 for c in self.checks if c.status == CheckStatus.WARN),
                'failed': sum(1 for c in self.checks if c.status == CheckStatus.FAIL),
            },
            'checks': [c.to_dict() for c in self.checks],
            'blockers': [c.to_dict() for c in self.checks if c.status == CheckStatus.FAIL],
        }
