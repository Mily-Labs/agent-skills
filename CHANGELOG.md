# Changelog

All notable changes to this repository are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); individual plugins follow
[semantic versioning](https://semver.org).

## [Unreleased]

### Added
- Mily Labs brand icon for the `text-to-lottie-studio` plugin
  (`interface.composerIcon` + `interface.logo`); `validate.mjs` now checks that
  referenced icon/screenshot files exist.
- `docs/INSTALL.md` — per-agent install guide and troubleshooting (Codex PATH,
  marketplace refresh, etc.).

### Changed
- Codex install is now one command: the plugin is `INSTALLED_BY_DEFAULT`
  (`authentication: ON_USE`), so `codex plugin marketplace add` enables it with no
  manual config or GUI toggle.
- Fixed install docs: removed the non-existent `codex plugin install` step.

## 0.1.0 — 2026-06-26

Initial public release of the **Mily Labs agent-skills** marketplace.

### Added
- **text-to-lottie-studio** (0.1.0) — an expert motion-design skill plus an on-demand
  Skia/Skottie player, packaged for Codex and Claude Code and installable as a portable
  skill. Includes a reference library: `creative-direction`, `motion-craft`,
  `lottie-toolbox`, `techniques-cookbook`.
- Marketplace plumbing for three install formats (Codex, Claude Code, `npx skills`).
- Cross-platform tooling: `scripts/validate.mjs` (zero-dep validator) and
  `scripts/sync-skills.mjs`.
- CI that runs validation on Linux, macOS, and Windows.
- OSS scaffolding: README, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, issue/PR templates.
