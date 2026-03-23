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

## Acceptance Criteria

- `task done 1` marks task with id 1 as done
- Output confirms the task title that was completed
- Error message if task id doesn't exist
- Error message if `tasks.json` is missing
