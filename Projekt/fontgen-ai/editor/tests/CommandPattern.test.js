/**
 * Tests for Command Pattern (Undo/Redo)
 */

import {
  CommandHistory,
  MovePointCommand,
  AddPointCommand,
  DeletePointCommand,
  ParameterChangeCommand
} from '../src/undo/CommandPattern.js';

// Simple test runner
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}: ${error.message}`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// Tests

test('CommandHistory creates with empty stacks', () => {
  const history = new CommandHistory();
  assert(!history.canUndo(), 'Should not be able to undo');
  assert(!history.canRedo(), 'Should not be able to redo');
});

test('CommandHistory executes commands and adds to undo stack', () => {
  const history = new CommandHistory();
  let executed = false;

  const command = new MovePointCommand(1, 0, 0, 10, 10, () => {
    executed = true;
  });

  history.execute(command);

  assert(executed, 'Command should be executed');
  assert(history.canUndo(), 'Should be able to undo after executing command');
});

test('Undo reverses command', () => {
  const history = new CommandHistory();
  let state = { x: 0, y: 0 };

  const command = new MovePointCommand(
    1,
    state.x,
    state.y,
    10,
    10,
    () => {
      state.x = 10;
      state.y = 10;
    },
    () => {
      state.x = 0;
      state.y = 0;
    }
  );

  history.execute(command);
  assert(state.x === 10 && state.y === 10, 'State should be updated after execute');

  history.undo();
  assert(state.x === 0 && state.y === 0, 'State should be reverted after undo');
});

test('Redo restores command', () => {
  const history = new CommandHistory();
  let state = { x: 0, y: 0 };

  const command = new MovePointCommand(
    1,
    state.x,
    state.y,
    10,
    10,
    () => {
      state.x = 10;
      state.y = 10;
    },
    () => {
      state.x = 0;
      state.y = 0;
    }
  );

  history.execute(command);
  history.undo();
  assert(state.x === 0, 'State should be reverted');

  history.redo();
  assert(state.x === 10 && state.y === 10, 'State should be restored after redo');
});

test('Redo stack is cleared on new command', () => {
  const history = new CommandHistory();
  let state = { x: 0 };

  const cmd1 = new MovePointCommand(1, 0, 0, 10, 10, () => {
    state.x = 10;
  });

  const cmd2 = new MovePointCommand(1, 10, 10, 20, 20, () => {
    state.x = 20;
  });

  history.execute(cmd1);
  history.undo();
  assert(history.canRedo(), 'Should be able to redo after undo');

  history.execute(cmd2);
  assert(!history.canRedo(), 'Redo stack should be cleared after new command');
});

test('CommandHistory respects max size', () => {
  const history = new CommandHistory(3);
  let counter = 0;

  for (let i = 0; i < 5; i++) {
    const cmd = new MovePointCommand(i, 0, 0, i, i, () => {
      counter++;
    });
    history.execute(cmd);
  }

  assert(history.undoStack.length === 3, 'Undo stack should not exceed max size');
});

test('ParameterChangeCommand tracks parameter changes', () => {
  const history = new CommandHistory();
  let paramValue = 50;

  const command = new ParameterChangeCommand(
    'weight',
    paramValue,
    75,
    (id, val) => {
      paramValue = val;
    },
    (id, val) => {
      paramValue = val;
    }
  );

  history.execute(command);
  assert(paramValue === 75, 'Parameter should be updated');

  history.undo();
  assert(paramValue === 50, 'Parameter should be reverted');
});

test('Command descriptions are available', () => {
  const history = new CommandHistory();

  const cmd = new MovePointCommand(1, 0, 0, 10, 10);
  history.execute(cmd);

  const desc = history.getUndoDescription();
  assert(desc && desc.includes('Move point'), 'Should provide undo description');
});

test('History listeners are notified', () => {
  const history = new CommandHistory();
  let notified = false;

  history.addListener(() => {
    notified = true;
  });

  const cmd = new MovePointCommand(1, 0, 0, 10, 10);
  history.execute(cmd);

  assert(notified, 'Listener should be notified');
});

console.log('\nAll tests completed!');
