# Subscript Text Generator

Client-side Unicode subscript converter. No backend, no login, no tracking.

## Features

- **Formula (Smart) mode:** Converts only digits after letters (H₂O, x₂, Fe₂O₃). Rest of text unchanged.
- **Normal mode:** Converts full text to Unicode subscript where supported.
- **Toggles:** Numbers only, letters only, symbols only.
- **Convert selection:** Select part of input and convert only that part.
- **Style:** Normal / bold / italic display (copy-paste uses standard subscript).
- **Actions:** Copy, download as .txt, Clear.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or: python -m http.server 8080
```

## Deploy (static)

Upload the project folder to:

- **Netlify / Vercel:** Drag folder or connect Git; no build step.
- **GitHub Pages:** Push to a repo, enable Pages, set source to main branch / root or `docs` if you put files in `docs`.

Required files: `index.html`, `styles.css`, `script.js`.
