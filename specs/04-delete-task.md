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

## Acceptance Criteria

- `task delete 1` removes task with id 1 from `tasks.json`
- Output confirms the task title that was deleted
- Error message if task id doesn't exist
- Error message if `tasks.json` is missing
