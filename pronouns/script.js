// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const nextBtn = document.getElementById('next-btn');

const questionCounterText = document.getElementById('question-counter');
const scoreText = document.getElementById('score');
const questionText = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const feedbackText = document.getElementById('feedback-text');
const explanationText = document.getElementById('explanation-text');
const finalScoreText = document.getElementById('final-score');

// Game Questions Data
// The placeholder '___' will be replaced with a styled span.
const questions = [
    {
        type: "Reflexive",
        sentence: "Yo ___ lavo las manos antes de comer.",
        options: ["me", "te", "se"],
        correctAnswer: "me",
        explanation: "Reflexive: The action (lavo) is done by the subject (Yo) to the subject itself. 'me' is the reflexive pronoun for 'Yo'."
    },
    {
        type: "Direct Object",
        sentence: "Mi madre compró una torta. ___ comimos en la noche.",
        options: ["lo", "la", "le"],
        correctAnswer: "la",
        explanation: "Direct Object: The pronoun replaces 'una torta' (feminine, singular). 'What did we eat?' -> 'it' (the cake). So we use 'la'."
    },
    {
        type: "Indirect Object",
        sentence: "Yo ___ di el regalo a mi hermana.",
        options: ["lo", "la", "le"],
        correctAnswer: "le",
        explanation: "Indirect Object: The pronoun indicates 'to whom' the action was done. 'To whom did I give the gift?' -> 'to my sister' (a ella). So we use 'le'."
    },
    {
        type: "Reflexive",
        sentence: "Tú ___ despiertas muy temprano.",
        options: ["me", "te", "se"],
        correctAnswer: "te",
        explanation: "Reflexive: The action (despiertas) is done by the subject (Tú) to the subject itself. 'te' is the reflexive pronoun for 'Tú'."
    },
    {
        type: "Direct Object",
        sentence: "Vi a Juan en el parque. ___ saludé desde lejos.",
        options: ["lo", "la", "le"],
        correctAnswer: "lo",
        explanation: "Direct Object: The pronoun replaces 'a Juan' (masculine, singular). 'Whom did I greet?' -> 'him' (Juan). So we use 'lo'."
    },
    {
        type: "Indirect Object",
        sentence: "El profesor ___ explica la lección a los estudiantes.",
        options: ["los", "las", "les"],
        correctAnswer: "les",
        explanation: "Indirect Object: The pronoun indicates 'to whom' the action was done. 'To whom does the teacher explain the lesson?' -> 'to the students' (a ellos). So we use 'les'."
    },
    {
        type: "Reflexive",
        sentence: "Nosotros ___ divertimos mucho en la fiesta.",
        options: ["nos", "os", "se"],
        correctAnswer: "nos",
        explanation: "Reflexive: The action (divertimos) is done by the subject (Nosotros) to the subject itself. 'nos' is the reflexive pronoun for 'Nosotros'."
    },
     {
        type: "Direct & Indirect (Se Lo)",
        sentence: "Le compré flores a mi madre. ___ di esta mañana.",
        options: ["Se las", "Le las", "Se los"],
        correctAnswer: "Se las",
        explanation: "'Le' changes to 'se' before 'la/lo/las/los'. The direct object is 'flores' (feminine, plural), so we use 'las'. 'Se las' means 'I gave them to her'."
    }
];

// Game State
let shuffledQuestions, currentQuestionIndex, score;

// Event Listeners
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});
restartBtn.addEventListener('click', startGame);


function startGame() {
    // 1. Hide start/end screens, show game screen
    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    // 2. Reset game state
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    scoreText.innerText = score;

    // 3. Set up the first question
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
        endGame();
    }
}

function showQuestion(question) {
    // Update Question Counter
    questionCounterText.innerText = `${currentQuestionIndex + 1} / ${shuffledQuestions.length}`;

    // Display the sentence with a styled blank
    questionText.innerHTML = question.sentence.replace('___', '<span>___</span>');

    // Create and display option buttons
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', selectAnswer);
        optionsContainer.appendChild(button);
    });
}

function resetState() {
    // Hide feedback and next button
    feedbackContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');

    // Clear old options
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.innerText === shuffledQuestions[currentQuestionIndex].correctAnswer;

    // Update score if correct
    if (correct) {
        score++;
        scoreText.innerText = score;
        feedbackText.innerText = "¡Correcto!";
        feedbackText.style.color = '#155724';
    } else {
        feedbackText.innerText = "Incorrecto";
        feedbackText.style.color = '#721c24';
    }

    // Show explanation
    explanationText.innerText = shuffledQuestions[currentQuestionIndex].explanation;
    feedbackContainer.classList.remove('hidden');

    // Highlight correct and incorrect answers
    Array.from(optionsContainer.children).forEach(button => {
        if (button.innerText === shuffledQuestions[currentQuestionIndex].correctAnswer) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
        button.disabled = true; // Disable all buttons after selection
    });

    // --- TTS: Read the completed sentence in Spanish (Spain) ---
    const originalSentence = shuffledQuestions[currentQuestionIndex].sentence;
    const filledSentence = originalSentence.replace('___', selectedButton.innerText);
    speakSpanish(filledSentence);
    // --- END TTS ---

    // Show the 'Next' button
    nextBtn.classList.remove('hidden');
}

// Add TTS function for Spanish (Spain)
function speakSpanish(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;
    // Try to force a Spain Spanish voice
    const voices = window.speechSynthesis.getVoices();
    // Prefer Spain Spanish (es-ES), fallback to any Spanish
    let esVoice = voices.find(v => v.lang === 'es-ES');
    if (!esVoice) esVoice = voices.find(v => v.lang && v.lang.startsWith('es'));
    if (esVoice) utterance.voice = esVoice;
    window.speechSynthesis.speak(utterance);
}

function endGame() {
    gameScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreText.innerText = `${score} / ${shuffledQuestions.length}`;
}