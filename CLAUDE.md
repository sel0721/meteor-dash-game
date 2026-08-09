# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single self-contained HTML file (`meteor-dash.html`) implementing "메테오 대시" (Meteor Dash), a browser-based canvas arcade game in a retro pixel-art style. There is no build system, package manager, bundler, or test suite for the game itself — all HTML, CSS, and JavaScript live inline in the one file, including two embedded pixel fonts (base64 data URIs).

The repo also contains `meteor-dash-promo/`, a separate Remotion project (its own `package.json`, TypeScript, npm-installed dependencies) that renders a short vertical promo video for the game. It is unrelated to the game's runtime — see its own section below.

## Running the game

Open `meteor-dash.html` directly in a browser (double-click, or `open meteor-dash.html` on macOS). No dev server, install step, or compilation is required.

`index.html` at the repo root is a one-line meta-refresh redirect to `meteor-dash.html` — it exists only so GitHub Pages (which serves `index.html` from the root) lands visitors on the game. It has no other purpose and isn't part of the game itself.

There are no lint, build, or test commands for the game.

## Claude Code hooks (`.claude/settings.json`, `.claude/hooks/`)

This repo has project-level hooks that run automatically — they aren't optional conventions, they actually execute:

- **PostToolUse on Edit|Write**: after any edit, `auto-preview.sh` opens `meteor-dash.html` in the default browser if that's the file touched; `check-js-syntax.sh` extracts the inline `<script>` block and parses it with `new Function()` (parse-only, never executed) — a real syntax error returns `{"decision":"block","reason":...}` so it comes back to you in-turn instead of silently shipping broken JS.
- **PreToolUse on Edit**: `guard-canvas-size.py` asks for confirmation if an edit would remove/change the exact line `const LW = 96, LH = 150;` (the pixel-art rendering depends on this); `guard-storage-keys.py` does the same if an edit would change the literal strings `meteor-dash-best` or `meteor-dash-scores` (renaming either orphans every existing player's saved score).
- **Stop**: `auto-deploy.sh` runs the same JS-syntax check first — if it fails, it skips deploying and just reports why — otherwise it `git add -A && git commit && git push`s any changes, which GitHub Pages picks up automatically. This means **ending a session with working-directory changes publishes them** to the live game at `https://sel0721.github.io/meteor-dash-game/`. If you don't want that for a given change, commit nothing you don't want live, or ask the user before you stop.

All five scripts live in `.claude/hooks/` and are plain bash/python reading the hook JSON payload from stdin — read them directly rather than guessing behavior from this summary if you need to change one.

## Deployment

The repo is public and deployed via GitHub Pages at `https://sel0721.github.io/meteor-dash-game/` (Pages is configured to serve from the `main` branch, root path). Pushing to `main` is enough to update the live site — GitHub rebuilds Pages automatically; there is no CI workflow file. Nothing sensitive is committed here: the Gemini API key used to generate the thumbnail lives in `~/.env` on the dev machine, outside the repo entirely.

## Architecture

Everything is in `meteor-dash.html`, structured as three inline sections:

- **`<style>`**: two `@font-face` rules embed pixel fonts as base64 `data:` URIs — `PixelEN` (Press Start 2P, for Latin/numeric HUD text like SCORE/BEST and keycaps) and `PixelKR` (Galmuri11 Bold, for all Korean text: title, headings, body, buttons). CSS custom properties on `:root` define a colorful nebula/sunset palette (`--bg-deep`, `--bg-mid`, `--bg-horizon`, `--accent`, `--accent2`, `--gold`, etc.). The game is intentionally single-theme (dark pixel arcade), not adapted for light mode. Panels/buttons use `clip-path` polygons to fake notched pixel-art corners instead of `border-radius`, and the `.screen-wrap` has a `::after` scanline overlay (`repeating-linear-gradient`) for a CRT look.
- **Markup**: a `.frame` > `.screen-wrap` containing the `<canvas id="game">`, a HUD (`#scoreVal`, `#bestVal`, plus `#comboStat`/`#comboVal` shown only while a combo is active), a `#buffRow` status strip for active power-up timers, and two overlay panels (`#startOverlay`, `#overOverlay`, each with a `.score-list` top-5 block) toggled via a `hidden` class.
- **`<script>`**: an IIFE containing the entire game engine:
  - **Fixed low-res render buffer**: `canvas.width/height` are set once to `LW=96, LH=150` logical pixels (not tied to device size or `devicePixelRatio`). CSS scales the canvas up to fill `.screen-wrap` with `image-rendering: pixelated`, so every `fillRect`/shape drawn in logical coordinates renders as a crisp, chunky pixel-art block. All gameplay math (positions, speeds, radii) is authored directly in this 96×150 logical space — do not reintroduce dpr-based canvas scaling, it would defeat the pixel look.
  - **Sprites**: `SHIP`, `ROCK`, `ORB` are hand-authored pixel-art bitmaps — arrays of equal-length strings where each character maps to a palette color (`.` = transparent). `drawSprite(rows, palette, x, y)` blits one logical pixel per character via `fillRect(x+c, y+r, 1, 1)`; `drawSpriteScaled(rows, palette, x, y, scale)` is the same but blits each logical pixel as an `scale×scale` block, used to draw the boss meteor at 2x size from the same 7×7 `ROCK` map. `ROCK_TYPES` (violet/ember/toxic), `FLASH_PAL` (white hit-flash), `BOSS_PAL`, and `ORB_TYPES` (shield/magnet/spread/bomb) supply per-entity color variants over the shared `ROCK`/`ORB` shapes; the ship's flame color alternates each frame (`flameOn`) for a 2-frame flicker animation.
  - `state` — running/over flags, elapsed time, score, screen-shake timer, starfield, particle pool, score popups, combo count/multiplier/decay timer, and boss spawn tracking (`bossActive`, `nextBossScore`).
  - `player` — position, drag/keyboard target position, and three buff timers: `shieldT` (invincible + destroys meteors on touch), `magnetT` (pulls falling orbs toward the ship instead of letting them fall straight), `spreadT` (3-way bullet spread instead of a single shot).
  - `meteors` / `orbs` / `bullets` — arrays of falling/rising entities. Meteors are spawned via `spawnMeteor()` (normal, with `hp` from `meteorHp(r)` — bigger rocks take more hits) or `spawnBoss()` (large `isBoss:true` rock with its own `hp`/`maxHp`/`scale`, triggered from `update()` once `state.score` crosses `state.nextBossScore`); both live in the same `meteors` array so collision/offscreen-cleanup code doesn't need to special-case bosses beyond a few `m.isBoss` checks. Orbs carry a `type` from `pickOrbType()` (weighted random over `ORB_WEIGHTS`) and are spawned periodically or dropped guaranteed on boss kill. Bullets are spawned by `tryFire()` (rate-limited by `fireTimer`) and fired on Spacebar or pointerdown via `tryFire()`.
  - `update(dt)` — per-frame physics/collision step. Bullet-vs-meteor collision reduces `m.hp` and calls `killMeteor(m, mi)` at 0 hp (awards combo-scaled score via `addCombo()`, spawns a floating `+N` popup, particles, and — for bosses — a guaranteed orb drop). Player-vs-meteor collision calls `triggerGameOver()` unless `shieldT` is active. Orb pickup branches on `type` to apply the matching effect, including `bombBlast()` which chain-kills every non-boss meteor on screen (and chips 3 hp off a boss) through the same `killMeteor` path. Combo decays to 0 via `comboTimer` if no kill lands within 3s.
  - `draw*()` functions — `drawBackdrop` (banded sky gradient + moon + twinkling starfield, disabled twinkle under `prefers-reduced-motion`), `drawPlayer`, `drawMeteors` (boss gets `drawSpriteScaled` + a small pixel hp bar), `drawOrbs`, `drawBullets`, `drawParticles`, `drawPopups` (canvas `fillText` using the embedded `PixelEN` font for score/pickup callouts) — all built on `drawSprite`/raw `fillRect` calls rather than gradients or rotated polygons.
  - `frame(now)` — the `requestAnimationFrame` game loop driving `update` + draw calls; applies a small random-translate screen shake from `state.shakeT`.
  - Input: keyboard (arrow keys / A-D) sets `keys.left`/`keys.right`; Space fires while running or (re)starts the game otherwise. Pointer events (mouse and touch, via `pointerdown`/`pointermove`) set `player.targetX` for drag-to-move and also fire a shot on `pointerdown`, mapped into the 96-wide logical space in `pointerToX`.
  - Persistence: single high score in `localStorage['meteor-dash-best']` (drives the HUD `BEST` value) plus a separate top-5 list in `localStorage['meteor-dash-scores']` (JSON array, managed by `loadScores()`/`saveScore()`/`renderScores()`) rendered into both overlays' `.score-list`.

When modifying game behavior (difficulty curve, spawn rates, collision radius, fire cooldown, combo decay, boss threshold, etc.), the relevant tuning values are concentrated in `difficulty()`, `spawnMeteor()`, `spawnBoss()`, `tryFire()`, `addCombo()`, and the constants near the top of `update()` — remember all distances/speeds are in the small 96×150 logical space, not display pixels.

When modifying visuals, prefer editing/adding pixel-map strings (`SHIP`/`ROCK`/`ORB`) and palette entries (`PAL`, `ROCK_TYPES`, `ORB_TYPES`, `BOSS_PAL`) over adding gradients, blur, or rotation — those break the pixel-art look given the fixed low-res buffer. New meteor/orb variants should follow the existing pattern of reusing the shared `ROCK`/`ORB` shape with a new palette rather than authoring a new pixel map, unless the silhouette itself needs to differ.

## Regenerating the embedded fonts

The two `@font-face` `src` values are base64-encoded font files inlined directly in the CSS (no external font requests, so the file works fully offline). If they ever need to be regenerated: `PixelEN` comes from Google Fonts "Press Start 2P" (`.ttf`, `format('truetype')`); `PixelKR` comes from the Galmuri project's `Galmuri11-Bold.woff2` (`format('woff2')`, OFL-licensed, `https://cdn.jsdelivr.net/gh/quiple/galmuri@latest/dist/`). Only the bold Korean weight is embedded to keep file size reasonable — Galmuri's full regular weight is ~500KB before base64, notably larger than the bold subset used here.

## Thumbnail assets

`thumbnail.png` (500×500) is a promotional/listing image, downscaled from the AI-generated 2048×2048 source(s) kept in `썸네일이미지/`. Neither is referenced by `meteor-dash.html` — the game embeds its own fonts and draws everything on canvas, so these files have no effect on gameplay and only matter if you're updating cover art.

## Promo video (`meteor-dash-promo/`)

A [Remotion](https://remotion.dev) project that renders a 9.17s, 1080×1920 vertical promo video (`out/meteor-dash-promo.mp4`, also copied to the repo root as `meteor-dash-promo.mp4`). Run commands from inside `meteor-dash-promo/`:

```
npm i
npx remotion studio    # live preview
npx remotion render MeteorDashPromo out/meteor-dash-promo.mp4
```

- **Composition** (`src/Root.tsx`, `src/PromoVideo.tsx`): three scenes (`src/scenes/Scene1Hook.tsx`, `Scene2Features.tsx`, `Scene3CTA.tsx`) joined with `@remotion/transitions` fades. Each scene is also registered as its own `Composition` under a `Promo-Scenes` folder so it can be previewed/trimmed individually in Studio. Total duration (275 frames @ 30fps) and each scene's `durationInFrames` are kept inline on the `<Composition>`/`<TransitionSeries.Sequence>` tags per Remotion's interactivity conventions — don't extract them into constants.
- **Fonts** (`src/fonts.ts`): `PixelEN` (Press Start 2P) loads via `@remotion/google-fonts`; `PixelKR` (the same Galmuri11-Bold used by the game) loads from `public/Galmuri11-Bold.woff2` via `@remotion/fonts`' `loadFont()`. Both must finish loading before text scenes render correctly — this is handled automatically by those loaders, not manually.
- **Thumbnail reuse**: `public/thumbnail.png` is a copy of the root `thumbnail.png`. It's shown framed (not full-bleed/cropped) in Scene 1 and Scene 3 — the thumbnail already has "메테오 대시"/"SURVIVAL ARCADE" baked into its pixels, so stretching it as a full-screen zoomed background duplicates and blurs that text. Keep it framed at a size close to its native 500×500 if you touch these scenes.
- **Music** (`public/chiptune.wav`): an original 8-bit chiptune generated procedurally (square/pulse/triangle-wave synthesis + noise percussion, no samples, no copyrighted material), timed to exactly match the video's 275-frame duration and structured around the three scenes (soft build → energetic main riff → decelerating resolve). The generator script itself is **not** checked into this repo (it was run from a scratch location); regenerating or tweaking the melody means rewriting an equivalent numpy synthesis script rather than editing an existing one here.

### macOS ffmpeg gotcha

`npx remotion render` on this machine (macOS 13, below Remotion's macOS 15 requirement) fails: the bundled `@remotion/compositor-darwin-arm64/ffmpeg` dynamically links `libavdevice.dylib`, which references an AVFoundation symbol (`_AVCaptureDeviceTypeContinuityCamera`) that doesn't exist before macOS 15, so it crashes with `SIGABRT` during the final video/audio stitch step (frame rendering itself completes fine — only the ffmpeg-dependent mux step fails). Homebrew's `ffmpeg` formula has no bottle for this OS and hangs/takes forever building from source (SVT-AV1's CMake `TryCompile` step got stuck at 68+ minutes CPU time and had to be killed) — don't reach for `brew install ffmpeg` here.

The working fix, if this needs to be redone:
1. Get a prebuilt static ffmpeg fast via `pip install imageio-ffmpeg` (in a venv) — its bundled binary is statically linked and runs fine on this OS.
2. Build a custom binaries directory: copy the **entire** `node_modules/@remotion/compositor-darwin-arm64/` folder (the `remotion` compositor binary needs its sibling `.dylib`s present, resolved relative to its own directory) somewhere, then overwrite just `ffmpeg` in that copy with the imageio-ffmpeg static binary. Leave `ffprobe` as the original bundled one.
3. Render with `--binaries-directory=<that folder>`.
4. That swapped-in ffmpeg lacks `libfdk_aac` (Remotion's default AAC encoder choice), so also pass `--audio-codec=mp3` (maps to `libmp3lame`, which the static build does include) or the audio mux step will fail with "Unknown encoder 'libfdk_aac'".
