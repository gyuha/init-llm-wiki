# npx Installer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `npx init-llm-wiki <folder>` scaffold a full LLM wiki into the specified folder.

**Architecture:** All template files live in `wiki/` inside the package root. `bin/install.js` copies `wiki/` contents into the user-specified target directory. Zero external dependencies.

**Tech Stack:** Node.js 16+, `fs`, `path`, `url` (built-ins only)

---

## File Map

| Action | Path | Purpose |
|--------|------|---------|
| Create | `package.json` | npm package definition with `bin` entry |
| Create | `bin/install.js` | npx entry point — copies template |
| Create | `wiki/` | Template folder (all current project files moved here) |
| Move into `wiki/` | `CLAUDE.md`, `README.md`, `.gitignore`, `.claude/`, `wiki/`, `raw/`, `AGENTS.md`, `.agents/` | Template contents |

---

### Task 1: Move project files into wiki/ template folder

**Files:**
- Create: `wiki/` (new template directory)
- Move: all current root files into `wiki/`

> Note: `wiki/` already exists as the knowledge base directory. We use a temp dir `_wiki_tpl/` to stage the move, then rename.

- [ ] **Step 1: Create staging directory and move git-tracked files**

```bash
mkdir _wiki_tpl
git mv CLAUDE.md _wiki_tpl/CLAUDE.md
git mv README.md _wiki_tpl/README.md
git mv .claude _wiki_tpl/.claude
git mv wiki _wiki_tpl/wiki
git mv raw _wiki_tpl/raw
```

- [ ] **Step 2: Move untracked files**

```bash
cp .gitignore _wiki_tpl/.gitignore
# AGENTS.md is a symlink (untracked) — recreate inside template
ln -s CLAUDE.md _wiki_tpl/AGENTS.md
# .agents/ contains a symlink to ../skills — recreate pointing to .claude/skills
mkdir _wiki_tpl/.agents
ln -s ../.claude/skills _wiki_tpl/.agents/skills
```

- [ ] **Step 3: Rename staging dir to wiki/**

```bash
mv _wiki_tpl wiki
git add wiki/
```

- [ ] **Step 4: Remove the old .gitignore from root (it's now in wiki/)**

```bash
git rm --cached .gitignore 2>/dev/null || true
# Keep the file in wiki/, root no longer needs one (or add minimal one)
```

- [ ] **Step 5: Verify structure**

```bash
ls wiki/
# Expected: AGENTS.md  CLAUDE.md  README.md  .agents  .claude  .gitignore  raw  wiki
ls wiki/wiki/
# Expected: analyses  concepts  entities  index.md  log.md  sources
ls wiki/.claude/skills/
# Expected: url-to-markdown  wiki-ingest  wiki-lint  wiki-query
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: move project files into wiki/ template directory"
```

---

### Task 2: Create package.json

**Files:**
- Create: `package.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "init-llm-wiki",
  "version": "1.0.0",
  "description": "Scaffold an LLM-maintained personal wiki powered by Claude",
  "bin": {
    "init-llm-wiki": "bin/install.js"
  },
  "files": [
    "bin/",
    "wiki/"
  ],
  "engines": {
    "node": ">=16"
  },
  "keywords": ["llm", "wiki", "claude", "knowledge-base"],
  "license": "MIT"
}
```

- [ ] **Step 2: Verify**

```bash
node -e "const p = require('./package.json'); console.log(p.name, p.bin)"
# Expected: init-llm-wiki { 'init-llm-wiki': 'bin/install.js' }
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "feat: add package.json for npm/npx publishing"
```

---

### Task 3: Create bin/install.js

**Files:**
- Create: `bin/install.js`

- [ ] **Step 1: Create bin/ directory and install.js**

```bash
mkdir bin
```

Create `bin/install.js` with the following content:

```js
#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync, symlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const targetName = process.argv[2];

if (!targetName) {
  console.error('Usage: npx init-llm-wiki <folder-name>');
  console.error('Example: npx init-llm-wiki my-notes');
  process.exit(1);
}

const targetDir = join(process.cwd(), targetName);

if (existsSync(targetDir)) {
  console.error(`Error: folder "${targetName}" already exists.`);
  process.exit(1);
}

const templateDir = join(__dirname, '..', 'wiki');

function copyRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      // Skip symlinks from template — recreated below
      continue;
    } else if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

console.log(`Creating "${targetName}"...`);
copyRecursive(templateDir, targetDir);

// Recreate symlinks
symlinkSync('CLAUDE.md', join(targetDir, 'AGENTS.md'));
mkdirSync(join(targetDir, '.agents'), { recursive: true });
symlinkSync('../.claude/skills', join(targetDir, '.agents', 'skills'));

console.log(`\nDone! Wiki scaffolded at ./${targetName}`);
console.log('\nNext steps:');
console.log(`  cd ${targetName}`);
console.log('  # Add sources to raw/ and run /wiki-ingest in Claude Code');
```

- [ ] **Step 2: Make the file executable**

```bash
chmod +x bin/install.js
```

- [ ] **Step 3: Update package.json to use ESM**

Add `"type": "module"` to `package.json`:

```json
{
  "name": "init-llm-wiki",
  "version": "1.0.0",
  "description": "Scaffold an LLM-maintained personal wiki powered by Claude",
  "type": "module",
  "bin": {
    "init-llm-wiki": "bin/install.js"
  },
  "files": [
    "bin/",
    "wiki/"
  ],
  "engines": {
    "node": ">=16"
  },
  "keywords": ["llm", "wiki", "claude", "knowledge-base"],
  "license": "MIT"
}
```

- [ ] **Step 4: Test locally**

```bash
node bin/install.js test-wiki
# Expected output:
# Creating "test-wiki"...
#
# Done! Wiki scaffolded at ./test-wiki
#
# Next steps:
#   cd test-wiki
#   # Add sources to raw/ and run /wiki-ingest in Claude Code
```

- [ ] **Step 5: Verify installed structure**

```bash
ls test-wiki/
# Expected: AGENTS.md  CLAUDE.md  README.md  .agents  .claude  .gitignore  raw  wiki

ls test-wiki/wiki/
# Expected: analyses  concepts  entities  index.md  log.md  sources

ls test-wiki/.claude/skills/
# Expected: url-to-markdown  wiki-ingest  wiki-lint  wiki-query

readlink test-wiki/AGENTS.md
# Expected: CLAUDE.md

readlink test-wiki/.agents/skills
# Expected: ../.claude/skills
```

- [ ] **Step 6: Test error cases**

```bash
# Missing argument
node bin/install.js
# Expected: Usage: npx init-llm-wiki <folder-name>

# Already exists
node bin/install.js test-wiki
# Expected: Error: folder "test-wiki" already exists.
```

- [ ] **Step 7: Clean up test folder**

```bash
rm -rf test-wiki
```

- [ ] **Step 8: Commit**

```bash
git add bin/install.js package.json
git commit -m "feat: add bin/install.js npx entry point"
```

---

### Task 4: Smoke test with npx link

**Files:** (no changes)

- [ ] **Step 1: Link package locally**

```bash
npm link
```

- [ ] **Step 2: Test via npx-style invocation**

```bash
init-llm-wiki smoke-test
ls smoke-test/
# Expected: AGENTS.md  CLAUDE.md  README.md  .agents  .claude  .gitignore  raw  wiki
```

- [ ] **Step 3: Clean up**

```bash
rm -rf smoke-test
npm unlink
```
