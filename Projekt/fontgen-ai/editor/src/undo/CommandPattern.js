/**
 * Command Pattern for Undo/Redo
 * Implements two-stack history (undo/redo)
 */

export class Command {
  /**
   * Execute the command
   * Override in subclasses
   */
  execute() {
    throw new Error('execute() must be implemented');
  }

  /**
   * Undo the command
   * Override in subclasses
   */
  undo() {
    throw new Error('undo() must be implemented');
  }

  /**
   * Get description for UI (e.g., "Move point")
   */
  getDescription() {
    return 'Command';
  }

  /**
   * Serialize command state for persistence
   */
  serialize() {
    return {};
  }

  /**
   * Deserialize command state
   */
  static deserialize(data) {
    return new Command();
  }
}

/**
 * History manager with two-stack pattern
 */
export class CommandHistory {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.undoStack = [];
    this.redoStack = [];
    this.listeners = [];
  }

  /**
   * Execute a command and push to undo stack
   * @param {Command} command - Command to execute
   */
  execute(command) {
    if (!(command instanceof Command)) {
      throw new Error('Must pass a Command instance');
    }

    command.execute();
    this.undoStack.push(command);

    // Limit undo stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    // Clear redo stack on new command
    this.redoStack = [];

    this.notifyListeners();
  }

  /**
   * Undo the last command
   * @returns {boolean} True if undo was performed
   */
  undo() {
    if (this.undoStack.length === 0) {
      return false;
    }

    const command = this.undoStack.pop();
    command.undo();
    this.redoStack.push(command);

    this.notifyListeners();
    return true;
  }

  /**
   * Redo the last undone command
   * @returns {boolean} True if redo was performed
   */
  redo() {
    if (this.redoStack.length === 0) {
      return false;
    }

    const command = this.redoStack.pop();
    command.execute();
    this.undoStack.push(command);

    this.notifyListeners();
    return true;
  }

  /**
   * Check if undo is available
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Check if redo is available
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Get description of next undo action
   */
  getUndoDescription() {
    if (this.undoStack.length === 0) return null;
    return this.undoStack[this.undoStack.length - 1].getDescription();
  }

  /**
   * Get description of next redo action
   */
  getRedoDescription() {
    if (this.redoStack.length === 0) return null;
    return this.redoStack[this.redoStack.length - 1].getDescription();
  }

  /**
   * Clear all history
   */
  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.notifyListeners();
  }

  /**
   * Register listener for history changes
   * @param {Function} callback - Called when history changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  /**
   * Notify all listeners of history change
   */
  notifyListeners() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Serialize history to JSON for persistence
   */
  serialize() {
    return {
      undoStack: this.undoStack.map(cmd => ({
        type: cmd.constructor.name,
        data: cmd.serialize()
      })),
      redoStack: this.redoStack.map(cmd => ({
        type: cmd.constructor.name,
        data: cmd.serialize()
      }))
    };
  }

  /**
   * Save history to IndexedDB
   */
  async saveToDb(dbName = 'GlyphEditor', storeName = 'history') {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        store.put({
          id: 'history',
          data: this.serialize(),
          timestamp: Date.now()
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Load history from IndexedDB
   */
  async loadFromDb(dbName = 'GlyphEditor', storeName = 'history') {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);

        const getRequest = store.get('history');
        getRequest.onsuccess = () => {
          if (getRequest.result) {
            resolve(getRequest.result.data);
          } else {
            resolve(null);
          }
        };
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }
}

/**
 * Specific command implementations
 */

export class MovePointCommand extends Command {
  constructor(pointId, oldX, oldY, newX, newY, onExecute, onUndo) {
    super();
    this.pointId = pointId;
    this.oldX = oldX;
    this.oldY = oldY;
    this.newX = newX;
    this.newY = newY;
    this.onExecute = onExecute;
    this.onUndo = onUndo;
  }

  execute() {
    if (this.onExecute) {
      this.onExecute(this.pointId, this.newX, this.newY);
    }
  }

  undo() {
    if (this.onUndo) {
      this.onUndo(this.pointId, this.oldX, this.oldY);
    }
  }

  getDescription() {
    return `Move point (${Math.round(this.newX)}, ${Math.round(this.newY)})`;
  }

  serialize() {
    return {
      pointId: this.pointId,
      oldX: this.oldX,
      oldY: this.oldY,
      newX: this.newX,
      newY: this.newY
    };
  }
}

export class AddPointCommand extends Command {
  constructor(x, y, type, onExecute, onUndo) {
    super();
    this.x = x;
    this.y = y;
    this.type = type || 'line';
    this.pointId = null;
    this.onExecute = onExecute;
    this.onUndo = onUndo;
  }

  execute() {
    if (this.onExecute) {
      this.pointId = this.onExecute(this.x, this.y, this.type);
    }
  }

  undo() {
    if (this.onUndo && this.pointId) {
      this.onUndo(this.pointId);
    }
  }

  getDescription() {
    return `Add ${this.type} point`;
  }

  serialize() {
    return {
      x: this.x,
      y: this.y,
      type: this.type
    };
  }
}

export class DeletePointCommand extends Command {
  constructor(pointId, pointData, onExecute, onUndo) {
    super();
    this.pointId = pointId;
    this.pointData = pointData;
    this.onExecute = onExecute;
    this.onUndo = onUndo;
  }

  execute() {
    if (this.onExecute) {
      this.onExecute(this.pointId);
    }
  }

  undo() {
    if (this.onUndo) {
      this.onUndo(this.pointId, this.pointData);
    }
  }

  getDescription() {
    return 'Delete point';
  }

  serialize() {
    return {
      pointId: this.pointId,
      pointData: this.pointData
    };
  }
}

export class ParameterChangeCommand extends Command {
  constructor(parameterId, oldValue, newValue, onExecute, onUndo) {
    super();
    this.parameterId = parameterId;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.onExecute = onExecute;
    this.onUndo = onUndo;
  }

  execute() {
    if (this.onExecute) {
      this.onExecute(this.parameterId, this.newValue);
    }
  }

  undo() {
    if (this.onUndo) {
      this.onUndo(this.parameterId, this.oldValue);
    }
  }

  getDescription() {
    return `Change ${this.parameterId} to ${Math.round(this.newValue * 100) / 100}`;
  }

  serialize() {
    return {
      parameterId: this.parameterId,
      oldValue: this.oldValue,
      newValue: this.newValue
    };
  }
}

export default {
  Command,
  CommandHistory,
  MovePointCommand,
  AddPointCommand,
  DeletePointCommand,
  ParameterChangeCommand
};
