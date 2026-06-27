<div align="center">

# Mily Labs · agent-skills

**An open marketplace of skills & plugins for AI coding agents.**
One repo, installable into **Codex**, **Claude Code**, and any
[skills-compatible](https://github.com/vercel-labs/skills) agent.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/Mily-Labs/agent-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/Mily-Labs/agent-skills/actions/workflows/ci.yml)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

## Catalog

| Skill / Plugin | What it does | Install |
|---|---|---|
| **[text-to-lottie-studio](plugins/text-to-lottie-studio)** | Author virtuoso, art-directed **Lottie** animations from a prompt — logo reveals, kinetic type, liquid morphs, particle bursts, seamless loops — verified in a local Skia/Skottie player. | `…@mily-labs` (below) |

> More skills land here over time. Want to add one? See **[CONTRIBUTING](CONTRIBUTING.md)**.

## Install

Pick your agent — the same skills power all of them.

### Codex

One command — the plugin is `INSTALLED_BY_DEFAULT`, so adding the marketplace
enables it (Codex's CLI has no separate `install` step):

```bash
codex plugin marketplace add Mily-Labs/agent-skills
```

Then restart Codex. If `codex` isn't on your PATH (e.g. you only have the desktop
app), see [docs/INSTALL.md](docs/INSTALL.md) for the full-path command and the
in-app refresh flow.

### Claude Code

```bash
/plugin marketplace add Mily-Labs/agent-skills
/plugin install text-to-lottie-studio@mily-labs
```

### Any other agent (Cursor, Cline, Windsurf, …)

```bash
npx skills add Mily-Labs/agent-skills
```

…or copy any `skills/<name>/` folder into your agent's skills directory. It's MIT —
fork and adapt.

## Quick start (text-to-lottie-studio)

```bash
# scaffold the local Skia/Skottie player (downloaded on demand, not vendored)
node plugins/text-to-lottie-studio/scripts/setup-player.mjs
cd lottie-player && npm run dev          # http://localhost:3030
```

Then ask your agent:

> Animate my logo from `./logo.svg` as a Lottie line-draw reveal with a premium
> gradient and a light sweep. Verify it renders.

The output is a `lottie.json` you can drop on any website
([embed snippet](plugins/text-to-lottie-studio/README.md#embed-on-your-site)).

## Repository layout

```
agent-skills/
├── skills/                          # canonical skills (single source of truth)
│   └── text-to-lottie/{SKILL.md, reference/*.md}
├── plugins/                         # packaged plugins (Codex + Claude manifests + synced skill copy)
│   └── text-to-lottie-studio/{.codex-plugin, .claude-plugin, skills/, scripts/}
├── .agents/plugins/marketplace.json # Codex marketplace
├── .claude-plugin/marketplace.json  # Claude Code marketplace
└── scripts/{validate,sync-skills,setup-player}.mjs
```

The three install formats coexist — each agent ignores the others' folders. Skills live
once in `skills/`; `npm run sync` mirrors them into each plugin (agents copy plugins into
a sandboxed cache and can't reference files outside the plugin dir). `npm run validate`
checks every manifest, marketplace, skill and script, and runs in CI on Linux, macOS and
Windows.

## Contributing

New skills and improvements are welcome — see **[CONTRIBUTING.md](CONTRIBUTING.md)**.
By participating you agree to the **[Code of Conduct](CODE_OF_CONDUCT.md)**.

## License

[MIT](LICENSE) © Mily Labs.
