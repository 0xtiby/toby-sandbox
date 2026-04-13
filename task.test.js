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
    for (const cmd of ['list']) {
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

  it('errors on corrupt tasks.json without overwriting', () => {
    cleanup();
    fs.writeFileSync(TASKS_FILE, '{invalid');
    const result = run('add', 'test');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
    const content = fs.readFileSync(TASKS_FILE, 'utf8');
    assert.strictEqual(content, '{invalid');
    cleanup();
  });
});

describe('task.js done', () => {
  const fs = require('node:fs');
  const TASKS_FILE = path.join(__dirname, 'tasks.json');

  function cleanup() {
    try { fs.unlinkSync(TASKS_FILE); } catch {}
  }

  it('marks a task as done and prints confirmation', () => {
    cleanup();
    run('add', 'Buy milk');
    const result = run('done', '1');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /Completed task 1: Buy milk/);
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    assert.strictEqual(tasks[0].done, true);
    cleanup();
  });

  it('prints already complete for done task and exits 0', () => {
    cleanup();
    run('add', 'Buy milk');
    run('done', '1');
    const result = run('done', '1');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /Task 1 is already complete/);
    cleanup();
  });

  it('errors with no id argument', () => {
    cleanup();
    const result = run('done');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /id is required/);
    cleanup();
  });

  it('errors with non-numeric id', () => {
    cleanup();
    run('add', 'test');
    const result = run('done', 'abc');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /id must be a positive integer/);
    cleanup();
  });

  it('errors with non-existent id', () => {
    cleanup();
    run('add', 'test');
    const result = run('done', '999');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /task 999 not found/);
    cleanup();
  });

  it('errors when tasks.json is missing', () => {
    cleanup();
    const result = run('done', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /no tasks file found/);
    cleanup();
  });

  it('errors on corrupt tasks.json', () => {
    cleanup();
    fs.writeFileSync(TASKS_FILE, '{invalid');
    const result = run('done', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
    cleanup();
  });

  it('errors on non-array tasks.json', () => {
    cleanup();
    fs.writeFileSync(TASKS_FILE, '"not an array"');
    const result = run('done', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
    cleanup();
  });
});

describe('task.js delete', () => {
  const fs = require('node:fs');
  const TASKS_FILE = path.join(__dirname, 'tasks.json');

  function cleanup() {
    try { fs.unlinkSync(TASKS_FILE); } catch {}
  }

  it('deletes a task and prints confirmation', () => {
    cleanup();
    run('add', 'Buy milk');
    run('add', 'Walk dog');
    const result = run('delete', '1');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /Deleted task 1: Buy milk/);
    const tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    assert.strictEqual(tasks.length, 1);
    assert.strictEqual(tasks[0].id, 2);
    cleanup();
  });

  it('errors with no id argument', () => {
    cleanup();
    const result = run('delete');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /id is required/);
    cleanup();
  });

  it('errors with non-numeric id', () => {
    cleanup();
    run('add', 'test');
    const result = run('delete', 'abc');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /id must be a positive integer/);
    cleanup();
  });

  it('errors with non-existent id', () => {
    cleanup();
    run('add', 'test');
    const result = run('delete', '999');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /task 999 not found/);
    cleanup();
  });

  it('errors when tasks.json is missing', () => {
    cleanup();
    const result = run('delete', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /no tasks file found/);
    cleanup();
  });

  it('errors on corrupt tasks.json', () => {
    cleanup();
    fs.writeFileSync(TASKS_FILE, 'not json');
    const result = run('delete', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
    cleanup();
  });

  it('errors on non-array tasks.json', () => {
    cleanup();
    fs.writeFileSync(TASKS_FILE, '"not an array"');
    const result = run('delete', '1');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
    cleanup();
  });
});
