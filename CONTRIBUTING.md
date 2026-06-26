# Contributing to Mily Labs · agent-skills

Thanks for helping grow the marketplace! This repo hosts **skills** and **plugins** for
AI coding agents (Codex, Claude Code, and any [vercel-labs/skills](https://github.com/vercel-labs/skills)-compatible
agent). Contributions — new skills, fixes, docs — are welcome via fork & pull request.

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ground rules

- **Single source of truth:** every skill lives once in `skills/<name>/`. Never hand-edit
  the copies under `plugins/*/skills/` — they are generated.
- **Cross-platform:** scripts must be Node ESM using only `node:*` built-ins (they run on
  Linux, macOS, and Windows in CI). No bash-only tooling.
- **It must pass `npm run validate`** locally and in CI before it can merge.

## Prerequisites

- Node.js ≥ 18 (no other dependencies — everything is zero-dep).

## Add or edit a skill

1. Create / edit `skills/<skill-name>/SKILL.md` with YAML frontmatter:

   ```markdown
   ---
   name: my-skill
   description: One line describing what it does and when an agent should use it.
   ---
   ```

   Put any deep-dive docs in `skills/<skill-name>/reference/*.md` and link them from
   `SKILL.md` as `reference/<file>.md`.

2. If the skill should ship as an installable **plugin**, create
   `plugins/<plugin-name>/` containing:
   - `.codex-plugin/plugin.json` (Codex manifest — see an existing one for the required
     `interface` block and strict-semver `version`; **no `hooks` field**),
   - `.claude-plugin/plugin.json` (Claude manifest — only `name` is required),
   - (the `skills/` and `scripts/` copies are generated — see next step).

3. Register the plugin in **both** marketplaces:
   - `.agents/plugins/marketplace.json` (Codex) — add an entry with
     `source.path: "./plugins/<plugin-name>"`, `policy`, and `category`.
   - `.claude-plugin/marketplace.json` (Claude) — add an entry with
     `source: "./plugins/<plugin-name>"`.

4. Tell the sync script what the plugin bundles by adding it to the `PLUGINS` map in
   `scripts/sync-skills.mjs`, then run:

   ```bash
   npm run sync        # mirror canonical skills/scripts into the plugin
   npm run validate    # must print "validation passed"
   ```

5. Update `CHANGELOG.md` and open a PR.

## Commit & PR conventions

- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`,
  `docs:`, `chore:` …).
- Keep PRs focused. Fill in the PR checklist (ran `sync`, ran `validate`, updated
  changelog).
- CI (Linux/macOS/Windows) must be green.

## Reporting issues

Use the issue templates: **Bug report** or **Propose a skill**. For security concerns,
see [SECURITY.md](SECURITY.md).
