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

## Output Format

```
[ ] 1  Buy milk
[x] 2  Walk the dog
[ ] 3  Write tests
```

Each line: status indicator, id, title — separated by spaces.

## Exit Codes

- `0` — always (even when no tasks exist)

## Acceptance Criteria

- `task list` prints all tasks with id, title, and status
- If no tasks exist, prints a friendly "No tasks yet" message
- Pending tasks show as `[ ]`, done tasks show as `[x]`
- Corrupt `tasks.json` prints an error and exits 1
