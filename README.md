# Talia — A small wedding gift site

This repository contains a single-page front-end site — a cute, cinematic gift.

## My Happy Place — Scrapbook

This repository is a minimal single-page scrapbook built with **Tailwind CSS**. It displays photos in a scattered, scrollable layout with a lightbox modal, music toggle, and custom heart animations.

### Local development

```bash
npm install
npm run dev
```

The `dev` command:
- Watches `styles-tailwind.css` and rebuilds `styles.css` whenever you make changes
- Starts a live-server on `http://localhost:3000` with auto-reload

### Building CSS

To manually build the Tailwind CSS output:

```bash
npm run build:css
```

To watch for changes during development:

```bash
npm run watch:css
```

### Project structure

- `index.html` — Main HTML page with hero section, scatter gallery, lightbox, and reasons section
- `script.js` — Vanilla JavaScript for interactivity (lightbox, music toggle, animations)
- `styles-tailwind.css` — Tailwind CSS source file with custom theme config
- `styles.css` — Compiled Tailwind CSS output (18KB minified)
- `tailwind.config.js` — Tailwind configuration with custom colors and animations
- `postcss.config.js` — PostCSS configuration for Tailwind processing

### Styling with Tailwind CSS

The site uses **Tailwind CSS v4** for styling with custom theme extensions:

- **Colors**: Custom teal palette (`#2aa6a3`, `#57c4bf`, `#7bd7d2`)
- **Typography**: Playfair Display (headings), Inter (body), Pacifico (script)
- **Animations**: Custom `floatDown` and `popIn` keyframes defined in `@theme`
- **Responsive**: Mobile-first design with breakpoints at 600px and 900px

### Deployment

The repo includes a GitHub Actions workflow (`.github/workflows/gh-pages.yml`) that:
1. Installs Node.js dependencies
2. Builds the Tailwind CSS
3. Deploys to GitHub Pages on `gh-pages` branch

When you push to `main`, the workflow automatically builds and deploys your site.

### How images work

- Add photos to the `assets/` folder with appropriate filenames
- Update the `IMAGE_LIST` in `script.js` with image paths and captions
- Photos display in a scattered, responsive column layout

### Want help?

- Adjust colors by editing the `@theme` block in `styles-tailwind.css`
- Customize layout or add components using Tailwind utility classes
- Modify animations in the `@keyframes` definitions
- Update responsive breakpoints in the media queries

