"""
Glyph Composition Phase: Derive lowercase, accented, symbols, and digits from base glyphs.

This module generates full glyph coverage (95+ glyphs) by composing from base Latin
uppercase glyphs via scaling, transformation, and diacritic combination rules.
"""

import copy
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


@dataclass
class GlyphOutline:
    """Represents a single glyph outline."""
    name: str
    unicode: Optional[int] = None
    width: float = 600  # Default advance width
    paths: List[Dict] = None  # SVG path data
    components: List[Tuple[str, float, float]] = None  # [(base_glyph, dx, dy), ...]

    def __post_init__(self):
        if self.paths is None:
            self.paths = []
        if self.components is None:
            self.components = []


class CompositionRules:
    """
    Parametric composition rules for deriving glyphs from base set.
    """

    # Lowercase from uppercase: scaling and vertical shift
    LOWERCASE_TRANSFORM = {
        'lowercase_scale': 0.7,    # Scale to x-height (~70% of cap height)
        'baseline_shift': 0.0,     # No vertical shift (sit on baseline)
    }

    # Accents (diacritics)
    ACCENTS = {
        'acute': {'unicode': 0x0301, 'type': 'combining'},
        'grave': {'unicode': 0x0300, 'type': 'combining'},
        'circumflex': {'unicode': 0x0302, 'type': 'combining'},
        'diaeresis': {'unicode': 0x0308, 'type': 'combining'},
        'tilde': {'unicode': 0x0303, 'type': 'combining'},
        'cedilla': {'unicode': 0x0327, 'type': 'combining'},
    }

    # Accented character composition: (base, accent)
    ACCENTED_CHARS = {
        'á': ('a', 'acute'),
        'à': ('a', 'grave'),
        'â': ('a', 'circumflex'),
        'ä': ('a', 'diaeresis'),
        'ã': ('a', 'tilde'),
        'é': ('e', 'acute'),
        'è': ('e', 'grave'),
        'ê': ('e', 'circumflex'),
        'ë': ('e', 'diaeresis'),
        'í': ('i', 'acute'),
        'ì': ('i', 'grave'),
        'î': ('i', 'circumflex'),
        'ï': ('i', 'diaeresis'),
        'ó': ('o', 'acute'),
        'ò': ('o', 'grave'),
        'ô': ('o', 'circumflex'),
        'ö': ('o', 'diaeresis'),
        'õ': ('o', 'tilde'),
        'ú': ('u', 'acute'),
        'ù': ('u', 'grave'),
        'û': ('u', 'circumflex'),
        'ü': ('u', 'diaeresis'),
        'ý': ('y', 'acute'),
        'ÿ': ('y', 'diaeresis'),
        'ñ': ('n', 'tilde'),
        'ç': ('c', 'cedilla'),
    }

    # Mirror/derived symbols
    DERIVED_SYMBOLS = {
        # Brackets (mirror from paren/square bracket)
        '(': {'width_factor': 0.8},
        ')': {'mirror_of': '(', 'width_factor': 0.8},
        '[': {'width_factor': 0.9},
        ']': {'mirror_of': '[', 'width_factor': 0.9},
        '{': {'width_factor': 0.7},
        '}': {'mirror_of': '{', 'width_factor': 0.7},

        # Punctuation
        '.': {'size': 0.15},  # Small dot
        ',': {'size': 0.15},  # Small dot with tail
        ':': {'size': 0.15},  # Two dots
        ';': {'size': 0.15},  # Dot + comma
        '!': {'based_on': 'i'},  # i + exclamation mark
        '?': {'based_on': 'o'},  # derived from O
    }

    # Digit optical scaling (optical sizing for readability)
    DIGIT_SCALES = {
        '0': 1.0,
        '1': 0.85,  # Narrower
        '2': 1.0,
        '3': 1.0,
        '4': 1.0,
        '5': 1.0,
        '6': 1.0,
        '7': 1.0,
        '8': 1.0,
        '9': 1.0,
    }


class GlyphComposer:
    """
    Orchestrates glyph derivation from base glyphs.
    """

    def __init__(self, design_tokens: Dict):
        """
        Args:
            design_tokens: Design constraints {
                'x_height': 500,           # in font units
                'cap_height': 700,
                'accent_height': 200,
                'weight': 'regular',       # 'light', 'regular', 'bold'
                'style': 'serif',          # 'serif', 'sans'
            }
        """
        self.design_tokens = design_tokens
        self.base_glyphs: Dict[str, GlyphOutline] = {}
        self.derived_glyphs: Dict[str, GlyphOutline] = {}

    def set_base_glyphs(self, glyphs: Dict[str, GlyphOutline]) -> None:
        """Load base uppercase glyphs from glyph generator."""
        self.base_glyphs = glyphs

    def compose_all(self) -> Dict[str, GlyphOutline]:
        """
        Generate full glyph set via composition.

        Returns:
            Dictionary of all glyphs (base + derived)
        """
        result = copy.deepcopy(self.base_glyphs)

        # Generate lowercase from uppercase
        lowercase = self._derive_lowercase()
        result.update(lowercase)

        # Generate accented characters
        accented = self._derive_accented()
        result.update(accented)

        # Generate digits
        digits = self._derive_digits()
        result.update(digits)

        # Generate common punctuation & symbols
        symbols = self._derive_symbols()
        result.update(symbols)

        # Generate space glyphs
        spaces = self._derive_spaces()
        result.update(spaces)

        self.derived_glyphs = result
        return result

    def _derive_lowercase(self) -> Dict[str, GlyphOutline]:
        """Transform uppercase to lowercase via scaling and positioning."""
        lowercase = {}

        x_height = self.design_tokens.get('x_height', 500)
        cap_height = self.design_tokens.get('cap_height', 700)
        scale_factor = x_height / cap_height if cap_height > 0 else 0.7

        for char_code in range(ord('A'), ord('Z') + 1):
            upper_char = chr(char_code)
            lower_char = chr(char_code + 32)

            if upper_char in self.base_glyphs:
                upper_glyph = self.base_glyphs[upper_char]

                # Create lowercase version
                lower_glyph = GlyphOutline(
                    name=f'uni{ord(lower_char):04X}',
                    unicode=ord(lower_char),
                    width=int(upper_glyph.width * scale_factor),
                )

                # Option 1: Use component reference with transformation
                lower_glyph.components.append((
                    upper_glyph.name,
                    0,
                    0
                ))

                # Store transform metadata for later rendering
                lower_glyph.paths = [{
                    'scale': scale_factor,
                    'translate': (0, 0),
                }]

                lowercase[lower_char] = lower_glyph

        return lowercase

    def _derive_accented(self) -> Dict[str, GlyphOutline]:
        """Compose accented characters from base + diacritics."""
        accented = {}
        accent_height = self.design_tokens.get('accent_height', 200)

        for char, (base_char, accent_name) in CompositionRules.ACCENTED_CHARS.items():
            if base_char not in self.derived_glyphs and base_char not in self.base_glyphs:
                continue  # Base glyph not available

            base_glyph = self.derived_glyphs.get(base_char) or self.base_glyphs.get(base_char)
            if not base_glyph:
                continue

            # Create composite glyph
            accented_glyph = GlyphOutline(
                name=f'uni{ord(char):04X}',
                unicode=ord(char),
                width=base_glyph.width,
            )

            # Add base glyph as component
            accented_glyph.components.append((base_glyph.name, 0, 0))

            # Add accent as component (positioned above)
            accent_x = base_glyph.width // 2  # Center horizontally
            accent_y = accent_height
            accented_glyph.components.append((
                f'accent_{accent_name}',
                accent_x,
                accent_y
            ))

            accented[char] = accented_glyph

        return accented

    def _derive_digits(self) -> Dict[str, GlyphOutline]:
        """Generate digits from parametric rules (optical sizing)."""
        digits = {}

        for digit in '0123456789':
            digit_glyph = GlyphOutline(
                name=f'uni{ord(digit):04X}',
                unicode=ord(digit),
                width=600,  # Monospace digit width
            )

            # Use scale factor for optical adjustment
            scale = CompositionRules.DIGIT_SCALES.get(digit, 1.0)
            digit_glyph.paths = [{
                'scale': scale,
                'type': 'digit',
            }]

            digits[digit] = digit_glyph

        return digits

    def _derive_symbols(self) -> Dict[str, GlyphOutline]:
        """Generate common symbols, punctuation, and brackets."""
        symbols = {}

        # Define symbol unicode and basic properties
        symbol_defs = {
            '.': 0x002E,  # FULL STOP
            ',': 0x002C,  # COMMA
            ':': 0x003A,  # COLON
            ';': 0x003B,  # SEMICOLON
            '!': 0x0021,  # EXCLAMATION MARK
            '?': 0x003F,  # QUESTION MARK
            '(': 0x0028,  # LEFT PAREN
            ')': 0x0029,  # RIGHT PAREN
            '[': 0x005B,  # LEFT SQUARE BRACKET
            ']': 0x005D,  # RIGHT SQUARE BRACKET
            '{': 0x007B,  # LEFT CURLY BRACKET
            '}': 0x007D,  # RIGHT CURLY BRACKET
            '-': 0x002D,  # HYPHEN-MINUS
            '—': 0x2014,  # EM DASH
            '–': 0x2013,  # EN DASH
            '/': 0x002F,  # SOLIDUS
            '\\': 0x005C,  # REVERSE SOLIDUS
            '*': 0x002A,  # ASTERISK
            '+': 0x002B,  # PLUS SIGN
            '=': 0x003D,  # EQUALS SIGN
            '<': 0x003C,  # LESS-THAN
            '>': 0x003E,  # GREATER-THAN
            '&': 0x0026,  # AMPERSAND
            '#': 0x0023,  # NUMBER SIGN
            '@': 0x0040,  # COMMERCIAL AT
            '%': 0x0025,  # PERCENT SIGN
            '"': 0x0022,  # QUOTATION MARK
            "'": 0x0027,  # APOSTROPHE
            '`': 0x0060,  # GRAVE ACCENT
        }

        for char, unicode_val in symbol_defs.items():
            sym_glyph = GlyphOutline(
                name=f'uni{unicode_val:04X}',
                unicode=unicode_val,
                width=400,  # Default symbol width
            )
            sym_glyph.paths = [{'type': 'symbol', 'char': char}]
            symbols[char] = sym_glyph

        return symbols

    def _derive_spaces(self) -> Dict[str, GlyphOutline]:
        """Generate space glyphs with various widths."""
        spaces = {}

        space_defs = {
            ' ': (0x0020, 250),    # SPACE
            '\t': (0x0009, 1000),  # TAB (4× normal space)
            '\n': (0x000A, 0),     # LF (zero-width)
        }

        for char, (unicode_val, width) in space_defs.items():
            space_glyph = GlyphOutline(
                name=f'uni{unicode_val:04X}',
                unicode=unicode_val,
                width=width,
                paths=[],  # No visible path
            )
            spaces[char] = space_glyph

        return spaces

    def get_statistics(self) -> Dict:
        """Return composition statistics."""
        all_glyphs = {**self.base_glyphs, **self.derived_glyphs}

        return {
            'total_glyphs': len(all_glyphs),
            'base_glyphs': len(self.base_glyphs),
            'derived_glyphs': len(self.derived_glyphs),
            'categories': {
                'uppercase': sum(1 for c in self.base_glyphs if c.isupper()),
                'lowercase': sum(1 for c in self.derived_glyphs if c.islower()),
                'digits': sum(1 for c in '0123456789' if c in self.derived_glyphs),
                'symbols': sum(1 for c in self.derived_glyphs if not c.isalnum() and c not in [' ', '\t', '\n']),
            }
        }
