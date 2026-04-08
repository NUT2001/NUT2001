/**
 * Quiz data — edit questions, options, and correct answer index here.
 * correctIndex is 0-based (0 = first option, 1 = second, etc.)
 */
const quizData = [
  {
    question: "Which of the following is a macronutrient?",
    options: ["Vitamin C", "Iron", "Carbohydrates", "Zinc"],
    correctIndex: 2
  },
  {
    question: "How many calories does 1 gram of fat provide?",
    options: ["4 kcal", "7 kcal", "9 kcal", "12 kcal"],
    correctIndex: 2
  },
  {
    question: "Which vitamin is primarily obtained from sunlight?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    correctIndex: 3
  },
  {
    question: "What is the recommended daily water intake for an average adult?",
    options: ["500 mL", "1 Litre", "2 Litres", "5 Litres"],
    correctIndex: 2
  }
];

// ===== BUILD QUIZ =====
(function buildQuiz() {
  const container = document.getElementById('quiz-container');

  quizData.forEach((item, qIndex) => {
    const block = document.createElement('div');
    block.classList.add('quiz-question');
    block.dataset.correct = item.correctIndex;

    const qText = document.createElement('p');
    qText.textContent = `${qIndex + 1}. ${item.question}`;
    block.appendChild(qText);

    item.options.forEach((opt, oIndex) => {
      const label = document.createElement('label');
      label.innerHTML = `
        <input type="radio" name="q${qIndex}" value="${oIndex}" />
        ${opt}
      `;
      block.appendChild(label);
    });

    container.appendChild(block);
  });
})();

// ===== SUBMIT & GRADE =====
function submitQuiz() {
  const questions = document.querySelectorAll('.quiz-question');
  let score = 0;
  let allAnswered = true;

  questions.forEach((block, qIndex) => {
    const selected = block.querySelector(`input[name="q${qIndex}"]:checked`);

    if (!selected) {
      allAnswered = false;
      return;
    }

    const chosen  = parseInt(selected.value, 10);
    const correct = parseInt(block.dataset.correct, 10);

    block.classList.remove('correct', 'wrong');

    if (chosen === correct) {
      block.classList.add('correct');
      score++;
    } else {
      block.classList.add('wrong');
    }

    // Disable inputs after submission
    block.querySelectorAll('input').forEach(i => i.disabled = true);
  });

  if (!allAnswered) {
    document.getElementById('quiz-result').textContent =
      'Please answer all questions before submitting.';
    return;
  }

  const total   = quizData.length;
  const percent = Math.round((score / total) * 100);

  document.getElementById('quiz-result').textContent =
    `You scored ${score} / ${total} (${percent}%)`;

  document.getElementById('submit-quiz').disabled = true;
}
