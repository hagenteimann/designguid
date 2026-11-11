/**
 * Parameter Panel
 * UI for adjustable sliders and parameter groups
 */

import { ParameterChangeCommand } from '../undo/CommandPattern.js';

export class ParameterPanel {
  constructor(containerId, history = null) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }

    this.history = history;
    this.parameters = new Map();
    this.groups = new Map();
    this.listeners = [];

    this.initializeDefaultParameters();
    this.render();
  }

  /**
   * Initialize default font parameters
   */
  initializeDefaultParameters() {
    // Stroke parameters
    this.addGroup('Stroke', 'stroke');
    this.addParameter('weight', 'Weight', 'stroke', 50, 0, 100, 5);
    this.addParameter('thickness', 'Thickness', 'stroke', 50, 0, 100, 5);
    this.addParameter('contrast', 'Contrast', 'stroke', 50, 0, 100, 5);

    // Counter parameters
    this.addGroup('Counter', 'counter');
    this.addParameter('aperture', 'Aperture', 'counter', 50, 0, 100, 5);
    this.addParameter('bowlWidth', 'Bowl Width', 'counter', 50, 0, 100, 5);

    // Serif parameters
    this.addGroup('Serif', 'serif');
    this.addParameter('serifLength', 'Length', 'serif', 50, 0, 100, 5);
    this.addParameter('serifHeight', 'Height', 'serif', 50, 0, 100, 5);
    this.addParameter('serifBracketing', 'Bracketing', 'serif', 50, 0, 100, 5);

    // Spacing parameters
    this.addGroup('Spacing', 'spacing');
    this.addParameter('sideBearing', 'Side Bearing', 'spacing', 50, 0, 100, 5);
    this.addParameter('tracking', 'Tracking', 'spacing', 50, 0, 100, 5);

    // Terminal parameters
    this.addGroup('Terminal', 'terminal');
    this.addParameter('terminalCurve', 'Terminal Curve', 'terminal', 50, 0, 100, 5);
    this.addParameter('terminalAngle', 'Angle', 'terminal', 50, 0, 360, 5);
  }

  /**
   * Add parameter group
   * @param {string} label - Display label
   * @param {string} groupId - Unique group identifier
   */
  addGroup(label, groupId) {
    if (!this.groups.has(groupId)) {
      this.groups.set(groupId, {
        id: groupId,
        label,
        expanded: true,
        parameters: []
      });
    }
  }

  /**
   * Add parameter to group
   * @param {string} id - Parameter ID
   * @param {string} label - Display label
   * @param {string} groupId - Group identifier
   * @param {number} value - Initial value
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {number} step - Step size
   */
  addParameter(id, label, groupId, value = 50, min = 0, max = 100, step = 1) {
    this.parameters.set(id, {
      id,
      label,
      groupId,
      value,
      min,
      max,
      step,
      callbacks: []
    });

    const group = this.groups.get(groupId);
    if (group && !group.parameters.includes(id)) {
      group.parameters.push(id);
    }
  }

  /**
   * Get parameter value
   */
  getParameterValue(id) {
    const param = this.parameters.get(id);
    return param ? param.value : null;
  }

  /**
   * Set parameter value with undo support
   */
  setParameterValue(id, newValue, triggerChange = true) {
    const param = this.parameters.get(id);
    if (!param) return;

    const oldValue = param.value;
    param.value = Math.max(param.min, Math.min(param.max, newValue));

    // Update UI
    const slider = this.container.querySelector(`input[data-parameter="${id}"]`);
    const valueInput = this.container.querySelector(`input[data-parameter="${id}"][type="number"]`);

    if (slider) {
      slider.value = param.value;
    }
    if (valueInput) {
      valueInput.value = (param.value / 100).toFixed(2);
    }

    // Execute undo command
    if (this.history && oldValue !== param.value) {
      const command = new ParameterChangeCommand(
        id,
        oldValue,
        param.value,
        (paramId, value) => this.setParameterValue(paramId, value, false),
        (paramId, value) => this.setParameterValue(paramId, value, false)
      );
      this.history.execute(command);
    }

    if (triggerChange) {
      this.emitChange(id, param.value);
    }
  }

  /**
   * Reset parameter group to defaults
   */
  resetGroup(groupId) {
    const group = this.groups.get(groupId);
    if (!group) return;

    for (const parameterId of group.parameters) {
      const param = this.parameters.get(parameterId);
      if (param) {
        this.setParameterValue(parameterId, 50);
      }
    }
  }

  /**
   * Register parameter change listener
   */
  onChange(callback) {
    this.listeners.push(callback);
  }

  /**
   * Emit change event
   */
  emitChange(parameterId, value) {
    for (const listener of this.listeners) {
      listener({ parameterId, value });
    }
  }

  /**
   * Render parameter panel
   */
  render() {
    this.container.innerHTML = '';
    this.container.className = 'parameter-panel';

    for (const [groupId, group] of this.groups) {
      const groupContainer = document.createElement('div');
      groupContainer.className = 'parameter-group';
      groupContainer.dataset.group = groupId;

      // Group header
      const header = document.createElement('div');
      header.className = 'group-header';
      header.innerHTML = `
        <button class="group-toggle" data-group="${groupId}">
          <span class="toggle-icon">${group.expanded ? '▼' : '▶'}</span>
          <span class="group-label">${group.label}</span>
        </button>
        <button class="group-reset" data-group="${groupId}" title="Reset to defaults">↺</button>
      `;

      header.querySelector('.group-toggle').addEventListener('click', (e) => {
        this.toggleGroup(groupId);
      });

      header.querySelector('.group-reset').addEventListener('click', (e) => {
        this.resetGroup(groupId);
      });

      groupContainer.appendChild(header);

      // Parameters in group
      if (group.expanded) {
        const parametersContainer = document.createElement('div');
        parametersContainer.className = 'parameters-container';

        for (const parameterId of group.parameters) {
          const param = this.parameters.get(parameterId);
          if (param) {
            const paramElement = this.renderParameter(param);
            parametersContainer.appendChild(paramElement);
          }
        }

        groupContainer.appendChild(parametersContainer);
      }

      this.container.appendChild(groupContainer);
    }

    this.attachEventListeners();
  }

  /**
   * Render single parameter control
   */
  renderParameter(param) {
    const container = document.createElement('div');
    container.className = 'parameter-control';
    container.dataset.parameter = param.id;

    const normalizedValue = (param.value - param.min) / (param.max - param.min) * 100;

    container.innerHTML = `
      <label class="parameter-label">${param.label}</label>
      <div class="parameter-input-group">
        <input
          type="range"
          class="parameter-slider"
          data-parameter="${param.id}"
          min="${param.min}"
          max="${param.max}"
          step="${param.step}"
          value="${param.value}"
          style="width: 100%"
        />
        <input
          type="number"
          class="parameter-value"
          data-parameter="${param.id}"
          value="${(param.value / 100).toFixed(2)}"
          step="${param.step / 100}"
          min="${param.min / 100}"
          max="${param.max / 100}"
        />
      </div>
      <div class="parameter-display" data-parameter="${param.id}">${Math.round(param.value)}%</div>
    `;

    return container;
  }

  /**
   * Toggle parameter group visibility
   */
  toggleGroup(groupId) {
    const group = this.groups.get(groupId);
    if (!group) return;

    group.expanded = !group.expanded;
    this.render();
  }

  /**
   * Attach event listeners to controls
   */
  attachEventListeners() {
    // Slider change
    for (const slider of this.container.querySelectorAll('.parameter-slider')) {
      slider.addEventListener('input', (e) => {
        const parameterId = e.target.dataset.parameter;
        const value = parseFloat(e.target.value);
        this.setParameterValue(parameterId, value);

        // Update display
        const displayEl = this.container.querySelector(`.parameter-display[data-parameter="${parameterId}"]`);
        if (displayEl) {
          displayEl.textContent = Math.round(value) + '%';
        }
      });

      slider.addEventListener('change', (e) => {
        const parameterId = e.target.dataset.parameter;
        // Finalize change (could add sound or haptic feedback here)
      });
    }

    // Number input change
    for (const input of this.container.querySelectorAll('.parameter-value')) {
      input.addEventListener('input', (e) => {
        const parameterId = e.target.dataset.parameter;
        const value = parseFloat(e.target.value) * 100;
        this.setParameterValue(parameterId, value);

        // Update slider
        const slider = this.container.querySelector(`.parameter-slider[data-parameter="${parameterId}"]`);
        if (slider) {
          slider.value = value;
        }
      });
    }
  }

  /**
   * Get all parameter values as object
   */
  getAllParameters() {
    const result = {};
    for (const [id, param] of this.parameters) {
      result[id] = param.value;
    }
    return result;
  }

  /**
   * Set all parameter values from object
   */
  setAllParameters(values) {
    for (const [id, value] of Object.entries(values)) {
      this.setParameterValue(id, value, false);
    }
  }

  /**
   * Export parameters as JSON
   */
  export() {
    return {
      timestamp: new Date().toISOString(),
      parameters: this.getAllParameters()
    };
  }

  /**
   * Import parameters from JSON
   */
  import(data) {
    if (data.parameters) {
      this.setAllParameters(data.parameters);
    }
  }
}

export default ParameterPanel;
