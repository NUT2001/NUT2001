# NUT2001 — Project Memo

**Last updated:** 2026-05-09

## Live site

- **URL:** https://nut2001.github.io/NUT2001/
- **GitHub repo:** https://github.com/NUT2001/NUT2001 (account `NUT2001`, not the original `cxxclk`)
- **Hosting:** GitHub Pages, `main` branch root, auto-redeploys on push
- **Git remote auth:** HTTPS + Personal Access Token (`ghp_…`) embedded in `origin` URL

## What it is

E-learning page for the nutrition lesson **"Breakfast Boost"** (with Dora). The header brand and document title are both **"NUT2001 Nutrition Education"**. Hero subtitle: *"Join Dora for short clips, quick questions, and simple breakfast tips for independent uni life."* Three tabs:

| Tab | Purpose |
|---|---|
| **Lesson** (Home) | 5-video flow with two 1-10 ratings, three Dora Q&As, and an end summary (session score + priority check) |
| **Forum** | Real-time community feed (Firestore-backed) with image upload, hearts, post detail pages, owner moderation |
| **Authors** | The five course authors with student IDs |

## Stack

- Static site (no build step). Plain HTML/CSS/JS served directly by GitHub Pages.
- **Firebase** as the backend:
  - **Firestore** — `posts` collection (text, image URL, likes map, comments array, createdAt)
  - **Authentication** — Google sign-in only
  - **Cloud Storage** — post images at `post-images/{uid}/{timestamp}-{filename}`
  - Project: `nut2001-8a3cd`, on **Blaze plan** (required for new-project Storage, free-tier usage)
- Web Audio API for the countdown click-tick sound (no audio file).
- Inter + JetBrains Mono via Google Fonts (substitutes for figmaSans / figmaMono).

## File layout

```
NUT2001/
├── index.html            — three tabs + lesson stage host
├── webpage.md            — product spec
├── FigmaDesign.md        — design system reference (Figma marketing aesthetic)
├── DESIGN.md             — older Miro design ref (no longer applied)
├── claude.md             — this memo
├── .gitignore            — ignores ppt-master/, .venv, .env
├── css/
│   └── style.css         — design tokens + all component styles
└── js/
    ├── firebase-config.js — Firebase init + OWNER_UID + module re-exports
    ├── main.js            — tab nav + lesson stage state machine (renders each stage)
    ├── quiz.js            — playTick() + startCountdown() helpers
    └── community.js       — forum (auth, list, detail routing, likes, comments)
```

## Lesson flow (5 videos)

The state machine is in `js/main.js`. `STAGES` is the source of truth — append/edit entries to change the flow.

```
Video 1  → Rating 1 (10s, clicks)
Video 2  → Q1 (B,  15s, clicks)
Video 3  → Q2 (C,  15s, clicks)
Video 4  → Q3 (A,  15s, clicks, image-choice)
Video 5  → Rating 2 (10s, clicks)         (merged Body 4 + Body 5 + Closure)
End      → SESSION SCORE + Breakfast Priority Check + reminder
```

After answering or timeout, feedback shows for **1 second**, then auto-advances to the next video. Click sound is generated per-second by `playTick()` in `js/quiz.js` (square-wave blip via Web Audio).

### Video stage rendering

`renderVideoStage` in `js/main.js` branches on URL:

- **`.mp4` URL (Firebase Storage path)** → renders a native `<video>` with `controls playsinline preload="auto"`. Videos other than the first get the `autoplay` attribute. The `ended` event auto-advances to the next stage. A "I've finished watching →" button is also rendered as a manual fallback.
- **Anything else (current Drive `/preview` URLs)** → renders an `<iframe>`. Videos other than the first get `?autoplay=1` appended (best-effort; Drive doesn't officially support it). Drive's iframe exposes no JS API, so auto-advance on `ended` does **not** fire — user must click the button.

The plan is to host the final cuts as mp4 in Firebase Storage and replace each entry in the `VIDEOS` map; the `<video>` path then activates with no other code change.

### End-of-session screen

Two cards side by side, then a prominent reminder block:

- **Left — SESSION SCORE** (eyebrow "SESSION SCORE"): big `X / 3`, then a score-specific message (one each for 0/1/2/3).
- **Right — Breakfast Priority Check** (eyebrow "Breakfast Priority Check"): three lines (`Before: r1/10`, `After: r2/10`, `Change: ±d`), then a body paragraph and a **Key takeaway** paragraph chosen from four branches (`r2>r1`, `r2<r1`, `r2=r1<5`, `r2=r1≥5`).
- **Reminder block**: 19px, accent left border, links into the Forum tab in the same tab.

## Forum (Firestore schema)

Each `posts/{id}` doc:

```js
{
  author: "Display Name",
  authorUid: "uid",
  text: "...",
  image: "https://firebasestorage.googleapis.com/...",  // null if no image
  imagePath: "post-images/{uid}/...",                   // for owner-delete cleanup
  likes: { uid1: true, uid2: false },                   // truthy = liked
  comments: [
    { id: "...", author: "...", authorUid: "...", text: "...", timestamp: "ISO" }
  ],
  createdAt: <Firestore serverTimestamp>
}
```

### Routing

- Forum list → URL `https://nut2001.github.io/NUT2001/`
- Post detail → URL `…/#/post/{id}` (hash routing, handled in `community.js` `parseHash` / `goToPost`)
- Hash change automatically swaps the list and detail views; the Forum tab activates if not already.

### Owner moderation

- Owner UID is hardcoded in `js/firebase-config.js` as `OWNER_UID = "gQVrUpGUKnNHRYYbHyIxjp2HEkt2"`.
- When the signed-in UID matches, an `Owner` badge appears in the auth bar and 🗑️ buttons appear on every post and comment.
- Firestore security rule for `delete` is gated to that exact UID — even if the client UI shows a 🗑️ to a non-owner (it shouldn't, but defense-in-depth), the server rejects.

## Firebase rules (currently published)

### Firestore

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.auth.uid == request.resource.data.authorUid;
      allow update: if request.auth != null
                    && request.resource.data.diff(resource.data)
                       .affectedKeys().hasOnly(['comments', 'likes']);
      allow delete: if request.auth != null
                    && request.auth.uid == "gQVrUpGUKnNHRYYbHyIxjp2HEkt2";
    }
  }
}
```

### Cloud Storage

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /post-images/{userId}/{filename=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.uid == userId
                   && request.resource.size < 8 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null
                    && (request.auth.uid == userId
                        || request.auth.uid == "gQVrUpGUKnNHRYYbHyIxjp2HEkt2");
    }
  }
}
```

### Auth — authorized domains

Both `nut2001.github.io` and the project's default `nut2001-8a3cd.firebaseapp.com` are added under Authentication → Settings → Authorized domains. Without `nut2001.github.io`, Google sign-in popup fails.

## Design system

`FigmaDesign.md` is the reference. Visual notes:

- **Mono chrome** (black on white) for top nav, body type, all primary CTAs.
- **Pastel color blocks** are the section device — `lime`, `lilac`, `cream`, `mint`, `pink`, `coral`, `navy`. Tabs use lime (Forum), cream (Lesson), lilac (Authors).
- **All buttons are pills** (`border-radius: 50px`). No square buttons.
- **Inter** + **JetBrains Mono** (Google Fonts) substitute for the proprietary `figmaSans` / `figmaMono`. Eyebrows and timestamps use the mono.
- Tokens (colors, radii, spacing) are CSS custom properties at the top of `css/style.css`.

## Deploy / edit cycle

```bash
# Edit files locally
git add <files>
git commit -m "..."
git push                 # auto-triggers GitHub Pages rebuild (~1 min)
```

## What changed from the original (April 2026) version

Apr 2026 setup is documented in older notes; key shifts:
- Account moved from `cxxclk` to `NUT2001`, repo recreated.
- Forum migrated from `localStorage` (per-browser, not shared) → Firestore real-time + Google auth + Storage for images.
- Visual system swapped from Miro (Roobert / teal-coral-rose) → Figma marketing (Inter / mono chrome + pastel blocks).
- Lesson expanded from 2 videos / 2 questions → 5 videos / 2 ratings / 3 Q&As / score + priority-check end screen (originally 7 videos with two activity cards, later trimmed when Body 4 / Body 5 / Closure were merged into one final video).
- Removed `js/interactions.js` (old True/False component, no longer used).
- Forum now has likes (heart) and per-post detail pages (`#/post/{id}` hash routing).

## Known constraints

- **Drive iframe** can't be controlled from JS — auto-advance on `ended` and reliable autoplay only work after migrating each video to a Firebase Storage mp4 URL (see "Video stage rendering" above and `webpage.md`).
- **Image size limit** 8 MB per post (enforced both client-side and in Storage rules).
- **Forum quality** — Firestore rules let any signed-in user fully overwrite the `comments` and `likes` fields of any post. Acceptable for a class forum; not production-grade. Tighten via per-user dotted-path rules if needed.
- **Token in `origin` URL** is plaintext on disk; if leaked, revoke at https://github.com/settings/tokens.
