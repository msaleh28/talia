# Talia — A small wedding gift site

This repository contains a single-page front-end site — a cute, cinematic gift.

Preview locally:

# My Happy Place — Scrapbook

This repository is a minimal single-page scrapbook. It attempts to load images placed in `/assets` named `1.jpg`..`20.jpg` and displays them in a scattered, scrollable layout. Click any photo to enlarge it.

Local development

```bash
npm install
npm run dev
```

How images work
- Add photos to the `assets/` folder named `1.jpg`, `2.jpg`, etc. The page will detect and show images up to `20.jpg` automatically.

Deployment
- The repo includes a GitHub Actions workflow that can publish the repo root to the `gh-pages` branch when you push to `main`. Enable GitHub Pages in the repository settings if needed.

Want help?
- I can import your photos into `assets/` for you, adjust the layout, or extend the loader to support other file names.
