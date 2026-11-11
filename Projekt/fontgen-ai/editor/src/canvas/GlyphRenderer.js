/**
 * Glyph Renderer
 * Sets up Paper.js canvas and manages rendering
 */

import { BezierEditor } from './BezierEditor.js';
import { UfoParser } from '../io/UfoParser.js';

export class GlyphRenderer {
  constructor(canvasId, width = 1000, height = 1000, history = null) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element with id "${canvasId}" not found`);
    }

    this.canvas.width = width;
    this.canvas.height = height;

    this.width = width;
    this.height = height;
    this.history = history;

    // Setup Paper.js
    this.setupPaperJs();

    // Create Bezier editor
    this.bezierEditor = new BezierEditor(this.paperScope, history);

    this.currentGlyph = null;
    this.listeners = [];

    this.renderGrid();
    this.renderMetrics();
  }

  /**
   * Setup Paper.js scope
   */
  setupPaperJs() {
    this.paperScope = new window.paper.PaperScope();
    this.paperScope.setup(this.canvas);

    // Set canvas background
    this.paperScope.view.backgroundColor = '#ffffff';
  }

  /**
   * Load glyph from UFO data
   * @param {Object} glyph - Parsed glyph object
   */
  loadGlyph(glyph) {
    this.currentGlyph = glyph;
    this.bezierEditor.clearEditor();

    if (!glyph.contours || glyph.contours.length === 0) {
      this.renderGrid();
      this.renderMetrics();
      return;
    }

    // Load first contour (main outline)
    const contour = glyph.contours[0];
    if (contour.type !== 'components') {
      this.bezierEditor.loadContour(contour);
    }

    this.renderGrid();
    this.renderMetrics();
    this.paperScope.view.update();
  }

  /**
   * Render grid overlay
   */
  renderGrid() {
    const gridLayer = new this.paperScope.Layer();
    gridLayer.name = 'grid';

    const gridSize = 100;
    const gridColor = '#e0e0e0';
    const majorGridColor = '#cccccc';

    // Draw vertical lines
    for (let x = 0; x <= this.width; x += gridSize) {
      const path = new this.paperScope.Path();
      path.strokeColor = x % (gridSize * 10) === 0 ? majorGridColor : gridColor;
      path.strokeWidth = x % (gridSize * 10) === 0 ? 1 : 0.5;
      path.add(new this.paperScope.Point(x, 0));
      path.add(new this.paperScope.Point(x, this.height));
      path.data.isGrid = true;
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.height; y += gridSize) {
      const path = new this.paperScope.Path();
      path.strokeColor = y % (gridSize * 10) === 0 ? majorGridColor : gridColor;
      path.strokeWidth = y % (gridSize * 10) === 0 ? 1 : 0.5;
      path.add(new this.paperScope.Point(0, y));
      path.add(new this.paperScope.Point(this.width, y));
      path.data.isGrid = true;
    }

    // Draw baseline
    const baselineY = this.height * 0.75;
    const baseline = new this.paperScope.Path();
    baseline.strokeColor = '#0000ff';
    baseline.strokeWidth = 1;
    baseline.dashArray = [5, 5];
    baseline.add(new this.paperScope.Point(0, baselineY));
    baseline.add(new this.paperScope.Point(this.width, baselineY));
    baseline.data.isGrid = true;

    // Draw x-height line (approximately 0.5x height)
    const xHeightY = this.height * 0.5;
    const xHeight = new this.paperScope.Path();
    xHeight.strokeColor = '#00aa00';
    xHeight.strokeWidth = 1;
    xHeight.dashArray = [5, 5];
    xHeight.add(new this.paperScope.Point(0, xHeightY));
    xHeight.add(new this.paperScope.Point(this.width, xHeightY));
    xHeight.data.isGrid = true;

    // Draw cap height line (approximately 0.25x height)
    const capHeightY = this.height * 0.25;
    const capHeight = new this.paperScope.Path();
    capHeight.strokeColor = '#ff0000';
    capHeight.strokeWidth = 1;
    capHeight.dashArray = [5, 5];
    capHeight.add(new this.paperScope.Point(0, capHeightY));
    capHeight.add(new this.paperScope.Point(this.width, capHeightY));
    capHeight.data.isGrid = true;

    // Move grid to back
    const allLayers = this.paperScope.project.layers;
    for (const layer of allLayers) {
      layer.moveToBack();
    }
  }

  /**
   * Render font metrics text
   */
  renderMetrics() {
    // Remove old metrics
    const metricsLayer = this.paperScope.project.layers.find(l => l.name === 'metrics');
    if (metricsLayer) {
      metricsLayer.removeChildren();
    }

    const metrics = this.bezierEditor.getMetrics();

    if (metrics) {
      // Create a simple text rendering
      const textOptions = {
        point: new this.paperScope.Point(10, this.height - 10),
        fontSize: 12,
        fillColor: '#666666',
        font: 'Arial'
      };

      const metricsText = `Bounds: ${Math.round(metrics.boundingBox.x)},${Math.round(metrics.boundingBox.y)} ` +
        `${Math.round(metrics.boundingBox.width)}x${Math.round(metrics.boundingBox.height)} | ` +
        `Points: ${metrics.pointCount} | Area: ${Math.round(metrics.area)}`;

      // Note: Paper.js doesn't have built-in text support, so we skip this for now
      // In a real implementation, we'd use Canvas text API or a text rendering library
    }
  }

  /**
   * Get current glyph data
   */
  getCurrentGlyph() {
    if (!this.currentGlyph) {
      return null;
    }

    return {
      ...this.currentGlyph,
      contours: [this.bezierEditor.getContourData()]
    };
  }

  /**
   * Export glyph as SVG
   */
  exportAsSvg() {
    if (!this.bezierEditor.selectedPath) {
      return null;
    }

    const pathData = this.bezierEditor.selectedPath.pathData;
    const svg = `<svg width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
      <path d="${pathData}" fill="none" stroke="black" stroke-width="2"/>
    </svg>`;

    return svg;
  }

  /**
   * Zoom in/out
   */
  zoom(factor) {
    this.paperScope.view.scale(factor);
  }

  /**
   * Pan canvas
   */
  pan(dx, dy) {
    this.paperScope.view.translate(new this.paperScope.Point(dx, dy));
  }

  /**
   * Reset view to fit glyph
   */
  fitToView() {
    if (!this.bezierEditor.selectedPath) {
      this.paperScope.view.zoom = 1;
      this.paperScope.view.center = new this.paperScope.Point(this.width / 2, this.height / 2);
      return;
    }

    const bounds = this.bezierEditor.selectedPath.bounds;
    const padding = 50;

    this.paperScope.view.zoom = 1;
    this.paperScope.view.center = bounds.center;

    // Calculate zoom to fit
    const scale = Math.min(
      (this.width - padding * 2) / bounds.width,
      (this.height - padding * 2) / bounds.height
    );

    if (scale > 0 && isFinite(scale)) {
      this.paperScope.view.zoom = scale;
    }
  }

  /**
   * Register change listener
   */
  onChange(callback) {
    this.listeners.push(callback);
    this.bezierEditor.onChange(callback);
  }

  /**
   * Get Bezier editor instance
   */
  getBezierEditor() {
    return this.bezierEditor;
  }

  /**
   * Get Paper.js scope
   */
  getPaperScope() {
    return this.paperScope;
  }

  /**
   * Export canvas as PNG
   */
  exportAsPng() {
    const canvas = this.canvas;
    return canvas.toDataURL('image/png');
  }
}

export default GlyphRenderer;
