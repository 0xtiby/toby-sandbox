const fs = require('node:fs');
const path = require('node:path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

function loadTasks() {
  let data;
  try {
    data = fs.readFileSync(TASKS_FILE, 'utf8');
  } catch {
    return [];
  }
  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch {
    throw new Error('tasks.json is corrupt');
  }
  if (!Array.isArray(parsed)) {
    throw new Error('tasks.json is corrupt');
  }
  return parsed;
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2) + '\n');
}

module.exports = { loadTasks, saveTasks };
