const fs = require('node:fs');
const path = require('node:path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2) + '\n');
}

module.exports = { loadTasks, saveTasks };
