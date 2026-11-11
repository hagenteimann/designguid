# Interactive Glyph Editor

A Paper.js-based interactive glyph editor for UFO (Unified Font Object) files. Edit glyphs via Bézier curve manipulation and parametric sliders, with real-time preview and full undo/redo support.

## Features

- **UFO File Loading**: Load and parse UFO font files directly in the browser
- **Bézier Curve Editing**: Interactive point and handle manipulation with Paper.js
- **Parametric Sliders**: 20+ adjustable parameters grouped by category (weight, contrast, serif, spacing, etc.)
- **Real-time Preview**: Changes apply instantly to the canvas
- **Undo/Redo**: Two-stack history with command pattern for all operations
- **Glyph Navigation**: Quick A-Z navigation, dropdown selector, keyboard shortcuts
- **Grid Overlay**: Visual alignment guides with baseline, x-height, and cap-height references
- **Export Options**: Save as GLIF XML, SVG, or PNG
- **Keyboard Shortcuts**: Full support for Ctrl+Z/Y, arrow keys, and more

## Installation

```bash
cd editor
npm install
```

## Development

Start the dev server:

```bash
npm run dev
```

The editor will open at `http://localhost:5174`

## Usage

### Basic Workflow

1. Load a UFO file (File → Load Font panel on the right sidebar)
2. Navigate glyphs using arrows, A-Z buttons, or the dropdown selector
3. Edit the glyph:
   - **Bézier Mode**: Click to add points, drag to move, right-click for context menu
   - **Parameter Mode**: Adjust sliders to modify weight, contrast, serifs, etc.
4. Export the modified glyph as GLIF, SVG, or PNG

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` or `Ctrl+Shift+Z` | Redo |
| `Delete` | Delete selected point |
| `→` | Next glyph |
| `←` | Previous glyph |
| `Ctrl++` | Zoom in |
| `Ctrl+-` | Zoom out |

### API

```javascript
import GlyphEditor from './src/GlyphEditor.js';

// Initialize
const editor = new GlyphEditor({
  canvasId: 'glyph-canvas',
  parametersId: 'parameters-panel',
  navigatorId: 'glyph-navigator',
  canvasWidth: 1000,
  canvasHeight: 1000,
  maxUndoSteps: 100
});

// Load UFO file
const file = document.querySelector('input[type="file"]').files[0];
await editor.loadUfoFile(file);

// Programmatic glyph loading
editor.loadGlyph(glyphData);

// Export
const glif = editor.exportGlif();
const svg = editor.exportSvg();
const png = editor.exportPng();

// Undo/Redo
editor.undo();
editor.redo();

// Events
editor.addEventListener('glyphLoaded', ({ glyph }) => {
  console.log('Loaded:', glyph.name);
});

editor.addEventListener('glyphModified', ({ type }) => {
  console.log('Modified:', type);
});
```

## Architecture

### Core Components

- **GlyphEditor** (`src/GlyphEditor.js`): Main orchestrator, ties all components together
- **GlyphRenderer** (`src/canvas/GlyphRenderer.js`): Paper.js canvas setup and rendering
- **BezierEditor** (`src/canvas/BezierEditor.js`): Point/handle manipulation logic
- **ParameterPanel** (`src/ui/ParameterPanel.js`): Slider UI and parameter management
- **GlyphNavigator** (`src/ui/GlyphNavigator.js`): Glyph selection and navigation
- **UfoParser** (`src/io/UfoParser.js`): UFO/GLIF XML parsing and generation
- **CommandPattern** (`src/undo/CommandPattern.js`): Undo/redo infrastructure

### File Structure

```
editor/
├── src/
│   ├── GlyphEditor.js         # Main class
│   ├── editor.html             # Demo UI
│   ├── canvas/
│   │   ├── GlyphRenderer.js    # Canvas + Paper.js setup
│   │   └── BezierEditor.js     # Point editing
│   ├── ui/
│   │   ├── ParameterPanel.js   # Slider controls
│   │   └── GlyphNavigator.js   # Glyph selection
│   ├── io/
│   │   └── UfoParser.js        # UFO/GLIF parsing
│   └── undo/
│       └── CommandPattern.js   # Undo/redo system
├── tests/
│   ├── CommandPattern.test.js  # Undo/redo tests
│   └── UfoParser.test.js       # Parser tests
├── package.json
├── vite.config.js
└── README.md
```

## Parameters

### Default Parameter Groups

**Stroke**
- Weight: Overall stroke thickness (0-100%)
- Thickness: Uniform thickness (0-100%)
- Contrast: Vertical vs. horizontal weight ratio (0-100%)

**Counter**
- Aperture: Opening/counter space (0-100%)
- Bowl Width: Width of enclosed shapes (0-100%)

**Serif**
- Length: Serif extension (0-100%)
- Height: Serif thickness (0-100%)
- Bracketing: Curve into serif bracket (0-100%)

**Spacing**
- Side Bearing: Margin around glyph (0-100%)
- Tracking: Space between strokes (0-100%)

**Terminal**
- Terminal Curve: Curve at stroke endings (0-100%)
- Angle: Stroke terminal angle (0-360°)

Parameters are organized into collapsible groups with reset buttons per section.

## Extending Parameters

Add custom parameters:

```javascript
editor.parameterPanel.addParameter(
  'myParam',      // ID
  'My Parameter', // Label
  'custom',       // Group ID (creates if doesn't exist)
  50,             // Initial value (0-100)
  0,              // Min
  100,            // Max
  5               // Step
);
```

## Export Formats

### GLIF XML
Standard UFO glyph format. Compatible with FontLab, Glyphs, FontForge, etc.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<glyph name="A" unicode="A" width="600">
  <advance width="600"/>
  <outline>
    <contour>
      <point x="10" y="0" type="line"/>
      ...
    </contour>
  </outline>
</glyph>
```

### SVG
Vector format for web and design tools.

```svg
<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
  <path d="M 10 0 L 100 700 L 200 0 Z" fill="none" stroke="black"/>
</svg>
```

### PNG
Raster image of the current canvas view.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- ES2020 JavaScript support
- Canvas API
- IndexedDB (for history persistence)
- File API and Blob

## Dependencies

- **Paper.js 0.12.20**: Vector graphics and curve manipulation
- **JSZip 3.10.1**: UFO file (ZIP) handling
- **Vite**: Build tool and dev server

## Performance Notes

- Canvas rendering: ~60 FPS on modern hardware
- Large glyphs (100+ points): May require grid snapping disabled for smooth interaction
- UFO files: Max ~500 glyphs recommended for browser memory
- Undo stack: 100 commands by default (~1-2 MB memory)

## Keyboard Events

All keyboard shortcuts are bindable. Modify `bindKeyboardShortcuts()` in `GlyphEditor.js`:

```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'YOUR_KEY') {
    // Handle custom action
  }
});
```

## Testing

Run unit tests:

```bash
npm test
```

Tests cover:
- Undo/redo command pattern
- UFO/GLIF parsing and serialization
- Parameter management

## Limitations

- Single contour editing per glyph (components not yet supported)
- No hinting or TrueType instructions
- Quadratic curves only (no cubic Bézier)
- Parameters apply global transformations only (no point-level control)
- No multi-glyph batch operations

## Future Enhancements

- [ ] Cubic Bézier curve support
- [ ] Component/composite glyph editing
- [ ] Kerning and spacing adjustment UI
- [ ] Live font preview with text input
- [ ] Metrics and alignment tools
- [ ] Point snapping and guides
- [ ] Batch parameter application across multiple glyphs
- [ ] Integration with generative AI for suggestions

## License

MIT

## Contributing

Contributions welcome! Please file issues and PRs against the main repository.

## Support

For bugs, feature requests, or questions, open an issue in the repository.

---

**Built with Paper.js and vanilla JavaScript. Designed for the AI Font Generator project.**
