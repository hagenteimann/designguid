# Glyph Editor Integration Guide

This document describes how to integrate the standalone Glyph Editor into a larger application or web project.

## Overview

The editor is a self-contained ES module that can be:
1. Embedded directly in an HTML page
2. Imported as an ES6 module in React/Vue/Angular apps
3. Built as a web component for any framework
4. Used as an iframe for complete isolation

## Integration Methods

### Method 1: Direct HTML Embedding (Simplest)

Include the HTML file directly in your application:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App with Glyph Editor</title>
</head>
<body>
  <div id="app">
    <!-- Your app content -->
    <iframe src="editor/src/editor.html" 
            style="width: 100%; height: 100vh; border: none;">
    </iframe>
  </div>
</body>
</html>
```

**Pros:**
- Simple, zero configuration
- Complete isolation
- Safe from CSS/JS conflicts

**Cons:**
- Communication via postMessage
- Cannot share state directly

### Method 2: ES Module Import (React/Vue/Angular)

Import the editor class in your framework:

```jsx
import React, { useEffect, useRef } from 'react';
import GlyphEditor from '../fontgen-ai/editor/src/GlyphEditor.js';

export function GlyphEditorComponent() {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      // Create canvas elements
      const canvas = document.createElement('canvas');
      canvas.id = 'glyph-canvas';
      
      const paramsPanel = document.createElement('div');
      paramsPanel.id = 'parameters-panel';
      
      const navigator = document.createElement('div');
      navigator.id = 'glyph-navigator';
      
      containerRef.current.appendChild(canvas);
      containerRef.current.appendChild(paramsPanel);
      containerRef.current.appendChild(navigator);

      // Initialize editor
      editorRef.current = new GlyphEditor({
        canvasId: 'glyph-canvas',
        parametersId: 'parameters-panel',
        navigatorId: 'glyph-navigator'
      });

      // Listen to events
      editorRef.current.addEventListener('glyphLoaded', ({ glyph }) => {
        console.log('Loaded:', glyph.name);
      });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleLoadFile = async (file) => {
    if (editorRef.current) {
      const glyphs = await editorRef.current.loadUfoFile(file);
      console.log(`Loaded ${glyphs.length} glyphs`);
    }
  };

  return (
    <div>
      <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
      <input 
        type="file" 
        onChange={(e) => handleLoadFile(e.target.files[0])} 
      />
    </div>
  );
}
```

**Pros:**
- Full control and state sharing
- Can pass data between components
- No iframe overhead

**Cons:**
- Paper.js must be globally available
- CSS conflicts possible

### Method 3: Web Component Wrapper (Framework Agnostic)

Create a reusable web component:

```javascript
// GlyphEditorElement.js
import GlyphEditor from '../editor/src/GlyphEditor.js';

class GlyphEditorElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.editor = null;
  }

  connectedCallback() {
    // Create shadow DOM structure
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        #container {
          display: flex;
          height: 100%;
          gap: 16px;
          padding: 16px;
        }
        #canvas {
          flex: 1;
          border: 1px solid #ccc;
        }
      </style>
      <div id="container">
        <canvas id="canvas"></canvas>
        <div id="params"></div>
      </div>
    `;

    const container = this.shadowRoot.querySelector('#container');
    
    // Move Paper.js to shadow DOM
    if (!window.paper) {
      console.error('Paper.js not loaded');
      return;
    }

    this.editor = new GlyphEditor({
      canvasId: 'canvas',
      parametersId: 'params',
      navigatorId: null
    });

    this.dispatchEvent(new CustomEvent('editor-ready', { 
      detail: { editor: this.editor } 
    }));
  }

  async loadUfo(file) {
    if (this.editor) {
      return this.editor.loadUfoFile(file);
    }
  }

  exportGlif() {
    return this.editor?.exportGlif();
  }

  exportSvg() {
    return this.editor?.exportSvg();
  }

  exportPng() {
    return this.editor?.exportPng();
  }
}

customElements.define('glyph-editor', GlyphEditorElement);
```

Usage:

```html
<glyph-editor></glyph-editor>

<script type="module">
  const editor = document.querySelector('glyph-editor');
  editor.addEventListener('editor-ready', ({ detail }) => {
    console.log('Editor ready');
  });

  // Load UFO
  const file = document.querySelector('input[type="file"]').files[0];
  editor.loadUfo(file);

  // Export
  const glif = editor.exportGlif();
</script>
```

**Pros:**
- Works in any framework
- Encapsulated styling
- Reusable across projects

**Cons:**
- Requires custom element registration
- Shadow DOM style isolation may complicate styling

### Method 4: Headless API (No UI)

Use the editor programmatically without the UI:

```javascript
import GlyphEditor from '../editor/src/GlyphEditor.js';
import { UfoParser } from '../editor/src/io/UfoParser.js';

// Create editor without UI containers
const editor = new GlyphEditor({
  canvasId: 'hidden-canvas', // Off-screen canvas
});

// Process UFO files
async function processUfo(file) {
  const glyphs = await editor.loadUfoFile(file);
  
  for (const glyph of glyphs) {
    editor.loadGlyph(glyph);
    
    // Apply transformations programmatically
    editor.parameterPanel.setParameterValue('weight', 75);
    editor.parameterPanel.setParameterValue('contrast', 60);
    
    // Export modified glyph
    const glif = editor.exportGlif();
    console.log(glif);
  }
}
```

**Pros:**
- No UI overhead
- Perfect for batch processing
- Full programmatic control

**Cons:**
- Canvas still required for Paper.js rendering
- User cannot edit visually

## Event System

The editor emits events that your application can listen to:

```javascript
editor.addEventListener('glyphLoaded', ({ glyph }) => {
  console.log('Glyph loaded:', glyph.name);
});

editor.addEventListener('glyphModified', ({ type, pointId }) => {
  console.log('Modification type:', type);
  saveChanges();
});

editor.addEventListener('parameterChanged', ({ parameterId, value }) => {
  console.log(`${parameterId} = ${value}`);
});

editor.addEventListener('ufoLoaded', ({ glyphCount }) => {
  console.log(`Loaded ${glyphCount} glyphs`);
});

editor.addEventListener('modeChanged', ({ mode }) => {
  console.log('Mode:', mode);
});

editor.addEventListener('error', ({ message }) => {
  console.error('Editor error:', message);
});
```

## State Management

### Saving State

```javascript
// Export current state
const state = editor.exportState();
localStorage.setItem('glyphEditorState', JSON.stringify(state));

// Save history to IndexedDB
await editor.saveHistory();
```

### Restoring State

```javascript
// Load state from storage
const savedState = JSON.parse(localStorage.getItem('glyphEditorState'));
editor.importState(savedState);

// Load history from IndexedDB
const history = await editor.loadHistory();
```

## Performance Considerations

### Large Files

For UFO files with many glyphs (300+):

```javascript
// Load glyphs on demand instead of all at once
const glyphNames = [...glyphsMappings.keys()];

// Show progress
for (let i = 0; i < glyphNames.length; i++) {
  loadGlyph(glyphNames[i]);
  updateProgress(i / glyphNames.length);
  
  // Yield to browser
  await new Promise(resolve => setTimeout(resolve, 0));
}
```

### Memory Management

```javascript
// Clear undo history to save memory
editor.clearHistory();

// Reduce undo stack size
editor.history.maxSize = 50;

// Unload unused glyphs
editor.glyphs = editor.glyphs.slice(0, 50);
```

## Styling Integration

### Custom CSS

The editor HTML includes default styles. Override with CSS:

```css
/* Override parameter panel width */
.parameter-panel {
  width: 250px;
}

/* Custom canvas background */
#glyph-canvas {
  background: #f0f0f0;
}

/* Custom button styles */
button {
  background: #007acc;
  color: white;
}
```

### Tailwind CSS Integration

```jsx
// Wrap editor in Tailwind-styled container
<div className="flex h-screen gap-4 p-4">
  <div className="flex-1 rounded-lg shadow bg-white" ref={editorRef} />
  <div className="w-80 rounded-lg shadow bg-white">
    {/* Sidebar UI */}
  </div>
</div>
```

## API Reference

### GlyphEditor

```javascript
class GlyphEditor {
  // Initialization
  constructor(options)
  
  // Loading
  loadUfoFile(file)
  loadGlyph(glyph)
  
  // Editing
  setEditMode(mode)  // 'bezier' or 'parameters'
  deletePoint()
  reversePath()
  flattenCurves()
  
  // Undo/Redo
  undo()
  redo()
  canUndo() -> boolean
  canRedo() -> boolean
  clearHistory()
  
  // View
  zoom(factor)
  pan(dx, dy)
  fitToView()
  
  // Export
  exportGlif() -> string
  exportSvg() -> string
  exportPng() -> string
  
  // State
  exportState() -> object
  importState(state)
  saveHistory() -> Promise
  loadHistory() -> Promise
  
  // Events
  addEventListener(type, callback)
  
  // Properties
  currentGlyph
  glyphs
  mode
}
```

### ParameterPanel

```javascript
class ParameterPanel {
  addGroup(label, groupId)
  addParameter(id, label, groupId, value, min, max, step)
  getParameterValue(id) -> number
  setParameterValue(id, newValue)
  resetGroup(groupId)
  getAllParameters() -> object
  setAllParameters(values)
  onChange(callback)
}
```

### UfoParser

```javascript
class UfoParser {
  static parseGlif(xml) -> object
  static glyphToGlif(glyph) -> string
  static glyphToSvgPath(glyph) -> string
  static parseGlyphsContents(xml) -> object
  static parseMetainfo(xml) -> object
}
```

## Troubleshooting

### Paper.js Not Found

Ensure Paper.js is loaded before initializing editor:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.20/paper-full.min.js"></script>
<script type="module">
  import GlyphEditor from './GlyphEditor.js';
  // Now safe to use
</script>
```

### Canvas Not Rendering

Check that canvas element exists and is visible:

```javascript
const canvas = document.getElementById('glyph-canvas');
console.log(canvas.offsetWidth, canvas.offsetHeight); // Should not be 0
```

### File Upload Issues

Ensure file input accepts .ufo and .zip files:

```html
<input type="file" accept=".ufo,.zip" />
```

### Performance Degradation

Profile with DevTools. Common causes:
- Too many undo states (reduce `maxUndoSteps`)
- Large canvases (reduce size if not needed)
- Unoptimized parameter callbacks

## Security Considerations

- UFO files are parsed client-side (safe)
- API keys should never be stored in editor
- File uploads: validate file size and type
- Exported files: sanitize before serving

## Browser Compatibility

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires ES2020 support and modern Web APIs.

---

For more information, see [README.md](./README.md).
