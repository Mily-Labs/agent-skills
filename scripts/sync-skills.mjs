#!/usr/bin/env node
// sync-skills.mjs — mirror the canonical skills + shared scripts into each plugin
// that bundles them. The single source of truth is the repo-root `skills/<name>/`
// and `scripts/`. Codex and Claude Code copy a plugin into a cache and forbid `../`
// traversal, so each plugin must carry its own copy. Run after editing any skill.
//
// Cross-platform: uses only node:fs / node:path / node:url (no shell, no deps).

import { cpSync, rmSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Declare what each plugin bundles. Add a line here when you add a plugin.
const PLUGINS = {
  'text-to-lottie-studio': {
    skills: ['text-to-lottie'],
    scripts: ['setup-player.mjs'],
  },
};

let count = 0;
for (const [plugin, { skills = [], scripts = [] }] of Object.entries(PLUGINS)) {
  const base = resolve(root, 'plugins', plugin);
  for (const name of skills) {
    const src = resolve(root, 'skills', name);
    const dst = resolve(base, 'skills', name);
    rmSync(dst, { recursive: true, force: true });
    mkdirSync(dirname(dst), { recursive: true });
    cpSync(src, dst, { recursive: true });
    console.log(`  skill   skills/${name} -> plugins/${plugin}/skills/${name}`);
    count++;
  }
  for (const file of scripts) {
    const src = resolve(root, 'scripts', file);
    const dst = resolve(base, 'scripts', file);
    mkdirSync(dirname(dst), { recursive: true });
    cpSync(src, dst);
    console.log(`  script  scripts/${file} -> plugins/${plugin}/scripts/${file}`);
    count++;
  }
}
console.log(`✓ sync complete (${count} item${count === 1 ? '' : 's'})`);
