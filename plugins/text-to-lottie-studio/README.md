# Text to Lottie Studio

> Turn a text prompt into a **production-grade, art-directed Lottie animation** —
> rendered and verified in a local Skia/Skottie player. Part of the
> [Mily Labs agent-skills](https://github.com/Mily-Labs/agent-skills) marketplace.

Most "text to animation" tools give you a primitive tween: one shape sliding in a
straight line at constant speed. This plugin ships an expert motion-design **skill**
that makes the agent behave like a virtuoso animator — it reads the context of your
brief, chooses a bold direction, and authors distinctive motion (self-drawing lines,
kinetic typography, liquid morphs, particle bursts, seamless loops, camera moves)
with deliberate easing, anticipation, overshoot and stagger — then verifies it renders.

Perfect for **animating a logo** and **filling a website with motion**.

## Install

| Agent | Commands |
|---|---|
| **Codex** | `codex plugin marketplace add https://github.com/Mily-Labs/agent-skills`<br>`codex plugin install text-to-lottie-studio@mily-labs` (then restart Codex) |
| **Claude Code** | `/plugin marketplace add Mily-Labs/agent-skills`<br>`/plugin install text-to-lottie-studio@mily-labs` |
| **Any other agent** | `npx skills add Mily-Labs/agent-skills` |

## Scaffold the player (one time)

The renderer is **Skottie** (Skia), downloaded on demand — not vendored:

```bash
node scripts/setup-player.mjs        # creates ./lottie-player and installs deps
cd lottie-player && npm run dev      # http://localhost:3030
```

## Use it

**Animate a logo** (give the SVG so it grounds on the real geometry):

> Animate my logo from `./logo.svg` as a Lottie: reveal it by drawing along the path
> direction (trim path), premium gradient, easeOutExpo, transparent background, finish
> with a light sweep. Verify it renders.

**Fill a website with motion:**

> Make 3 Lottie animations for my landing page: a seamless hero loop, a staggered-dot
> loader, and a success check with overshoot. 60fps, dark theme, expose color controls.

## Embed on your site

```html
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
<lottie-player src="/animations/logo.json" autoplay loop style="width:240px"></lottie-player>
```

Also works with `lottie-web`, `@lottiefiles/react-lottie-player`, React Native (Skottie),
iOS, Android and Flutter. Ask the agent for a `.lottie` (dotLottie) for a smaller payload.

## What's inside

- `skills/text-to-lottie/SKILL.md` — the skill entry point + a reference library:
  `creative-direction`, `motion-craft` (easing bezier values), `lottie-toolbox`
  (Skottie-accurate JSON snippets), `techniques-cookbook` (recipes + a procedural generator).
- `scripts/setup-player.mjs` — scaffolds the Skottie player.

> Skottie has no expression engine, so all motion is baked into keyframes — the skill
> leans on procedural generation for physics, particles and staggered fields.

## License

MIT © Mily Labs. The bundled player is
[`diffusionstudio/lottie`](https://github.com/diffusionstudio/lottie) (MIT), downloaded
on demand rather than vendored.
