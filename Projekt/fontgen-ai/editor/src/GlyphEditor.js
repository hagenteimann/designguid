/**
 * Interactive Glyph Editor
 * Main editor class that orchestrates all components
 */

import { CommandHistory } from './undo/CommandPattern.js';
import { GlyphRenderer } from './canvas/GlyphRenderer.js';
import { BezierEditor } from './canvas/BezierEditor.js';
import { ParameterPanel } from './ui/ParameterPanel.js';
import { GlyphNavigator } from './ui/GlyphNavigator.js';
import { UfoParser } from './io/UfoParser.js';

export class GlyphEditor {
  constructor(options = {}) {
    const {
      canvasId = 'glyph-canvas',
      parametersId = 'parameters-panel',
      navigatorId = 'glyph-navigator',
      canvasWidth = 1000,
      canvasHeight = 1000,
      maxUndoSteps = 100
    } = options;

    // Initialize history
    this.history = new CommandHistory(maxUndoSteps);

    // Initialize components
    this.renderer = new GlyphRenderer(canvasId, canvasWidth, canvasHeight, this.history);
    this.bezierEditor = this.renderer.getBezierEditor();
    this.parameterPanel = new ParameterPanel(parametersId, this.history);
    this.navigator = new GlyphNavigator(navigatorId);

    // State
    this.glyphs = [];
    this.currentGlyph = null;
    this.mode = 'bezier'; // 'bezier' or 'parameters'
    this.listeners = [];

    // Setup event handlers
    this.setupEventHandlers();

    // Bind keyboard shortcuts
    this.bindKeyboardShortcuts();
  }

  /**
   * Setup internal event handlers
   */
  setupEventHandlers() {
    // Navigator selection
    this.navigator.onSelect(({ glyph, index }) => {
      this.loadGlyph(glyph);
      this.emitEvent('glyphSelected', { glyph, index });
    });

    // Parameter changes
    this.parameterPanel.onChange(({ parameterId, value }) => {
      this.applyParameterToGlyph(parameterId, value);
      this.emitEvent('parameterChanged', { parameterId, value });
    });

    // Bezier editor changes
    this.bezierEditor.onChange(({ type, pointId, ...data }) => {
      this.emitEvent('glyphModified', { type, pointId, ...data });
    });
  }

  /**
   * Load UFO file
   * @param {File|ArrayBuffer} file - UFO file or buffer
   */
  async loadUfoFile(file) {
    try {
      const JSZip = window.JSZip || (await this.loadJsZip());
      let zip;

      if (file instanceof File) {
        zip = await JSZip.loadAsync(file);
      } else if (file instanceof ArrayBuffer) {
        zip = await JSZip.loadAsync(file);
      } else {
        throw new Error('Invalid file format');
      }

      // Parse UFO structure
      const glyphs = [];

      // Read glyphs.contents plist to get glyph file mappings
      const contentsFile = zip.file('glyphs/contents.plist');
      if (!contentsFile) {
        throw new Error('Invalid UFO: missing glyphs/contents.plist');
      }

      const contentsContent = await contentsFile.async('string');
      const glyphMappings = UfoParser.parseGlyphsContents(contentsContent);

      // Load each glyph GLIF file
      for (const [glyphName, glyphFile] of Object.entries(glyphMappings)) {
        const glifPath = `glyphs/${glyphFile}`;
        const glifFileObj = zip.file(glifPath);

        if (glifFileObj) {
          const glifContent = await glifFileObj.async('string');
          const glyph = UfoParser.parseGlif(glifContent);
          glyphs.push(glyph);
        }
      }

      this.glyphs = glyphs;
      this.navigator.setGlyphs(glyphs);

      if (glyphs.length > 0) {
        this.loadGlyph(glyphs[0]);
      }

      this.emitEvent('ufoLoaded', { glyphCount: glyphs.length });
      return glyphs;
    } catch (error) {
      console.error('Error loading UFO file:', error);
      this.emitEvent('error', { message: error.message });
      throw error;
    }
  }

  /**
   * Load JSZip library dynamically
   */
  async loadJsZip() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = () => reject(new Error('Failed to load JSZip'));
      document.head.appendChild(script);
    });
  }

  /**
   * Load single glyph
   */
  loadGlyph(glyph) {
    if (!glyph) return;

    this.currentGlyph = glyph;
    this.renderer.loadGlyph(glyph);
    this.bezierEditor.renderPoints();

    this.emitEvent('glyphLoaded', { glyph });
  }

  /**
   * Apply parameter change to glyph
   */
  applyParameterToGlyph(parameterId, value) {
    if (!this.currentGlyph || !this.bezierEditor.selectedPath) {
      return;
    }

    // Map parameter to transformation
    const normalizedValue = value / 100; // Convert 0-100 to 0-1

    switch (parameterId) {
      case 'weight':
        this.scaleStrokeWeight(normalizedValue);
        break;
      case 'contrast':
        this.adjustContrast(normalizedValue);
        break;
      case 'thickness':
        this.adjustThickness(normalizedValue);
        break;
      case 'aperture':
        this.adjustAperture(normalizedValue);
        break;
      case 'bowlWidth':
        this.adjustBowlWidth(normalizedValue);
        break;
      default:
        // Custom parameter handling
        break;
    }

    this.renderer.paperScope.view.update();
  }

  /**
   * Scale stroke weight
   */
  scaleStrokeWeight(factor) {
    if (!this.bezierEditor.selectedPath) return;

    // Scale the path by expanding/contracting outlines
    const offset = (factor - 0.5) * 20; // -10 to 10 pixel range
    const expanded = this.bezierEditor.selectedPath.expand(offset);

    if (expanded) {
      this.bezierEditor.selectedPath.remove();
      this.bezierEditor.selectedPath = expanded;
    }
  }

  /**
   * Adjust contrast (vertical vs horizontal weight)
   */
  adjustContrast(factor) {
    if (!this.bezierEditor.selectedPath) return;

    // Horizontal scale based on contrast
    const scaleX = 1 + (factor - 0.5) * 0.5; // 0.75 to 1.25

    const bounds = this.bezierEditor.selectedPath.bounds;
    this.bezierEditor.selectedPath.scale(scaleX, 1, bounds.center);
  }

  /**
   * Adjust thickness uniformly
   */
  adjustThickness(factor) {
    if (!this.bezierEditor.selectedPath) return;

    const scale = 0.8 + factor * 0.4; // 0.8 to 1.2 scale
    const bounds = this.bezierEditor.selectedPath.bounds;
    this.bezierEditor.selectedPath.scale(scale, scale, bounds.center);
  }

  /**
   * Adjust aperture (counter opening)
   */
  adjustAperture(factor) {
    if (!this.bezierEditor.selectedPath) return;

    // Increase counter space by vertical scaling
    const scaleY = 0.9 + factor * 0.2; // 0.9 to 1.1
    const bounds = this.bezierEditor.selectedPath.bounds;
    this.bezierEditor.selectedPath.scale(1, scaleY, bounds.center);
  }

  /**
   * Adjust bowl width
   */
  adjustBowlWidth(factor) {
    if (!this.bezierEditor.selectedPath) return;

    // Widen bowls by horizontal scaling
    const scaleX = 0.9 + factor * 0.2; // 0.9 to 1.1
    const bounds = this.bezierEditor.selectedPath.bounds;
    this.bezierEditor.selectedPath.scale(scaleX, 1, bounds.center);
  }

  /**
   * Export glyph as GLIF XML
   */
  exportGlif() {
    if (!this.currentGlyph) {
      throw new Error('No glyph loaded');
    }

    const updated = this.renderer.getCurrentGlyph();
    return UfoParser.glyphToGlif(updated);
  }

  /**
   * Export glyph as SVG
   */
  exportSvg() {
    return this.renderer.exportAsSvg();
  }

  /**
   * Export canvas as PNG
   */
  exportPng() {
    return this.renderer.exportAsPng();
  }

  /**
   * Toggle between Bezier and Parameter editing modes
   */
  setEditMode(mode) {
    if (mode !== 'bezier' && mode !== 'parameters') {
      throw new Error('Invalid mode. Must be "bezier" or "parameters"');
    }

    this.mode = mode;
    this.emitEvent('modeChanged', { mode });
  }

  /**
   * Undo last action
   */
  undo() {
    this.history.undo();
  }

  /**
   * Redo last undone action
   */
  redo() {
    this.history.redo();
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.history.canUndo();
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.history.canRedo();
  }

  /**
   * Get undo description
   */
  getUndoDescription() {
    return this.history.getUndoDescription();
  }

  /**
   * Get redo description
   */
  getRedoDescription() {
    return this.history.getRedoDescription();
  }

  /**
   * Clear history
   */
  clearHistory() {
    this.history.clear();
  }

  /**
   * Delete selected point
   */
  deletePoint() {
    this.bezierEditor.deleteSelectedPoint();
  }

  /**
   * Reverse path direction
   */
  reversePath() {
    this.bezierEditor.reversePath();
  }

  /**
   * Flatten curves to lines
   */
  flattenCurves() {
    this.bezierEditor.flattenCurves();
  }

  /**
   * Zoom in/out
   */
  zoom(factor) {
    this.renderer.zoom(factor);
  }

  /**
   * Pan canvas
   */
  pan(dx, dy) {
    this.renderer.pan(dx, dy);
  }

  /**
   * Fit view to glyph
   */
  fitToView() {
    this.renderer.fitToView();
  }

  /**
   * Save history to IndexedDB
   */
  async saveHistory() {
    return this.history.saveToDb();
  }

  /**
   * Load history from IndexedDB
   */
  async loadHistory() {
    return this.history.loadFromDb();
  }

  /**
   * Register event listener
   */
  addEventListener(eventType, callback) {
    this.listeners.push({ type: eventType, callback });
  }

  /**
   * Emit event
   */
  emitEvent(type, data) {
    for (const { type: eventType, callback } of this.listeners) {
      if (eventType === type) {
        callback(data);
      }
    }
  }

  /**
   * Bind keyboard shortcuts
   */
  bindKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          this.undo();
        } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
          e.preventDefault();
          this.redo();
        }
      }

      if (e.key === 'Delete') {
        this.deletePoint();
      }
    });
  }

  /**
   * Export current session state
   */
  exportState() {
    return {
      currentGlyph: this.currentGlyph ? this.currentGlyph.name : null,
      parameters: this.parameterPanel.export(),
      mode: this.mode
    };
  }

  /**
   * Import session state
   */
  importState(state) {
    if (state.parameters) {
      this.parameterPanel.import(state.parameters);
    }
    if (state.mode) {
      this.mode = state.mode;
    }
  }
}

export default GlyphEditor;
