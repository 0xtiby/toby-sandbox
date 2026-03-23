#!/bin/bash
# Reset the sandbox to a clean state for a fresh toby run
# Keeps: specs/, reset.sh, .git, .gitignore
# Wipes: everything else (generated code, beads, config, etc.)

set -e

cd "$(dirname "$0")"

# Remove everything except specs, reset script, git, and gitignore
find . -mindepth 1 \
  -not -path './.git/*' \
  -not -path './.git' \
  -not -path './specs/*' \
  -not -path './specs' \
  -not -name 'reset.sh' \
  -not -name '.gitignore' \
  -not -name 'README.md' \
  -delete 2>/dev/null || true

echo "Sandbox reset. Ready for a fresh toby run."
