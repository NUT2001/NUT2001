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

- **Swap video:** update the `src` on the `<iframe>` inside `#stage-video1` or `#stage-video2` in `index.html`
- **Edit Q1 (radio):** update the `<label>` options inside `#q1-card` and set `data-correct` to the correct 0-based index
- **Edit Q2 (image choice):** update `.image-choice` text/emoji inside `#stage-quiz2`; correct answer is hardcoded as `'B'` in `submitQuiz2()` in `js/main.js`
- **Edit True/False questions:** update `.interaction-card` blocks in `index.html`; set `checkAnswer(this, true/false)` — `true` = this button is the correct answer
- **Edit multiple-choice quiz:** update the `quizData` array in `js/quiz.js` (question, options[], correctIndex)
- **Edit authors:** update `.author-card` entries in `index.html` (name, ID, initials in avatar)

---

## Page Rebuild (2026-04-08)

Rebuilt the full page per `webpage.md`:

### Tabs
| Tab | ID | Content |
|---|---|---|
| Home | `tab-home` | Video → Quiz flow |
| Dora Q&A | `tab-doraqna` | True/False + Multiple Choice |
| Forum | `tab-forum` | Post feed with image upload & comments |
| Authors | `tab-authors` | 5 course authors with student IDs |

### Home flow (5 stages)
1. **Video 1** (`stage-video1`) — Google Drive iframe + "I've finished watching" button
2. **Q1** (`stage-quiz1`) — 15s countdown, tick sound, radio options; 1 point
3. **Video 2** (`stage-video2`) — second iframe + "I've finished watching" button
4. **Q2** (`stage-quiz2`) — 15s countdown, tick sound, image choice cards side-by-side; 1 point
5. **End** (`stage-end`) — scoreboard (x/2), end-of-session message, two lesson preview cards

### Tick sound
Generated via Web Audio API in `playTick()` (`js/main.js`) — no audio file needed.

### Score tracking
`totalScore` var in `js/main.js` accumulates across both questions, shown in scoreboard.

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
