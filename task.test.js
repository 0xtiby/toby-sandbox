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
    for (const cmd of ['add', 'list', 'done', 'delete']) {
      const result = run(cmd);
      assert.strictEqual(result.exitCode, 0, `command "${cmd}" should exit 0`);
    }
  });
});
