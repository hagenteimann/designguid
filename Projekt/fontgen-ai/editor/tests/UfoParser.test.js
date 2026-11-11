/**
 * Tests for UFO Parser
 */

import { UfoParser } from '../src/io/UfoParser.js';

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Sample GLIF data
const SAMPLE_GLIF = `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="A" unicode="A" width="600">
  <advance width="600"/>
  <outline>
    <contour>
      <point x="10" y="0" type="line"/>
      <point x="200" y="700" type="line"/>
      <point x="400" y="700" type="line"/>
      <point x="590" y="0" type="line"/>
    </contour>
    <contour>
      <point x="100" y="200" type="line"/>
      <point x="500" y="200" type="line"/>
      <point x="500" y="300" type="line"/>
      <point x="100" y="300" type="line"/>
    </contour>
  </outline>
</glyph>`;

const SAMPLE_GLIF_WITH_CURVES = `<?xml version="1.0" encoding="UTF-8"?>
<glyph name="O" unicode="O" width="600">
  <advance width="600"/>
  <outline>
    <contour>
      <point x="300" y="700" type="qcurve" smooth="yes"/>
      <point x="100" y="600" type="qcurve"/>
      <point x="50" y="350" type="qcurve" smooth="yes"/>
      <point x="100" y="100" type="qcurve"/>
      <point x="300" y="0" type="qcurve" smooth="yes"/>
      <point x="500" y="100" type="qcurve"/>
      <point x="550" y="350" type="qcurve" smooth="yes"/>
      <point x="500" y="600" type="qcurve"/>
    </contour>
  </outline>
</glyph>`;

// Tests

test('parseGlif parses basic glyph data', () => {
  const glyph = UfoParser.parseGlif(SAMPLE_GLIF);

  assert(glyph.name === 'A', 'Should parse glyph name');
  assert(glyph.unicode === 'A', 'Should parse unicode value');
  assert(glyph.width === 600, 'Should parse advance width');
});

test('parseGlif extracts contours', () => {
  const glyph = UfoParser.parseGlif(SAMPLE_GLIF);

  assert(glyph.contours.length === 2, 'Should have 2 contours');
  assert(glyph.contours[0].points.length === 4, 'First contour should have 4 points');
  assert(glyph.contours[1].points.length === 4, 'Second contour should have 4 points');
});

test('parseContour extracts point data', () => {
  const glyph = UfoParser.parseGlif(SAMPLE_GLIF);
  const firstPoint = glyph.contours[0].points[0];

  assert(firstPoint.x === 10, 'Should parse x coordinate');
  assert(firstPoint.y === 0, 'Should parse y coordinate');
  assert(firstPoint.type === 'line', 'Should parse point type');
});

test('parseGlif handles curves with smooth flag', () => {
  const glyph = UfoParser.parseGlif(SAMPLE_GLIF_WITH_CURVES);

  const smoothPoints = glyph.contours[0].points.filter(p => p.smooth);
  assert(smoothPoints.length === 4, 'Should identify smooth points');
});

test('glyphToGlif generates valid XML', () => {
  const glyph = {
    name: 'B',
    unicode: 'B',
    width: 600,
    contours: [
      {
        points: [
          { x: 10, y: 0, type: 'line' },
          { x: 100, y: 0, type: 'line' },
          { x: 100, y: 700, type: 'line' },
          { x: 10, y: 700, type: 'line' }
        ],
        closed: true
      }
    ]
  };

  const xml = UfoParser.glyphToGlif(glyph);

  assert(xml.includes('<?xml'), 'Should include XML declaration');
  assert(xml.includes('name="B"'), 'Should include glyph name');
  assert(xml.includes('unicode="B"'), 'Should include unicode value');
  assert(xml.includes('<point'), 'Should include points');
});

test('glyphToGlif escapes special characters', () => {
  const glyph = {
    name: 'test&name',
    unicode: null,
    width: 600,
    contours: []
  };

  const xml = UfoParser.glyphToGlif(glyph);

  assert(xml.includes('&amp;'), 'Should escape ampersand');
});

test('escapeXml handles all special characters', () => {
  const text = '<test & "quote">';
  const escaped = UfoParser.escapeXml(text);

  assert(escaped === '&lt;test &amp; &quot;quote&quot;&gt;', 'Should escape all special chars');
});

test('parseGlyphsContents parses plist structure', () => {
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
      <key>A</key>
      <string>A_.glif</string>
      <key>B</key>
      <string>B_.glif</string>
    </dict>
    </plist>`;

  const glyphs = UfoParser.parseGlyphsContents(plist);

  assert(glyphs.A === 'A_.glif', 'Should map A to A_.glif');
  assert(glyphs.B === 'B_.glif', 'Should map B to B_.glif');
});

test('parseMetainfo extracts UFO metadata', () => {
  const plist = `<?xml version="1.0" encoding="UTF-8"?>
    <plist version="1.0">
    <dict>
      <key>formatVersion</key>
      <integer>3</integer>
      <key>creator</key>
      <string>FontLab</string>
    </dict>
    </plist>`;

  const metadata = UfoParser.parseMetainfo(plist);

  assert(metadata.formatVersion === 3, 'Should parse integer values');
  assert(metadata.creator === 'FontLab', 'Should parse string values');
});

test('parseGlif throws on invalid XML', () => {
  const invalidXml = 'not xml at all';

  let threw = false;
  try {
    UfoParser.parseGlif(invalidXml);
  } catch (e) {
    threw = true;
  }

  assert(threw, 'Should throw on invalid XML');
});

test('parseGlif throws when glyph element missing', () => {
  const noGlyph = '<?xml version="1.0"?><root></root>';

  let threw = false;
  try {
    UfoParser.parseGlif(noGlyph);
  } catch (e) {
    threw = true;
  }

  assert(threw, 'Should throw when glyph element is missing');
});

test('glyphToSvgPath generates SVG path data', () => {
  const glyph = {
    contours: [
      {
        points: [
          { x: 10, y: 10, type: 'line' },
          { x: 100, y: 10, type: 'line' },
          { x: 100, y: 100, type: 'line' },
          { x: 10, y: 100, type: 'line' }
        ],
        closed: true
      }
    ]
  };

  const path = UfoParser.glyphToSvgPath(glyph);

  assert(path.includes('M 10 10'), 'Should include move command');
  assert(path.includes('Z'), 'Should close path');
});

console.log('\nAll UFO parser tests completed!');
