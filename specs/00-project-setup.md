# Project Setup

## Overview

Define the project scaffolding, language, and CLI entry point for the task tracker.

## Problem & Users

The task tracker needs a consistent runtime, entry point, and shared data model so all commands work together.

**Primary user:** Developer using the CLI.

## Scope

### In Scope
- Node.js project with `package.json`
- Single entry point: `bin/task` (or `task.js` with a bin field in `package.json`)
- CLI parses subcommands: `task <command> [args]`
- Shared Task data model used by all commands

### Out of Scope
- Publishing to npm
- External dependencies (use Node.js built-ins only)

## Data Model

```json
{
  "id": 1,
  "title": "Buy milk",
  "done": false,
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### Task Schema

| Field     | Type    | Description                        |
|-----------|---------|------------------------------------|
| id        | number  | Auto-increment, unique positive integer |
| title     | string  | Non-empty task description         |
| done      | boolean | `false` when created               |
| createdAt | string  | ISO 8601 timestamp at creation     |

### Storage

- File: `tasks.json` in the current working directory
- Format: JSON array of Task objects
- Created automatically on first `task add`

## CLI Interface

```
task add <title>     Add a new task
task list            List all tasks
task done <id>       Mark a task as done
task delete <id>     Delete a task
```

Unknown commands print a usage/help message.

## Exit Codes

All commands use consistent exit codes:
- `0` — success
- `1` — error (invalid input, missing file, task not found)

## Acceptance Criteria

- `node task.js` or `task` (via package.json bin) is the entry point
- Unknown subcommands print usage and exit with code 1
- No external dependencies — only Node.js built-ins
