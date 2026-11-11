/**
 * Bezier Curve Editor
 * Handles point manipulation, path editing with Paper.js
 */

import { MovePointCommand, AddPointCommand, DeletePointCommand } from '../undo/CommandPattern.js';

export class BezierEditor {
  constructor(paperScope, history) {
    this.paper = paperScope;
    this.history = history;
    this.selectedPoint = null;
    this.selectedPath = null;
    this.points = new Map(); // pointId -> { point: Path.Point, path: Path }
    this.pointIdCounter = 0;
    this.snapToGrid = false;
    this.gridSize = 10;
    this.listeners = [];

    this.setupEventHandlers();
  }

  /**
   * Load a glyph contour into the editor
   * @param {Object} contour - Contour with points array
   */
  loadContour(contour) {
    this.clearEditor();

    if (!contour || !contour.points || contour.points.length === 0) {
      return;
    }

    const path = new this.paper.Path();
    path.strokeColor = '#000000';
    path.fillColor = null;
    path.strokeWidth = 2;
    path.closed = contour.closed !== false;

    let prevPoint = null;

    for (let i = 0; i < contour.points.length; i++) {
      const point = contour.points[i];
      let segment;

      if (point.type === 'qcurve') {
        segment = path.add(new this.paper.Point(point.x, point.y));
        segment.handleIn = this.createHandleIn(i, contour.points);
        segment.handleOut = this.createHandleOut(i, contour.points);
      } else if (point.type === 'line') {
        segment = path.add(new this.paper.Point(point.x, point.y));
      } else if (point.type === 'move' || point.type === 'curve') {
        segment = path.add(new this.paper.Point(point.x, point.y));
      } else {
        segment = path.add(new this.paper.Point(point.x, point.y));
      }

      const pointId = this.pointIdCounter++;
      this.points.set(pointId, {
        point: segment.point,
        path: path,
        segment: segment,
        originalType: point.type,
        pointData: point
      });

      prevPoint = segment;
    }

    this.selectedPath = path;
    this.renderPoints();
  }

  /**
   * Create handle-in for quadratic/cubic curves
   */
  createHandleIn(index, points) {
    if (index === 0) return new this.paper.Point(0, 0);

    const prev = points[index - 1];
    const curr = points[index];

    // If previous point has type qcurve, it's an off-curve point
    if (prev.type === 'qcurve') {
      return new this.paper.Point(prev.x - curr.x, prev.y - curr.y);
    }

    return new this.paper.Point(0, 0);
  }

  /**
   * Create handle-out for quadratic/cubic curves
   */
  createHandleOut(index, points) {
    if (index === points.length - 1) return new this.paper.Point(0, 0);

    const curr = points[index];
    const next = points[index + 1];

    // If next point has type qcurve, it's an off-curve point
    if (next.type === 'qcurve') {
      return new this.paper.Point(next.x - curr.x, next.y - curr.y);
    }

    return new this.paper.Point(0, 0);
  }

  /**
   * Setup Paper.js event handlers
   */
  setupEventHandlers() {
    this.paper.view.onMouseDown = (event) => this.onMouseDown(event);
    this.paper.view.onMouseDrag = (event) => this.onMouseDrag(event);
    this.paper.view.onMouseUp = (event) => this.onMouseUp(event);
    this.paper.view.onMouseMove = (event) => this.onMouseMove(event);
  }

  /**
   * Handle mouse down - select or create point
   */
  onMouseDown(event) {
    const hitOptions = {
      segments: true,
      stroke: true,
      fill: true,
      tolerance: 5
    };

    const hit = this.paper.project.hitTest(event.point, hitOptions);

    if (hit) {
      if (hit.type === 'segment') {
        this.selectPoint(hit.segment.index);
      } else if (hit.type === 'stroke') {
        // Add point to path at click location
        const addedSegment = hit.item.divideAt(event.point);
        if (addedSegment) {
          this.addPointAtSegment(addedSegment);
        }
      }
    }

    this.renderPoints();
  }

  /**
   * Handle mouse drag - move selected point
   */
  onMouseDrag(event) {
    if (!this.selectedPath || !this.selectedPoint) {
      return;
    }

    const newPoint = event.point.clone();

    if (this.snapToGrid) {
      newPoint.x = Math.round(newPoint.x / this.gridSize) * this.gridSize;
      newPoint.y = Math.round(newPoint.y / this.gridSize) * this.gridSize;
    }

    // Find which point is selected
    for (const [pointId, data] of this.points.entries()) {
      if (data.point === this.selectedPoint) {
        const oldX = this.selectedPoint.x;
        const oldY = this.selectedPoint.y;

        this.selectedPoint.x = newPoint.x;
        this.selectedPoint.y = newPoint.y;

        this.paper.view.update();

        // Emit change event
        this.emitChange({
          type: 'pointMove',
          pointId,
          oldX,
          oldY,
          newX: newPoint.x,
          newY: newPoint.y
        });

        break;
      }
    }

    this.renderPoints();
  }

  /**
   * Handle mouse up - finalize drag
   */
  onMouseUp(event) {
    if (!this.selectedPath || !this.selectedPoint) {
      return;
    }

    this.renderPoints();
  }

  /**
   * Handle mouse move - show hover state
   */
  onMouseMove(event) {
    const hitOptions = {
      segments: true,
      tolerance: 5
    };

    const hit = this.paper.project.hitTest(event.point, hitOptions);

    if (hit && hit.type === 'segment') {
      this.paper.view.element.style.cursor = 'grab';
    } else {
      this.paper.view.element.style.cursor = 'default';
    }
  }

  /**
   * Select a point by segment index
   */
  selectPoint(segmentIndex) {
    const segment = this.selectedPath.segments[segmentIndex];
    if (segment) {
      this.selectedPoint = segment.point;
    }
  }

  /**
   * Add point at segment location
   */
  addPointAtSegment(segment) {
    const pointId = this.pointIdCounter++;
    const x = segment.point.x;
    const y = segment.point.y;

    this.points.set(pointId, {
      point: segment.point,
      path: this.selectedPath,
      segment: segment,
      originalType: 'line',
      pointData: { x, y, type: 'line' }
    });

    // Execute command for undo
    const command = new AddPointCommand(x, y, 'line', () => pointId);
    this.history.execute(command);

    this.emitChange({
      type: 'pointAdded',
      pointId,
      x,
      y,
      type: 'line'
    });
  }

  /**
   * Delete selected point
   */
  deleteSelectedPoint() {
    if (!this.selectedPoint || !this.selectedPath) {
      return;
    }

    for (const [pointId, data] of this.points.entries()) {
      if (data.point === this.selectedPoint) {
        const pointData = data.pointData;
        const segment = data.segment;

        // Execute command for undo
        const command = new DeletePointCommand(pointId, pointData);
        this.history.execute(command);

        segment.remove();
        this.points.delete(pointId);
        this.selectedPoint = null;

        this.emitChange({
          type: 'pointDeleted',
          pointId
        });

        break;
      }
    }

    this.renderPoints();
  }

  /**
   * Render control points and handles on canvas
   */
  renderPoints() {
    // Clear previous point renders
    const layer = this.paper.project.layers[0];
    const pointsToRemove = [];

    for (const item of layer.children) {
      if (item.data && item.data.isControlPoint) {
        pointsToRemove.push(item);
      }
    }

    for (const item of pointsToRemove) {
      item.remove();
    }

    // Render points
    if (this.selectedPath) {
      for (const segment of this.selectedPath.segments) {
        const isSelected = segment.point === this.selectedPoint;

        // Render point
        const circle = new this.paper.Path.Circle(segment.point, 5);
        circle.fillColor = isSelected ? '#ff0000' : '#0000ff';
        circle.strokeColor = '#ffffff';
        circle.strokeWidth = 1;
        circle.data.isControlPoint = true;

        // Render handles if they exist
        if (segment.handleIn && !segment.handleIn.isZero()) {
          const handleInPoint = segment.point.add(segment.handleIn);
          const handleInCircle = new this.paper.Path.Circle(handleInPoint, 3);
          handleInCircle.fillColor = '#00ff00';
          handleInCircle.strokeColor = '#ffffff';
          handleInCircle.strokeWidth = 0.5;
          handleInCircle.data.isControlPoint = true;

          // Draw line from point to handle
          const line = new this.paper.Path();
          line.strokeColor = '#cccccc';
          line.strokeWidth = 0.5;
          line.add(segment.point);
          line.add(handleInPoint);
          line.data.isControlPoint = true;
        }

        if (segment.handleOut && !segment.handleOut.isZero()) {
          const handleOutPoint = segment.point.add(segment.handleOut);
          const handleOutCircle = new this.paper.Path.Circle(handleOutPoint, 3);
          handleOutCircle.fillColor = '#00ff00';
          handleOutCircle.strokeColor = '#ffffff';
          handleOutCircle.strokeWidth = 0.5;
          handleOutCircle.data.isControlPoint = true;

          // Draw line from point to handle
          const line = new this.paper.Path();
          line.strokeColor = '#cccccc';
          line.strokeWidth = 0.5;
          line.add(segment.point);
          line.add(handleOutPoint);
          line.data.isControlPoint = true;
        }
      }
    }

    this.paper.view.update();
  }

  /**
   * Clear editor
   */
  clearEditor() {
    this.paper.project.activeLayer.removeChildren();
    this.points.clear();
    this.selectedPoint = null;
    this.selectedPath = null;
    this.pointIdCounter = 0;
  }

  /**
   * Get contour data from current editor state
   */
  getContourData() {
    if (!this.selectedPath) {
      return null;
    }

    const points = [];
    for (const segment of this.selectedPath.segments) {
      points.push({
        x: segment.point.x,
        y: segment.point.y,
        type: segment.point.data?.type || 'line',
        smooth: segment.point.data?.smooth || false
      });
    }

    return {
      points,
      closed: this.selectedPath.closed
    };
  }

  /**
   * Emit change event
   */
  emitChange(event) {
    for (const listener of this.listeners) {
      listener(event);
    }
  }

  /**
   * Register change listener
   */
  onChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove change listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Set grid snapping
   */
  setSnapToGrid(enabled, gridSize = 10) {
    this.snapToGrid = enabled;
    this.gridSize = gridSize;
  }

  /**
   * Flatten all curves to lines
   */
  flattenCurves() {
    if (!this.selectedPath) return;

    const flatPath = this.selectedPath.flatten(1); // Flatten with tolerance of 1px
    this.paper.view.update();
  }

  /**
   * Reverse path direction
   */
  reversePath() {
    if (!this.selectedPath) return;

    this.selectedPath.reverse();
    this.renderPoints();
    this.paper.view.update();
  }

  /**
   * Show metrics for current glyph
   */
  getMetrics() {
    if (!this.selectedPath) {
      return null;
    }

    const bounds = this.selectedPath.bounds;
    return {
      boundingBox: {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height
      },
      pointCount: this.selectedPath.segments.length,
      isClosed: this.selectedPath.closed,
      area: this.selectedPath.area
    };
  }
}

export default BezierEditor;
