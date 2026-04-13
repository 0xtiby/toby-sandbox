const { describe, it } = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const TASK_JS = path.join(__dirname, 'task.js');

function mkTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'task-list-'));
}

function run(cwd, ...args) {
  try {
    const stdout = execFileSync('node', [TASK_JS, ...args], {
      encoding: 'utf8',
      cwd,
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

describe('task list', () => {
  it('prints "No tasks yet" when tasks.json does not exist', () => {
    const dir = mkTmpDir();
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /No tasks yet/);
  });

  it('prints "No tasks yet" for empty array', () => {
    const dir = mkTmpDir();
    fs.writeFileSync(path.join(dir, 'tasks.json'), '[]');
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /No tasks yet/);
  });

  it('prints pending tasks with [ ] prefix', () => {
    const dir = mkTmpDir();
    fs.writeFileSync(path.join(dir, 'tasks.json'), JSON.stringify([
      { id: 1, title: 'Buy milk', done: false },
    ]));
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /\[ \] 1  Buy milk/);
  });

  it('prints done tasks with [x] prefix', () => {
    const dir = mkTmpDir();
    fs.writeFileSync(path.join(dir, 'tasks.json'), JSON.stringify([
      { id: 2, title: 'Walk the dog', done: true },
    ]));
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 0);
    assert.match(result.stdout, /\[x\] 2  Walk the dog/);
  });

  it('errors on corrupt tasks.json with exit 1', () => {
    const dir = mkTmpDir();
    fs.writeFileSync(path.join(dir, 'tasks.json'), 'not json');
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 1);
    assert.match(result.stderr, /corrupt/);
  });

  it('prints multiple tasks in order', () => {
    const dir = mkTmpDir();
    fs.writeFileSync(path.join(dir, 'tasks.json'), JSON.stringify([
      { id: 1, title: 'Buy milk', done: false },
      { id: 2, title: 'Walk the dog', done: true },
      { id: 3, title: 'Write tests', done: false },
    ]));
    const result = run(dir, 'list');
    assert.strictEqual(result.exitCode, 0);
    const lines = result.stdout.trim().split('\n');
    assert.strictEqual(lines.length, 3);
    assert.match(lines[0], /\[ \] 1  Buy milk/);
    assert.match(lines[1], /\[x\] 2  Walk the dog/);
    assert.match(lines[2], /\[ \] 3  Write tests/);
  });
});
