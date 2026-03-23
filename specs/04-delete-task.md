# Delete Task

## Overview

Implement a CLI command to remove a task.

## Problem & Users

Users need to remove tasks they no longer need.

**Primary user:** Developer using the CLI.

## Scope

### In Scope
- `task delete <id>` command
- Remove the task from `tasks.json`
- Confirm which task was deleted

### Out of Scope
- Bulk delete
- Undo

## Error Handling

- Non-numeric or missing id: print error message, exit with code 1

## Exit Codes

- `0` — task deleted successfully
- `1` — error (invalid id, task not found, missing file)

## Acceptance Criteria

- `task delete 1` removes task with id 1 from `tasks.json`
- Output confirms the task title that was deleted
- Error message if task id doesn't exist
- Error message if `tasks.json` is missing
- Error message if id is non-numeric or missing
