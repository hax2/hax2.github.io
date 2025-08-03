// Spanish Learning Data - Organized by Regions with Sentences

const REGIONS = {
  basics: {
    name: 'Básicos',
    color: '#F87171',
    description: 'Essential phrases for everyday communication - Use these when you need to be polite, ask for help, or express basic needs in any situation.',
    flashcards: [
      { 
        front: 'Sí, por favor.', 
        back: 'Yes, please.',
        context: 'Use when agreeing to something politely',
        grammar: 'Sí = Yes, por favor = please (polite request marker)',
        breakdown: {
          'Sí': 'Yes (affirmative response)',
          'por': 'for (preposition)',
          'favor': 'favor (literally "for favor")',
          'por favor': 'please (polite expression)'
        }
      },
      { 
        front: 'No, gracias.', 
        back: 'No, thank you.',
        context: 'Use when politely declining something',
        grammar: 'No = No, gracias = thank you (polite decline)',
        breakdown: {
          'No': 'No (negative response)',
          'gracias': 'thank you (gratitude expression)'
        }
      },
      { 
        front: 'Por favor, ayúdame.', 
        back: 'Please help me.',
        context: 'Use when you need assistance from someone',
        grammar: 'Imperative form: ayúdame = help me (command)',
        breakdown: {
          'Por': 'for (preposition)',
          'favor': 'favor',
          'por favor': 'please',
          'ayúda': 'help (imperative form)',
          'me': 'me (object pronoun)',
          'ayúdame': 'help me'
        }
      },
      { 
        front: 'Gracias por tu ayuda.', 
        back: 'Thank you for your help.',
        context: 'Use to express gratitude for someone\'s assistance',
        grammar: 'Gracias por + noun = Thank you for + noun',
        breakdown: {
          'Gracias': 'thank you',
          'por': 'for (preposition)',
          'tu': 'your (possessive adjective)',
          'ayuda': 'help (noun)'
        }
      },
      { 
        front: 'De nada, es un placer.', 
        back: "You're welcome, it's a pleasure.",
        context: 'Use to respond to thanks, emphasizing that helping was enjoyable',
        grammar: 'De nada = You\'re welcome, es = is (ser verb)',
        breakdown: {
          'De': 'of (preposition)',
          'nada': 'nothing',
          'de nada': "you're welcome (literally 'of nothing')",
          'es': 'is (ser verb)',
          'un': 'a (indefinite article)',
          'placer': 'pleasure'
        }
      }
    ]
  },
  greetings: {
    name: 'Saludos',
    color: '#F59E0B',
    description: 'Greetings and introductions - Use these when meeting people, starting conversations, or being polite in social situations.',
    flashcards: [
      { 
        front: '¡Hola! ¿Cómo estás?', 
        back: 'Hello! How are you?',
        context: 'Use as a friendly greeting when meeting someone',
        grammar: '¿Cómo estás? = How are you? (tú form, informal)',
        breakdown: {
          '¡Hola!': 'Hello! (exclamation)',
          '¿Cómo': 'How (question word)',
          'estás': 'are you (estar verb, tú form)',
          '¿Cómo estás?': 'How are you?'
        }
      },
      { 
        front: 'Buenos días, señor.', 
        back: 'Good morning, sir.',
        context: 'Use as a formal morning greeting, especially in professional settings',
        grammar: 'Buenos días = Good morning (formal greeting)',
        breakdown: {
          'Buenos': 'good (plural, masculine)',
          'días': 'days',
          'buenos días': 'good morning',
          'señor': 'sir (formal address)'
        }
      },
      { 
        front: 'Mucho gusto en conocerte.', 
        back: 'Nice to meet you.',
        context: 'Use when meeting someone for the first time',
        grammar: 'Mucho gusto = Nice to meet you, en conocerte = in meeting you',
        breakdown: {
          'Mucho': 'much/a lot',
          'gusto': 'pleasure',
          'mucho gusto': 'nice to meet you',
          'en': 'in (preposition)',
          'conocer': 'to meet/know',
          'te': 'you (object pronoun)',
          'conocerte': 'meeting you'
        }
      }
    ]
  },
  travel: {
    name: 'Viaje',
    color: '#10B981',
    description: 'Travel and transportation vocabulary - Use these when navigating airports, train stations, hotels, and asking for directions while traveling.',
    flashcards: [
      { 
        front: '¿Dónde está la estación de tren?', 
        back: 'Where is the train station?',
        context: 'Use when looking for the train station in a city',
        grammar: '¿Dónde está? = Where is? (location question)',
        breakdown: {
          '¿Dónde': 'Where (question word)',
          'está': 'is (estar verb, 3rd person)',
          'la': 'the (definite article, feminine)',
          'estación': 'station',
          'de': 'of (preposition)',
          'tren': 'train'
        }
      },
      { 
        front: '¿Cuál es el número de mi vuelo?', 
        back: 'What is my flight number?',
        context: 'Use at airports to ask about your flight information',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'el': 'the (definite article, masculine)',
          'número': 'number',
          'de': 'of (preposition)',
          'mi': 'my (possessive adjective)',
          'vuelo': 'flight'
        }
      }
    ]
  },
  food: {
    name: 'Comida',
    color: '#3B82F6',
    description: 'Food and dining vocabulary - Use these in restaurants, cafes, and when discussing food preferences or dietary needs.',
    flashcards: [
      { 
        front: 'Tengo hambre, ¿dónde podemos comer?', 
        back: "I'm hungry, where can we eat?",
        context: 'Use when you\'re hungry and looking for a place to eat',
        grammar: 'Tengo hambre = I have hunger (common expression for being hungry)',
        breakdown: {
          'Tengo': 'I have (tener verb, 1st person)',
          'hambre': 'hunger',
          'tengo hambre': "I'm hungry",
          '¿dónde': 'Where (question word)',
          'podemos': 'we can (poder verb, 1st person plural)',
          'comer': 'to eat (infinitive)'
        }
      },
      { 
        front: '¿Cuál es la especialidad de la casa?', 
        back: 'What is the house specialty?',
        context: 'Use in restaurants to ask about the restaurant\'s signature dishes',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'la': 'the (definite article, feminine)',
          'especialidad': 'specialty',
          'de': 'of (preposition)',
          'la': 'the (definite article, feminine)',
          'casa': 'house'
        }
      }
    ]
  },
  emergencies: {
    name: 'Emergencias',
    color: '#EF4444',
    description: 'Emergency and safety phrases - Use these in urgent situations, medical emergencies, or when you need immediate help.',
    flashcards: [
      { 
        front: '¡Fuego! ¡Salgan todos del edificio!', 
        back: 'Fire! Everyone get out of the building!',
        context: 'Use to warn people about a fire emergency',
        grammar: '¡Salgan! = Get out! (imperative, ustedes form)',
        breakdown: {
          '¡Fuego!': 'Fire! (exclamation)',
          '¡Salgan': 'Get out (imperative, ustedes)',
          'todos': 'everyone (all people)',
          'del': 'of the (de + el)',
          'edificio': 'building'
        }
      },
      { 
        front: 'Necesito un médico urgentemente.', 
        back: 'I need a doctor urgently.',
        context: 'Use in medical emergencies when you need immediate medical attention',
        grammar: 'Necesito = I need (necesitar verb, 1st person)',
        breakdown: {
          'Necesito': 'I need (necesitar verb, 1st person)',
          'un': 'a (indefinite article, masculine)',
          'médico': 'doctor',
          'urgentemente': 'urgently (adverb)'
        }
      }
    ]
  },
  shopping: {
    name: 'Compras',
    color: '#8B5CF6',
    description: 'Shopping and commerce vocabulary - Use these in stores, markets, and when making purchases or asking about products.',
    flashcards: [
      { 
        front: '¿Cuánto cuesta esta camisa?', 
        back: 'How much does this shirt cost?',
        context: 'Use when asking about the price of clothing in a store',
        grammar: '¿Cuánto cuesta? = How much does it cost? (price question)',
        breakdown: {
          '¿Cuánto': 'How much (question word)',
          'cuesta': 'costs (costar verb, 3rd person)',
          'esta': 'this (demonstrative adjective, feminine)',
          'camisa': 'shirt'
        }
      },
      { 
        front: '¿Aceptan tarjetas de crédito?', 
        back: 'Do you accept credit cards?',
        context: 'Use when asking about payment methods in stores',
        grammar: '¿Aceptan? = Do you accept? (aceptar verb, 3rd person plural)',
        breakdown: {
          '¿Aceptan': 'Do you accept (aceptar verb, 3rd person plural)',
          'tarjetas': 'cards (plural)',
          'de': 'of (preposition)',
          'crédito': 'credit'
        }
      }
    ]
  },
  health: {
    name: 'Salud',
    color: '#14B8A6',
    description: 'Health and medical vocabulary - Use these when visiting doctors, pharmacies, or describing health problems.',
    flashcards: [
      { 
        front: 'Me duele la cabeza desde ayer.', 
        back: 'My head has been hurting since yesterday.',
        context: 'Use when describing pain to a doctor or pharmacist',
        grammar: 'Me duele + [body part] = [body part] hurts me (doler structure)',
        breakdown: {
          'Me': 'me (object pronoun)',
          'duele': 'hurts (doler verb, 3rd person)',
          'la': 'the (definite article, feminine)',
          'cabeza': 'head',
          'desde': 'since (preposition)',
          'ayer': 'yesterday'
        }
      },
      { 
        front: '¿Cuál es mi temperatura corporal?', 
        back: 'What is my body temperature?',
        context: 'Use when asking about your temperature at a medical appointment',
        grammar: '¿Cuál es? = What is? (asking for specific measurement)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'mi': 'my (possessive adjective)',
          'temperatura': 'temperature',
          'corporal': 'bodily (adjective)'
        }
      }
    ]
  },
  business: {
    name: 'Negocios',
    color: '#F43F5E',
    description: 'Business and professional vocabulary - Use these in meetings, negotiations, and professional settings like offices and conferences.',
    flashcards: [
      { 
        front: 'Tenemos una reunión importante mañana.', 
        back: 'We have an important meeting tomorrow.',
        context: 'Use when discussing work schedules or upcoming meetings',
        grammar: 'Tenemos = We have (tener verb, 1st person plural)',
        breakdown: {
          'Tenemos': 'We have (tener verb, 1st person plural)',
          'una': 'a (indefinite article, feminine)',
          'reunión': 'meeting',
          'importante': 'important (adjective)',
          'mañana': 'tomorrow'
        }
      },
      { 
        front: '¿Cuál es el presupuesto para este proyecto?', 
        back: 'What is the budget for this project?',
        context: 'Use in business meetings when discussing project finances',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'el': 'the (definite article, masculine)',
          'presupuesto': 'budget',
          'para': 'for (preposition)',
          'este': 'this (demonstrative adjective, masculine)',
          'proyecto': 'project'
        }
      }
    ]
  },
  cualEs: {
    name: '¿Cuál es?',
    color: '#EC4899',
    description: 'Questions using "¿Cuál es?" for asking about specific things - Use these when you need to ask for specific information, characteristics, or choices from a set of options.',
    flashcards: [
      { 
        front: '¿Cuál es tu nombre completo?', 
        back: 'What is your full name?',
        context: 'Use when filling out forms or getting to know someone formally',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'tu': 'your (possessive adjective)',
          'nombre': 'name',
          'completo': 'complete/full (adjective)'
        }
      },
      { 
        front: '¿Cuál es tu profesión?', 
        back: 'What is your profession?',
        context: 'Use when asking about someone\'s job or career',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'tu': 'your (possessive adjective)',
          'profesión': 'profession'
        }
      },
      { 
        front: '¿Cuál es el problema principal?', 
        back: 'What is the main problem?',
        context: 'Use in meetings or discussions when trying to identify the core issue',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'el': 'the (definite article, masculine)',
          'problema': 'problem',
          'principal': 'main/principal (adjective)'
        }
      },
      { 
        front: '¿Cuál es el objetivo de esta reunión?', 
        back: 'What is the objective of this meeting?',
        context: 'Use at the beginning of meetings to clarify the purpose',
        grammar: '¿Cuál es? = What is? (asking for specific information)',
        breakdown: {
          '¿Cuál': 'Which/What (question word)',
          'es': 'is (ser verb)',
          'el': 'the (definite article, masculine)',
          'objetivo': 'objective/goal',
          'de': 'of (preposition)',
          'esta': 'this (demonstrative adjective, feminine)',
          'reunión': 'meeting'
        }
      }
    ]
  },
  cualGeneral: {
    name: 'Uso General de \'Cuál\'',
    color: '#6366F1',
    description: 'More ways to use "cuál" and its plural form "cuáles" - Use these when choosing between options, asking about preferences, or discussing multiple items.',
    flashcards: [
      { 
        front: '¿Cuál de estos vestidos prefieres?', 
        back: 'Which of these dresses do you prefer?',
        context: 'Use when shopping and asking someone to choose between clothing options',
        grammar: '¿Cuál de? = Which of? (choosing from a group)',
        breakdown: {
          '¿Cuál': 'Which (question word)',
          'de': 'of (preposition)',
          'estos': 'these (demonstrative adjective, masculine plural)',
          'vestidos': 'dresses',
          'prefieres': 'you prefer (preferir verb, tú form)'
        }
      },
      { 
        front: '¿Cuáles son tus metas para este año?', 
        back: 'What are your goals for this year?',
        context: 'Use in personal or professional conversations about future plans',
        grammar: '¿Cuáles son? = What are? (plural form of cuál)',
        breakdown: {
          '¿Cuáles': 'Which ones/What (plural of cuál)',
          'son': 'are (ser verb, 3rd person plural)',
          'tus': 'your (possessive adjective, plural)',
          'metas': 'goals',
          'para': 'for (preposition)',
          'este': 'this (demonstrative adjective, masculine)',
          'año': 'year'
        }
      },
      { 
        front: 'No sé cuál camino tomar.', 
        back: 'I don\'t know which path to take.',
        context: 'Use when you\'re uncertain about which option to choose',
        grammar: 'No sé = I don\'t know (saber verb, negative)',
        breakdown: {
          'No': 'no/not (negation)',
          'sé': 'I know (saber verb, 1st person)',
          'cuál': 'which (question word)',
          'camino': 'path/road',
          'tomar': 'to take (infinitive)'
        }
      }
    ]
  }
};

// XP Levels Configuration
const XP_LEVELS = {
  1: { xp: 0, title: 'Principiante' },
  2: { xp: 50, title: 'Estudiante' },
  3: { xp: 150, title: 'Aprendiz' },
  4: { xp: 300, title: 'Intermedio' },
  5: { xp: 500, title: 'Avanzado' },
  6: { xp: 750, title: 'Experto' },
  7: { xp: 1050, title: 'Maestro' },
  8: { xp: 1400, title: 'Profesor' },
  9: { xp: 1800, title: 'Gurú' },
  10: { xp: 2250, title: 'Leyenda' }
};

// Default Settings
const DEFAULT_SETTINGS = {
  // TTS Settings
  ttsAutoPlay: true,
  ttsAutoPlayEnglish: false,
  ttsVolume: 0.8,
  ttsRate: 1.0,
  ttsPitch: 1.0,
  
  // Animation Settings
  animationsEnabled: true,
  flashcardFlipSpeed: 0.8,
  transitionSpeed: 0.3,
  
  // Game Settings
  showProgressBars: true,
  showXP: true,
  showLevelInfo: true,
  
  // UI Settings
  darkMode: 'auto', // 'light', 'dark', 'auto'
  compactMode: false,
  showHints: true,
  
  // Learning Settings
  autoMarkLearned: false,
  showCorrectAnswers: true,
  flexibleAnswerValidation: true,
  
  // Accessibility
  highContrast: false,
  largeText: false,
  reduceMotion: false
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REGIONS, XP_LEVELS };
}