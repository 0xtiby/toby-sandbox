function createTask(id, title) {
  return {
    id,
    title,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

function nextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

module.exports = { createTask, nextId };
