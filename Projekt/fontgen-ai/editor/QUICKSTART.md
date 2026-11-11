# Quick Start Guide

Get the Glyph Editor running in 5 minutes.

## Installation

### 1. Install Dependencies

```bash
cd /path/to/editor
npm install
```

This installs:
- `paper.js` - Vector graphics
- `jszip` - UFO file handling
- `vite` - Dev server and build tool

### 2. Start Dev Server

```bash
npm run dev
```

The editor opens at **http://localhost:5174**

## Using the Editor

### Load a Font

1. Click **"Click to load UFO file"** in the left sidebar
2. Select a `.ufo` font file from your computer
3. Editor loads all glyphs

### Navigate Glyphs

Choose any method:
- **Arrows**: Use ← → to move between glyphs
- **Dropdown**: Select from alphabetical list
- **A-Z Buttons**: Quick jump to letter
- **Keyboard**: Arrow keys work anywhere

### Edit Points (Bézier Mode)

- **Add Point**: Click on the path
- **Move Point**: Drag a point (blue circle)
- **Delete Point**: Select point, press Delete
- **Adjust Curve**: Drag handle (green circle)

### Adjust Parameters (Slider Mode)

1. Expand any parameter group (Stroke, Counter, etc.)
2. Drag slider or type number
3. Glyph updates instantly
4. Click **↺** button to reset group

### Undo/Redo

- **Undo**: Ctrl+Z (Cmd+Z on Mac)
- **Redo**: Ctrl+Y (Cmd+Shift+Z)

### Export Glyph

Click any export button:
- **📥 GLIF** - XML format (for UFO)
- **📥 SVG** - Vector graphic
- **📥 PNG** - Raster image

## Code Example

Use the editor in your code:

```javascript
import GlyphEditor from './src/GlyphEditor.js';

// Initialize
const editor = new GlyphEditor({
  canvasId: 'my-canvas',
  parametersId: 'my-params',
  navigatorId: 'my-navigator'
});

// Load UFO file
const file = document.querySelector('input[type="file"]').files[0];
await editor.loadUfoFile(file);

// Listen to events
editor.addEventListener('glyphModified', ({ type }) => {
  console.log('Modified:', type);
});

// Export
const glif = editor.exportGlif();
const svg = editor.exportSvg();
```

## Building for Production

```bash
npm run build
```

Output goes in `dist/` folder:
- `dist/editor.html` - Ready to deploy
- `dist/assets/` - Bundled JavaScript

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `←` `→` | Previous/Next glyph |
| `Delete` | Delete selected point |
| `Ctrl++` | Zoom in |
| `Ctrl+-` | Zoom out |

## Common Tasks

### Change Canvas Size

```javascript
const editor = new GlyphEditor({
  canvasWidth: 2000,   // Default: 1000
  canvasHeight: 2000   // Default: 1000
});
```

### Adjust Undo History Size

```javascript
const editor = new GlyphEditor({
  maxUndoSteps: 50   // Default: 100
});
```

### Add Custom Parameter

```javascript
editor.parameterPanel.addParameter(
  'myParam',
  'My Parameter',
  'custom',  // group name
  50,        // initial value
  0,         // min
  100,       // max
  5          // step
);
```

### Save State

```javascript
// Export current state
const state = editor.exportState();
localStorage.setItem('editor-state', JSON.stringify(state));

// Save undo history
await editor.saveHistory();
```

### Load State

```javascript
// Restore state
const state = JSON.parse(localStorage.getItem('editor-state'));
editor.importState(state);

// Restore history
await editor.loadHistory();
```

## Troubleshooting

### "Paper.js not found"
- Ensure you're loading from `http://` not `file://`
- Check browser console for errors
- Refresh the page

### Canvas not showing
- Check that canvas element has width/height
- Verify `canvasId` matches your HTML element

### Slider not updating glyph
- Make sure parameter group is expanded
- Check browser console for JavaScript errors
- Try refreshing the page

### Export not working
- File might be too large (try smaller glyphs first)
- Check browser permissions for file download
- Try different export format

## Next Steps

### Learn More
- Read [README.md](./README.md) for full feature list
- Check [INTEGRATION.md](./INTEGRATION.md) for advanced usage
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for how it works

### Try It Out
1. Generate a sample UFO file
2. Load it in the editor
3. Edit a few glyphs
4. Export and use

### Integrate It
- Add to React app: See [INTEGRATION.md - Method 2](./INTEGRATION.md#method-2-es-module-import-reactvueangular)
- Create web component: See [INTEGRATION.md - Method 3](./INTEGRATION.md#method-3-web-component-wrapper-framework-agnostic)
- Use in iframe: See [INTEGRATION.md - Method 1](./INTEGRATION.md#method-1-direct-html-embedding-simplest)

## Tips & Tricks

### Efficient Editing
- Use grid snap for alignment: Right-click canvas for options
- Reset parameters to start fresh: Click **↺** in group header
- Undo multiple times: Ctrl+Z keeps undoing

### Better Workflow
- Export GLIF files as backups
- Use A-Z buttons for quick navigation
- Keyboard shortcuts are faster than mouse

### Performance
- Disable grid for smooth editing (right-click canvas)
- Use keyboard shortcuts instead of buttons
- Close browser tabs to free memory for large fonts

## Getting Help

### Error Messages
- Check browser console (F12)
- Look at error message in status bar
- Refer to troubleshooting section above

### Missing Features
- See "Future Enhancements" in [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md#future-enhancements)
- Open issue in repository

### Integration Questions
- Check [INTEGRATION.md](./INTEGRATION.md) first
- Look for similar example code
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for component details

---

**Ready to edit!** Start with `npm run dev` and load your first font.
