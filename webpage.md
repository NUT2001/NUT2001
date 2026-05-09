# NUT2001 Webpage Setup

## Requirements

1. The page title and the header brand (top-left of every page) both read **"NUT2001"** (kept short so it fits the mobile header).
2. The homepage hero shows the heading **"Breakfast Boost"** with the subtitle **"Join Dora for short clips, quick questions, and simple breakfast tips for independent uni life."**
3. Use the design system documented in `FigmaDesign.md` (Figma marketing aesthetic — monochrome chrome plus oversized pastel color-block sections, pill buttons, Inter / JetBrains Mono).
4. The main page should show the embedded video, with the question card appearing below the video after the video ends or the user clicks **"I've finished watching →"**.
5. Create a tab named **Forum** where signed-in users can post and comment on others' posts (Google sign-in required).
6. Create a tab named **Authors** and list the following authors:
   - Linkun Chen 35967862
   - Yiu Wai Kwan 34625607
   - Pokhou Leong 34106235
   - Jiayi Liu 36030279
   - Rui Zhang 35641096

---

## Video Hosting & Auto-Advance

The lesson videos are intended to live in **Firebase Storage** as direct mp4 files. When `STAGES[i].src` ends in `.mp4`, the video stage renders a native `<video>` element with:

- **Autoplay** for every video except the very first (browser autoplay policies require an initial user gesture, so video 1 stays manual).
- **Auto-advance** to the next stage when the `ended` event fires — the user does not need to click anything.
- A fallback **"I've finished watching →"** button is still rendered for users who want to skip ahead.

While the final cuts are still being edited, the placeholder videos remain on Google Drive and are embedded via the `/preview` iframe URL. Drive's embedded player does not expose JavaScript hooks for play state or end events, so during this transitional period:

- Auto-advance on `ended` does **not** fire — the user must click **"I've finished watching →"**.
- Autoplay from video 2 onward attempts `?autoplay=1` on the iframe URL but is best-effort only.

Once each video is replaced with a Firebase Storage mp4 URL, the `<video>` path activates automatically — no other code change required.

---

## Main Page Behaviour

### Video 1 — Set the scene

1. Play this video:
   https://drive.google.com/file/d/1lpmDN-GX69J05SUz7m-oHf_gx2Byxuz_/preview
2. After the user clicks **"I've finished watching →"**, show [Breakfast rating 1](#breakfast-rating-1) below the video.
3. Ask the user to choose an answer with a **10-second countdown timer**.
4. Add a **click sound** during the countdown (synthesised via Web Audio).

#### Breakfast rating 1

**Question:** On a scale from 1 to 10, how important is breakfast to you?

This is a rating scale question. Ask the audience to choose one number from 1 to 10.

- After the audience selects a rating, show "Thank you for your response." and save this score as **rating 1**.
- If the audience doesn't choose a rating, assume a rating of 1.

Hide this question 1 second after the audience chooses an answer or the timer runs out.

### Video 2 — Body 1

After the user chooses an answer, or after the timer runs out:

1. Play this video:
   https://drive.google.com/file/d/1MxJIJrz0dgwd6CN6bZAZgFNXVydAypTn/preview
2. After the user clicks **"I've finished watching →"**, show [Dora's Q&A 1](#doras-qa-1) below the video.
3. Ask the user to choose an answer with a **15-second countdown timer**.
4. Add a **click sound** during the countdown.

#### Dora's Q&A 1

**Question**: Which of the following is the best reason to prioritise a nutritious breakfast?

**Choices**:

- A. It guarantees perfect academic results
- B. It can support energy, concentration and nutrient intake
- C. It means you do not need to eat lunch
- D. It must include all five food groups every morning

**Correct answer**: B

**Scoring:** 1 point if correct, 0 if incorrect or no selection when timer runs out.

Provide feedback based on the audience's answer:

- If answered correctly, show "Great work — that's correct!"
- If answered incorrectly or no answer when timer runs out, show "Not quite — the correct answer is B."

Hide this question 1 second after the audience chooses an answer or the timer runs out.

### Video 3 — Body 2

After the user chooses an answer, or after the timer runs out:

1. Play this video:
   https://drive.google.com/file/d/17jl90WkbP9mHVyLkTnWBF8fIC_DXI_hP/preview
2. After the user clicks **"I've finished watching →"**, show [Dora's Q&A 2](#doras-qa-2) below the video.
3. Ask the user to choose an answer with a **15-second countdown timer**.
4. Add a **click sound** during the countdown.

#### Dora's Q&A 2

**Question**: Which food group and nutrient match is correct?

**Choices**:

- A. Egg — vegetables & legumes — fibre and vitamins
- B. Banana — fruit — calcium and protein
- C. Wholegrain bread — grain food — carbohydrate, fibre and energy
- D. Yoghurt — protein food — calcium and energy

**Correct answer**: C

**Scoring:** 1 point if correct, 0 if incorrect or no selection when timer runs out.

Provide feedback based on the audience's answer:

- If answered correctly, show "Great work — that's correct!"
- If answered incorrectly or no answer when timer runs out, show "Not quite — the correct answer is C."

Hide this question 1 second after the audience chooses an answer or the timer runs out.

### Video 4 — Body 3

After the user chooses an answer, or after the timer runs out:

1. Play this video:
   https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview
   *(Placeholder URL — to be replaced with the real Body 3 video)*
2. After the user clicks **"I've finished watching →"**, show [Dora's Q&A 3](#doras-qa-3) below the video.
3. Ask the user to choose an answer with a **15-second countdown timer**.
4. Add a **click sound** during the countdown.

#### Dora's Q&A 3

**Question**: Which breakfast is the healthier choice?

**Visual:** Show two breakfast choices side by side:

- A. ![Fried egg on whole grain toast with coffee](https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/perfectly-fried-egg-on-whole-grain-toast-6w5jIN9T-v2oNOMWhixGD.webp)
- B. ![Croissants with jam and coffee](https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/delicious-croissants-with-jam-and-coffee-FTHVyZLCQyPGhFBQnVtOa.webp)

**Choices**:

- A. Fried egg on whole grain toast with coffee
- B. Croissants with jam and coffee

**Correct answer**: A

**Scoring:** 1 point if correct, 0 if incorrect or no selection when timer runs out.

Provide feedback based on the audience's answer:

- If answered correctly, show "Great work — that's correct!"
- If answered incorrectly or no answer when timer runs out, show "Not quite — the correct answer is A."

Hide this question 1 second after the audience chooses an answer or the timer runs out.

### Video 5 — Body 4 + Body 5 + Closure (merged)

After the user chooses an answer, or after the timer runs out:

1. Play this video:
   https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview
   *(Placeholder URL — to be replaced with the real merged Body 4 / Body 5 / Closure video)*
2. After the user clicks **"I've finished watching →"** (or the video ends, once mp4-hosted), show [Breakfast rating 2](#breakfast-rating-2) below the video.
3. Ask the user to choose an answer with a **10-second countdown timer**.
4. Add a **click sound** during the countdown.

> The previous standalone "Dora's activity 4" and "Dora's activity 5" stages have been removed from the in-page flow. Their activities (preparing a breakfast, finding a campus breakfast option, posting and commenting) are now covered inside this merged video, and users participate via the Forum tab directly.

#### Breakfast rating 2

**Question:** On a scale from 1 to 10, how important is breakfast to you now?

This is a rating scale question. Ask the audience to choose one number from 1 to 10.

- After the audience selects a rating, save this score as **rating 2**.
- If the audience doesn't choose a rating, assume a rating of 1.

## End of Session

The end screen has two cards side by side, followed by a reminder block.

### Left card — SESSION SCORE

Eyebrow label: **SESSION SCORE**. Show the Q&A score as `X / 3`, then a message based on the score:

- **0/3** — "Thanks for taking part. These questions were a chance to explore breakfast choices — keep the key tips in mind for next time."
- **1/3** — "Good effort. You've started thinking about breakfast choices and how they can support a healthier routine."
- **2/3** — "Well done. You showed a good understanding of healthier breakfast choices for busy uni life."
- **3/3** — "Excellent work. You clearly recognised how to prioritise breakfast as part of a healthy daily routine."

### Right card — Breakfast Priority Check

Eyebrow label: **Breakfast Priority Check**. Show three lines:

- `Before the session: <rating 1>/10`
- `After the session: <rating 2>/10`
- `Change: <rating 2 − rating 1>` (prefixed with `+` when positive)

Then show a body paragraph followed by a **Key takeaway** paragraph based on the change:

- **rating 2 > rating 1** —
  *Body:* "Your rating increased. This suggests that you may now see breakfast as a higher priority in a healthy daily routine."
  *Key takeaway:* "Breakfast does not need to be perfect — even a quick, simple option can help support a healthier start to the day."
- **rating 2 < rating 1** —
  *Body:* "Your rating decreased. That is okay — reflection is about noticing your own views, not choosing the 'right' number."
  *Key takeaway:* "Even if breakfast is not your top priority, a quick and practical option can still support your overall diet."
- **rating 2 = rating 1 < 5** —
  *Body:* "Your rating stayed the same. Breakfast may still feel like a low priority for you right now."
  *Key takeaway:* "Start small — even one quick breakfast on a busy weekday can be a useful first step."
- **rating 2 = rating 1 ≥ 5** —
  *Body:* "Your rating stayed the same. This suggests that you already see breakfast as an important part of a healthy routine."
  *Key takeaway:* "The next step is turning that awareness into practical breakfast choices that fit uni life."

### Reminder block

Below the two cards, show a visually-prominent reminder (larger text, accent left border):

> Reminder: do not forget to complete your activities and upload your photos **in the Forum →**.

The end-page Forum link opens in the **same tab** (switches to the Forum tab in-place).

---

## Forum Page Behaviour

### List view

- Show all posts in reverse-chronological order. Each post card displays:
  - The first attached image (if any)
  - The first 100 words of the post text, truncated with `…` if longer
  - Author name and timestamp
  - A heart "like" button with the current like count
  - The number of comments (count only — comment text only on the detail page)
- Clicking a card navigates to the post's detail page (`#/post/{id}`).

### Detail view (`#/post/{id}`)

- Full post text and full image (no truncation).
- Heart like button with full like count.
- Full comment list.
- Comment input (signed-in users only) — replies appear immediately via Firestore real-time updates.

### Posting

- Sign-in with Google is required to post or comment.
- A post-form at the top of the Forum lets signed-in users add a post with text and optional image (max 8 MB).
- Images are uploaded to Firebase Storage; the post document stores only the download URL plus the storage path.

### Owner moderation

- The site owner (identified by Firebase Auth UID) sees a 🗑️ button on every post and every comment.
- Owner can delete any post (also removes its image from Storage) and any single comment.
- The owner UID lives in `js/firebase-config.js` as `OWNER_UID`. Firestore security rules also gate `delete` to that UID.
