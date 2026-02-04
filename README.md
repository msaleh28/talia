# Talia — A small wedding gift site

This repository contains a single-page front-end site — a cute, cinematic gift.

Preview locally:

# Talia — A small wedding gift site

This repository contains a single static, single-page front-end site — a small, cinematic gift you can host on GitHub Pages.

Quick local preview

1. Install dev dependency (optional, recommended for live reload):

```bash
npm install
```

2. Start dev server (uses `live-server`):

```bash
npm run dev
# opens http://127.0.0.1:3000 by default
```

Files added
- `index.html` — single scrolling page with hero, story, gallery, and hidden surprises.
- `styles.css` — dreamy/teal design and animations.
- `script.js` — ambient music (WebAudio), confetti, and secret interactions.
- `package.json` — small dev script for `npm run dev`.
- `.github/workflows/gh-pages.yml` — GitHub Actions workflow that deploys the repo root to the `gh-pages` branch on push to `main`.

Notes & next steps
- Replace the placeholder images in `/assets` with your photos (e.g. `/assets/1.jpg`).
- If you prefer a custom audio track, add `/assets/music.mp3` and I can update `script.js` to use it instead of the generated synth.
- Deployment: pushing to the `main` branch will trigger the workflow and publish the site at `https://<your-username>.github.io/<repo>/` (ensure Pages is enabled and the `gh-pages` branch is published).

Want me to do next?
- I can add your photos and tune layout.
- I can switch the music to a custom file and add a visible player.
- I can create a simple build step (if you want to add frameworks) or keep it static.
