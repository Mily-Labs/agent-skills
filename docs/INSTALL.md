# Install guide

The marketplace works with three agents. Pick yours. The **easiest** path is
`npx skills add` (one command) or Claude Code (two in-app commands).

---

## Claude Code

Type these in the Claude Code chat box (no terminal, no config files):

```
/plugin marketplace add Mily-Labs/agent-skills
/plugin install text-to-lottie-studio@mily-labs
```

You can also browse it visually: type `/plugin` → **Marketplaces → Add** →
`Mily-Labs/agent-skills` → **Discover** tab → install **Text to Lottie Studio**.

---

## Any agent that supports the open skills format (Cursor, Cline, Windsurf, …)

One command in a terminal:

```bash
npx skills add Mily-Labs/agent-skills
```

This installs the `text-to-lottie` skill from `skills/text-to-lottie/`. Or copy
that folder by hand into your agent's skills directory.

---

## Codex

The plugin is published as `INSTALLED_BY_DEFAULT`, so **adding the marketplace is
the whole install** — Codex's CLI has no separate `install` command.

```bash
codex plugin marketplace add Mily-Labs/agent-skills
```

Then **restart Codex**. Ask it for a Lottie animation to confirm the skill loaded.

### If `codex` is "not recognized" (desktop-app users)

The Codex desktop app ships its CLI inside the app folder and doesn't add it to
your PATH. Call it by full path instead. On Windows:

```powershell
& "$env:LOCALAPPDATA\OpenAI\Codex\bin\codex.exe" plugin marketplace add Mily-Labs/agent-skills
```

(macOS/Linux: the binary is under the app's resources; or install the standalone
CLI so plain `codex` works.)

### Updating to a newer version

Codex caches a clone of the marketplace. To pull the latest (new skills, icon,
fixes), refresh it — either the **↻ button** on the Plugins screen, or:

```bash
codex plugin marketplace upgrade mily-labs
```

then restart Codex.

### Removing it

```bash
codex plugin marketplace remove mily-labs
```

---

## After install — try it

1. Scaffold the local Skia/Skottie preview player (downloaded on demand):

   ```bash
   node plugins/text-to-lottie-studio/scripts/setup-player.mjs
   cd lottie-player && npm run dev          # http://localhost:3030
   ```

2. Ask your agent, e.g.:

   > Animate my logo from `./logo.svg` as a Lottie line-draw reveal with a
   > premium gradient and a light sweep. Verify it renders.

3. Embed the resulting `lottie.json` on your site — see the
   [plugin README](../plugins/text-to-lottie-studio/README.md#embed-on-your-site).

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Codex: `codex` not recognized | Use the full-path command above, or install the standalone Codex CLI. |
| Codex: plugin not visible after `marketplace add` | Restart Codex. If still missing, `codex plugin marketplace upgrade mily-labs` then restart. |
| Old version / missing icon in Codex | Refresh the marketplace (↻ or `marketplace upgrade`), then restart. |
| Claude: `marketplace add` can't find it | Use the `owner/repo` form `Mily-Labs/agent-skills` (case-insensitive). |
| Player won't start | Ensure Node ≥ 18, then re-run `setup-player.mjs`; it runs `degit` + `npm install`. |
