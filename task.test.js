const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const path = require('node:path');

const TASK_JS = path.join(__dirname, 'task.js');

function run(...args) {
  try {
    const stdout = execFileSync('node', [TASK_JS, ...args], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return { stdout, stderr: '', exitCode: 0 };
  } catch (err) {
    return {
      stdout: err.stdout || '',
      stderr: err.stderr || '',
      exitCode: err.status,
    };
  }
}

describe('task.js CLI', () => {
  it('prints usage and exits 1 with no args', () => {
    const result = run();
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /Usage:/);
    assert.match(result.stderr, /task add <title>/);
  });

  it('prints usage and exits 1 for unknown command', () => {
    const result = run('unknown');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /Usage:/);
  });

  it('does not crash for valid commands', () => {
    for (const cmd of ['list', 'done', 'delete']) {
      const result = run(cmd);
      assert.strictEqual(result.exitCode, 0, `command "${cmd}" should exit 0`);
    }
  });
});

describe('task.js add', () => {
  const fs = require('node:fs');
  const TASKS_FILE = path.join(__dirname, 'tasks.json');

  function cleanup() {
    try { fs.unlinkSync(TASKS_FILE); } catch {}
  }

  it('adds a task and prints confirmation', () => {
    cleanup();
    const result = run('add', 'Buy milk');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /Added task 1: Buy milk/);
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    assert.strictEqual(tasks.length, 1);
    assert.strictEqual(tasks[0].title, 'Buy milk');
    assert.strictEqual(tasks[0].done, false);
    cleanup();
  });

  it('auto-increments task id', () => {
    cleanup();
    run('add', 'First');
    const result = run('add', 'Second');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /Added task 2: Second/);
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    assert.strictEqual(tasks.length, 2);
    cleanup();
  });

  it('errors with no title argument', () => {
    cleanup();
    const result = run('add');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /title is required/);
    cleanup();
  });

  it('errors with empty title', () => {
    cleanup();
    const result = run('add', '');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /title is required/);
    cleanup();
  });
});
