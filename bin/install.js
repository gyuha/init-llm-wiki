#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, copyFileSync, symlinkSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const targetName = process.argv[2];

if (!targetName) {
  console.error('Usage: npx init-llm-wiki <folder-name>');
  console.error('Example: npx init-llm-wiki my-notes');
  process.exit(1);
}

const targetDir = resolve(process.cwd(), targetName);

if (!targetDir.startsWith(process.cwd() + '/')) {
  console.error('Error: target folder must be a simple name, not a path.');
  process.exit(1);
}

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
      // Skip symlinks in template — recreated explicitly below
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
console.log('  # Install qmd (required for wiki-ingest)');
console.log('  npm install -g @tobilu/qmd');
console.log('  # or: bun install -g @tobilu/qmd');
console.log('  # Add sources to raw/ and run /wiki-ingest in Claude Code');

