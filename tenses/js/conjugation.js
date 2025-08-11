/* ------------------ CONJUGATION HELPERS ------------------ */

function makeRegularTable(tenseId) {
  const e = ENDINGS[tenseId];
  if (!e) return null;
  
  const verbs = [
    { label: "hablar (-ar)", stem: "habl", group: "ar" },
    { label: "comer (-er)", stem: "com", group: "er" },
    { label: "vivir (-ir)", stem: "viv", group: "ir" },
  ];
  
  return verbs.map(v => {
    let forms;
    if (e.infAdds) {
      const infinitive = v.group === "ar" ? "hablar" : v.group === "er" ? "comer" : "vivir";
      forms = PRONOUNS.map((_, i) => `${infinitive}${e[v.group][i]}`);
    } else {
      forms = PRONOUNS.map((_, i) => `${v.stem}${e[v.group][i]}`);
    }
    return { title: v.label, forms };
  });
}

function makeSubjImperfRegular() {
  return [
    { 
      title: "hablar (-ar)", 
      forms: ["hablara", "hablaras", "hablara", "habláramos", "hablarais", "hablaran"] 
    },
    { 
      title: "comer (-er)", 
      forms: ["comiera", "comieras", "comiera", "comiéramos", "comierais", "comieran"] 
    },
    { 
      title: "vivir (-ir)", 
      forms: ["viviera", "vivieras", "viviera", "viviéramos", "vivierais", "vivieran"] 
    },
  ];
}

function makeCompoundAux(tenseId) {
  const maps = {
    "ind-pret-perf-comp": ["he", "has", "ha", "hemos", "habéis", "han"],
    "ind-pluscuam": ["había", "habías", "había", "habíamos", "habíais", "habían"],
    "ind-pret-anterior": ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"],
    "ind-futuro-comp": ["habré", "habrás", "habrá", "habremos", "habréis", "habrán"],
    "ind-cond-comp": ["habría", "habrías", "habría", "habríamos", "habríais", "habrían"],
    "subj-perf": ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
    "subj-pluscuam": ["hubiera", "hubieras", "hubiera", "hubiéramos", "hubierais", "hubieran"],
  };
  return maps[tenseId] || null;
}

function makeIrregTable(tenseId) {
  const pack = IRREG[tenseId];
  if (!pack) return null;
  
  // Handle future/conditional stems
  if (pack.stems) return pack;
  
  return Object.entries(pack).map(([verb, forms]) => ({ verb, forms }));
}

function conjugateVerb(verb, tenseId) {
  // Check for irregular forms first
  const irregTable = makeIrregTable(tenseId);
  if (irregTable && !irregTable.stems) {
    const irregEntry = irregTable.find(entry => entry.verb === verb);
    if (irregEntry) {
      return irregEntry.forms;
    }
  }
  
  // Handle future/conditional irregular stems
  if (irregTable && irregTable.stems && irregTable.stems[verb]) {
    const stem = irregTable.stems[verb];
    const endings = ENDINGS[tenseId];
    if (endings && endings.ar) { // Use any group's endings since they're the same for future/conditional
      return PRONOUNS.map((_, i) => `${stem}${endings.ar[i]}`);
    }
  }
  
  // Regular conjugation
  const endings = ENDINGS[tenseId];
  if (!endings) return null;
  
  // Determine verb group
  let group, stem;
  if (verb.endsWith('ar')) {
    group = 'ar';
    stem = verb.slice(0, -2);
  } else if (verb.endsWith('er')) {
    group = 'er';
    stem = verb.slice(0, -2);
  } else if (verb.endsWith('ir')) {
    group = 'ir';
    stem = verb.slice(0, -2);
  } else {
    return null; // Invalid verb
  }
  
  if (endings.infAdds) {
    // Future and conditional use full infinitive + endings
    return PRONOUNS.map((_, i) => `${verb}${endings[group][i]}`);
  } else {
    // Regular tenses use stem + endings
    return PRONOUNS.map((_, i) => `${stem}${endings[group][i]}`);
  }
}

function getParticiple(verb) {
  // Check irregular participles first
  const irregularMap = {
    'abrir': 'abierto',
    'cubrir': 'cubierto', 
    'decir': 'dicho',
    'escribir': 'escrito',
    'hacer': 'hecho',
    'morir': 'muerto',
    'poner': 'puesto',
    'romper': 'roto',
    'ver': 'visto',
    'volver': 'vuelto',
    'freír': 'frito',
    'imprimir': 'impreso',
    'satisfacer': 'satisfecho'
  };
  
  if (irregularMap[verb]) {
    return irregularMap[verb];
  }
  
  // Regular participles
  if (verb.endsWith('ar')) {
    return verb.slice(0, -2) + 'ado';
  } else if (verb.endsWith('er') || verb.endsWith('ir')) {
    return verb.slice(0, -2) + 'ido';
  }
  
  return verb; // fallback
}

function getGerund(verb) {
  if (verb.endsWith('ar')) {
    return verb.slice(0, -2) + 'ando';
  } else if (verb.endsWith('er') || verb.endsWith('ir')) {
    return verb.slice(0, -2) + 'iendo';
  }
  
  return verb; // fallback
}