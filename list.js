const { loadTasks } = require('./store');

function list() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks yet');
    return;
  }
  for (const task of tasks) {
    const status = task.done ? '[x]' : '[ ]';
    console.log(`${status} ${task.id}  ${task.title}`);
  }
}

module.exports = { list };
