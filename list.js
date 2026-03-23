const { loadTasks } = require('./store');

function list() {
  let tasks;
  try {
    tasks = loadTasks();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
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
