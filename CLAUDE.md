# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single self-contained HTML file (`meteor-dash.html`) implementing "메테오 대시" (Meteor Dash), a browser-based canvas arcade game in a retro pixel-art style. There is no build system, package manager, bundler, or test suite — all HTML, CSS, and JavaScript live inline in the one file, including two embedded pixel fonts (base64 data URIs).

## Running the game

Open `meteor-dash.html` directly in a browser (double-click, or `open meteor-dash.html` on macOS). No dev server, install step, or compilation is required.

There are no lint, build, or test commands in this repo.

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
