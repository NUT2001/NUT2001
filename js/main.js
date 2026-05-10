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
  v1: 'https://firebasestorage.googleapis.com/v0/b/nut2001-8a3cd.firebasestorage.app/o/videos%2FPart%201.mp4?alt=media',
  v2: 'https://firebasestorage.googleapis.com/v0/b/nut2001-8a3cd.firebasestorage.app/o/videos%2FPart%202.mp4?alt=media',
  v3: 'https://firebasestorage.googleapis.com/v0/b/nut2001-8a3cd.firebasestorage.app/o/videos%2FPart%203.mp4?alt=media',
  v4: 'https://firebasestorage.googleapis.com/v0/b/nut2001-8a3cd.firebasestorage.app/o/videos%2FPart%204.mp4?alt=media',
  v5: 'https://firebasestorage.googleapis.com/v0/b/nut2001-8a3cd.firebasestorage.app/o/videos%2FPart%205.mp4?alt=media',
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
  if (stage.kind === 'end')      return renderEndStage(host);
}

function nextStage() { startStage(state.index + 1); }

function renderVideoStage(host, stage) {
  const isFirstVideo = state.index === 0;
  const isMp4 = /\.mp4($|\?)/i.test(stage.src);

  if (isMp4) {
    host.innerHTML = `
      <div class="video-frame">
        <video id="stage-video" ${isFirstVideo ? '' : 'autoplay'} controls playsinline preload="auto">
          <source src="${stage.src}" type="video/mp4" />
        </video>
      </div>
      <div class="stage-actions">
        <button class="btn-primary" id="video-done-btn">I&rsquo;ve finished watching &rarr;</button>
      </div>
    `;
    document.getElementById('stage-video').addEventListener('ended', () => {
      if (window.playTick) window.playTick();
      nextStage();
    });
  } else {
    const src = isFirstVideo ? stage.src : `${stage.src}?autoplay=1`;
    host.innerHTML = `
      <div class="video-frame">
        <iframe src="${src}" allow="autoplay" allowfullscreen></iframe>
      </div>
      <div class="stage-actions">
        <button class="btn-primary" id="video-done-btn">I&rsquo;ve finished watching &rarr;</button>
      </div>
    `;
  }

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
    setTimeout(nextStage, 1000);
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
    setTimeout(nextStage, 1000);
  }
}

function renderEndStage(host) {
  const r1 = state.rating1 ?? 1;
  const r2 = state.rating2 ?? 1;
  const delta = r2 - r1;
  let body, takeaway;
  if (r2 > r1) {
    body = 'Your rating increased. This suggests that you may now see breakfast as a higher priority in a healthy daily routine.';
    takeaway = 'Breakfast does not need to be perfect — even a quick, simple option can help support a healthier start to the day.';
  } else if (r2 < r1) {
    body = 'Your rating decreased. That is okay — reflection is about noticing your own views, not choosing the “right” number.';
    takeaway = 'Even if breakfast is not your top priority, a quick and practical option can still support your overall diet.';
  } else if (r2 < 5) {
    body = 'Your rating stayed the same. Breakfast may still feel like a low priority for you right now.';
    takeaway = 'Start small — even one quick breakfast on a busy weekday can be a useful first step.';
  } else {
    body = 'Your rating stayed the same. This suggests that you already see breakfast as an important part of a healthy routine.';
    takeaway = 'The next step is turning that awareness into practical breakfast choices that fit uni life.';
  }

  const scoreMessages = {
    0: 'Thanks for taking part. These questions were a chance to explore breakfast choices — keep the key tips in mind for next time.',
    1: 'Good effort. You’ve started thinking about breakfast choices and how they can support a healthier routine.',
    2: 'Well done. You showed a good understanding of healthier breakfast choices for busy uni life.',
    3: 'Excellent work. You clearly recognised how to prioritise breakfast as part of a healthy daily routine.',
  };
  const scoreMsg = scoreMessages[state.score] ?? scoreMessages[0];

  host.innerHTML = `
    <div class="end-grid">
      <div class="end-card">
        <span class="eyebrow" style="margin:0">SESSION SCORE</span>
        <div class="score-display">${state.score} / 3</div>
        <div class="end-message">${escapeHtml(scoreMsg)}</div>
      </div>
      <div class="end-card">
        <span class="eyebrow" style="margin:0">Breakfast Priority Check</span>
        <div class="rating-stats">
          <div>Before the session: ${r1}/10</div>
          <div>After the session: ${r2}/10</div>
          <div>Change: ${delta > 0 ? '+' : ''}${delta}</div>
        </div>
        <div class="end-message">
          <p>${escapeHtml(body)}</p>
          <p><strong>Key takeaway:</strong> ${escapeHtml(takeaway)}</p>
        </div>
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
