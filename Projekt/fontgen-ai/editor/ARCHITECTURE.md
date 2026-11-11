# Glyph Editor Architecture

This document describes the internal architecture and design patterns of the Interactive Glyph Editor.

## High-Level Overview

```
┌─────────────────────────────────────────────────────┐
│                 GlyphEditor (Main)                  │
│   - Orchestrates all components                     │
│   - Manages lifecycle and events                    │
│   - Provides public API                             │
└────────────────────────────────────────────────────┬┘
                                                      │
        ┌─────────────────┬──────────────────┬───────┘
        │                 │                  │
        ▼                 ▼                  ▼
   ┌────────┐      ┌──────────┐      ┌──────────┐
   │Renderer│      │Bezier    │      │Parameter │
   │(Canvas)│      │Editor    │      │Panel     │
   └────────┘      └──────────┘      └──────────┘
        │               │                   │
        ▼               ▼                   ▼
   ┌────────┐      ┌──────────┐      ┌──────────┐
   │Paper.js│      │Commands  │      │Sliders   │
   │Grid    │      │History   │      │Groups    │
   └────────┘      └──────────┘      └──────────┘

   ┌──────────────┐      ┌──────────────┐
   │UFO Parser    │      │Glyph         │
   │- GLIF        │      │Navigator     │
   │- Plist       │      │- A-Z Buttons │
   │- XML         │      │- Dropdown    │
   └──────────────┘      └──────────────┘
```

## Component Architecture

### 1. GlyphEditor (Main Orchestrator)

**File**: `src/GlyphEditor.js`

**Responsibilities**:
- Initialize all sub-components
- Manage component interactions
- Provide public API
- Handle keyboard shortcuts
- Emit events

**Key Methods**:
```javascript
// Lifecycle
constructor(options)
loadUfoFile(file)
loadGlyph(glyph)

// Editing
setEditMode(mode)
applyParameterToGlyph(id, value)
deletePoint()
reversePath()

// Undo/Redo
undo()
redo()
canUndo()

// View
zoom(factor)
pan(dx, dy)
fitToView()

// Export
exportGlif()
exportSvg()
exportPng()
```

**Event Flow**:
```
User Action
    ↓
GlyphEditor
    ├→ Renderer (canvas changes)
    ├→ BezierEditor (point changes)
    ├→ ParameterPanel (slider changes)
    └→ CommandHistory (undo/redo)
    ↓
Emit Event
    ↓
Application Listener
```

### 2. GlyphRenderer (Canvas Management)

**File**: `src/canvas/GlyphRenderer.js`

**Responsibilities**:
- Paper.js scope initialization
- Canvas setup and rendering
- Grid and metrics display
- View transforms (zoom, pan)
- Glyph loading and rendering

**Key Components**:
```
Canvas
├─ Grid Layer
│  ├─ Grid lines
│  ├─ Baseline
│  ├─ X-height line
│  └─ Cap-height line
├─ Glyph Layer (editable)
│  └─ Path objects
└─ Metrics Layer (text)
```

**Coordinate System**:
- Canvas: 1000×1000px (default)
- Origin: Top-left
- Y-axis: Inverted (top = 0)

### 3. BezierEditor (Point Editing)

**File**: `src/canvas/BezierEditor.js`

**Responsibilities**:
- Load contours into Paper.js
- Handle point selection
- Manage point drag operations
- Render control points and handles
- Provide curve manipulation API

**Point Types**:
- `line`: Straight line segment
- `qcurve`: Quadratic curve point
- `curve`: Cubic curve point
- `move`: Contour start point

**Editing Operations**:
```
Click on path
    ↓
Add point at location
    ↓
→ AddPointCommand (undo/redo)

Click on point
    ↓
Select point
    ↓
Drag point
    ↓
→ MovePointCommand (undo/redo)

Right-click on point
    ↓
Delete point
    ↓
→ DeletePointCommand (undo/redo)
```

### 4. ParameterPanel (Slider Controls)

**File**: `src/ui/ParameterPanel.js`

**Responsibilities**:
- Create slider UI
- Organize parameters into groups
- Apply parameter changes to glyph
- Track parameter history
- Export/import parameter state

**Parameter Structure**:
```javascript
{
  id: 'weight',
  label: 'Weight',
  groupId: 'stroke',
  value: 50,        // 0-100
  min: 0,
  max: 100,
  step: 5,
  callbacks: [...]
}
```

**Groups**:
- Stroke: weight, thickness, contrast
- Counter: aperture, bowl width
- Serif: length, height, bracketing
- Spacing: side bearing, tracking
- Terminal: curve, angle

### 5. GlyphNavigator (Glyph Selection)

**File**: `src/ui/GlyphNavigator.js`

**Responsibilities**:
- Display available glyphs
- Provide navigation UI
- Jump to specific glyph
- Handle keyboard shortcuts (arrow keys)

**Navigation Methods**:
- A-Z quick buttons
- Dropdown selector
- Previous/Next buttons
- Keyboard arrows

### 6. UfoParser (File I/O)

**File**: `src/io/UfoParser.js`

**Responsibilities**:
- Parse UFO ZIP files
- Extract GLIF XML
- Parse glyph outlines
- Generate GLIF from glyph data
- Handle plist files

**UFO Structure**:
```
font.ufo/
├─ glyphs/
│  ├─ contents.plist    (glyph name → file mapping)
│  ├─ A_.glif           (individual glyph)
│  ├─ B_.glif
│  └─ ...
├─ glyphOrder.plist
├─ fontinfo.plist
├─ metainfo.plist
└─ ...
```

**GLIF Format**:
```xml
<glyph name="A" unicode="A" width="600">
  <advance width="600"/>
  <outline>
    <contour>
      <point x="10" y="0" type="line"/>
      <point x="100" y="700" type="line"/>
      ...
    </contour>
  </outline>
</glyph>
```

### 7. CommandPattern (Undo/Redo)

**File**: `src/undo/CommandPattern.js`

**Responsibilities**:
- Implement two-stack history
- Execute and undo commands
- Provide command descriptions
- Persist history to IndexedDB

**Command Types**:
```javascript
// Base class
class Command {
  execute()
  undo()
  getDescription()
  serialize()
}

// Specific commands
MovePointCommand(pointId, oldX, oldY, newX, newY)
AddPointCommand(x, y, type)
DeletePointCommand(pointId, pointData)
ParameterChangeCommand(id, oldValue, newValue)
```

**History Flow**:
```
Execute Command
    ↓
Undo Stack: [cmd1, cmd2, cmd3]
Redo Stack: []
    ↓
User presses Undo
    ↓
cmd3.undo()
Undo Stack: [cmd1, cmd2]
Redo Stack: [cmd3]
    ↓
User presses Redo
    ↓
cmd3.execute()
Undo Stack: [cmd1, cmd2, cmd3]
Redo Stack: []
    ↓
User performs new action
    ↓
Redo Stack: [] (cleared)
```

## Data Flow

### Loading a UFO File

```
1. User selects file
    ↓
2. GlyphEditor.loadUfoFile(file)
    ↓
3. UfoParser.parseGlyphsContents()
    ↓
4. For each glyph: UfoParser.parseGlif()
    ↓
5. GlyphNavigator.setGlyphs(glyphs)
    ↓
6. GlyphEditor.loadGlyph(firstGlyph)
    ↓
7. GlyphRenderer.loadGlyph()
    ├─ BezierEditor.loadContour()
    └─ Render grid and metrics
    ↓
8. Emit 'ufoLoaded' event
```

### Editing a Point

```
1. User clicks on canvas
    ↓
2. BezierEditor.onMouseDown()
    ├─ Detect hit (segment or stroke)
    └─ Select/add point
    ↓
3. User drags point
    ↓
4. BezierEditor.onMouseDrag()
    ├─ Calculate new position
    ├─ Apply snap-to-grid if enabled
    └─ Update point coordinates
    ↓
5. Emit 'glyphModified' event
    ↓
6. User releases mouse
    ↓
7. BezierEditor.onMouseUp()
    ├─ Finalize drag
    ├─ Create MovePointCommand
    └─ CommandHistory.execute()
    ↓
8. Undo/Redo available
```

### Adjusting Parameter

```
1. User drags slider
    ↓
2. ParameterPanel.attachEventListeners()
    ├─ Update parameter value
    └─ Update UI (display, input fields)
    ↓
3. GlyphEditor.applyParameterToGlyph(id, value)
    ├─ Calculate transformation
    ├─ Apply to Bezier path
    └─ Re-render canvas
    ↓
4. Create ParameterChangeCommand
    ↓
5. CommandHistory.execute()
    ↓
6. Emit 'parameterChanged' event
```

## Design Patterns

### 1. Command Pattern (Undo/Redo)

Each action is encapsulated as a Command object with `execute()` and `undo()` methods.

**Benefits**:
- Decouple action from UI
- Serialize operations for persistence
- Implement undo/redo naturally

```javascript
const cmd = new MovePointCommand(
  pointId, oldX, oldY, newX, newY,
  onExecute, onUndo
);
history.execute(cmd);
```

### 2. Observer Pattern (Events)

Components emit events that the main editor listens to.

```javascript
editor.addEventListener('glyphModified', callback);
editor.emitEvent('glyphModified', { type, data });
```

### 3. Adapter Pattern (Paper.js)

BezierEditor adapts Paper.js API to the editor's needs.

```javascript
paperScope.view.onMouseDown = (event) => {
  // Adapt Paper.js event to editor logic
};
```

### 4. Singleton Pattern (History)

One global CommandHistory instance per editor.

```javascript
this.history = new CommandHistory(maxSize);
// Shared by all components
```

## State Management

### Immutability

Glyphs are copied when loaded:
```javascript
loadGlyph(glyph) {
  this.currentGlyph = { ...glyph };
  // Changes don't affect original
}
```

### Mutable Views

Canvas/Paper.js objects are mutable for performance:
```javascript
point.x = newX;  // Direct mutation (efficient)
paperScope.view.update();  // Trigger redraw
```

## Performance Optimizations

### 1. Lazy Rendering
- Grid rendered once, reused
- Control points rendered on demand
- Metrics updated only on glyph change

### 2. Event Debouncing
- Parameter slider: emit events at intervals
- Mouse drag: batch updates

### 3. Canvas Caching
- Grid layer caches
- Metrics pre-calculated

### 4. Memory Management
- Undo stack has max size (100 by default)
- Old commands discarded
- History persisted to IndexedDB, not RAM

## Extensibility Points

### Adding Custom Parameters

```javascript
parameterPanel.addParameter(
  'myParam',
  'My Custom Parameter',
  'myGroup',
  50,
  0,
  100,
  5
);

// Handle in applyParameterToGlyph()
case 'myParam':
  this.applyCustomTransform(normalizedValue);
  break;
```

### Adding Custom Commands

```javascript
class MyCustomCommand extends Command {
  execute() { /* ... */ }
  undo() { /* ... */ }
  getDescription() { return 'My Custom Action'; }
}

history.execute(new MyCustomCommand(...));
```

### Custom Export Formats

```javascript
export(format) {
  const glyph = this.getCurrentGlyph();
  
  switch (format) {
    case 'glif': return UfoParser.glyphToGlif(glyph);
    case 'json': return JSON.stringify(glyph);
    case 'custom': return this.customExport(glyph);
  }
}
```

## Testing Strategy

### Unit Tests
- Command pattern (undo/redo)
- UFO parser (GLIF parsing)
- Parameter calculations

### Integration Tests
- Load UFO → navigate → export
- Edit point → undo → redo
- Apply parameter → check transformation

### Performance Tests
- Large glyphs (100+ points)
- Many undo steps
- Rapid slider adjustments

---

## Related Documentation

- [README.md](./README.md) - Feature overview and usage
- [INTEGRATION.md](./INTEGRATION.md) - Integration with other projects
