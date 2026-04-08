/* ===== TAB SWITCHING ===== */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.remove('hidden');
  });
});

/* ===== POST-VIDEO QUIZ ===== */
var countdownInterval;
var secondsLeft = 10;

function showPostVideoQuiz() {
  const quizSection = document.getElementById('post-video-quiz');
  quizSection.classList.remove('hidden');

  // Hide the "watched" button so it can't be clicked again
  document.querySelector('.watched-btn').style.display = 'none';

  quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  startCountdown();
}

function startCountdown() {
  secondsLeft = 10;
  updateCountdownUI();

  countdownInterval = setInterval(() => {
    secondsLeft--;
    updateCountdownUI();
    if (secondsLeft <= 0) {
      clearInterval(countdownInterval);
      submitPostVideoQuiz(true);
    }
  }, 1000);
}

function updateCountdownUI() {
  document.getElementById('countdown-text').textContent = secondsLeft;
  const pct = (secondsLeft / 10) * 100;
  const bar = document.getElementById('countdown-bar');
  bar.style.width = pct + '%';
  bar.style.background = secondsLeft <= 3 ? '#e74c3c' : '#5b76fe';
}

function submitPostVideoQuiz(auto = false) {
  clearInterval(countdownInterval);

  const card   = document.getElementById('pvq-card');
  const chosen = card.querySelector('input[name="pvq"]:checked');
  const result = document.getElementById('pvq-result');
  const correct = parseInt(card.dataset.correct, 10);

  card.querySelectorAll('input').forEach(i => i.disabled = true);
  document.getElementById('pvq-submit').disabled = true;
  document.getElementById('countdown-text').textContent = '0';
  document.getElementById('countdown-bar').style.width = '0%';

  if (!chosen) {
    card.classList.add('wrong');
    result.textContent = auto
      ? "⏰ Time's up! The correct answer is D. All of the above."
      : '⚠ No answer selected. The correct answer is D. All of the above.';
    result.style.color = '#600000';
    return;
  }

  const val = parseInt(chosen.value, 10);
  if (val === correct) {
    card.classList.add('correct');
    result.textContent = '✔ Correct! All of the above are benefits of eating breakfast.';
    result.style.color = '#00b473';
  } else {
    card.classList.add('wrong');
    result.textContent = '✘ Not quite. The correct answer is D. All of the above.';
    result.style.color = '#600000';
  }
}
