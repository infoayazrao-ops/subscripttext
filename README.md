<p align="center">
  <img src="subscript_generator_logo.webp" alt="Subscript Generator" width="120" />
</p>

<h1 align="center">Subscript &amp; Superscript Generator</h1>

<p align="center">
  <strong>Free Unicode tool for chemistry, math &amp; physics text</strong><br />
  Convert <code>H2O</code> → <code>H₂O</code> · <code>x2</code> → <code>x²</code> · copy-paste anywhere
</p>

<p align="center">
  <a href="https://subscripttext.com"><img src="https://img.shields.io/badge/Live_Site-subscripttext.com-0B6E4F?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live site" /></a>
  <a href="https://subscripttext.com"><img src="https://img.shields.io/badge/Free-No_signup-1B4332?style=for-the-badge" alt="Free" /></a>
  <a href="https://subscripttext.com"><img src="https://img.shields.io/badge/Works-Offline-2D6A4F?style=for-the-badge" alt="Works offline" /></a>
</p>

<p align="center">
  <a href="https://subscripttext.com"><strong>→ Open the tool at subscripttext.com</strong></a>
</p>

---

## What it does

A **client-side** Unicode converter for subscript and superscript text.  
No backend · No login · Works in Word, Google Docs, WhatsApp, PowerPoint, and the web.

| Input | Output | Use case |
|:-----:|:------:|:---------|
| `H2O` | H₂O | Chemistry formulas |
| `CO2` | CO₂ | Science writing |
| `x2` | x² | Math / exponents |
| `Fe2O3` | Fe₂O₃ | Compounds |

---

## Features

- **Formula (Smart) mode** — converts only digits after letters (`H2O` → `H₂O`), leaves the rest alone  
- **Normal mode** — converts full text to Unicode subscript where supported  
- **Superscript generator** — for exponents and powers (`x²`, `m³`)  
- **Toggles** — numbers only · letters only · symbols only  
- **Convert selection** — highlight part of the text and convert just that  
- **Style preview** — normal / bold / italic (copy uses standard Unicode)  
- **Quick actions** — Copy · Download `.txt` · Clear  

---

## Try it

1. Open **[https://subscripttext.com](https://subscripttext.com)**  
2. Type or paste your text  
3. Choose Formula or Normal mode  
4. Copy and paste into Word, Docs, WhatsApp, or anywhere Unicode works  

---

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8080
```

Core files: `index.html` · `styles.css` · `script.js`

---

## Deploy (static)

No build step — upload the folder as-is:

| Platform | How |
|----------|-----|
| **Hostinger / cPanel** | Upload to `public_html` |
| **Netlify / Vercel** | Drag folder or connect this repo |
| **GitHub Pages** | Enable Pages → source: `main` / root |

---

## Links

- **Website:** [https://subscripttext.com](https://subscripttext.com)  
- **Repo:** [github.com/infoayazrao-ops/subscripttext](https://github.com/infoayazrao-ops/subscripttext)

---

<p align="center">
  Made for students, teachers &amp; writers who need clean Unicode subscripts.<br />
  <a href="https://subscripttext.com">subscripttext.com</a>
</p>
