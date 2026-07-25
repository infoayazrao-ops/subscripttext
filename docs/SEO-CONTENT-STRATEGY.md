# SEO content strategy (keyword groups → articles)

This document explains how new blog articles map to your GSC queries, Google Trends CSVs, and modern SEO ideas (EEAT, helpful content, TF‑IDF-style coverage, LLM-friendly structure).

## One article per keyword group

| Article file | Keyword group (examples) | Intent |
|--------------|-------------------------|--------|
| `google-docs-subscript-superscript.html` | google docs subscript, subscript in google docs, how to write subscript in google docs, superscript in google docs | How-to in Docs |
| `word-subscript-superscript.html` | subscript in word, how to subscript in word, how to write co2 in word, superscript in word | How-to in Word |
| `excel-subscript-superscript.html` | subscript excel, excel subscript, how to type exponents in excel | Cells + formulas + Unicode |
| `superscript-generator-copy-paste.html` | superscript generator, superscript copy paste, superscript copy and paste, exponent, footnote copy paste, superscript in whatsapp | Tool + superscript focus |
| `subscript-numbers-symbols-copy-paste.html` | subscript copy and paste, subscript copy paste, subscript numbers copy paste, subscript text, text to subscript, subscript symbol | Copy-paste + numbers |
| `subscript-vs-superscript.html` | what is subscript, what is superscript, subscript vs superscript, subscript and superscript | Educational / definition |

**Already on site:** WhatsApp guide, PowerPoint guide, CO₂/H₂O chemistry page, homepage (subscript generator).

---

## Simple language (helpful content)

- Short sentences, numbered steps, tables where useful.
- Answer the question in the first screen (intro + H2).
- **FAQ-style blocks** at the end of sections help both users and AI summaries.

---

## EEAT (Experience, Expertise, Authoritativeness, Trust)

- **Experience:** Steps reflect real use of Docs, Word, Excel, and the live tool.
- **Expertise:** Unicode vs app formatting is explained clearly (when to use each).
- **Trust:** Links to `disclaimer.html`, `about-us.html`, and “not professional publishing software” where relevant.

---

## TF‑IDF-style coverage (without stuffing)

- Each page uses its **primary phrase** in title, meta description, H1, and first paragraph.
- **Related terms** appear naturally: e.g. Docs page mentions shortcuts, Format menu, CO₂; Excel page mentions `^`, `POWER()`, m².
- **Internal links** connect Docs ↔ Word ↔ generator ↔ superscript ↔ “vs” article so Google sees topical clusters.

---

## LLM / AI search considerations

- Clear **H2/H3** questions (“What is…”, “How to…”).
- **Concrete examples** (H₂O, x², CO₂).
- **Comparison tables** where it helps (subscript vs superscript).
- **Article** JSON-LD on new pages for structure.

---

## After deploy

1. Upload all new `.html` files, updated `blog.html`, and `sitemap.xml` to Hostinger.
2. In Google Search Console: submit sitemap or use **URL Inspection** on 1–2 new URLs.
3. Monitor **Performance → Pages** for impressions over 2–8 weeks.

---

## Files added (2026-03-20)

- `google-docs-subscript-superscript.html`
- `word-subscript-superscript.html`
- `excel-subscript-superscript.html`
- `superscript-generator-copy-paste.html`
- `subscript-numbers-symbols-copy-paste.html`
- `subscript-vs-superscript.html`

Updated: `blog.html`, `sitemap.xml`.
