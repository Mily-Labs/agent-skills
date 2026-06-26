# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Instead, report it privately via GitHub's
[security advisories](https://github.com/Mily-Labs/agent-skills/security/advisories/new)
("Report a vulnerability"). We aim to acknowledge reports within a few days and will keep
you informed as we work on a fix.

## Scope

This repository ships **skills and plugin manifests** plus small zero-dependency Node
scripts. The most relevant concerns are:

- The `setup-player.mjs` script runs `npx degit diffusionstudio/lottie` and `npm install`
  in a directory you choose. Review it before running if that matters to you.
- Plugins are consumed by third-party agents (Codex, Claude Code) that copy them into a
  sandboxed cache. Skills are plain Markdown and contain no executable code.

## Supported versions

The latest `main` is supported. Fixes are released by bumping the affected plugin's
`version` and updating `CHANGELOG.md`.
