# Add Task

## Overview

Implement a CLI command to add tasks to a local JSON file.

## Problem & Users

Users need a simple way to create tasks from the terminal.

**Primary user:** Developer using the CLI.

## Scope

### In Scope
- `task add "Buy milk"` command
- Store tasks in a `tasks.json` file in the current directory
- Each task has: id (auto-increment), title, done (boolean), createdAt (ISO timestamp)
- Create `tasks.json` if it doesn't exist

### Out of Scope
- Listing, completing, or deleting tasks (separate specs)
- Any database or server

## Error Handling

- Empty or missing title: print error message, exit with code 1
- Corrupt/invalid `tasks.json`: print error message, exit with code 1 (do not overwrite)

## Exit Codes

- `0` — task added successfully
- `1` — error (empty title, corrupt JSON)

## Acceptance Criteria

- Running `task add "Buy milk"` creates/appends to `tasks.json`
- Each task gets a unique incremental id
- Output confirms the task was added with its id
- `tasks.json` is valid JSON after every operation
- `task add ""` or `task add` with no argument prints an error and exits 1
