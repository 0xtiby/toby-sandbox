const { describe, it } = require('node:test');
const assert = require('node:assert');
const { createTask, nextId } = require('./model');

describe('model', () => {
  it('createTask returns correct shape', () => {
    const task = createTask(1, 'Buy milk');
    assert.strictEqual(task.id, 1);
    assert.strictEqual(task.title, 'Buy milk');
    assert.strictEqual(task.done, false);
    assert.ok(task.createdAt);
    assert.doesNotThrow(() => new Date(task.createdAt).toISOString());
  });

  it('nextId returns 1 for empty array', () => {
    assert.strictEqual(nextId([]), 1);
  });

  it('nextId returns max + 1', () => {
    assert.strictEqual(nextId([{ id: 3 }, { id: 1 }]), 4);
  });
});
