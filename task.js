#!/usr/bin/env node

const { loadTasks, saveTasks } = require('./store');
const { createTask, nextId } = require('./model');
const { list } = require('./list');

const USAGE = `Usage: task <command> [arguments]

Commands:
  task add <title>     Add a new task
  task list            List all tasks
  task done <id>       Mark a task as done
  task delete <id>     Delete a task`;

const command = process.argv[2];

const handlers = {
  add() {
    const title = process.argv[3];
    if (!title || title.trim() === '') {
      console.error('Error: title is required');
      process.exit(1);
    }
    let tasks;
    try {
      tasks = loadTasks();
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    const id = nextId(tasks);
    const task = createTask(id, title);
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Added task ${id}: ${title}`);
  },
  list,
  done() {},
  delete() {},
};

if (!command || !handlers[command]) {
  console.error(USAGE);
  process.exit(1);
}

handlers[command]();
