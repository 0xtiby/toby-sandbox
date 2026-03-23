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
  done() {
    const fs = require('node:fs');
    const arg = process.argv[3];
    if (arg === undefined) {
      console.error('Error: id is required');
      process.exit(1);
    }
    const id = parseInt(arg, 10);
    if (!Number.isInteger(id) || id <= 0) {
      console.error('Error: id must be a positive integer');
      process.exit(1);
    }
    if (!fs.existsSync('tasks.json')) {
      console.error('Error: no tasks file found');
      process.exit(1);
    }
    let tasks;
    try {
      tasks = loadTasks();
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    const task = tasks.find((t) => t.id === id);
    if (!task) {
      console.error(`Error: task ${id} not found`);
      process.exit(1);
    }
    if (task.done) {
      console.log(`Task ${id} is already complete`);
      return;
    }
    task.done = true;
    saveTasks(tasks);
    console.log(`Completed task ${id}: ${task.title}`);
  },
  delete() {},
};

if (!command || !handlers[command]) {
  console.error(USAGE);
  process.exit(1);
}

handlers[command]();
