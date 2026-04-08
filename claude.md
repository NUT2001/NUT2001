# NUT2001 — Conversation Memo

**Date:** 2026-04-08

---

## What We Built

Created a web project called **NUT2001** at `/home/clk/NUT2001/` for an e-learning website featuring:

1. **Embedded video** — YouTube iframe (or local `<video>`) with a responsive 16:9 container
2. **True/False interactions** — statement cards where the user picks True or False and gets immediate correct/wrong feedback
3. **Multiple choice quiz** — question bank rendered dynamically from a JS data array, graded on submit with a score summary

---

## Project Structure

```
NUT2001/
├── index.html          — main page (header, 3 sections)
├── DESIGN.md           — Miro design system reference
├── claude.md           — this memo
├── css/
│   └── style.css       — all styles (Miro tokens applied)
├── js/
│   ├── interactions.js — True/False checkAnswer() logic
│   └── quiz.js         — quiz data array + build + grade
└── assets/
    ├── videos/         — drop local .mp4 files here
    └── images/
```

---

## Design System Applied

Fetched **DESIGN.md** from `VoltAgent/awesome-design-md` (Miro-inspired design system) and applied it to the site:

| Token | Value |
|---|---|
| Primary text | `#1c1c1e` |
| Interactive blue | `#5b76fe` |
| Success green | `#00b473` |
| Border | `#c7cad5` |
| Ring shadow | `rgb(224,226,232) 0px 0px 0px 1px` |
| Display font | Roobert PRO Medium |
| Body font | Noto Sans |
| Button radius | 8px |
| Panel radius | 20px |

Pastel accent sections:
- Video → **teal** (`#c3faf5` / `#187574`)
- Interactions → **coral** (`#ffc6c6` / `#600000`)
- Quiz → **rose** (`#ffd8f4`)

---

## Key Editing Points

- **Swap video:** change `VIDEO_ID` in `index.html` line ~20, or uncomment the `<video>` tag for local files
- **Edit True/False questions:** update `.interaction-card` blocks in `index.html`; set `checkAnswer(this, true/false)` — `true` = this button is the correct answer
- **Edit quiz questions:** update the `quizData` array in `js/quiz.js` (question, options[], correctIndex)

---

## Deployment (2026-04-08)

- Installed **git** via `sudo apt-get install -y git`
- Configured git: `user.name = cxxclk`, `user.email = cxxclk@gmail.com`
- Initialized repo, committed all files, pushed to **github.com/cxxclk/NUT2001**
- Enabled **GitHub Pages** — site is live at: https://cxxclk.github.io/NUT2001/
- Auth: Personal Access Token (classic) with `repo` scope

### Useful commands
```bash
# Push future changes
cd /home/clk/NUT2001
git add .
git commit -m "your message"
git push
```
