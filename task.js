#!/usr/bin/env node

const USAGE = `Usage: task <command> [arguments]

Commands:
  task add <title>     Add a new task
  task list            List all tasks
  task done <id>       Mark a task as done
  task delete <id>     Delete a task`;

const command = process.argv[2];

const handlers = {
  add() {},
  list() {},
  done() {},
  delete() {},
};

if (!command || !handlers[command]) {
  console.error(USAGE);
  process.exit(1);
}

handlers[command]();
