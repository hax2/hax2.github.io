/* ------------------ DATA ------------------ */
const PRONOUNS = ["yo", "tú", "él/ella/usted", "nosotros", "vosotros", "ellos/ustedes"];

const ENDINGS = {
  "ind-presente": {
    ar: ["o","as","a","amos","áis","an"],
    er: ["o","es","e","emos","éis","en"],
    ir: ["o","es","e","imos","ís","en"],
  },
  "ind-pret-perf-sim": {
    ar: ["é","aste","ó","amos","asteis","aron"],
    er: ["í","iste","ió","imos","isteis","ieron"],
    ir: ["í","iste","ió","imos","isteis","ieron"],
  },
  "ind-imperfecto": {
    ar: ["aba","abas","aba","ábamos","abais","aban"],
    er: ["ía","ías","ía","íamos","íais","ían"],
    ir: ["ía","ías","ía","íamos","íais","ían"],
  },
  "ind-futuro": {
    ar: ["é","ás","á","emos","éis","án"],
    er: ["é","ás","á","emos","éis","án"],
    ir: ["é","ás","á","emos","éis","án"],
    infAdds: true,
  },
  "ind-cond": {
    ar: ["ía","ías","ía","íamos","íais","ían"],
    er: ["ía","ías","ía","íamos","íais","ían"],
    ir: ["ía","ías","ía","íamos","íais","ían"],
    infAdds: true,
  },
  "subj-presente": {
    ar: ["e","es","e","emos","éis","en"],
    er: ["a","as","a","amos","áis","an"],
    ir: ["a","as","a","amos","áis","an"],
  },
};

const IRREG = {
  "ind-presente": {
    ser: ["soy","eres","es","somos","sois","son"],
    estar: ["estoy","estás","está","estamos","estáis","están"],
    ir: ["voy","vas","va","vamos","vais","van"],
    haber: ["he","has","ha","hemos","habéis","han"],
    tener: ["tengo","tienes","tiene","tenemos","tenéis","tienen"],
    hacer: ["hago","haces","hace","hacemos","hacéis","hacen"],
    decir: ["digo","dices","dice","decimos","decís","dicen"],
    poder: ["puedo","puedes","puede","podemos","podéis","pueden"],
    poner: ["pongo","pones","pone","ponemos","ponéis","ponen"],
    venir: ["vengo","vienes","viene","venimos","venís","vienen"],
    querer: ["quiero","quieres","quiere","queremos","queréis","quieren"],
    saber: ["sé","sabes","sabe","sabemos","sabéis","saben"],
    ver: ["veo","ves","ve","vemos","veis","ven"],
    dar: ["doy","das","da","damos","dais","dan"],
  },
  "ind-pret-perf-sim": {
    ser: ["fui","fuiste","fue","fuimos","fuisteis","fueron"],
    ir: ["fui","fuiste","fue","fuimos","fuisteis","fueron"],
    estar: ["estuve","estuviste","estuvo","estuvimos","estuvisteis","estuvieron"],
    haber: ["hube","hubiste","hubo","hubimos","hubisteis","hubieron"],
    tener: ["tuve","tuviste","tuvo","tuvimos","tuvisteis","tuvieron"],
    hacer: ["hice","hiciste","hizo","hicimos","hicisteis","hicieron"],
    decir: ["dije","dijiste","dijo","dijimos","dijisteis","dijeron"],
    poder: ["pude","pudiste","pudo","pudimos","pudisteis","pudieron"],
    poner: ["puse","pusiste","puso","pusimos","pusisteis","pusieron"],
    venir: ["vine","viniste","vino","vinimos","vinisteis","vinieron"],
    querer: ["quise","quisiste","quiso","quisimos","quisisteis","quisieron"],
    saber: ["supe","supiste","supo","supimos","supisteis","supieron"],
    ver: ["vi","viste","vio","vimos","visteis","vieron"],
    dar: ["di","diste","dio","dimos","disteis","dieron"],
  },
  "ind-imperfecto": {
    ser: ["era","eras","era","éramos","erais","eran"],
    ir: ["iba","ibas","iba","íbamos","ibais","iban"],
    ver: ["veía","veías","veía","veíamos","veíais","veían"],
    estar: ["estaba","estabas","estaba","estábamos","estabais","estaban"],
    haber: ["había","habías","había","habíamos","habíais","habían"],
  },
  "ind-futuro": {
    stems: { 
      decir:"dir-", hacer:"har-", poder:"podr-", poner:"pondr-", 
      querer:"querr-", saber:"sabr-", tener:"tendr-", venir:"vendr-", 
      haber:"habr-", salir:"saldr-" 
    },
  },
  "ind-cond": {
    stems: { 
      decir:"dir-", hacer:"har-", poder:"podr-", poner:"pondr-", 
      querer:"querr-", saber:"sabr-", tener:"tendr-", venir:"vendr-", 
      haber:"habr-", salir:"saldr-" 
    },
  },
  "subj-presente": {
    ser:["sea","seas","sea","seamos","seáis","sean"],
    estar:["esté","estés","esté","estemos","estéis","estén"],
    ir:["vaya","vayas","vaya","vayamos","vayáis","vayan"],
    haber:["haya","hayas","haya","hayamos","hayáis","hayan"],
    saber:["sepa","sepas","sepa","sepamos","sepáis","sepan"],
    dar:["dé","des","dé","demos","deis","den"],
    tener:["tenga","tengas","tenga","tengamos","tengáis","tengan"],
    decir:["diga","digas","diga","digamos","digáis","digan"],
    hacer:["haga","hagas","haga","hagamos","hagáis","hagan"],
    poder:["pueda","puedas","pueda","podamos","podáis","puedan"],
    querer:["quiera","quieras","quiera","queramos","queráis","quieran"],
    venir:["venga","vengas","venga","vengamos","vengáis","vengan"],
  },
  "subj-imperf": {
    ser:["fuera","fueras","fuera","fuéramos","fuerais","fueran"],
    ir:["fuera","fueras","fuera","fuéramos","fuerais","fueran"],
    estar:["estuviera","estuvieras","estuviera","estuviéramos","estuvierais","estuvieran"],
    tener:["tuviera","tuvieras","tuviera","tuviéramos","tuvierais","tuvieran"],
    poder:["pudiera","pudieras","pudiera","pudiéramos","pudierais","pudieran"],
    decir:["dijera","dijeras","dijera","dijéramos","dijerais","dijeran"],
    haber:["hubiera","hubieras","hubiera","hubiéramos","hubierais","hubieran"],
  },
};

const PARTICIPLES_IRR = [
  "abierto","cubierto","dicho","escrito","hecho","muerto",
  "puesto","roto","visto","vuelto","frito","impreso","satisfecho"
];

const TENSES = [
  // INDICATIVE
  { 
    id:"ind-presente", 
    name:"Presente", 
    mood:"Indicativo", 
    time:"Presente", 
    aspect:"Simple",
    examples:[
      {es:"Vivo en Madrid.",en:"I live in Madrid."},
      {es:"Leo ahora mismo.",en:"I'm reading right now (colloquial)."},
      {es:"Siempre salimos a las ocho.",en:"We always go out at eight."},
      {es:"Mañana tengo examen.",en:"I have an exam tomorrow (scheduled future)."}
    ],
    usage:["Hechos, hábitos y situaciones actuales","Valores de futuro programado (Mañana salgo temprano)"],
    formation:"Raíz + terminaciones de presente (-o, -as/-es, -a/-e, …)", 
    tags:["hecho","hábito","ahora"] 
  },
  { 
    id:"ind-pret-perf-sim", 
    name:"Pretérito perfecto simple", 
    mood:"Indicativo", 
    time:"Pasado", 
    aspect:"Simple",
    examples:[
      {es:"Ayer comí paella.",en:"Yesterday I ate paella."},
      {es:"Llegó, llamó y se fue.",en:"He arrived, called, and left."},
      {es:"El equipo ganó el campeonato en 2022.",en:"The team won the championship in 2022."}
    ],
    usage:["Acción completada en un momento puntual y terminado","Secuencia de eventos pasados"],
    formation:"Raíz + terminaciones de indefinido (-é/-í, -aste/-iste, -ó/-ió, …)", 
    tags:["pasado puntual","completado"] 
  },
  { 
    id:"ind-imperfecto", 
    name:"Pretérito imperfecto", 
    mood:"Indicativo", 
    time:"Pasado", 
    aspect:"Simple",
    examples:[
      {es:"De niño jugaba al fútbol.",en:"As a child I used to play soccer."},
      {es:"Era tarde y llovía.",en:"It was late and it was raining."},
      {es:"Mientras yo cocinaba, él ponía la mesa.",en:"While I was cooking, he was setting the table."}
    ],
    usage:["Acciones habituales, descripciones, contexto","Acción en progreso en el pasado (mientras)"], 
    formation:"-aba / -ía", 
    tags:["hábito","descripción","progreso"] 
  },
  { 
    id:"ind-pret-perf-comp", 
    name:"Pretérito perfecto compuesto", 
    mood:"Indicativo", 
    time:"Pasado", 
    aspect:"Compuesto",
    examples:[
      {es:"Este año he viajado mucho.",en:"This year I have traveled a lot."},
      {es:"Hoy he visto a Marta.",en:"I have seen Marta today."},
      {es:"Nunca he estado en Perú.",en:"I have never been to Peru."}
    ],
    usage:["Pasado reciente o con conexión al presente","Experiencias con periodo no terminado (hoy, esta semana)"],
    formation:"haber (presente) + participio", 
    tags:["reciente","relevante"] 
  },
  { 
    id:"ind-pluscuam", 
    name:"Pluscuamperfecto", 
    mood:"Indicativo", 
    time:"Pasado", 
    aspect:"Compuesto",
    examples:[
      {es:"Cuando llegué, ya habían cerrado.",en:"When I arrived, they had already closed."},
      {es:"Nunca había probado el ramen.",en:"I had never tried ramen."}
    ],
    usage:["Acción anterior a otra acción pasada"], 
    formation:"haber (imperfecto) + participio", 
    tags:["anterioridad"] 
  },
  { 
    id:"ind-pret-anterior", 
    name:"Pretérito anterior (raro)", 
    mood:"Indicativo", 
    time:"Pasado", 
    aspect:"Compuesto",
    examples:[
      {es:"Apenas hube terminado, salí.",en:"As soon as I had finished, I left."}
    ],
    usage:["Muy literario; acción inmediatamente anterior"], 
    formation:"haber (pretérito) + participio", 
    tags:["literario"] 
  },
  { 
    id:"ind-futuro", 
    name:"Futuro simple", 
    mood:"Indicativo", 
    time:"Futuro", 
    aspect:"Simple",
    examples:[
      {es:"Mañana estudiaré.",en:"Tomorrow I will study."},
      {es:"Estará en casa.",en:"He/She is probably at home (conjecture)."},
      {es:"¿Vendrás a la reunión?",en:"Will you come to the meeting?"}
    ],
    usage:["Predicciones, promesas","Conjeturas en presente"], 
    formation:"Infinitivo + (-é, -ás, -á, -emos, -éis, -án)", 
    tags:["predicción","conjetura"] 
  },
  { 
    id:"ind-futuro-comp", 
    name:"Futuro compuesto", 
    mood:"Indicativo", 
    time:"Futuro", 
    aspect:"Compuesto",
    examples:[
      {es:"Para 2030 habré terminado.",en:"By 2030 I will have finished."},
      {es:"Ya habrán salido.",en:"They will have already left (guess)."}
    ],
    usage:["Acción futura acabada antes de otra futura","Conjetura sobre pasado reciente"], 
    formation:"haber (futuro) + participio", 
    tags:["anterioridad futura"] 
  },
  { 
    id:"ind-cond", 
    name:"Condicional simple", 
    mood:"Indicativo", 
    time:"Futuro hipotético", 
    aspect:"Simple",
    examples:[
      {es:"Yo viajaría más si tuviera dinero.",en:"I would travel more if I had money."},
      {es:"Serían las cinco.",en:"It was probably five o'clock (conjecture)."},
      {es:"¿Podrías ayudarme?",en:"Could you help me?"}
    ],
    usage:["Hipótesis, cortesía, conjetura en pasado"], 
    formation:"Infinitivo + (-ía, -ías, -ía, -íamos, -íais, -ían)", 
    tags:["hipótesis","cortesía"] 
  },
  { 
    id:"ind-cond-comp", 
    name:"Condicional compuesto", 
    mood:"Indicativo", 
    time:"Pasado hipotético", 
    aspect:"Compuesto",
    examples:[
      {es:"Habría ido, pero estaba enfermo.",en:"I would have gone, but I was sick."},
      {es:"Yo te habría llamado antes.",en:"I would have called you earlier."}
    ],
    usage:["Hipótesis no realizada en el pasado"], 
    formation:"haber (condicional) + participio", 
    tags:["contrafactual"] 
  },

  // SUBJUNCTIVE
  { 
    id:"subj-presente", 
    name:"Presente de subjuntivo", 
    mood:"Subjuntivo", 
    time:"Presente/Futuro", 
    aspect:"Simple",
    examples:[
      {es:"Quiero que vengas.",en:"I want you to come."},
      {es:"Es posible que llueva.",en:"It's possible that it may rain."},
      {es:"Cuando llegue, te aviso.",en:"When I arrive, I'll let you know."}
    ],
    usage:["Deseo, duda, mandato indirecto, finalidad tras que"], 
    formation:"1ª persona presente + cambio (-e/-a)", 
    tags:["deseo","duda","subordinada"] 
  },
  { 
    id:"subj-imperf", 
    name:"Imperfecto de subjuntivo", 
    mood:"Subjuntivo", 
    time:"Pasado/hipotético", 
    aspect:"Simple",
    examples:[
      {es:"Si tuviera tiempo, viajaría.",en:"If I had time, I would travel."},
      {es:"Quería que vinieras.",en:"I wanted you to come."},
      {es:"Si fuera verdad, me alegraría.",en:"If it were true, I'd be happy."}
    ],
    usage:["Condicional irreal, cortesía, pasado de subjuntivo"], 
    formation:"3ª persona plural del indefinido + (-ra/-se)", 
    tags:["si irreal","pasado dependiente"] 
  },
  { 
    id:"subj-perf", 
    name:"Pretérito perfecto de subjuntivo", 
    mood:"Subjuntivo", 
    time:"Pasado reciente", 
    aspect:"Compuesto",
    examples:[
      {es:"Me alegra que hayas venido.",en:"I'm glad you've come."},
      {es:"Dudo que hayan terminado.",en:"I doubt they have finished."}
    ],
    usage:["Acción pasada conectada al presente en subordinadas"], 
    formation:"haber (presente subj.) + participio", 
    tags:["reciente","subordinada"] 
  },
  { 
    id:"subj-pluscuam", 
    name:"Pluscuamperfecto de subjuntivo", 
    mood:"Subjuntivo", 
    time:"Pasado hipotético", 
    aspect:"Compuesto",
    examples:[
      {es:"Si hubieras estudiado, habrías aprobado.",en:"If you had studied, you would have passed."},
      {es:"Ojalá me hubieran avisado.",en:"If only they had warned me."}
    ],
    usage:["Condiciones irreales en el pasado; anterioridad en subordinadas"], 
    formation:"haber (imperfecto subj.) + participio", 
    tags:["si irreal pasada","anterioridad"] 
  },
  { 
    id:"subj-futuro", 
    name:"Futuro de subjuntivo (arcaico)", 
    mood:"Subjuntivo", 
    time:"Futuro", 
    aspect:"Simple",
    examples:[
      {es:"Donde estuvieres, te hallaré.",en:"Wherever you may be, I will find you."}
    ],
    usage:["Forma legal/arcaica; hoy sustituida por presente de subjuntivo"], 
    formation:"-re, -res, -re, …", 
    tags:["arcaico"] 
  },

  // IMPERATIVE
  { 
    id:"imp-afirm", 
    name:"Imperativo afirmativo", 
    mood:"Imperativo", 
    time:"Mandato", 
    aspect:"—",
    examples:[
      {es:"Ven aquí.",en:"Come here."},
      {es:"Hable más despacio, por favor.",en:"Speak more slowly, please."}
    ],
    usage:["Órdenes y ruegos directos en afirmativo"], 
    formation:"Tú: 3ª persona presente (sin -s en -ar/-er); otros: subjuntivo", 
    tags:["orden"] 
  },
  { 
    id:"imp-neg", 
    name:"Imperativo negativo", 
    mood:"Imperativo", 
    time:"Mandato", 
    aspect:"—",
    examples:[
      {es:"No hables.",en:"Don't speak."},
      {es:"No se preocupe.",en:"Don't worry."}
    ],
    usage:["Órdenes en negativo (todas las personas usan subjuntivo)"], 
    formation:"No + presente de subjuntivo", 
    tags:["prohibición"] 
  },

  // NON-FINITE / PERIPHRASES
  { 
    id:"nf-inf", 
    name:"Infinitivo", 
    mood:"No personal", 
    time:"Atemporal", 
    aspect:"—",
    examples:[
      {es:"Fumar mata.",en:"Smoking kills."},
      {es:"Leer es aprender.",en:"To read is to learn."}
    ],
    usage:["Sustantivar la acción; perífrasis (ir a + inf.)"], 
    formation:"-ar / -er / -ir", 
    tags:["sustantivo","perífrasis"] 
  },
  { 
    id:"nf-ger", 
    name:"Gerundio", 
    mood:"No personal", 
    time:"Progreso", 
    aspect:"—",
    examples:[
      {es:"Estoy estudiando.",en:"I am studying."},
      {es:"Siguió hablando.",en:"He/She kept talking."}
    ],
    usage:["Acción en desarrollo; perífrasis progresivas"], 
    formation:"-ando / -iendo", 
    tags:["progresivo"] 
  },
  { 
    id:"nf-part", 
    name:"Participio", 
    mood:"No personal", 
    time:"Resultado", 
    aspect:"—",
    examples:[
      {es:"La puerta está cerrada.",en:"The door is closed."},
      {es:"Hemos visto la película.",en:"We have seen the movie."}
    ],
    usage:["Resultado/estado; tiempos compuestos con haber"], 
    formation:"-ado / -ido (irregulares: hecho, visto, puesto, …)", 
    tags:["resultado","compuesto"] 
  },
  { 
    id:"perif-prog", 
    name:"Progresivo (estar + gerundio)", 
    mood:"Perífrasis", 
    time:"Progreso", 
    aspect:"Perífrasis",
    examples:[
      {es:"Estaba lloviendo.",en:"It was raining."},
      {es:"Seguimos trabajando.",en:"We are still working."}
    ],
    usage:["Enfoca la acción en curso (presente/pasado/futuro)"], 
    formation:"estar (tiempo) + gerundio", 
    tags:["en curso"] 
  },
  { 
    id:"perif-ir-a", 
    name:"Ir a + infinitivo", 
    mood:"Perífrasis", 
    time:"Futuro cercano", 
    aspect:"Perífrasis",
    examples:[
      {es:"Voy a estudiar.",en:"I'm going to study."},
      {es:"Íbamos a salir, pero llovió.",en:"We were going to leave, but it rained."}
    ],
    usage:["Plan/intención próximo"], 
    formation:"ir (presente/pasado) + a + inf.", 
    tags:["plan","intención"] 
  },
];

const MOODS = ["Indicativo","Subjuntivo","Imperativo","Perífrasis","No personal"];

const moodColor = (m) => ({
  "Indicativo":"from-sky-500 to-cyan-500",
  "Subjuntivo":"from-violet-500 to-fuchsia-500",
  "Imperativo":"from-amber-500 to-orange-500",
  "No personal":"from-slate-500 to-zinc-500",
  "Perífrasis":"from-emerald-500 to-teal-500",
}[m]||"from-slate-500 to-gray-500");

const moodBadge = (m) => ({
  "Indicativo":"bg-sky-600",
  "Subjuntivo":"bg-fuchsia-600",
  "Imperativo":"bg-orange-600",
  "No personal":"bg-zinc-700",
  "Perífrasis":"bg-emerald-600",
}[m]||"bg-slate-600");

// VERB MASTERY GAME DATA
const GAME_VERBS = [
  { verb: "hablar", meaning: "to speak", group: "ar", difficulty: 1 },
  { verb: "comer", meaning: "to eat", group: "er", difficulty: 1 },
  { verb: "vivir", meaning: "to live", group: "ir", difficulty: 1 },
  { verb: "estudiar", meaning: "to study", group: "ar", difficulty: 1 },
  { verb: "trabajar", meaning: "to work", group: "ar", difficulty: 1 },
  { verb: "beber", meaning: "to drink", group: "er", difficulty: 1 },
  { verb: "escribir", meaning: "to write", group: "ir", difficulty: 1 },
  { verb: "leer", meaning: "to read", group: "er", difficulty: 1 },
  { verb: "caminar", meaning: "to walk", group: "ar", difficulty: 1 },
  { verb: "correr", meaning: "to run", group: "er", difficulty: 1 },
  
  // Irregular verbs (difficulty 2)
  { verb: "ser", meaning: "to be", group: "irregular", difficulty: 2 },
  { verb: "estar", meaning: "to be", group: "irregular", difficulty: 2 },
  { verb: "tener", meaning: "to have", group: "irregular", difficulty: 2 },
  { verb: "hacer", meaning: "to do/make", group: "irregular", difficulty: 2 },
  { verb: "ir", meaning: "to go", group: "irregular", difficulty: 2 },
  { verb: "venir", meaning: "to come", group: "irregular", difficulty: 2 },
  { verb: "poder", meaning: "can/to be able", group: "irregular", difficulty: 2 },
  { verb: "querer", meaning: "to want", group: "irregular", difficulty: 2 },
  { verb: "saber", meaning: "to know", group: "irregular", difficulty: 2 },
  { verb: "decir", meaning: "to say", group: "irregular", difficulty: 2 },
  { verb: "ver", meaning: "to see", group: "irregular", difficulty: 2 },
  { verb: "dar", meaning: "to give", group: "irregular", difficulty: 2 },
  { verb: "poner", meaning: "to put", group: "irregular", difficulty: 2 }
];

const GAME_SUBJECTS = [
  { pronoun: "yo", index: 0, meaning: "I" },
  { pronoun: "tú", index: 1, meaning: "you (informal)" },
  { pronoun: "él/ella/usted", index: 2, meaning: "he/she/you (formal)" },
  { pronoun: "nosotros", index: 3, meaning: "we" },
  { pronoun: "vosotros", index: 4, meaning: "you all (Spain)" },
  { pronoun: "ellos/ustedes", index: 5, meaning: "they/you all" }
];

const GAME_TENSE_COLLECTIONS = {
  "essential": {
    name: "Tiempos Esenciales",
    description: "Los 8 tiempos más importantes del español",
    tenses: ["ind-presente", "ind-pret-perf-sim", "ind-imperfecto", "ind-pret-perf-comp", "ind-futuro", "subj-presente", "subj-imperf", "ind-cond"],
    difficulty: 1
  },
  "present": {
    name: "Presente",
    description: "Enfoque en el presente",
    tenses: ["ind-presente"],
    difficulty: 1
  },
  "past": {
    name: "Pasados",
    description: "Todos los tiempos pasados",
    tenses: ["ind-pret-perf-sim", "ind-imperfecto", "ind-pret-perf-comp", "ind-pluscuam"],
    difficulty: 2
  },
  "future": {
    name: "Futuros",
    description: "Tiempos de futuro",
    tenses: ["ind-futuro", "ind-futuro-comp", "perif-ir-a"],
    difficulty: 2
  },
  "subjunctive": {
    name: "Subjuntivo",
    description: "Modo subjuntivo completo",
    tenses: ["subj-presente", "subj-imperf", "subj-perf", "subj-pluscuam"],
    difficulty: 3
  },
  "all": {
    name: "Todos los Tiempos",
    description: "Desafío completo",
    tenses: TENSES.map(t => t.id),
    difficulty: 3
  }
};

const GAME_EXAMPLE_SENTENCES = {
  "ind-presente": [
    "Yo ___ español todos los días.",
    "Tú ___ en la oficina.",
    "Ella ___ libros interesantes.",
    "Nosotros ___ juntos.",
    "Vosotros ___ muy bien.",
    "Ellos ___ en casa."
  ],
  "ind-pret-perf-sim": [
    "Ayer yo ___ con mis amigos.",
    "Tú ___ la tarea anoche.",
    "Él ___ al cine el sábado.",
    "Nosotros ___ temprano.",
    "Vosotros ___ la verdad.",
    "Ellas ___ toda la noche."
  ],
  "ind-imperfecto": [
    "Cuando era niño, yo ___ mucho.",
    "Tú ___ todos los días.",
    "Ella ___ mientras estudiaba.",
    "Nosotros ___ en verano.",
    "Vosotros ___ por las tardes.",
    "Ellos ___ frecuentemente."
  ],
  "ind-futuro": [
    "Mañana yo ___ temprano.",
    "Tú ___ la respuesta.",
    "Él ___ a visitarnos.",
    "Nosotros ___ juntos.",
    "Vosotros ___ la verdad.",
    "Ellas ___ pronto."
  ],
  "subj-presente": [
    "Espero que yo ___.",
    "Quiero que tú ___.",
    "Es posible que ella ___.",
    "Ojalá que nosotros ___.",
    "Dudo que vosotros ___.",
    "No creo que ellos ___."
  ]
};