# Complete Task

## Overview

Implement a CLI command to mark a task as done.

## Problem & Users

Users need to mark tasks as completed.

**Primary user:** Developer using the CLI.

## Scope

### In Scope
- `task done <id>` command
- Set `done: true` for the matching task in `tasks.json`
- Confirm which task was completed

### Out of Scope
- Undoing completion
- Deleting tasks (separate spec)

## Error Handling

- Non-numeric or missing id: print error message, exit with code 1
- Task already done: print a message noting it's already complete (not an error, exit 0)

## Exit Codes

- `0` — task marked as done (or already done)
- `1` — error (invalid id, task not found, missing file)

## Acceptance Criteria

- `task done 1` marks task with id 1 as done
- Output confirms the task title that was completed
- If task is already done, prints a message noting it's already complete
- Error message if task id doesn't exist
- Error message if `tasks.json` is missing
- Error message if id is non-numeric or missing
