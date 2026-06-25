# TypeBlaster

TypeBlaster is a minimalist retro-arcade typing defense game built with React, Vite, and Canvas 2D. You control a fixed cannon, lock onto descending word enemies, type their words one letter at a time, and survive escalating waves with boss fights every third wave.

## Features

- Canvas-rendered arcade action with lasers, particles, explosions, starfield, score popups, and screen shake.
- Target lock typing: starting a word locks the target until the word is completed.
- Wave progression with standard, fast, heavy, boss, and shield drone enemies.
- HUD with health, score, high score, wave, accuracy, WPM, combo, enemies defeated, and bosses defeated.
- Start menu, settings, countdown, pause, wave complete, and game over states.
- Web Audio API sound effects with persistent volume and mute settings.
- Persistent local high score and settings through localStorage.
- Offline-first curated word banks plus optional Dictionary API validation cache.

## Tech Stack

- React.js
- Vite
- JavaScript
- HTML Canvas 2D
- CSS
- Vitest
- Web Audio API
- localStorage

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Run Tests

```bash
npm test
```

## GitHub Pages Deployment

The repository includes `.github/workflows/deploy.yml` for GitHub Pages. The workflow installs dependencies, runs tests, builds the app, uploads the `dist` artifact, and deploys it to Pages.

If deploying to `https://username.github.io/repo-name/`, set the Vite base path to `'/repo-name/'`. This project reads `VITE_BASE_PATH` in `vite.config.js`, and the included workflow sets it automatically from the repository name.

## localStorage Usage

TypeBlaster stores:

- `typeblaster.settings`: sound, volume, screen shake, reduced motion, and difficulty.
- `typeblaster.highScore`: highest local score.
- `typeblaster.dictionaryCache`: optional word validation results from the Dictionary API.

## Dictionary API Integration

The game ships with large local curated word banks and works fully offline. `dictionaryService.js` can validate known words with `https://api.dictionaryapi.dev/api/v2/entries/en/<word>`, caches results in localStorage, times out quickly, and never blocks gameplay. API failures, rate limits, and offline use fall back to local words.

## Controls

- Type letters `a-z` to lock and damage targets.
- Press `Escape` to pause or resume.
- Wrong letters do not damage enemies and do not cancel the current target.

## Non-Goals

TypeBlaster does not include mobile keyboard support, multiplayer, online leaderboards, user accounts, backend services, databases, external sprites, external audio files, analytics, monetization, player movement, manual target cancel, save games, or in-app dictionary definitions.
