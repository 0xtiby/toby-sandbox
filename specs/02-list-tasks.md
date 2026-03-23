# List Tasks

## Overview

Implement a CLI command to display all tasks.

## Problem & Users

Users need to see their tasks at a glance.

**Primary user:** Developer using the CLI.

## Scope

### In Scope
- `task list` command
- Read from `tasks.json` and display tasks in a readable format
- Show id, title, and status (done/pending)
- Handle empty or missing `tasks.json` gracefully

### Out of Scope
- Filtering or sorting
- Adding, completing, or deleting tasks (separate specs)

## Acceptance Criteria

- `task list` prints all tasks with id, title, and status
- If no tasks exist, prints a friendly "No tasks yet" message
- Pending tasks show as `[ ]`, done tasks show as `[x]`
