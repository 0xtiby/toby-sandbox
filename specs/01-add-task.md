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

## Acceptance Criteria

- Running `task add "Buy milk"` creates/appends to `tasks.json`
- Each task gets a unique incremental id
- Output confirms the task was added with its id
- `tasks.json` is valid JSON after every operation
