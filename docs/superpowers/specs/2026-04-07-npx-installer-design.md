# Design: npx Installer for init-llm-wiki

**Date:** 2026-04-07
**Status:** Approved

## Overview

Make `init-llm-wiki` installable via `npx init-llm-wiki <folder-name>` so users can scaffold a new LLM wiki in any directory.

## Architecture

### Package Structure

```
init-llm-wiki/          ← npm package root
├── bin/
│   └── install.js      # npx entry point (Node.js, no external deps)
├── package.json        # defines name, bin, files
└── wiki/               # install template (current project files moved here)
    ├── CLAUDE.md
    ├── README.md
    ├── .gitignore
    ├── .claude/
    │   └── skills/
    ├── wiki/
    │   ├── index.md
    │   ├── log.md
    │   ├── sources/
    │   ├── entities/
    │   ├── concepts/
    │   └── analyses/
    └── raw/
```

### Usage

```sh
npx init-llm-wiki my-notes
# Creates my-notes/ with full wiki template contents
```

### bin/install.js Logic

1. Read `process.argv[2]` as target folder name
2. If missing → print usage and exit 1
3. If target folder already exists → print error and exit 1
4. Create target folder
5. Recursively copy `wiki/` template contents to target folder
6. Recreate symlinks: `AGENTS.md → CLAUDE.md`, `.agents/ → .claude/skills/`
7. Print success message with next steps

### package.json

```json
{
  "name": "init-llm-wiki",
  "version": "1.0.0",
  "description": "Scaffold an LLM-maintained wiki",
  "bin": { "init-llm-wiki": "bin/install.js" },
  "files": ["bin/", "wiki/"],
  "engines": { "node": ">=16" }
}
```

## Constraints

- Zero external dependencies (Node.js `fs` and `path` only)
- Fails fast if target folder exists (no overwrite)
- Template lives in `wiki/` subdirectory of the package
