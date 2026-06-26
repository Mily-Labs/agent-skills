#!/usr/bin/env node
// validate.mjs — self-contained, zero-dependency, cross-platform validator for the
// marketplace. Run locally (`npm run validate`) and in CI on Linux/macOS/Windows.
// Checks: JSON parses, Codex + Claude plugin manifests, both marketplaces, skill
// frontmatter + reference links, plugin/skill sync drift, and `node --check` scripts.

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const err = (m) => errors.push(m);
const rel = (p) => relative(root, p).split('\\').join('/');
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const IGNORE = new Set(['node_modules', '.git', 'lottie-player']);

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORE.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const files = walk(root);
const ends = (f, suffix) => rel(f).endsWith(suffix);

// 1) every JSON parses
const parsed = new Map();
for (const f of files.filter((f) => f.endsWith('.json'))) {
  try { parsed.set(f, JSON.parse(readFileSync(f, 'utf8'))); }
  catch (e) { err(`JSON parse: ${rel(f)} — ${e.message}`); }
}

// 2) Codex plugin manifests
for (const f of files.filter((f) => ends(f, '.codex-plugin/plugin.json'))) {
  const m = parsed.get(f); if (!m) continue; const at = rel(f);
  if (!isStr(m.name)) err(`${at}: name required`);
  if (!isStr(m.version) || !SEMVER.test(m.version)) err(`${at}: version must be strict semver`);
  if (!isStr(m.description)) err(`${at}: description required`);
  if (!m.author || !isStr(m.author.name)) err(`${at}: author.name required`);
  if ('hooks' in m) err(`${at}: the 'hooks' field is rejected by the Codex validator`);
  const i = m.interface || {};
  for (const k of ['displayName', 'shortDescription', 'developerName', 'category']) {
    if (!isStr(i[k])) err(`${at}: interface.${k} required`);
  }
  if (!Array.isArray(i.capabilities) || !i.capabilities.every(isStr)) {
    err(`${at}: interface.capabilities must be a non-empty array of strings`);
  }
  if (!('defaultPrompt' in i) && !('default_prompt' in i)) err(`${at}: interface.defaultPrompt required`);
}

// 3) Claude plugin manifests
for (const f of files.filter((f) => ends(f, '.claude-plugin/plugin.json'))) {
  const m = parsed.get(f); if (!m) continue; const at = rel(f);
  if (!isStr(m.name)) err(`${at}: name required`);
  else if (!/^[a-z0-9-]+$/.test(m.name)) err(`${at}: name must be kebab-case (a-z 0-9 -)`);
  if ('keywords' in m && !Array.isArray(m.keywords)) err(`${at}: keywords must be an array`);
}

// 4) Codex marketplace
{
  const f = join(root, '.agents/plugins/marketplace.json');
  const m = parsed.get(f);
  if (!m) err('.agents/plugins/marketplace.json missing or invalid');
  else {
    const at = rel(f);
    if (!isStr(m.name)) err(`${at}: name required`);
    if (!Array.isArray(m.plugins)) err(`${at}: plugins[] required`);
    for (const p of m.plugins || []) {
      if (!isStr(p.name)) err(`${at}: a plugin entry is missing name`);
      const path = p.source && p.source.path;
      if (!isStr(path)) err(`${at}: ${p.name}: source.path required`);
      else if (!existsSync(resolve(root, path))) err(`${at}: ${p.name}: source.path not found (${path})`);
      if (!p.policy || !isStr(p.policy.installation) || !isStr(p.policy.authentication)) {
        err(`${at}: ${p.name}: policy.installation + policy.authentication required`);
      }
      if (!isStr(p.category)) err(`${at}: ${p.name}: category required`);
    }
  }
}

// 5) Claude marketplace
{
  const f = join(root, '.claude-plugin/marketplace.json');
  const m = parsed.get(f);
  if (!m) err('.claude-plugin/marketplace.json missing or invalid');
  else {
    const at = rel(f);
    if (!isStr(m.name)) err(`${at}: name required`);
    if (!m.owner || !isStr(m.owner.name)) err(`${at}: owner.name required`);
    if (!Array.isArray(m.plugins)) err(`${at}: plugins[] required`);
    for (const p of m.plugins || []) {
      if (!isStr(p.name)) err(`${at}: a plugin entry is missing name`);
      if (!isStr(p.source)) err(`${at}: ${p.name}: source (relative path string) required`);
      else if (!existsSync(resolve(root, p.source))) err(`${at}: ${p.name}: source not found (${p.source})`);
    }
  }
}

// 6) skills: frontmatter + reference links exist
for (const f of files.filter((f) => basename(f) === 'SKILL.md')) {
  const at = rel(f);
  const txt = readFileSync(f, 'utf8');
  const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) { err(`${at}: missing YAML frontmatter`); continue; }
  if (!/\bname\s*:/.test(fm[1])) err(`${at}: frontmatter missing 'name'`);
  if (!/\bdescription\s*:/.test(fm[1])) err(`${at}: frontmatter missing 'description'`);
  const dir = dirname(f);
  const refs = new Set([...txt.matchAll(/reference\/([A-Za-z0-9_-]+\.md)/g)].map((x) => x[1]));
  for (const r of refs) {
    if (!existsSync(join(dir, 'reference', r))) err(`${at}: links missing file reference/${r}`);
  }
}

// 7) sync drift: each plugin's bundled skill must equal the canonical skill
function listRel(dir) {
  const out = [];
  (function w(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) w(p);
      else out.push(relative(dir, p).split('\\').join('/'));
    }
  })(dir);
  return out.sort();
}
const pluginsDir = join(root, 'plugins');
if (existsSync(pluginsDir)) {
  for (const plugin of readdirSync(pluginsDir)) {
    const bundled = join(pluginsDir, plugin, 'skills');
    if (!existsSync(bundled)) continue;
    for (const skill of readdirSync(bundled)) {
      const canon = join(root, 'skills', skill);
      const copy = join(bundled, skill);
      if (!existsSync(canon)) { err(`plugins/${plugin}/skills/${skill}: no canonical skills/${skill}`); continue; }
      const a = listRel(canon), b = listRel(copy);
      if (a.join('|') !== b.join('|')) {
        err(`plugins/${plugin}/skills/${skill}: file set differs from canonical — run \`npm run sync\``);
        continue;
      }
      for (const rf of a) {
        if (!readFileSync(join(canon, rf)).equals(readFileSync(join(copy, rf)))) {
          err(`plugins/${plugin}/skills/${skill}/${rf}: content differs from canonical — run \`npm run sync\``);
        }
      }
    }
  }
}

// 8) node --check every .mjs
for (const f of files.filter((f) => f.endsWith('.mjs'))) {
  const r = spawnSync(process.execPath, ['--check', f], { encoding: 'utf8' });
  if (r.status !== 0) err(`node --check failed: ${rel(f)}\n${(r.stderr || '').trim()}`);
}

// report
if (errors.length) {
  console.error(`\n✖ validation FAILED (${errors.length} issue${errors.length > 1 ? 's' : ''}):`);
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('✓ validation passed — manifests, marketplaces, skills, sync, and scripts all OK');
