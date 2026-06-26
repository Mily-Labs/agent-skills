# Changelog

All notable changes to this repository are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); individual plugins follow
[semantic versioning](https://semver.org).

## [Unreleased]

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
