/* ------------------ RECOMMENDER ------------------ */

const QUESTIONS = [
  { 
    id: "when", 
    label: "¿Cuándo ocurre la acción?", 
    options: [
      { id: "present", label: "Ahora / habitual" },
      { id: "past", label: "Pasado" },
      { id: "future", label: "Futuro / intención" },
      { id: "timeless", label: "Atemporal / genérico" },
      { id: "command", label: "Orden / prohibición" },
    ]
  },
  { 
    id: "nuance", 
    label: "Matiz principal", 
    options: [
      { id: "fact", label: "Hecho/certeza" },
      { id: "progress", label: "En progreso" },
      { id: "completed", label: "Completado" },
      { id: "habitual", label: "Habitual / contexto" },
      { id: "recent", label: "Reciente / conecta con ahora" },
      { id: "prior", label: "Anterior a otro evento" },
      { id: "doubt", label: "Deseo/duda/valoración" },
      { id: "hypo", label: "Hipótesis / irreal" },
    ]
  },
];

function recommend(selection) {
  const { when, nuance } = selection;
  const out = [];
  
  if (when === "past") {
    if (nuance === "completed") out.push("ind-pret-perf-sim");
    if (nuance === "habitual" || nuance === "progress") out.push("ind-imperfecto");
    if (nuance === "recent") out.push("ind-pret-perf-comp");
    if (nuance === "prior") out.push("ind-pluscuam");
    if (nuance === "doubt") out.push("subj-imperf");
    if (nuance === "hypo") out.push("ind-cond-comp", "subj-pluscuam");
  }
  
  if (when === "present") {
    if (nuance === "fact" || nuance === "habitual") out.push("ind-presente");
    if (nuance === "progress") out.push("perif-prog");
    if (nuance === "doubt") out.push("subj-presente");
    if (nuance === "recent") out.push("ind-pret-perf-comp");
  }
  
  if (when === "future") {
    if (nuance === "fact") out.push("ind-futuro");
    if (nuance === "recent" || nuance === "progress") out.push("perif-ir-a");
    if (nuance === "prior") out.push("ind-futuro-comp");
    if (nuance === "hypo") out.push("ind-cond");
    if (nuance === "doubt") out.push("subj-presente");
  }
  
  if (when === "timeless") {
    if (nuance === "fact" || nuance === "habitual") out.push("ind-presente", "nf-inf");
  }
  
  if (when === "command") {
    if (!nuance || nuance === "fact") out.push("imp-afirm");
    out.push("imp-neg");
  }
  
  return [...new Set(out)];
}

function getRecommendationExplanation(selection) {
  const { when, nuance } = selection;
  const explanations = [];
  
  if (when === "past") {
    if (nuance === "completed") {
      explanations.push("Para acciones completadas en el pasado, usa el pretérito perfecto simple.");
    }
    if (nuance === "habitual" || nuance === "progress") {
      explanations.push("Para hábitos o acciones en progreso en el pasado, usa el imperfecto.");
    }
    if (nuance === "recent") {
      explanations.push("Para el pasado reciente conectado al presente, usa el pretérito perfecto compuesto.");
    }
  }
  
  if (when === "present") {
    if (nuance === "fact" || nuance === "habitual") {
      explanations.push("Para hechos actuales o hábitos, usa el presente de indicativo.");
    }
    if (nuance === "progress") {
      explanations.push("Para acciones en progreso, usa estar + gerundio.");
    }
  }
  
  if (when === "future") {
    if (nuance === "fact") {
      explanations.push("Para predicciones futuras, usa el futuro simple.");
    }
    if (nuance === "recent" || nuance === "progress") {
      explanations.push("Para planes inmediatos, usa ir a + infinitivo.");
    }
  }
  
  return explanations.join(" ");
}

// Interactive recommender state
let currentRecommenderState = {
  when: null,
  nuance: null,
  step: 0
};

function resetRecommender() {
  currentRecommenderState = {
    when: null,
    nuance: null,
    step: 0
  };
}

function updateRecommenderSelection(questionId, optionId) {
  currentRecommenderState[questionId] = optionId;
  
  // Auto-advance to next step
  if (questionId === 'when' && currentRecommenderState.step === 0) {
    currentRecommenderState.step = 1;
  }
}

function getCurrentRecommendations() {
  if (!currentRecommenderState.when) return [];
  
  return recommend(currentRecommenderState);
}