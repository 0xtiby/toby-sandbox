const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

function cleanup() {
  try { fs.unlinkSync(TASKS_FILE); } catch {}
}

describe('store', () => {
  beforeEach(cleanup);
  afterEach(cleanup);

  it('loadTasks returns [] when file does not exist', () => {
    const { loadTasks } = require('./store');
    assert.deepStrictEqual(loadTasks(), []);
  });

  it('saveTasks then loadTasks round-trips', () => {
    const { loadTasks, saveTasks } = require('./store');
    const tasks = [{ id: 1, title: 'Test', done: false, createdAt: '2025-01-01T00:00:00.000Z' }];
    saveTasks(tasks);
    assert.deepStrictEqual(loadTasks(), tasks);
  });
});
