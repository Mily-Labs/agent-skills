#!/usr/bin/env node
// setup-player.mjs — scaffold the local Skia/Skottie Lottie player used to
// preview and verify animations produced by the text-to-lottie skill.
//
//   node setup-player.mjs [target-dir]   (default: ./lottie-player)
//
// It runs `degit diffusionstudio/lottie <target>` then `npm install`
// (the postinstall copies the CanvasKit wasm into /public). Dependency-free.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const PLAYER_REPO = 'diffusionstudio/lottie';
const targetName = process.argv[2] ?? 'lottie-player';
const target = resolve(process.cwd(), targetName);
const onWindows = process.platform === 'win32';

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, { stdio: 'inherit', shell: onWindows, ...opts });
  if (r.status !== 0) {
    console.error(`\n✖ \`${cmd} ${args.join(' ')}\` failed (exit ${r.status ?? 'unknown'}).`);
    process.exit(r.status ?? 1);
  }
}

if (existsSync(target) && readdirSync(target).length > 0) {
  console.error(
    `✖ Target "${target}" already exists and is not empty.\n` +
    `  Pass a different folder name, e.g.  node setup-player.mjs my-player`
  );
  process.exit(1);
}

console.log(`▶ Scaffolding the Skottie player into: ${target}`);
run('npx', ['--yes', 'degit', PLAYER_REPO, target]);

console.log('▶ Installing dependencies (copies CanvasKit wasm into /public)…');
run('npm', ['install'], { cwd: target });

console.log(`
✓ Player ready.

Next:
  cd ${targetName}
  npm run dev            # opens http://localhost:3030

Then ask your agent (Codex / Claude Code) to create a Lottie animation. The
text-to-lottie skill writes each scene to
  public/projects/<project>/<scene-N>/lottie.json
and you can scrub & verify it live in the player. Pin a frame for an exact
still with  /<project>/<scene>?frame=N .
`);
