/* ===== TAB SWITCHING ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

/* ===== TICK SOUND ===== */
function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

/* ===== SCORE ===== */
var totalScore = 0;

/* ===== COUNTDOWN ===== */
var countdownInterval = null;
var secondsLeft = 15;
var activeTextId = null;
var activeBarId = null;

function startCountdown(textId, barId, onExpire) {
  secondsLeft = 15;
  activeTextId = textId;
  activeBarId = barId;
  updateCountdownUI();

  countdownInterval = setInterval(function () {
    secondsLeft--;
    playTick();
    updateCountdownUI();
    if (secondsLeft <= 0) {
      clearInterval(countdownInterval);
      onExpire();
    }
  }, 1000);
}

function updateCountdownUI() {
  document.getElementById(activeTextId).textContent = secondsLeft;
  var pct = (secondsLeft / 15) * 100;
  var bar = document.getElementById(activeBarId);
  bar.style.width = pct + '%';
  bar.style.background = secondsLeft <= 3 ? '#e74c3c' : '#5b76fe';
}

function stopCountdown() {
  clearInterval(countdownInterval);
}

/* ===== STAGE HELPERS ===== */
function showStage(id) {
  var el = document.getElementById(id);
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideStage(id) {
  document.getElementById(id).classList.add('hidden');
}

/* ===== QUIZ 1 ===== */
function startQuiz1() {
  hideStage('stage-video1');
  showStage('stage-quiz1');
  startCountdown('countdown-text', 'countdown-bar', function () { submitQuiz1(true); });
}

function submitQuiz1(auto) {
  if (auto === undefined) auto = false;
  stopCountdown();

  var card   = document.getElementById('q1-card');
  var chosen = card.querySelector('input[name="q1"]:checked');
  var result = document.getElementById('q1-result');
  var correct = parseInt(card.dataset.correct, 10);

  card.querySelectorAll('input').forEach(function (i) { i.disabled = true; });
  document.getElementById('q1-submit').disabled = true;
  document.getElementById('countdown-text').textContent = '0';
  document.getElementById('countdown-bar').style.width = '0%';

  var scored = false;
  if (!chosen) {
    card.classList.add('wrong');
    result.textContent = auto
      ? "⏰ Time's up! The correct answer is D. All of the above."
      : '⚠ No answer selected. The correct answer is D. All of the above.';
    result.style.color = '#600000';
  } else {
    var val = parseInt(chosen.value, 10);
    if (val === correct) {
      card.classList.add('correct');
      result.textContent = '✔ Correct! All of the above are benefits of eating breakfast.';
      result.style.color = '#00b473';
      scored = true;
    } else {
      card.classList.add('wrong');
      result.textContent = '✘ Not quite. The correct answer is D. All of the above.';
      result.style.color = '#600000';
    }
  }

  if (scored) totalScore++;

  setTimeout(function () {
    hideStage('stage-quiz1');
    showStage('stage-video2');
  }, 2000);
}

/* ===== QUIZ 2 ===== */
var selectedImageChoice = null;

function selectImageChoice(choice) {
  selectedImageChoice = choice;
  document.querySelectorAll('.image-choice').forEach(function (el) {
    el.classList.remove('selected');
  });
  document.getElementById('choice-' + choice.toLowerCase()).classList.add('selected');
}

function startQuiz2() {
  hideStage('stage-video2');
  showStage('stage-quiz2');
  startCountdown('countdown-text2', 'countdown-bar2', function () { submitQuiz2(true); });
}

function submitQuiz2(auto) {
  if (auto === undefined) auto = false;
  stopCountdown();

  var result = document.getElementById('q2-result');

  document.querySelectorAll('.image-choice').forEach(function (el) {
    el.style.pointerEvents = 'none';
  });
  document.getElementById('q2-submit').disabled = true;
  document.getElementById('countdown-text2').textContent = '0';
  document.getElementById('countdown-bar2').style.width = '0%';

  var scored = false;
  if (!selectedImageChoice) {
    result.textContent = auto
      ? "⏰ Time's up! The correct answer is B. Wholegrain cereal with yoghurt & fruit."
      : '⚠ No answer selected. The correct answer is B.';
    result.style.color = '#600000';
    document.getElementById('choice-b').classList.add('choice-correct');
  } else if (selectedImageChoice === 'B') {
    result.textContent = '✔ Correct! Wholegrain cereal with yoghurt & fruit is much healthier.';
    result.style.color = '#00b473';
    document.getElementById('choice-b').classList.add('choice-correct');
    scored = true;
  } else {
    result.textContent = '✘ Not quite. Wholegrain cereal with yoghurt & fruit is the healthier choice.';
    result.style.color = '#600000';
    document.getElementById('choice-a').classList.add('choice-wrong');
    document.getElementById('choice-b').classList.add('choice-correct');
  }

  if (scored) totalScore++;

  setTimeout(function () {
    hideStage('stage-quiz2');
    showStage('stage-end');
    renderScoreboard();
  }, 2000);
}

/* ===== SCOREBOARD ===== */
function renderScoreboard() {
  document.getElementById('score-display').textContent = totalScore + ' / 2';
  var labels = ['Keep practising! 💪', 'Good effort! 👍', 'Perfect score! 🎉'];
  document.getElementById('score-label').textContent = labels[totalScore] || '';
}
