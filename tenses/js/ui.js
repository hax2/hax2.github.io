/* ------------------ UI COMPONENTS ------------------ */

function moodHeader(mood, count) {
  const wrap = el("div", "p-4 -m-6 mb-0 rounded-t-xl text-white bg-gradient-to-r " + moodColor(mood));
  const title = el("div", "flex items-center justify-between font-semibold");
  title.innerHTML = `<span>${mood}</span><span class="text-sm text-white/90">${count} ${count === 1 ? "tiempo" : "tiempos"}</span>`;
  wrap.appendChild(title);
  return wrap;
}

function TenseCard(t) {
  const card = el("div", "card-hover rounded-2xl overflow-hidden ring-1 ring-black/5 bg-gradient-to-br text-white shadow-lg " + moodColor(t.mood));

  // Enhanced header with better spacing
  const head = el("div", "p-6 pb-4");
  const title = el("div", "flex items-start justify-between gap-3");

  const nameSection = el("div", "flex-1");
  const name = el("h3", "text-xl font-bold leading-tight mb-2");
  name.textContent = t.name;
  nameSection.appendChild(name);

  // Time and aspect info
  const timeInfo = el("div", "flex items-center gap-2 text-white/80 text-sm");
  const timeChip = el("span", "chip bg-white/20 backdrop-blur-sm");
  timeChip.textContent = t.time;
  timeInfo.appendChild(timeChip);

  if (t.aspect && t.aspect !== "—") {
    const aspectChip = el("span", "chip bg-white/15 backdrop-blur-sm");
    aspectChip.textContent = t.aspect;
    timeInfo.appendChild(aspectChip);
  }
  nameSection.appendChild(timeInfo);

  const moodBadgeEl = el("span", `badge ${moodBadge(t.mood)} shadow-sm`);
  moodBadgeEl.textContent = t.mood;

  title.appendChild(nameSection);
  title.appendChild(moodBadgeEl);
  head.appendChild(title);
  card.appendChild(head);

  const body = el("div", "p-6 pt-0 space-y-4");

  // Enhanced tags with better styling
  if (t.tags && t.tags.length > 0) {
    const tags = el("div", "flex flex-wrap gap-2");
    (t.tags || []).slice(0, 4).forEach(tag => {
      const tagEl = el("span", "chip bg-white/25 backdrop-blur-sm text-xs font-medium");
      tagEl.innerHTML = `<span class="mr-1">🏷️</span>${tag}`;
      tags.appendChild(tagEl);
    });
    body.appendChild(tags);
  }

  // Enhanced usage description
  const usage = el("div", "text-white/95 text-sm leading-relaxed line-clamp-3");
  usage.textContent = (t.usage || [])[0] || "Descripción no disponible";
  body.appendChild(usage);

  // Enhanced example preview
  if (t.examples && t.examples.length > 0) {
    const examplePreview = el("div", "bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20");
    const exampleText = el("div", "text-white/90 text-sm italic font-medium");
    exampleText.textContent = `"${t.examples[0].es}"`;
    examplePreview.appendChild(exampleText);
    body.appendChild(examplePreview);
  }

  // Enhanced button
  const btnRow = el("div", "flex items-center justify-between pt-2");

  // Quick info
  const quickInfo = el("div", "text-white/70 text-xs");
  const exampleCount = (t.examples || []).length;
  quickInfo.textContent = `${exampleCount} ejemplo${exampleCount !== 1 ? 's' : ''}`;

  const btn = el("button", "btn-secondary bg-white/90 hover:bg-white text-slate-800 hover:text-slate-900 border-0 shadow-sm hover:shadow-md transition-all duration-300");
  btn.innerHTML = `
    <span class="flex items-center gap-2">
      Ver detalles
      <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    </span>
  `;
  btn.onclick = () => openDetail(t);

  btnRow.appendChild(quickInfo);
  btnRow.appendChild(btn);
  body.appendChild(btnRow);

  card.appendChild(body);
  return card;
}

function MapGrid(filter = "") {
  const data = searchAmong(TENSES, filter);
  const byMood = {};

  data.forEach(t => {
    if (!byMood[t.mood]) byMood[t.mood] = [];
    byMood[t.mood].push(t);
  });

  const container = el("div", "space-y-10");

  // Show search results summary
  if (filter) {
    const summary = el("div", "bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100");
    const summaryContent = el("div", "flex items-center justify-between");

    const info = el("div", "");
    const title = el("h3", "text-lg font-bold text-indigo-900 mb-1");
    title.textContent = `Resultados para "${filter}"`;
    const count = el("p", "text-indigo-700 text-sm");
    count.textContent = `${data.length} tiempo${data.length !== 1 ? 's' : ''} encontrado${data.length !== 1 ? 's' : ''}`;
    info.appendChild(title);
    info.appendChild(count);

    const clearBtn = el("button", "btn-secondary text-indigo-600 hover:text-indigo-800 border-indigo-200 hover:border-indigo-300");
    clearBtn.innerHTML = `
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18"></path>
          <path d="M6 6l12 12"></path>
        </svg>
        Limpiar filtro
      </span>
    `;
    clearBtn.onclick = () => {
      const searchInput = $("#search");
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
    };

    summaryContent.appendChild(info);
    summaryContent.appendChild(clearBtn);
    summary.appendChild(summaryContent);
    container.appendChild(summary);
  }

  // Show empty state if no results
  if (data.length === 0) {
    const emptyState = el("div", "text-center py-16");
    const icon = el("div", "w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center");
    icon.innerHTML = `
      <svg class="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="M21 21l-4.3-4.3"></path>
      </svg>
    `;
    const title = el("h3", "text-xl font-semibold text-slate-600 mb-2");
    title.textContent = "No se encontraron resultados";
    const desc = el("p", "text-slate-500 mb-6");
    desc.textContent = `No hay tiempos verbales que coincidan con "${filter}"`;

    const suggestions = el("div", "flex flex-wrap justify-center gap-2");
    const commonSearches = ["presente", "pasado", "futuro", "subjuntivo", "indicativo"];
    commonSearches.forEach(term => {
      const btn = el("button", "chip bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors");
      btn.textContent = term;
      btn.onclick = () => {
        const searchInput = $("#search");
        if (searchInput) {
          searchInput.value = term;
          searchInput.dispatchEvent(new Event('input'));
        }
      };
      suggestions.appendChild(btn);
    });

    emptyState.appendChild(icon);
    emptyState.appendChild(title);
    emptyState.appendChild(desc);
    emptyState.appendChild(suggestions);
    container.appendChild(emptyState);
    return container;
  }

  MOODS.forEach(mood => {
    if (!byMood[mood]) return;

    const section = el("div", "bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden");

    // Enhanced mood header
    const header = el("div", "p-8 pb-6 bg-gradient-to-r " + moodColor(mood));
    const headerContent = el("div", "flex items-center justify-between");

    const headerInfo = el("div", "");
    const moodTitle = el("h2", "text-2xl font-bold text-white mb-2");
    moodTitle.textContent = mood;
    const moodDesc = el("p", "text-white/90 text-sm");
    const descriptions = {
      "Indicativo": "Expresa hechos, realidades y certezas",
      "Subjuntivo": "Expresa deseos, dudas y posibilidades",
      "Imperativo": "Expresa órdenes y mandatos",
      "Perífrasis": "Construcciones verbales complejas",
      "No personal": "Formas no conjugadas del verbo"
    };
    moodDesc.textContent = descriptions[mood] || "";
    headerInfo.appendChild(moodTitle);
    headerInfo.appendChild(moodDesc);

    const count = el("div", "text-right");
    const countNumber = el("div", "text-3xl font-black text-white");
    countNumber.textContent = byMood[mood].length;
    const countLabel = el("div", "text-white/80 text-sm font-medium");
    countLabel.textContent = byMood[mood].length === 1 ? "tiempo" : "tiempos";
    count.appendChild(countNumber);
    count.appendChild(countLabel);

    headerContent.appendChild(headerInfo);
    headerContent.appendChild(count);
    header.appendChild(headerContent);
    section.appendChild(header);

    // Enhanced grid with better spacing
    const gridContainer = el("div", "p-8");
    const grid = el("div", "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6");
    byMood[mood].forEach(tense => {
      grid.appendChild(TenseCard(tense));
    });
    gridContainer.appendChild(grid);
    section.appendChild(gridContainer);

    container.appendChild(section);
  });

  return container;
}
function FlowChart() {
  const container = el("div", "space-y-8");

  // Enhanced header
  const header = el("div", "bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white");
  const headerContent = el("div", "text-center");

  const icon = el("div", "w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center");
  icon.innerHTML = `
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
    </svg>
  `;

  const title = el("h2", "text-3xl font-bold mb-2");
  title.textContent = "Asistente Inteligente";

  const subtitle = el("p", "text-white/90 text-lg");
  subtitle.textContent = "Encuentra el tiempo verbal perfecto respondiendo estas preguntas";

  headerContent.appendChild(icon);
  headerContent.appendChild(title);
  headerContent.appendChild(subtitle);
  header.appendChild(headerContent);
  container.appendChild(header);

  // Progress indicator
  const progressContainer = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const progressHeader = el("div", "flex items-center justify-between mb-4");

  const progressTitle = el("h3", "font-semibold text-slate-700");
  progressTitle.textContent = "Progreso";

  const progressSteps = el("div", "flex items-center gap-2");
  [1, 2].forEach((step, index) => {
    const stepEl = el("div", `w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${index === 0 ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`);
    stepEl.textContent = step;
    stepEl.id = `step-${step}`;
    progressSteps.appendChild(stepEl);

    if (index < 1) {
      const connector = el("div", "w-8 h-1 bg-slate-200 rounded transition-all duration-300");
      connector.id = `connector-${step}`;
      progressSteps.appendChild(connector);
    }
  });

  progressHeader.appendChild(progressTitle);
  progressHeader.appendChild(progressSteps);
  progressContainer.appendChild(progressHeader);
  container.appendChild(progressContainer);

  // Questions container
  const questionsContainer = el("div", "space-y-6");

  QUESTIONS.forEach((question, qIndex) => {
    const questionCard = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8 transition-all duration-300");
    questionCard.id = `question-${qIndex}`;

    // Question header
    const questionHeader = el("div", "flex items-center gap-4 mb-6");

    const questionNumber = el("div", "w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center");
    questionNumber.textContent = qIndex + 1;

    const questionInfo = el("div", "flex-1");
    const questionTitle = el("h3", "text-xl font-bold text-slate-800 mb-1");
    questionTitle.textContent = question.label;

    const questionDesc = el("p", "text-slate-600 text-sm");
    const descriptions = {
      "when": "Selecciona el momento temporal de la acción",
      "nuance": "Elige el matiz o aspecto más importante"
    };
    questionDesc.textContent = descriptions[question.id] || "";

    questionInfo.appendChild(questionTitle);
    questionInfo.appendChild(questionDesc);
    questionHeader.appendChild(questionNumber);
    questionHeader.appendChild(questionInfo);
    questionCard.appendChild(questionHeader);

    // Enhanced options grid
    const optionsGrid = el("div", "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3");

    question.options.forEach((option, optIndex) => {
      const btn = el("button", "group p-4 text-left rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 card-hover");

      const optionContent = el("div", "");
      const optionTitle = el("div", "font-semibold text-slate-800 mb-1 group-hover:text-indigo-700");
      optionTitle.textContent = option.label;

      const optionIcon = el("div", "text-2xl mb-2");
      const icons = {
        "present": "⏰", "past": "⏮️", "future": "⏭️", "timeless": "♾️", "command": "❗",
        "fact": "✅", "progress": "🔄", "completed": "✔️", "habitual": "🔁",
        "recent": "🆕", "prior": "⏪", "doubt": "❓", "hypo": "🤔"
      };
      optionIcon.textContent = icons[option.id] || "📝";

      optionContent.appendChild(optionIcon);
      optionContent.appendChild(optionTitle);
      btn.appendChild(optionContent);

      btn.onclick = () => {
        // Remove active state from all options in this question
        optionsGrid.querySelectorAll('button').forEach(b => {
          b.classList.remove('border-indigo-500', 'bg-indigo-100', 'shadow-lg');
          b.classList.add('border-slate-200');
        });

        // Add active state
        btn.classList.remove('border-slate-200');
        btn.classList.add('border-indigo-500', 'bg-indigo-100', 'shadow-lg');

        // Update progress
        updateProgress(qIndex + 1);

        // Update recommender state
        updateRecommenderSelection(question.id, option.id);

        // Show recommendations if both questions answered
        if (currentRecommenderState.when && currentRecommenderState.nuance) {
          showRecommendations();
        }

        // Smooth scroll to next question or results
        if (qIndex < QUESTIONS.length - 1) {
          setTimeout(() => {
            const nextQuestion = $(`#question-${qIndex + 1}`);
            if (nextQuestion) {
              nextQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        } else {
          setTimeout(() => {
            const results = $("#recommendations-area");
            if (results && !results.classList.contains('hidden')) {
              results.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }
      };

      optionsGrid.appendChild(btn);
    });

    questionCard.appendChild(optionsGrid);
    questionsContainer.appendChild(questionCard);
  });

  container.appendChild(questionsContainer);

  // Enhanced recommendations area
  const recommendationsDiv = el("div", "mt-8 hidden");
  recommendationsDiv.id = "recommendations-area";
  container.appendChild(recommendationsDiv);

  return container;
}

function updateProgress(currentStep) {
  // Update step indicators
  for (let i = 1; i <= 2; i++) {
    const stepEl = $(`#step-${i}`);
    const connectorEl = $(`#connector-${i}`);

    if (stepEl) {
      if (i <= currentStep) {
        stepEl.classList.remove('bg-slate-200', 'text-slate-500');
        stepEl.classList.add('bg-indigo-500', 'text-white');
      } else {
        stepEl.classList.remove('bg-indigo-500', 'text-white');
        stepEl.classList.add('bg-slate-200', 'text-slate-500');
      }
    }

    if (connectorEl) {
      if (i < currentStep) {
        connectorEl.classList.remove('bg-slate-200');
        connectorEl.classList.add('bg-indigo-500');
      } else {
        connectorEl.classList.remove('bg-indigo-500');
        connectorEl.classList.add('bg-slate-200');
      }
    }
  }
}
function showRecommendations() {
  const area = $("#recommendations-area");
  if (!area) return;

  const recommendations = getCurrentRecommendations();
  const recommendedTenses = TENSES.filter(t => recommendations.includes(t.id));

  area.innerHTML = "";
  area.classList.remove("hidden");

  // Enhanced results container
  const resultsContainer = el("div", "bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 shadow-lg");

  // Success header
  const header = el("div", "text-center mb-8");
  const successIcon = el("div", "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center");
  successIcon.innerHTML = `
    <svg class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
  `;

  const title = el("h3", "text-2xl font-bold text-green-900 mb-2");
  title.textContent = "¡Recomendaciones encontradas!";

  const subtitle = el("p", "text-green-700");
  subtitle.textContent = `Basado en tus respuestas, estos son los ${recommendedTenses.length} tiempo${recommendedTenses.length !== 1 ? 's' : ''} más adecuado${recommendedTenses.length !== 1 ? 's' : ''}:`;

  header.appendChild(successIcon);
  header.appendChild(title);
  header.appendChild(subtitle);
  resultsContainer.appendChild(header);

  if (recommendedTenses.length === 0) {
    const noResults = el("div", "text-center py-8");
    const sadIcon = el("div", "text-6xl mb-4");
    sadIcon.textContent = "🤔";
    const message = el("p", "text-slate-600 text-lg");
    message.textContent = "No se encontraron recomendaciones específicas para esta combinación.";
    const suggestion = el("p", "text-slate-500 text-sm mt-2");
    suggestion.textContent = "Intenta con diferentes opciones o consulta el mapa visual.";

    noResults.appendChild(sadIcon);
    noResults.appendChild(message);
    noResults.appendChild(suggestion);
    resultsContainer.appendChild(noResults);
    area.appendChild(resultsContainer);
    return;
  }

  // Enhanced recommendations grid
  const grid = el("div", "grid grid-cols-1 md:grid-cols-2 gap-6");
  recommendedTenses.forEach((tense, index) => {
    const card = el("div", "bg-white rounded-2xl p-6 shadow-md border border-white/50 card-hover");

    // Priority indicator
    const priority = el("div", "flex items-center justify-between mb-4");
    const priorityBadge = el("span", `chip ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gradient-to-r from-blue-400 to-indigo-400'} text-white font-bold`);
    priorityBadge.innerHTML = `${index === 0 ? '⭐ Recomendado' : '✨ Alternativa'}`;

    const moodBadgeEl = el("span", `badge ${moodBadge(tense.mood)}`);
    moodBadgeEl.textContent = tense.mood;

    priority.appendChild(priorityBadge);
    priority.appendChild(moodBadgeEl);
    card.appendChild(priority);

    // Tense info
    const name = el("h4", "text-xl font-bold text-slate-800 mb-3");
    name.textContent = tense.name;
    card.appendChild(name);

    const usage = el("p", "text-slate-600 mb-4 leading-relaxed");
    usage.textContent = (tense.usage || [])[0] || "";
    card.appendChild(usage);

    // Example preview
    if (tense.examples && tense.examples.length > 0) {
      const exampleBox = el("div", "bg-slate-50 rounded-xl p-4 mb-4 border-l-4 border-indigo-400");
      const exampleLabel = el("div", "text-xs font-semibold text-slate-500 mb-1");
      exampleLabel.textContent = "EJEMPLO";
      const exampleText = el("div", "text-slate-800 font-medium italic");
      exampleText.textContent = `"${tense.examples[0].es}"`;
      const exampleTranslation = el("div", "text-slate-600 text-sm mt-1");
      exampleTranslation.textContent = tense.examples[0].en;

      exampleBox.appendChild(exampleLabel);
      exampleBox.appendChild(exampleText);
      exampleBox.appendChild(exampleTranslation);
      card.appendChild(exampleBox);
    }

    // Action button
    const btn = el("button", "btn-primary w-full justify-center");
    btn.innerHTML = `
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <path d="M10 17l5-5-5-5"></path>
          <path d="M15 12H3"></path>
        </svg>
        Explorar ${tense.name}
      </span>
    `;
    btn.onclick = () => openDetail(tense);
    card.appendChild(btn);

    grid.appendChild(card);
  });

  resultsContainer.appendChild(grid);

  // Enhanced explanation
  const explanation = getRecommendationExplanation(currentRecommenderState);
  if (explanation) {
    const explContainer = el("div", "mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/50");
    const explHeader = el("div", "flex items-center gap-3 mb-3");
    const explIcon = el("div", "w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center");
    explIcon.innerHTML = `
      <svg class="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 16v-4"></path>
        <path d="M12 8h.01"></path>
      </svg>
    `;
    const explTitle = el("h4", "font-semibold text-slate-800");
    explTitle.textContent = "¿Por qué estas recomendaciones?";

    explHeader.appendChild(explIcon);
    explHeader.appendChild(explTitle);
    explContainer.appendChild(explHeader);

    const explText = el("p", "text-slate-700 leading-relaxed");
    explText.textContent = explanation;
    explContainer.appendChild(explText);

    resultsContainer.appendChild(explContainer);
  }

  // Reset button
  const resetContainer = el("div", "mt-6 text-center");
  const resetBtn = el("button", "btn-secondary");
  resetBtn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 21v-5h-5"></path>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
        <path d="M3 3v5h5"></path>
      </svg>
      Empezar de nuevo
    </span>
  `;
  resetBtn.onclick = () => {
    resetRecommender();
    renderCurrentTab();
  };
  resetContainer.appendChild(resetBtn);
  resultsContainer.appendChild(resetContainer);

  area.appendChild(resultsContainer);
}

function ReferenceTable() {
  const container = el("div", "space-y-8");

  // Enhanced header
  const header = el("div", "bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 text-white");
  const headerContent = el("div", "text-center");

  const icon = el("div", "w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center");
  icon.innerHTML = `
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <path d="M14 2v6h6"></path>
      <path d="M16 13H8"></path>
      <path d="M16 17H8"></path>
      <path d="M10 9H8"></path>
    </svg>
  `;

  const title = el("h2", "text-3xl font-bold mb-2");
  title.textContent = "Referencia Completa";

  const subtitle = el("p", "text-white/90 text-lg");
  subtitle.textContent = "Consulta rápida de todos los tiempos verbales del español";

  headerContent.appendChild(icon);
  headerContent.appendChild(title);
  headerContent.appendChild(subtitle);
  header.appendChild(headerContent);
  container.appendChild(header);

  // Enhanced filter controls
  const filterContainer = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");

  const filterHeader = el("div", "flex items-center gap-3 mb-4");
  const filterIcon = el("div", "w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center");
  filterIcon.innerHTML = `
    <svg class="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 3H2l8 9v7l4 2v-9l8-9z"></path>
    </svg>
  `;
  const filterTitle = el("h3", "font-semibold text-slate-800");
  filterTitle.textContent = "Filtrar por modo";

  filterHeader.appendChild(filterIcon);
  filterHeader.appendChild(filterTitle);
  filterContainer.appendChild(filterHeader);

  const filterDiv = el("div", "flex flex-wrap gap-3");

  const allBtn = el("button", "reference-filter-btn chip bg-indigo-500 text-white hover:bg-indigo-600 transition-colors");
  allBtn.textContent = "Todos";
  allBtn.onclick = () => updateReferenceFilter("");
  filterDiv.appendChild(allBtn);

  MOODS.forEach(mood => {
    const btn = el("button", "reference-filter-btn chip bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors");
    btn.textContent = mood;
    btn.onclick = () => updateReferenceFilter(mood);
    filterDiv.appendChild(btn);
  });

  filterContainer.appendChild(filterDiv);
  container.appendChild(filterContainer);

  // Enhanced table container
  const tableCard = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden");

  const tableHeader = el("div", "bg-slate-50 px-6 py-4 border-b border-slate-200");
  const tableTitle = el("h3", "font-semibold text-slate-800");
  tableTitle.textContent = "Tabla de Referencia";
  tableHeader.appendChild(tableTitle);
  tableCard.appendChild(tableHeader);

  const tableContainer = el("div", "overflow-x-auto custom-scrollbar");
  const table = el("table", "w-full");

  // Enhanced header
  const thead = el("thead", "bg-slate-50");
  const headerRow = el("tr", "");
  const headers = [
    { text: "Tiempo Verbal", icon: "📝" },
    { text: "Modo", icon: "🎭" },
    { text: "Uso Principal", icon: "💡" },
    { text: "Formación", icon: "🔧" },
    { text: "Ejemplo", icon: "💬" }
  ];

  headers.forEach(header => {
    const th = el("th", "text-left p-4 font-semibold text-slate-700 border-b border-slate-200");
    const headerContent = el("div", "flex items-center gap-2");
    const icon = el("span", "text-sm");
    icon.textContent = header.icon;
    const text = el("span", "");
    text.textContent = header.text;
    headerContent.appendChild(icon);
    headerContent.appendChild(text);
    th.appendChild(headerContent);
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Enhanced body
  const tbody = el("tbody", "divide-y divide-slate-100");
  tbody.id = "reference-table-body";
  table.appendChild(tbody);

  tableContainer.appendChild(table);
  tableCard.appendChild(tableContainer);
  container.appendChild(tableCard);

  // Stats footer
  const statsContainer = el("div", "bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100");
  const statsGrid = el("div", "grid grid-cols-2 md:grid-cols-4 gap-4 text-center");

  const stats = [
    { label: "Total Tiempos", value: TENSES.length, icon: "📊" },
    { label: "Modos", value: MOODS.length, icon: "🎭" },
    { label: "Indicativo", value: TENSES.filter(t => t.mood === "Indicativo").length, icon: "✅" },
    { label: "Subjuntivo", value: TENSES.filter(t => t.mood === "Subjuntivo").length, icon: "❓" }
  ];

  stats.forEach(stat => {
    const statCard = el("div", "");
    const statIcon = el("div", "text-2xl mb-1");
    statIcon.textContent = stat.icon;
    const statValue = el("div", "text-2xl font-bold text-indigo-600");
    statValue.textContent = stat.value;
    const statLabel = el("div", "text-sm text-slate-600 font-medium");
    statLabel.textContent = stat.label;

    statCard.appendChild(statIcon);
    statCard.appendChild(statValue);
    statCard.appendChild(statLabel);
    statsGrid.appendChild(statCard);
  });

  statsContainer.appendChild(statsGrid);
  container.appendChild(statsContainer);

  // Initial load
  updateReferenceFilter("");

  return container;
}

// VERB MASTERY GAME COMPONENTS
function VerbMasteryGame() {
  const container = el("div", "space-y-8");

  // Game header
  const header = el("div", "bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white");
  const headerContent = el("div", "text-center");

  const icon = el("div", "w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center");
  icon.innerHTML = `
    <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  `;

  const title = el("h2", "text-3xl font-bold mb-2");
  title.textContent = "Maestría de Verbos";

  const subtitle = el("p", "text-white/90 text-lg");
  subtitle.textContent = "Domina la conjugación con práctica interactiva";

  headerContent.appendChild(icon);
  headerContent.appendChild(title);
  headerContent.appendChild(subtitle);
  header.appendChild(headerContent);
  container.appendChild(header);

  // Game content based on current phase
  const gameContent = el("div", "");
  gameContent.id = "game-content";

  switch (gameState.currentPhase) {
    case 'setup':
      gameContent.appendChild(GameSetup());
      break;
    case 'learning':
      gameContent.appendChild(GameLearning());
      break;
    case 'practice':
      gameContent.appendChild(GameLearning()); // Now handles both learning and practice
      break;
    case 'results':
      gameContent.appendChild(GameResults());
      break;
    default:
      gameContent.appendChild(GameSetup());
  }

  container.appendChild(gameContent);
  return container;
}

function updateReferenceFilter(moodFilter) {
  const tbody = $("#reference-table-body");
  if (!tbody) return;

  const filteredTenses = moodFilter ?
    TENSES.filter(t => t.mood === moodFilter) :
    TENSES;

  tbody.innerHTML = "";

  filteredTenses.forEach(tense => {
    const row = el("tr", "hover:bg-slate-50 cursor-pointer transition-colors");

    // Name
    const nameCell = el("td", "p-4 font-semibold text-slate-800");
    nameCell.textContent = tense.name;
    row.appendChild(nameCell);

    // Mood
    const moodCell = el("td", "p-4");
    const moodBadgeEl = el("span", `badge ${moodBadge(tense.mood)} shadow-sm`);
    moodBadgeEl.textContent = tense.mood;
    moodCell.appendChild(moodBadgeEl);
    row.appendChild(moodCell);

    // Usage
    const usageCell = el("td", "p-4 text-slate-600 max-w-xs");
    const usageText = el("div", "line-clamp-2 leading-relaxed");
    usageText.textContent = (tense.usage || [])[0] || "";
    usageCell.appendChild(usageText);
    row.appendChild(usageCell);

    // Formation
    const formationCell = el("td", "p-4 text-slate-600 font-mono text-xs max-w-xs");
    const formationText = el("div", "line-clamp-2 bg-slate-50 rounded px-2 py-1");
    formationText.textContent = tense.formation || "";
    formationCell.appendChild(formationText);
    row.appendChild(formationCell);

    // Example
    const exampleCell = el("td", "p-4 text-slate-600 max-w-sm");
    const example = (tense.examples || [])[0];
    if (example) {
      const exampleContainer = el("div", "");
      const spanishText = el("div", "italic font-medium text-slate-800 mb-1");
      spanishText.textContent = `"${example.es}"`;
      const englishText = el("div", "text-xs text-slate-500");
      englishText.textContent = example.en;
      exampleContainer.appendChild(spanishText);
      exampleContainer.appendChild(englishText);
      exampleCell.appendChild(exampleContainer);
    }
    row.appendChild(exampleCell);

    // Add click handler for row
    row.onclick = () => openDetail(tense);

    tbody.appendChild(row);
  });

  // Update filter button states
  const filterButtons = $$(".reference-filter-btn");
  filterButtons.forEach(btn => {
    btn.classList.remove("bg-indigo-500", "text-white");
    btn.classList.add("bg-slate-200", "text-slate-700");

    if ((moodFilter === "" && btn.textContent === "Todos") ||
      btn.textContent === moodFilter) {
      btn.classList.remove("bg-slate-200", "text-slate-700");
      btn.classList.add("bg-indigo-500", "text-white");
    }
  });
}
function GameLearning() {
  const container = el("div", "space-y-8");

  if (gameState.currentBlockIndex >= gameState.learningBlocks.length) {
    // All blocks completed, show results
    gameState.currentPhase = 'results';
    gameState.score = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
    // Don't call renderCurrentTab() here, let the switch statement handle it
    return GameResults();
  }

  const currentBlock = gameState.learningBlocks[gameState.currentBlockIndex];

  // Progress bar
  const progressSection = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const progressHeader = el("div", "flex items-center justify-between mb-4");

  const progressTitle = el("h3", "font-semibold text-slate-800");
  progressTitle.textContent = currentBlock.type === 'examples' ? "Aprendiendo" : "Practicando";

  const progressCounter = el("div", "text-sm text-slate-600");
  progressCounter.textContent = `Bloque ${gameState.currentBlockIndex + 1} de ${gameState.learningBlocks.length}`;

  progressHeader.appendChild(progressTitle);
  progressHeader.appendChild(progressCounter);
  progressSection.appendChild(progressHeader);

  const progressBar = el("div", "w-full bg-slate-200 rounded-full h-2");
  const progressFill = el("div", "bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300");
  progressFill.style.width = `${((gameState.currentBlockIndex + 1) / gameState.learningBlocks.length) * 100}%`;
  progressBar.appendChild(progressFill);
  progressSection.appendChild(progressBar);

  container.appendChild(progressSection);

  if (currentBlock.type === 'examples') {
    container.appendChild(renderExampleBlock(currentBlock));
  } else {
    container.appendChild(renderPracticeBlock(currentBlock));
  }

  return container;
}

function renderExampleBlock(block) {
  const container = el("div", "space-y-6");

  // Check if we've finished all examples in this block
  if (gameState.currentItemIndex >= block.content.length) {
    // Finished this example block, move to next block
    gameState.currentBlockIndex++;
    gameState.currentItemIndex = 0;
    return GameLearning();
  }

  const currentExample = block.content[gameState.currentItemIndex];

  // Progress within block
  const blockProgress = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const blockHeader = el("div", "flex items-center justify-between mb-4");

  const blockTitle = el("h3", "font-semibold text-slate-800");
  blockTitle.textContent = `Aprendiendo: ${block.tense.name}`;

  const blockCounter = el("div", "text-sm text-slate-600");
  blockCounter.textContent = `Ejemplo ${gameState.currentItemIndex + 1} de ${block.content.length}`;

  blockHeader.appendChild(blockTitle);
  blockHeader.appendChild(blockCounter);
  blockProgress.appendChild(blockHeader);

  const blockBar = el("div", "w-full bg-slate-200 rounded-full h-2");
  const blockFill = el("div", "bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300");
  blockFill.style.width = `${((gameState.currentItemIndex + 1) / block.content.length) * 100}%`;
  blockBar.appendChild(blockFill);
  blockProgress.appendChild(blockBar);

  container.appendChild(blockProgress);

  // Tense header
  const tenseHeader = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const headerContent = el("div", "flex items-center gap-4");

  const tenseIcon = el("div", "w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center");
  tenseIcon.innerHTML = `
    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
    </svg>
  `;

  const tenseInfo = el("div", "flex-1");
  const tenseName = el("h3", "text-xl font-bold text-slate-800 mb-1");
  tenseName.textContent = block.tense.name;

  const tenseUsage = el("p", "text-slate-600 text-sm");
  tenseUsage.textContent = (block.tense.usage || [])[0] || "";

  tenseInfo.appendChild(tenseName);
  tenseInfo.appendChild(tenseUsage);

  headerContent.appendChild(tenseIcon);
  headerContent.appendChild(tenseInfo);
  tenseHeader.appendChild(headerContent);
  container.appendChild(tenseHeader);

  // Current example
  const exampleCard = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");

  // Example sentence
  const sentenceSection = el("div", "bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6");
  const sentenceLabel = el("div", "text-sm font-semibold text-purple-700 mb-2");
  sentenceLabel.textContent = `EJEMPLO ${gameState.currentItemIndex + 1}`;

  const sentence = el("div", "text-2xl font-bold text-slate-800 mb-3");
  sentence.textContent = currentExample.sentence;

  const translation = el("div", "text-slate-600 text-lg mb-4");
  translation.textContent = currentExample.translation;

  // Add TTS button for the example sentence
  const ttsButton = createTTSButton(currentExample.sentence, "btn-secondary text-sm");

  sentenceSection.appendChild(sentenceLabel);
  sentenceSection.appendChild(sentence);
  sentenceSection.appendChild(translation);
  sentenceSection.appendChild(ttsButton);
  exampleCard.appendChild(sentenceSection);

  // Auto-play TTS for the example sentence after a short delay
  setTimeout(() => {
    speakText(currentExample.sentence);
  }, 1000);

  // Conjugation breakdown
  const breakdownSection = el("div", "bg-slate-50 rounded-xl p-6");
  const breakdownTitle = el("h4", "font-semibold text-slate-800 mb-4");
  breakdownTitle.textContent = "Análisis";

  const breakdownGrid = el("div", "grid grid-cols-1 md:grid-cols-3 gap-4");

  const verbInfo = el("div", "text-center");
  const verbLabel = el("div", "text-xs font-semibold text-slate-500 mb-1");
  verbLabel.textContent = "VERBO";
  const verbValue = el("div", "font-bold text-slate-800");
  verbValue.textContent = currentExample.verb.verb;
  verbInfo.appendChild(verbLabel);
  verbInfo.appendChild(verbValue);

  const subjectInfo = el("div", "text-center");
  const subjectLabel = el("div", "text-xs font-semibold text-slate-500 mb-1");
  subjectLabel.textContent = "SUJETO";
  const subjectValue = el("div", "font-bold text-slate-800");
  subjectValue.textContent = currentExample.subject.pronoun;
  subjectInfo.appendChild(subjectLabel);
  subjectInfo.appendChild(subjectValue);

  const conjugationInfo = el("div", "text-center");
  const conjugationLabel = el("div", "text-xs font-semibold text-slate-500 mb-1");
  conjugationLabel.textContent = "CONJUGACIÓN";
  const conjugationValue = el("div", "font-bold text-purple-600 text-lg");
  conjugationValue.textContent = currentExample.conjugation;
  conjugationInfo.appendChild(conjugationLabel);
  conjugationInfo.appendChild(conjugationValue);

  breakdownGrid.appendChild(verbInfo);
  breakdownGrid.appendChild(subjectInfo);
  breakdownGrid.appendChild(conjugationInfo);

  breakdownSection.appendChild(breakdownTitle);
  breakdownSection.appendChild(breakdownGrid);
  exampleCard.appendChild(breakdownSection);

  container.appendChild(exampleCard);

  // Navigation
  const navSection = el("div", "flex justify-center");
  const nextBtn = el("button", "btn-primary text-lg px-8 py-4");

  // Check if this is the last example in the block
  const isLastExample = gameState.currentItemIndex >= block.content.length - 1;

  nextBtn.innerHTML = `
    <span class="flex items-center gap-2">
      ${isLastExample ? '¡Ahora practica!' : 'Siguiente ejemplo'}
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    </span>
  `;

  nextBtn.onclick = () => {
    gameState.currentItemIndex++;
    renderCurrentTab();
  };

  navSection.appendChild(nextBtn);
  container.appendChild(navSection);

  return container;
}

function renderPracticeBlock(block) {
  const container = el("div", "space-y-6");

  if (gameState.currentItemIndex >= block.content.length) {
    // Finished this practice block
    gameState.currentBlockIndex++;
    gameState.currentItemIndex = 0;
    // Return the next block content instead of empty container
    return GameLearning();
  }

  const currentQuestion = block.content[gameState.currentItemIndex];

  // Progress within block
  const blockProgress = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-6");
  const blockHeader = el("div", "flex items-center justify-between mb-4");

  const blockTitle = el("h3", "font-semibold text-slate-800");
  blockTitle.textContent = `Practicando: ${block.tense.name}`;

  const blockCounter = el("div", "text-sm text-slate-600");
  blockCounter.textContent = `Pregunta ${gameState.currentItemIndex + 1} de ${block.content.length}`;

  blockHeader.appendChild(blockTitle);
  blockHeader.appendChild(blockCounter);
  blockProgress.appendChild(blockHeader);

  const blockBar = el("div", "w-full bg-slate-200 rounded-full h-2");
  const blockFill = el("div", "bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300");
  blockFill.style.width = `${((gameState.currentItemIndex + 1) / block.content.length) * 100}%`;
  blockBar.appendChild(blockFill);
  blockProgress.appendChild(blockBar);

  container.appendChild(blockProgress);

  // Question card
  const questionCard = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");

  // Question header
  const questionHeader = el("div", "text-center mb-8");
  const tenseChip = el("span", `badge ${moodBadge(currentQuestion.tense.mood)} mb-4`);
  tenseChip.textContent = currentQuestion.tense.name;

  const questionTitle = el("h3", "text-2xl font-bold text-slate-800 mb-2");
  questionTitle.textContent = "Completa la oración";

  const questionHint = el("p", "text-slate-600");
  questionHint.textContent = currentQuestion.hint;

  questionHeader.appendChild(tenseChip);
  questionHeader.appendChild(questionTitle);
  questionHeader.appendChild(questionHint);
  questionCard.appendChild(questionHeader);

  // Question sentence with fill-in-the-blank
  const sentenceSection = el("div", "bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-8");
  const sentence = el("div", "text-2xl font-bold text-slate-800 mb-4 text-center");

  // Create the sentence with an input field
  const parts = currentQuestion.question.split('___');
  const sentenceContainer = el("div", "flex flex-wrap items-center justify-center gap-2");

  parts.forEach((part, index) => {
    if (part) {
      const textSpan = el("span", "");
      textSpan.textContent = part;
      sentenceContainer.appendChild(textSpan);
    }

    if (index < parts.length - 1) {
      const input = el("input", "border-2 border-purple-300 rounded-lg px-4 py-2 text-xl font-bold text-center min-w-32 focus:border-purple-500 focus:outline-none");
      input.type = "text";
      input.placeholder = "?";
      input.id = "answer-input";
      input.autocomplete = "off";
      input.spellcheck = false;

      // Auto-focus and handle enter key
      setTimeout(() => input.focus(), 100);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          checkFillInAnswer();
        }
      });

      sentenceContainer.appendChild(input);
    }
  });

  sentence.appendChild(sentenceContainer);
  sentenceSection.appendChild(sentence);

  // Translation
  const translation = el("div", "text-slate-600 text-center text-lg mt-4 mb-4");
  translation.textContent = currentQuestion.translation;
  sentenceSection.appendChild(translation);

  // Add TTS button for the question sentence (with correct answer filled in)
  const completeSentence = currentQuestion.question.replace('___', currentQuestion.correctAnswer);
  const ttsButton = createTTSButton(completeSentence, "btn-secondary text-sm mx-auto");
  const ttsContainer = el("div", "text-center");
  ttsContainer.appendChild(ttsButton);
  sentenceSection.appendChild(ttsContainer);

  questionCard.appendChild(sentenceSection);

  // Submit button
  const submitSection = el("div", "text-center");
  const submitBtn = el("button", "btn-primary text-lg px-8 py-4");
  submitBtn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      Comprobar respuesta
    </span>
  `;
  submitBtn.onclick = checkFillInAnswer;

  submitSection.appendChild(submitBtn);
  questionCard.appendChild(submitSection);

  container.appendChild(questionCard);

  return container;
}

function checkFillInAnswer() {
  const input = document.getElementById('answer-input');
  if (!input) return;

  const userAnswer = input.value.trim();
  if (!userAnswer) {
    showToast('Por favor, escribe tu respuesta', 'warning');
    return;
  }

  const currentBlock = gameState.learningBlocks[gameState.currentBlockIndex];
  const currentQuestion = currentBlock.content[gameState.currentItemIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer);

  // Record the answer
  gameState.userAnswers.push({
    question: currentQuestion,
    selectedAnswer: userAnswer,
    correctAnswer: correctAnswer,
    isCorrect: isCorrect
  });

  // Update score
  if (isCorrect) {
    gameState.correctAnswers++;
    input.classList.add('border-green-500', 'bg-green-50');
    showToast('¡Correcto!', 'success', 2000);
  } else {
    input.classList.add('border-red-500', 'bg-red-50');
    showToast(`Incorrecto. La respuesta era: ${correctAnswer}`, 'error', 4000);
  }

  // Disable input and show correct answer
  input.disabled = true;
  if (!isCorrect) {
    const correctSpan = el("span", "ml-2 text-green-600 font-bold");
    correctSpan.textContent = `(${correctAnswer})`;
    input.parentElement.appendChild(correctSpan);
  }

  // Play TTS with the correct sentence after a short delay
  setTimeout(() => {
    const completeSentence = currentQuestion.question.replace('___', correctAnswer);
    speakText(completeSentence);
  }, 1000);

  // Move to next question after delay
  setTimeout(() => {
    gameState.currentItemIndex++;
    renderCurrentTab();
  }, isCorrect ? 2000 : 4000);
}



function GameResults() {
  const container = el("div", "space-y-8");

  // Results header
  const headerCard = el("div", "bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center");

  const resultIcon = el("div", "w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center");

  let iconContent, title, subtitle;
  if (gameState.score >= 90) {
    iconContent = `<svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`;
    title = "¡Excelente!";
    subtitle = "Dominas este verbo perfectamente";
  } else if (gameState.score >= 70) {
    iconContent = `<svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.03 0 3.89.67 5.39 1.8"></path></svg>`;
    title = "¡Muy bien!";
    subtitle = "Buen progreso, sigue practicando";
  } else {
    iconContent = `<svg class="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`;
    title = "Sigue practicando";
    subtitle = "La práctica hace al maestro";
  }

  resultIcon.innerHTML = iconContent;

  const titleEl = el("h2", "text-3xl font-bold mb-2");
  titleEl.textContent = title;

  const subtitleEl = el("p", "text-white/90 text-lg mb-6");
  subtitleEl.textContent = subtitle;

  const scoreEl = el("div", "text-6xl font-black mb-2");
  scoreEl.textContent = `${gameState.score}%`;

  const scoreLabel = el("div", "text-white/80");
  scoreLabel.textContent = `${gameState.correctAnswers} de ${gameState.totalQuestions} correctas`;

  headerCard.appendChild(resultIcon);
  headerCard.appendChild(titleEl);
  headerCard.appendChild(subtitleEl);
  headerCard.appendChild(scoreEl);
  headerCard.appendChild(scoreLabel);
  container.appendChild(headerCard);

  // Detailed results
  const detailsCard = el("div", "bg-white rounded-2xl shadow-lg border border-slate-100 p-8");
  const detailsTitle = el("h3", "text-xl font-bold text-slate-800 mb-6");
  detailsTitle.textContent = "Resumen detallado";
  detailsCard.appendChild(detailsTitle);

  // Stats grid
  const statsGrid = el("div", "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8");

  const stats = [
    { label: "Puntuación", value: `${gameState.score}%`, color: "text-purple-600" },
    { label: "Correctas", value: gameState.correctAnswers, color: "text-green-600" },
    { label: "Incorrectas", value: gameState.totalQuestions - gameState.correctAnswers, color: "text-red-600" },
    { label: "Total", value: gameState.totalQuestions, color: "text-slate-800" }
  ];

  stats.forEach(stat => {
    const statCard = el("div", "text-center p-4 bg-slate-50 rounded-xl");
    const statValue = el("div", `text-2xl font-bold ${stat.color}`);
    statValue.textContent = stat.value;
    const statLabel = el("div", "text-sm text-slate-600 mt-1");
    statLabel.textContent = stat.label;

    statCard.appendChild(statValue);
    statCard.appendChild(statLabel);
    statsGrid.appendChild(statCard);
  });

  detailsCard.appendChild(statsGrid);

  // Review incorrect answers
  const incorrectAnswers = gameState.userAnswers.filter(a => !a.isCorrect);
  if (incorrectAnswers.length > 0) {
    const reviewTitle = el("h4", "font-semibold text-slate-800 mb-4");
    reviewTitle.textContent = "Respuestas para revisar";
    detailsCard.appendChild(reviewTitle);

    const reviewList = el("div", "space-y-3");
    incorrectAnswers.forEach(answer => {
      const reviewItem = el("div", "p-4 bg-red-50 border border-red-200 rounded-xl");

      const questionText = el("div", "font-medium text-slate-800 mb-2");
      questionText.textContent = answer.question.question.replace('_____', `[${answer.question.subject.pronoun}]`);

      const answerInfo = el("div", "flex items-center gap-4 text-sm");
      const yourAnswer = el("span", "text-red-600");
      yourAnswer.innerHTML = `Tu respuesta: <strong>${answer.selectedAnswer}</strong>`;
      const correctAnswer = el("span", "text-green-600");
      correctAnswer.innerHTML = `Correcto: <strong>${answer.correctAnswer}</strong>`;

      answerInfo.appendChild(yourAnswer);
      answerInfo.appendChild(correctAnswer);

      reviewItem.appendChild(questionText);
      reviewItem.appendChild(answerInfo);
      reviewList.appendChild(reviewItem);
    });

    detailsCard.appendChild(reviewList);
  }

  container.appendChild(detailsCard);

  // Action buttons
  const actionsSection = el("div", "flex flex-col sm:flex-row gap-4 justify-center");

  const playAgainBtn = el("button", "btn-primary");
  playAgainBtn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 21v-5h-5"></path>
      </svg>
      Jugar de nuevo
    </span>
  `;
  playAgainBtn.onclick = resetGame;

  const newGameBtn = el("button", "btn-secondary");
  newGameBtn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 5v14"></path>
        <path d="M5 12h14"></path>
      </svg>
      Nuevo juego
    </span>
  `;
  newGameBtn.onclick = startNewGame;

  actionsSection.appendChild(playAgainBtn);
  actionsSection.appendChild(newGameBtn);
  container.appendChild(actionsSection);

  return container;
}