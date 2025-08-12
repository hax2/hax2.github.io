/* ------------------ VERB MASTERY GAME FUNCTIONS ------------------ */

function GameSetup() {
  const container = el("div", "space-y-8");
  
  // Progress indicator
  const progress = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const progressHeader = el("div", "flex items-center gap-3 mb-4");
  const progressIcon = el("div", "w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center");
  progressIcon.innerHTML = `
    <svg class="w-4 h-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 12l2 2 4-4"></path>
      <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.03 0 3.89.67 5.39 1.8"></path>
    </svg>
  `;
  const progressTitle = el("h3", "font-semibold text-slate-800");
  progressTitle.textContent = "Configuración del Juego";
  
  progressHeader.appendChild(progressIcon);
  progressHeader.appendChild(progressTitle);
  progress.appendChild(progressHeader);
  
  const steps = el("div", "flex items-center gap-2");
  [1, 2, 3].forEach((step, index) => {
    const stepEl = el("div", `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${index === 0 ? 'bg-purple-500 text-white' : 'bg-slate-200 text-slate-500'}`);
    stepEl.textContent = step;
    steps.appendChild(stepEl);
    
    if (index < 2) {
      const connector = el("div", "w-8 h-1 bg-slate-200 rounded transition-all duration-300");
      steps.appendChild(connector);
    }
  });
  
  progress.appendChild(steps);
  container.appendChild(progress);
  
  // Step 1: Verb Selection
  const verbSection = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");
  const verbHeader = el("div", "flex items-center gap-3 mb-6");
  const verbIcon = el("div", "w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center");
  verbIcon.textContent = "1";
  const verbTitle = el("h3", "text-xl font-bold text-slate-800");
  verbTitle.textContent = "Elige un verbo";
  
  verbHeader.appendChild(verbIcon);
  verbHeader.appendChild(verbTitle);
  verbSection.appendChild(verbHeader);
  
  // Verb difficulty tabs
  const difficultyTabs = el("div", "flex gap-2 mb-6");
  const difficulties = [
    { level: 1, label: "Regulares", description: "Verbos -ar, -er, -ir" },
    { level: 2, label: "Irregulares", description: "Ser, estar, tener..." }
  ];
  
  difficulties.forEach((diff, index) => {
    const tab = el("button", `px-4 py-2 rounded-xl font-medium transition-all duration-300 ${index === 0 ? 'bg-purple-100 text-purple-700 border-2 border-purple-300' : 'bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200'}`);
    tab.innerHTML = `
      <div class="text-sm font-bold">${diff.label}</div>
      <div class="text-xs opacity-75">${diff.description}</div>
    `;
    tab.onclick = () => updateVerbDifficulty(diff.level);
    difficultyTabs.appendChild(tab);
  });
  
  verbSection.appendChild(difficultyTabs);
  
  // Verb grid
  const verbGrid = el("div", "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3");
  verbGrid.id = "verb-grid";
  updateVerbGrid(verbGrid, 1); // Start with regular verbs
  
  verbSection.appendChild(verbGrid);
  container.appendChild(verbSection);
  
  // Step 2: Subject Selection
  const subjectSection = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");
  const subjectHeader = el("div", "flex items-center gap-3 mb-6");
  const subjectIcon = el("div", "w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center");
  subjectIcon.textContent = "2";
  const subjectTitle = el("h3", "text-xl font-bold text-slate-800");
  subjectTitle.textContent = "Elige los sujetos a practicar";
  
  subjectHeader.appendChild(subjectIcon);
  subjectHeader.appendChild(subjectTitle);
  subjectSection.appendChild(subjectHeader);
  
  const subjectGrid = el("div", "grid grid-cols-2 md:grid-cols-3 gap-3");
  GAME_SUBJECTS.forEach(subject => {
    const btn = el("button", "p-4 text-left rounded-xl border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300");
    
    const pronounEl = el("div", "font-bold text-slate-800 mb-1");
    pronounEl.textContent = subject.pronoun;
    
    const meaningEl = el("div", "text-sm text-slate-600");
    meaningEl.textContent = subject.meaning;
    
    btn.appendChild(pronounEl);
    btn.appendChild(meaningEl);
    
    btn.onclick = () => toggleSubject(subject, btn);
    subjectGrid.appendChild(btn);
  });
  
  subjectSection.appendChild(subjectGrid);
  
  // Quick select buttons
  const quickSelect = el("div", "flex gap-2 mt-4");
  const allBtn = el("button", "btn-secondary text-sm");
  allBtn.textContent = "Seleccionar todos";
  allBtn.onclick = () => selectAllSubjects();
  
  const essentialBtn = el("button", "btn-secondary text-sm");
  essentialBtn.textContent = "Solo esenciales (yo, tú, él/ella)";
  essentialBtn.onclick = () => selectEssentialSubjects();
  
  quickSelect.appendChild(allBtn);
  quickSelect.appendChild(essentialBtn);
  subjectSection.appendChild(quickSelect);
  
  container.appendChild(subjectSection);
  
  // Step 3: Tense Collection Selection
  const tenseSection = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");
  const tenseHeader = el("div", "flex items-center gap-3 mb-6");
  const tenseIcon = el("div", "w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold flex items-center justify-center");
  tenseIcon.textContent = "3";
  const tenseTitle = el("h3", "text-xl font-bold text-slate-800");
  tenseTitle.textContent = "Elige los tiempos a practicar";
  
  tenseHeader.appendChild(tenseIcon);
  tenseHeader.appendChild(tenseTitle);
  tenseSection.appendChild(tenseHeader);
  
  const tenseGrid = el("div", "grid grid-cols-1 md:grid-cols-2 gap-4");
  Object.entries(GAME_TENSE_COLLECTIONS).forEach(([key, collection]) => {
    const card = el("button", `p-6 text-left rounded-xl border-2 transition-all duration-300 ${key === gameState.selectedTenseCollection ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'}`);
    
    const cardHeader = el("div", "flex items-center justify-between mb-3");
    const cardTitle = el("h4", "font-bold text-slate-800");
    cardTitle.textContent = collection.name;
    
    const difficulty = el("div", "flex items-center gap-1");
    for (let i = 0; i < collection.difficulty; i++) {
      const star = el("span", "text-yellow-400");
      star.textContent = "⭐";
      difficulty.appendChild(star);
    }
    
    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(difficulty);
    card.appendChild(cardHeader);
    
    const cardDesc = el("p", "text-slate-600 text-sm mb-3");
    cardDesc.textContent = collection.description;
    card.appendChild(cardDesc);
    
    const cardCount = el("div", "text-xs text-slate-500");
    cardCount.textContent = `${collection.tenses.length} tiempo${collection.tenses.length !== 1 ? 's' : ''}`;
    card.appendChild(cardCount);
    
    card.onclick = () => selectTenseCollection(key);
    tenseGrid.appendChild(card);
  });
  
  tenseSection.appendChild(tenseGrid);
  container.appendChild(tenseSection);
  
  // Start button
  const startSection = el("div", "text-center");
  const startBtn = el("button", "btn-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed");
  startBtn.innerHTML = `
    <span class="flex items-center gap-3">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M8 5v14l11-7z"></path>
      </svg>
      Comenzar Práctica
    </span>
  `;
  startBtn.onclick = startGame;
  startBtn.disabled = !canStartGame();
  startBtn.id = "start-game-btn";
  
  startSection.appendChild(startBtn);
  container.appendChild(startSection);
  
  return container;
}

function updateVerbDifficulty(level) {
  // Update tab appearance
  document.querySelectorAll('[onclick*="updateVerbDifficulty"]').forEach((tab, index) => {
    if ((level === 1 && index === 0) || (level === 2 && index === 1)) {
      tab.className = 'px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-purple-100 text-purple-700 border-2 border-purple-300';
    } else {
      tab.className = 'px-4 py-2 rounded-xl font-medium transition-all duration-300 bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200';
    }
  });
  
  // Update verb grid
  const verbGrid = document.getElementById('verb-grid');
  if (verbGrid) {
    updateVerbGrid(verbGrid, level);
  }
}

function updateVerbGrid(container, difficulty) {
  container.innerHTML = '';
  
  const filteredVerbs = GAME_VERBS.filter(v => v.difficulty === difficulty);
  
  filteredVerbs.forEach(verb => {
    const isSelected = gameState.selectedVerbs.some(v => v.verb === verb.verb);
    const btn = el("button", `p-3 text-left rounded-xl border-2 transition-all duration-300 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'}`);
    
    const verbEl = el("div", "font-bold text-slate-800 mb-1");
    verbEl.textContent = verb.verb;
    
    const meaningEl = el("div", "text-sm text-slate-600");
    meaningEl.textContent = verb.meaning;
    
    btn.appendChild(verbEl);
    btn.appendChild(meaningEl);
    
    btn.onclick = () => toggleVerb(verb);
    container.appendChild(btn);
  });
}

function toggleVerb(verb) {
  const index = gameState.selectedVerbs.findIndex(v => v.verb === verb.verb);
  
  if (index === -1) {
    // Add verb to selection
    gameState.selectedVerbs.push(verb);
  } else {
    // Remove verb from selection
    gameState.selectedVerbs.splice(index, 1);
  }
  
  // Update button appearances
  document.querySelectorAll('#verb-grid button').forEach(btn => {
    const verbText = btn.querySelector('div').textContent;
    const isSelected = gameState.selectedVerbs.some(v => v.verb === verbText);
    
    if (isSelected) {
      btn.className = 'p-3 text-left rounded-xl border-2 transition-all duration-300 border-purple-500 bg-purple-50';
    } else {
      btn.className = 'p-3 text-left rounded-xl border-2 transition-all duration-300 border-slate-200 hover:border-purple-300 hover:bg-purple-50';
    }
  });
  
  updateStartButton();
}

function toggleSubject(subject, btn) {
  const index = gameState.selectedSubjects.findIndex(s => s.pronoun === subject.pronoun);
  
  if (index === -1) {
    gameState.selectedSubjects.push(subject);
    btn.classList.add('border-purple-500', 'bg-purple-50');
    btn.classList.remove('border-slate-200');
  } else {
    gameState.selectedSubjects.splice(index, 1);
    btn.classList.remove('border-purple-500', 'bg-purple-50');
    btn.classList.add('border-slate-200');
  }
  
  updateStartButton();
}

function selectAllSubjects() {
  gameState.selectedSubjects = [...GAME_SUBJECTS];
  
  document.querySelectorAll('#game-content button').forEach(btn => {
    if (btn.querySelector('div') && GAME_SUBJECTS.some(s => s.pronoun === btn.querySelector('div').textContent)) {
      btn.classList.add('border-purple-500', 'bg-purple-50');
      btn.classList.remove('border-slate-200');
    }
  });
  
  updateStartButton();
}

function selectEssentialSubjects() {
  gameState.selectedSubjects = GAME_SUBJECTS.slice(0, 3); // yo, tú, él/ella
  
  document.querySelectorAll('#game-content button').forEach(btn => {
    const btnText = btn.querySelector('div')?.textContent;
    if (btnText && ['yo', 'tú', 'él/ella/usted'].includes(btnText)) {
      btn.classList.add('border-purple-500', 'bg-purple-50');
      btn.classList.remove('border-slate-200');
    } else if (btnText && GAME_SUBJECTS.some(s => s.pronoun === btnText)) {
      btn.classList.remove('border-purple-500', 'bg-purple-50');
      btn.classList.add('border-slate-200');
    }
  });
  
  updateStartButton();
}

function selectTenseCollection(key) {
  gameState.selectedTenseCollection = key;
  
  // Update button appearances
  document.querySelectorAll('[onclick*="selectTenseCollection"]').forEach(btn => {
    btn.classList.remove('border-purple-500', 'bg-purple-50');
    btn.classList.add('border-slate-200');
  });
  
  event.target.closest('button').classList.add('border-purple-500', 'bg-purple-50');
  event.target.closest('button').classList.remove('border-slate-200');
  
  updateStartButton();
}

function canStartGame() {
  return gameState.selectedVerbs.length > 0 && 
         gameState.selectedSubjects.length > 0 && 
         gameState.selectedTenseCollection;
}

function updateStartButton() {
  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) {
    startBtn.disabled = !canStartGame();
  }
}

function startGame() {
  if (!canStartGame()) return;
  
  // Generate examples and questions
  generateGameContent();
  
  // Move to learning phase
  gameState.currentPhase = 'learning';
  gameState.currentExampleIndex = 0;
  
  // Re-render the game
  renderCurrentTab();
  
  showToast('¡Comenzando la práctica!', 'success');
}

function generateGameContent() {
  const collection = GAME_TENSE_COLLECTIONS[gameState.selectedTenseCollection];
  const verbs = gameState.selectedVerbs;
  const subjects = gameState.selectedSubjects;
  
  gameState.examples = [];
  gameState.questions = [];
  gameState.learningBlocks = [];
  
  // Generate examples and questions for each verb, tense and subject combination
  verbs.forEach(verb => {
    collection.tenses.forEach(tenseId => {
      const tense = TENSES.find(t => t.id === tenseId);
      if (!tense) return;
      
      const tenseExamples = [];
      const tenseQuestions = [];
      
      subjects.forEach(subject => {
        const conjugation = conjugateVerb(verb.verb, tenseId);
        if (conjugation && conjugation[subject.index]) {
          const conjugatedForm = conjugation[subject.index];
          
          // Get real example sentences for this verb and tense
          const verbSentences = GAME_EXAMPLE_SENTENCES[verb.verb];
          const tenseSentences = verbSentences && verbSentences[tenseId] 
            ? verbSentences[tenseId].filter(s => s.subject === subject.index)
            : [];
          
          // Create 2-3 examples per conjugation
          if (tenseSentences.length > 0) {
            tenseSentences.slice(0, 3).forEach(sentenceData => {
              tenseExamples.push({
                tense: tense,
                subject: subject,
                verb: verb,
                conjugation: conjugatedForm,
                sentence: sentenceData.es.replace('___', conjugatedForm),
                translation: sentenceData.en,
                originalSentence: sentenceData.es
              });
              
              // Create corresponding question
              tenseQuestions.push({
                tense: tense,
                subject: subject,
                verb: verb,
                question: sentenceData.es,
                correctAnswer: conjugatedForm,
                translation: sentenceData.en,
                hint: `${verb.meaning} (${tense.name.toLowerCase()})`
              });
            });
          } else {
            // Fallback to simple sentences if no specific examples exist
            const fallbackSentence = `${subject.pronoun} ___ ${getVerbContext(verb.verb)}.`;
            const fallbackTranslation = `${subject.meaning} ${verb.meaning} ${getVerbContext(verb.verb)}.`;
            
            tenseExamples.push({
              tense: tense,
              subject: subject,
              verb: verb,
              conjugation: conjugatedForm,
              sentence: fallbackSentence.replace('___', conjugatedForm),
              translation: fallbackTranslation,
              originalSentence: fallbackSentence
            });
            
            tenseQuestions.push({
              tense: tense,
              subject: subject,
              verb: verb,
              question: fallbackSentence,
              correctAnswer: conjugatedForm,
              translation: fallbackTranslation,
              hint: `${verb.meaning} (${tense.name.toLowerCase()})`
            });
          }
        }
      });
      
      // Add examples and questions for this tense
      gameState.examples.push(...tenseExamples);
      gameState.questions.push(...tenseQuestions);
    });
  });
  
  // Create learning blocks: alternating examples and practice
  // Group by tense for better learning flow
  const tenseGroups = {};
  gameState.examples.forEach(example => {
    const tenseId = example.tense.id;
    if (!tenseGroups[tenseId]) {
      tenseGroups[tenseId] = { examples: [], questions: [] };
    }
    tenseGroups[tenseId].examples.push(example);
  });
  
  gameState.questions.forEach(question => {
    const tenseId = question.tense.id;
    if (tenseGroups[tenseId]) {
      tenseGroups[tenseId].questions.push(question);
    }
  });
  
  // Create paired learning blocks - each example followed by its corresponding question
  Object.entries(tenseGroups).forEach(([tenseId, group]) => {
    const examples = group.examples;
    const questions = group.questions;
    
    // Create pairs of examples and their corresponding questions
    const pairs = [];
    examples.forEach(example => {
      // Find the corresponding question for this example
      const correspondingQuestion = questions.find(q => 
        q.subject.index === example.subject.index && 
        q.question === example.originalSentence
      );
      
      if (correspondingQuestion) {
        pairs.push({
          example: example,
          question: correspondingQuestion
        });
      }
    });
    
    // Shuffle the pairs to randomize the order
    const shuffledPairs = shuffleArray(pairs);
    
    // Create learning blocks: show 1-2 examples, then their corresponding questions
    let pairIndex = 0;
    while (pairIndex < shuffledPairs.length) {
      // Take 1-2 pairs for this learning cycle
      const currentPairs = shuffledPairs.slice(pairIndex, pairIndex + 2);
      
      // Add examples block
      gameState.learningBlocks.push({
        type: 'examples',
        content: currentPairs.map(pair => pair.example),
        tense: TENSES.find(t => t.id === tenseId)
      });
      
      // Add corresponding practice block
      gameState.learningBlocks.push({
        type: 'practice',
        content: currentPairs.map(pair => pair.question),
        tense: TENSES.find(t => t.id === tenseId)
      });
      
      pairIndex += 2;
    }
  });
  
  gameState.totalQuestions = gameState.questions.length;
  gameState.currentBlockIndex = 0;
  gameState.currentItemIndex = 0;
}

function generateOptions(correctAnswer, verb, tenseId, subjectIndex) {
  const options = [correctAnswer];
  
  // Add some incorrect options from the same tense but different subjects
  const conjugation = conjugateVerb(verb, tenseId);
  if (conjugation) {
    conjugation.forEach((form, index) => {
      if (index !== subjectIndex && form !== correctAnswer && !options.includes(form)) {
        options.push(form);
      }
    });
  }
  
  // Add options from other tenses if we need more
  if (options.length < 4) {
    const otherTenses = ['ind-presente', 'ind-pret-perf-sim', 'ind-imperfecto', 'ind-futuro'];
    otherTenses.forEach(otherTenseId => {
      if (otherTenseId !== tenseId && options.length < 4) {
        const otherConjugation = conjugateVerb(verb, otherTenseId);
        if (otherConjugation && otherConjugation[subjectIndex] && !options.includes(otherConjugation[subjectIndex])) {
          options.push(otherConjugation[subjectIndex]);
        }
      }
    });
  }
  
  // Ensure we have exactly 4 options, pad with variations if needed
  while (options.length < 4) {
    options.push(correctAnswer + '*'); // Placeholder - in real implementation, generate better distractors
  }
  
  return shuffleArray(options.slice(0, 4));
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getVerbContext(verb) {
  const contexts = {
    'hablar': 'con amigos',
    'comer': 'en casa',
    'vivir': 'aquí',
    'estudiar': 'mucho',
    'trabajar': 'duro',
    'beber': 'agua',
    'escribir': 'cartas',
    'leer': 'libros',
    'caminar': 'rápido',
    'correr': 'en el parque',
    'ser': 'feliz',
    'estar': 'bien',
    'tener': 'tiempo',
    'hacer': 'ejercicio',
    'ir': 'al trabajo',
    'venir': 'temprano',
    'poder': 'ayudar',
    'querer': 'aprender',
    'saber': 'la verdad',
    'decir': 'algo',
    'ver': 'películas',
    'dar': 'regalos',
    'poner': 'música'
  };
  return contexts[verb] || 'bien';
}

// Normalize answers to ignore accent marks and case
function normalizeAnswer(answer) {
  return answer.toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u')
    .replace(/ñ/g, 'n')
    .trim();
}

function resetGame() {
  // Keep same settings, regenerate content
  generateGameContent();
  gameState.currentPhase = 'learning';
  gameState.currentExampleIndex = 0;
  gameState.currentQuestionIndex = 0;
  gameState.currentBlockIndex = 0;
  gameState.currentItemIndex = 0;
  gameState.score = 0;
  gameState.correctAnswers = 0;
  gameState.userAnswers = [];
  
  renderCurrentTab();
  showToast('¡Comenzando nueva ronda!', 'success');
}

function startNewGame() {
  // Reset everything
  gameState = {
    selectedVerbs: [],
    selectedSubjects: [],
    selectedTenseCollection: null,
    currentPhase: 'setup',
    currentExampleIndex: 0,
    currentQuestionIndex: 0,
    currentBlockIndex: 0,
    currentItemIndex: 0,
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    examples: [],
    questions: [],
    userAnswers: [],
    learningBlocks: []
  };
  
  renderCurrentTab();
  showToast('¡Configurando nuevo juego!', 'info');
}