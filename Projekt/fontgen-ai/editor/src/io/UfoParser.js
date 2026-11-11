/**
 * UFO (Unified Font Object) Parser
 * Handles reading and writing UFO GLIF XML files
 */

export class UfoParser {
  /**
   * Parse UFO XML from string and extract glyph data
   * @param {string} glifXml - GLIF XML content
   * @returns {Object} Glyph data with outline, metrics, name
   */
  static parseGlif(glifXml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(glifXml, 'text/xml');

    if (doc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid GLIF XML');
    }

    const glyph = doc.querySelector('glyph');
    if (!glyph) {
      throw new Error('No glyph element found');
    }

    const name = glyph.getAttribute('name') || 'unnamed';
    const unicode = glyph.getAttribute('unicode');
    const width = parseInt(glyph.getAttribute('width') || '600', 10);
    const height = parseInt(glyph.getAttribute('height') || '0', 10);

    // Parse advance width from advance element
    let advanceWidth = width;
    const advanceEl = glyph.querySelector('advance');
    if (advanceEl) {
      advanceWidth = parseInt(advanceEl.getAttribute('width') || width, 10);
    }

    // Parse outline contours
    const outline = glyph.querySelector('outline');
    const contours = [];

    if (outline) {
      const contourEls = outline.querySelectorAll('contour');
      for (const contourEl of contourEls) {
        const contour = UfoParser.parseContour(contourEl);
        if (contour.points.length > 0) {
          contours.push(contour);
        }
      }

      // Parse components (composites)
      const components = [];
      const componentEls = outline.querySelectorAll('component');
      for (const compEl of componentEls) {
        const component = {
          base: compEl.getAttribute('base'),
          xScale: parseFloat(compEl.getAttribute('xScale') || '1'),
          xyScale: parseFloat(compEl.getAttribute('xyScale') || '0'),
          yxScale: parseFloat(compEl.getAttribute('yxScale') || '0'),
          yScale: parseFloat(compEl.getAttribute('yScale') || '1'),
          xOffset: parseFloat(compEl.getAttribute('xOffset') || '0'),
          yOffset: parseFloat(compEl.getAttribute('yOffset') || '0')
        };
        components.push(component);
      }

      if (components.length > 0) {
        contours.push({ type: 'components', components });
      }
    }

    return {
      name,
      unicode,
      width: advanceWidth,
      height,
      contours,
      raw: glifXml
    };
  }

  /**
   * Parse a single contour element
   * @param {Element} contourEl - Contour DOM element
   * @returns {Object} Contour with points
   */
  static parseContour(contourEl) {
    const points = [];
    const pointEls = contourEl.querySelectorAll('point');

    for (const pointEl of pointEls) {
      const x = parseFloat(pointEl.getAttribute('x') || '0');
      const y = parseFloat(pointEl.getAttribute('y') || '0');
      const type = pointEl.getAttribute('type') || 'qcurve'; // 'qcurve', 'line', 'curve', 'move'
      const name = pointEl.getAttribute('name') || null;
      const smooth = pointEl.hasAttribute('smooth');

      points.push({
        x,
        y,
        type,
        name,
        smooth
      });
    }

    return { points, closed: true };
  }

  /**
   * Convert glyph path data to SVG path string
   * @param {Object} glyph - Parsed glyph object
   * @returns {string} SVG path data
   */
  static glyphToSvgPath(glyph) {
    let pathData = '';

    for (const contour of glyph.contours) {
      if (contour.type === 'components') continue; // Skip components for now

      const { points } = contour;
      if (points.length === 0) continue;

      // Build path from points
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nextPoint = points[(i + 1) % points.length];

        if (i === 0) {
          pathData += `M ${point.x} ${point.y}`;
        }

        if (point.type === 'line') {
          pathData += ` L ${point.x} ${point.y}`;
        } else if (point.type === 'qcurve' || point.type === 'curve') {
          // For quadratic curves, look ahead to see if there's an off-curve point
          if (i < points.length - 1 && !points[i + 1].type) {
            // This is a cubic curve point
            const cp1 = points[i];
            const cp2 = points[i + 1];
            pathData += ` C ${cp1.x} ${cp1.y} ${cp2.x} ${cp2.y} ${nextPoint.x} ${nextPoint.y}`;
            // Skip the control points
            i += 2;
          } else {
            pathData += ` Q ${point.x} ${point.y} ${nextPoint.x} ${nextPoint.y}`;
          }
        }
      }

      pathData += ' Z';
    }

    return pathData;
  }

  /**
   * Generate GLIF XML from glyph data
   * @param {Object} glyph - Glyph data with contours and metrics
   * @returns {string} GLIF XML
   */
  static glyphToGlif(glyph) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<glyph name="' + UfoParser.escapeXml(glyph.name) + '"';

    if (glyph.unicode) {
      xml += ' unicode="' + UfoParser.escapeXml(glyph.unicode) + '"';
    }

    xml += ' width="' + glyph.width + '">\n';

    // Add advance width
    xml += `  <advance width="${glyph.width}"/>\n`;

    // Add outline if present
    if (glyph.contours && glyph.contours.length > 0) {
      xml += '  <outline>\n';

      for (const contour of glyph.contours) {
        if (contour.type === 'components') continue;

        xml += '    <contour>\n';
        for (const point of contour.points) {
          xml += `      <point x="${point.x}" y="${point.y}" type="${point.type}"`;
          if (point.smooth) {
            xml += ' smooth="yes"';
          }
          if (point.name) {
            xml += ` name="${UfoParser.escapeXml(point.name)}"`;
          }
          xml += '/>\n';
        }
        xml += '    </contour>\n';
      }

      xml += '  </outline>\n';
    }

    xml += '</glyph>\n';
    return xml;
  }

  /**
   * Escape XML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped XML
   */
  static escapeXml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Parse UFO metadata from metainfo.plist
   * @param {string} plistContent - Plist XML content
   * @returns {Object} Metadata
   */
  static parseMetainfo(plistContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(plistContent, 'text/xml');

    const metadata = {};
    const dictEl = doc.querySelector('dict');

    if (dictEl) {
      const keys = dictEl.querySelectorAll('key');
      for (const keyEl of keys) {
        const key = keyEl.textContent;
        const nextEl = keyEl.nextElementSibling;

        if (nextEl && nextEl.tagName === 'string') {
          metadata[key] = nextEl.textContent;
        } else if (nextEl && nextEl.tagName === 'integer') {
          metadata[key] = parseInt(nextEl.textContent, 10);
        }
      }
    }

    return metadata;
  }

  /**
   * Extract glyph name from UFO glyphs.contents plist
   * @param {string} plistContent - Plist XML content
   * @returns {Object} Map of glyph names to filenames
   */
  static parseGlyphsContents(plistContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(plistContent, 'text/xml');

    const glyphs = {};
    const dictEl = doc.querySelector('dict');

    if (dictEl) {
      const keys = dictEl.querySelectorAll('key');
      for (const keyEl of keys) {
        const glyphName = keyEl.textContent;
        const nextEl = keyEl.nextElementSibling;

        if (nextEl && nextEl.tagName === 'string') {
          glyphs[glyphName] = nextEl.textContent;
        }
      }
    }

    return glyphs;
  }
}

export default UfoParser;
