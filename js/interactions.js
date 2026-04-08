/**
 * checkAnswer — handles True/False interaction buttons
 * @param {HTMLElement} btn        - the clicked button
 * @param {boolean}     isCorrect  - whether THIS button is the correct answer
 */
function checkAnswer(btn, isCorrect) {
  const card     = btn.closest('.interaction-card');
  const feedback = card.querySelector('.feedback');
  const buttons  = card.querySelectorAll('button');

  // Disable all buttons after answering
  buttons.forEach(b => b.disabled = true);

  feedback.classList.remove('hidden', 'correct', 'wrong');

  if (isCorrect) {
    feedback.textContent = '✔ Correct!';
    feedback.classList.add('correct');
  } else {
    feedback.textContent = '✘ Incorrect. Try reviewing the material again.';
    feedback.classList.add('wrong');
  }
}
