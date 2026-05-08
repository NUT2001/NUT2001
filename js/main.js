/* ===== NUT2001 lesson flow + tab navigation ===== */

function showTab(name) {
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  const panel = document.getElementById('tab-' + name);
  if (panel) panel.classList.remove('hidden');
  const tab = document.querySelector(`.nav-link[data-tab="${name}"]`);
  if (tab) tab.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.tab;
      showTab(name);
      if (name !== 'forum' && location.hash.startsWith('#/post/')) {
        history.replaceState(null, '', location.pathname);
      }
    });
  });
  startStage(0);
});

const VIDEOS = {
  v1: 'https://drive.google.com/file/d/1lpmDN-GX69J05SUz7m-oHf_gx2Byxuz_/preview',
  v2: 'https://drive.google.com/file/d/1MxJIJrz0dgwd6CN6bZAZgFNXVydAypTn/preview',
  v3: 'https://drive.google.com/file/d/17jl90WkbP9mHVyLkTnWBF8fIC_DXI_hP/preview',
  v4: 'https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview',
  v5: 'https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview',
  v6: 'https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview',
  v7: 'https://drive.google.com/file/d/16xChEg5kiUJ-_t1Pxw_94BaNnWctIGgD/preview',
};

const STAGES = [
  { kind: 'video', src: VIDEOS.v1 },
  { kind: 'rating', id: 'rating1', timer: 10,
    prompt: 'On a scale from 1 to 10, how important is breakfast to you?' },

  { kind: 'video', src: VIDEOS.v2 },
  { kind: 'mcq', id: 'q1', timer: 15,
    prompt: 'Which of the following is the best reason to prioritise a nutritious breakfast?',
    choices: [
      'It guarantees perfect academic results',
      'It can support energy, concentration and nutrient intake',
      'It means you do not need to eat lunch',
      'It must include all five food groups every morning',
    ],
    correct: 1, correctLabel: 'B' },

  { kind: 'video', src: VIDEOS.v3 },
  { kind: 'mcq', id: 'q2', timer: 15,
    prompt: 'Which food group and nutrient match is correct?',
    choices: [
      'Egg — vegetables & legumes — fibre and vitamins',
      'Banana — fruit — calcium and protein',
      'Wholegrain bread — grain food — carbohydrate, fibre and energy',
      'Yoghurt — protein food — calcium and energy',
    ],
    correct: 2, correctLabel: 'C' },

  { kind: 'video', src: VIDEOS.v4 },
  { kind: 'mcq', id: 'q3', timer: 15,
    prompt: 'Which breakfast is the healthier choice?',
    images: [
      'https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/perfectly-fried-egg-on-whole-grain-toast-6w5jIN9T-v2oNOMWhixGD.webp',
      'https://pub-aaa82e9851064d22b954c3ebbafc9ae6.r2.dev/legacy/webp/delicious-croissants-with-jam-and-coffee-FTHVyZLCQyPGhFBQnVtOa.webp',
    ],
    choices: [
      'Fried egg on whole grain toast with coffee',
      'Croissants with jam and coffee',
    ],
    correct: 0, correctLabel: 'A' },

  { kind: 'video', src: VIDEOS.v5 },
  { kind: 'activity',
    title: "Dora's activity 4",
    intro: 'During the week:',
    leadAction: 'Prepare a healthy breakfast and upload it',
    tail: "Comment on others' posts." },

  { kind: 'video', src: VIDEOS.v6 },
  { kind: 'activity',
    title: "Dora's activity 5",
    intro: 'During the week:',
    leadAction: 'Find another breakfast option on campus, take a photo and upload it',
    tail: "Comment on others' posts." },

  { kind: 'video', src: VIDEOS.v7 },
  { kind: 'rating', id: 'rating2', timer: 10,
    prompt: 'On a scale from 1 to 10, how important is breakfast to you now?' },

  { kind: 'end' },
];

const state = {
  index: 0,
  score: 0,
  rating1: null,
  rating2: null,
  answers: {},
};

function startStage(i) {
  state.index = i;
  const stage = STAGES[i];
  const host = document.getElementById('stage-host');
  if (!host) return;
  host.innerHTML = '';
  if (!stage) return;
  if (stage.kind === 'video')    return renderVideoStage(host, stage);
  if (stage.kind === 'rating')   return renderRatingStage(host, stage);
  if (stage.kind === 'mcq')      return renderMCQStage(host, stage);
  if (stage.kind === 'activity') return renderActivityStage(host, stage);
  if (stage.kind === 'end')      return renderEndStage(host);
}

function nextStage() { startStage(state.index + 1); }

function renderVideoStage(host, stage) {
  host.innerHTML = `
    <div class="video-frame">
      <iframe src="${stage.src}" allow="autoplay" allowfullscreen></iframe>
    </div>
    <div class="stage-actions">
      <button class="btn-primary" id="video-done-btn">I&rsquo;ve finished watching &rarr;</button>
    </div>
  `;
  document.getElementById('video-done-btn').addEventListener('click', () => {
    if (window.playTick) window.playTick();
    nextStage();
  });
}

function renderRatingStage(host, stage) {
  host.innerHTML = `
    <div class="question-card">
      <div class="countdown-row">
        <span class="eyebrow" style="margin:0">Rating</span>
        <div class="countdown-bar-wrap"><div class="countdown-bar" id="cd-bar"></div></div>
        <span class="countdown-num" id="cd-num">${stage.timer}</span>
      </div>
      <p class="q-text">${escapeHtml(stage.prompt)}</p>
      <div class="rating-row" id="rating-row">
        ${Array.from({length: 10}, (_, i) => i + 1).map(n =>
          `<button class="rating-btn" data-val="${n}">${n}</button>`).join('')}
      </div>
      <div class="q-feedback hidden" id="q-feedback"></div>
    </div>
  `;

  let answered = false;
  const feedbackEl = document.getElementById('q-feedback');
  const cd = startCountdown({
    seconds: stage.timer,
    barEl: document.getElementById('cd-bar'),
    numEl: document.getElementById('cd-num'),
    onDone: () => { if (!answered) finalize(1); }
  });

  document.querySelectorAll('#rating-row .rating-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (answered) return;
      document.querySelectorAll('#rating-row .rating-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      finalize(parseInt(btn.dataset.val, 10));
    });
  });

  function finalize(value) {
    answered = true;
    cd.cancel();
    state[stage.id] = value;
    feedbackEl.classList.remove('hidden');
    feedbackEl.classList.add('neutral');
    feedbackEl.textContent = 'Thank you for your response.';
    setTimeout(nextStage, 5000);
  }
}

function renderMCQStage(host, stage) {
  const isImage = !!stage.images;
  const choicesHtml = isImage
    ? `<div class="image-choice-row">
         ${stage.choices.map((c, i) => `
           <div class="image-choice" data-val="${i}">
             <img src="${stage.images[i]}" alt="${escapeAttr(c)}" />
             <div class="image-choice-label">${String.fromCharCode(65+i)}. ${escapeHtml(c)}</div>
           </div>
         `).join('')}
       </div>`
    : `<div class="choice-list">
         ${stage.choices.map((c, i) => `
           <label>
             <input type="radio" name="${stage.id}" value="${i}" />
             <span><strong>${String.fromCharCode(65+i)}.</strong> ${escapeHtml(c)}</span>
           </label>
         `).join('')}
       </div>`;

  host.innerHTML = `
    <div class="question-card">
      <div class="countdown-row">
        <span class="eyebrow" style="margin:0">Dora&rsquo;s Q&amp;A</span>
        <div class="countdown-bar-wrap"><div class="countdown-bar" id="cd-bar"></div></div>
        <span class="countdown-num" id="cd-num">${stage.timer}</span>
      </div>
      <p class="q-text">${escapeHtml(stage.prompt)}</p>
      ${choicesHtml}
      <button class="btn-primary" id="mcq-submit">Submit Answer</button>
      <div class="q-feedback hidden" id="q-feedback"></div>
    </div>
  `;

  let answered = false;
  const feedbackEl = document.getElementById('q-feedback');
  const submitBtn = document.getElementById('mcq-submit');
  let selected = null;

  if (isImage) {
    document.querySelectorAll('.image-choice').forEach(el => {
      el.addEventListener('click', () => {
        if (answered) return;
        document.querySelectorAll('.image-choice').forEach(e => e.classList.remove('selected'));
        el.classList.add('selected');
        selected = parseInt(el.dataset.val, 10);
      });
    });
  } else {
    document.querySelectorAll(`input[name="${stage.id}"]`).forEach(r => {
      r.addEventListener('change', () => { selected = parseInt(r.value, 10); });
    });
  }

  const cd = startCountdown({
    seconds: stage.timer,
    barEl: document.getElementById('cd-bar'),
    numEl: document.getElementById('cd-num'),
    onDone: () => { if (!answered) finalize(null); }
  });

  submitBtn.addEventListener('click', () => {
    if (answered) return;
    finalize(selected);
  });

  function finalize(value) {
    answered = true;
    cd.cancel();
    submitBtn.disabled = true;
    state.answers[stage.id] = value;

    const isCorrect = value !== null && value === stage.correct;
    if (isCorrect) {
      state.score += 1;
      feedbackEl.classList.add('ok');
      feedbackEl.textContent = 'Great work — that’s correct!';
    } else {
      feedbackEl.classList.add('err');
      feedbackEl.textContent = `Not quite — the correct answer is ${stage.correctLabel}.`;
    }
    feedbackEl.classList.remove('hidden');
    setTimeout(nextStage, 5000);
  }
}

function renderActivityStage(host, stage) {
  host.innerHTML = `
    <div class="activity-card">
      <h2>${escapeHtml(stage.title)}</h2>
      <p>${escapeHtml(stage.intro)}</p>
      <ul>
        <li>${escapeHtml(stage.leadAction)} <a href="#" id="activity-forum-link" target="_blank" rel="noopener">in the Forum &rarr;</a></li>
        <li>${escapeHtml(stage.tail)}</li>
      </ul>
      <div class="stage-actions" style="margin-top:16px">
        <button class="btn-primary" id="activity-next">Continue &rarr;</button>
      </div>
    </div>
  `;
  document.getElementById('activity-forum-link').addEventListener('click', (e) => {
    e.preventDefault();
    const url = location.pathname + '#forum';
    window.open(url, '_blank', 'noopener');
  });
  document.getElementById('activity-next').addEventListener('click', nextStage);
}

function renderEndStage(host) {
  const r1 = state.rating1 ?? 1;
  const r2 = state.rating2 ?? 1;
  const delta = r2 - r1;
  let msg;
  if (r2 > r1) {
    msg = 'Great — your rating has increased. This may show that you see more value in breakfast after the session.';
  } else if (r2 < r1) {
    msg = 'That’s okay — your rating has decreased. The session may have helped you think more critically about whether breakfast fits your own routine.';
  } else if (r2 < 5) {
    msg = 'Your rating has stayed the same. Breakfast may still not feel like a priority, but you now have some practical options if you choose to try it.';
  } else {
    msg = 'Your rating has stayed the same. You already saw breakfast as important, and this session may help you make your choices more balanced and practical.';
  }

  host.innerHTML = `
    <div class="end-grid">
      <div class="end-card">
        <span class="eyebrow" style="margin:0">Scoreboard</span>
        <div class="score-display">${state.score} / 3</div>
        <div class="end-message">Your Dora Q&amp;A score from this session.</div>
      </div>
      <div class="end-card">
        <span class="eyebrow" style="margin:0">Breakfast rating change</span>
        <div class="delta-display">${delta > 0 ? '+' : ''}${delta}</div>
        <div class="end-message">${escapeHtml(msg)}</div>
      </div>
    </div>
    <div class="end-reminder">
      Reminder: do not forget to complete your activities and upload your photos
      <a href="#forum" id="end-forum-link">in the Forum &rarr;</a>.
    </div>
  `;
  document.getElementById('end-forum-link').addEventListener('click', (e) => {
    e.preventDefault();
    showTab('forum');
  });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, '&#39;');
}

window.showTab = showTab;
