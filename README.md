# Ardenveil — The Chromatic Seal

A choice-driven text adventure built with React, featuring turn-based combat, dynamic story progression, and immersive text-to-speech narration.

## Features

- **Choice-Driven Narrative** — Your decisions shape the story and its ending
- **Turn-Based Combat** — Strategic encounters with multiple outcomes
- **Species Selection** — Choose your character's race and starting abilities
- **Text-to-Speech Narration** — Immersive audio via ElevenLabs, with Web Speech API fallback
- **No Build Step** — Runs directly in the browser via native ES modules and import maps

## Getting Started

### Prerequisites

- Node.js 16+ (only needed for the local dev server)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/peerapongsm/Ardenveil-Codejam.git
cd Ardenveil-Codejam
```

2. Install dev dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **PLAY** to begin.

### ElevenLabs TTS (optional)

By default the game uses the browser's built-in Web Speech API for narration. To enable the higher-quality ElevenLabs voice:

1. Get a free API key at [elevenlabs.io](https://elevenlabs.io) (10,000 chars/month free tier)
2. Create the file `src/config.js` (gitignored — never committed):

```js
export const ELEVENLABS_API_KEY  = 'your_api_key_here'
export const ELEVENLABS_VOICE_ID = 'your_voice_id_here'
```

The game detects `src/config.js` at runtime and switches to ElevenLabs automatically. If the file is absent or the key is invalid, it silently falls back to Web Speech API.

### Running Tests

```bash
npm run test
```

## Project Structure

```
src/
├── components/        # React UI components
├── context/           # Game state context + reducer
├── data/              # Scene and species definitions
├── hooks/             # Custom React hooks (combat, TTS)
├── pages/             # Page components (HomePage, etc.)
├── services/          # External service wrappers (TTS)
├── styles/            # CSS and theme variables
├── utils/             # Pure helper functions
├── __tests__/         # Vitest test suite
├── AppShell.js        # Top-level routing shell
└── main.js            # Entry point
```

## Architecture

The project uses **browser-native ES modules** with **import maps** — no bundler required.

- React and dependencies load from CDN ([esm.sh](https://esm.sh))
- Import maps in `index.html` resolve bare specifiers to CDN URLs
- CSS is loaded directly from HTML — no PostCSS or preprocessing
- Deploy to GitHub Pages by pushing to `master` — no build step needed

## Deployment

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys automatically on every push to `master`.

To enable ElevenLabs on the deployed site, add these two [repository secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions) in your GitHub repo settings:

| Secret | Value |
|--------|-------|
| `ELEVENLABS_API_KEY` | Your ElevenLabs API key |
| `ELEVENLABS_VOICE_ID` | Your chosen voice ID |

The workflow injects them into `src/config.js` at deploy time — they never touch the repo.

Live site: [https://peerapongsm.github.io/Ardenveil-Codejam/](https://peerapongsm.github.io/Ardenveil-Codejam/)

## Security

- `src/config.js` is gitignored — API keys are never committed
- GitHub Secrets are used for CI/CD injection
- A strict Content Security Policy is set in `index.html`

## License

MIT

## Acknowledgments

- [React](https://react.dev) — UI framework
- [htm](https://github.com/developit/htm) — JSX-like syntax without a compiler
- [Immer](https://immerjs.github.io/immer/) — Immutable state management
- [ElevenLabs](https://elevenlabs.io) — AI text-to-speech
- [Google Fonts](https://fonts.google.com) — Cinzel, Crimson Text
