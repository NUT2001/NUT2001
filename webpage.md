# NUT2001 Webpage Setup

## Requirements

1. The page title is "NUT2001 Nutrition Education".
2. Use the design system documented in `FigmaDesign.md` (Figma marketing aesthetic — monochrome chrome plus oversized pastel color-block sections, pill buttons, Inter / JetBrains Mono).
3. The main page should show the embedded video, with the question card appearing below the video after the user clicks **"I've finished watching →"**.
4. Create a tab named **Forum** where signed-in users can post and comment on others' posts (Google sign-in required).
5. Create a tab named **Authors** and list the following authors:
   - Linkun Chen 35967862
   - Yiu Wai Kwan 34625607
   - Pokhou Leong 34106235
   - Jiayi Liu 36030279
   - Rui Zhang 35641096

---

## Known Compromises (Drive iframe limitations)

The lesson videos are hosted on Google Drive and embedded via the `/preview` iframe URL. Drive's embedded player does not expose JavaScript hooks for play state, time updates, or end events, and the fullscreen control sits inside Drive's own UI (out of our reach). As a result, the following design intentions are **not** enforced in code:

- Detecting "8 seconds before the video finishes" to auto-show a question — replaced by an explicit **"I've finished watching →"** button after each video.
- Disabling fullscreen — Drive's fullscreen button remains visible.
- Auto-advancing 3 seconds after a video ends — replaced by a **"Continue →"** button on activity cards.

If precise timing or fullscreen-blocking becomes important, host the video files directly (Firebase Storage / Cloudflare R2) and switch to a native `<video controlsList="nofullscreen">` element. The stage state machine in `js/main.js` only needs the video stage's `kind` handler swapped out.

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

Hide this question 5 seconds after the audience chooses an answer or the timer runs out.

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

Hide this question 5 seconds after the audience chooses an answer or the timer runs out.

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

Hide this question 5 seconds after the audience chooses an answer or the timer runs out.

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

Hide this question 5 seconds after the audience chooses an answer or the timer runs out.

### Video 5 — Body 4

After the user chooses an answer, or after the timer runs out:

1. Play this video:
   https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview
   *(Placeholder URL — to be replaced with the real Body 4 video)*
2. After the user clicks **"I've finished watching →"**, show [Dora's activity 4](#doras-activity-4) below the video.

#### Dora's activity 4

During the week:

- Prepare a healthy breakfast and upload it to the Forum.
- Comment on others' posts.

The Forum link opens in a **new tab**. The activity card shows a **"Continue →"** button to advance to the next video.

### Video 6 — Body 5

After the user clicks **"Continue →"** on Dora's activity 4:

1. Play this video:
   https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview
   *(Placeholder URL — to be replaced with the real Body 5 video)*
2. After the user clicks **"I've finished watching →"**, show [Dora's activity 5](#doras-activity-5) below the video.

#### Dora's activity 5

During the week:

- Find another breakfast option on campus, take a photo and upload it to the Forum.
- Comment on others' posts.

The Forum link opens in a **new tab**. The activity card shows a **"Continue →"** button to advance to the next video.

### Video 7 — Closure

After the user clicks **"Continue →"** on Dora's activity 5:

1. Play this video:
   https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview
   *(Placeholder URL — to be replaced with the real Closure video)*
2. After the user clicks **"I've finished watching →"**, show [Breakfast rating 2](#breakfast-rating-2) below the video.
3. Ask the user to choose an answer with a **10-second countdown timer**.
4. Add a **click sound** during the countdown.

#### Breakfast rating 2

**Question:** On a scale from 1 to 10, how important is breakfast to you now?

This is a rating scale question. Ask the audience to choose one number from 1 to 10.

- After the audience selects a rating, save this score as **rating 2**.
- If the audience doesn't choose a rating, assume a rating of 1.

## End of Session

1. Show the audience's **scoreboard** (Q&A score, X / 3) on the left.
2. Show the change in breakfast rating scores (rating 2 − rating 1) on the right with comments:
   - If rating 2 > rating 1: "Great — your rating has increased. This may show that you see more value in breakfast after the session."
   - If rating 2 < rating 1: "That's okay — your rating has decreased. The session may have helped you think more critically about whether breakfast fits your own routine."
   - If rating 2 = rating 1 < 5: "Your rating has stayed the same. Breakfast may still not feel like a priority, but you now have some practical options if you choose to try it."
   - If rating 2 = rating 1 ≥ 5: "Your rating has stayed the same. You already saw breakfast as important, and this session may help you make your choices more balanced and practical."
3. Below the scoreboard and rating change, show: "Reminder: do not forget to complete your activities and upload your photos in the Forum →".

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
