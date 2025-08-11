/* ------------------ MAIN APPLICATION ------------------ */

// Global state
let currentTab = 'map';
let currentFilter = '';
let isDetailOpen = false;
let isWalkthroughOpen = false;
let currentWalkthroughStep = 0;

// Game state
let gameState = {
  selectedVerb: null,
  selectedSubjects: [],
  selectedTenseCollection: 'essential',
  currentPhase: 'setup', // setup, learning, practice, results
  currentExampleIndex: 0,
  currentQuestionIndex: 0,
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  examples: [],
  questions: [],
  userAnswers: []
};

// DOM elements - will be initialized in init()
let tabMap, tabFlow, tabRef, searchInput, timeOverlay, timeSheet, walkthroughOverlay, walkthroughModal;

// Initialize the application
function init() {
    // Initialize DOM elements
    tabMap = $("#tab-map");
    tabFlow = $("#tab-flow");
    tabRef = $("#tab-reference");
    searchInput = $("#search");
    timeOverlay = $("#time-overlay");
    timeSheet = $("#time-sheet");
    walkthroughOverlay = $("#walkthrough-overlay");
    walkthroughModal = $("#walkthrough-modal");

    setupEventListeners();
    setupTabs();
    renderCurrentTab();

    // Load saved preferences
    const savedTab = loadFromStorage('currentTab', 'map');
    switchTab(savedTab);

    console.log('Spanish Tense Atlas initialized');
}

function setupEventListeners() {
    // Enhanced search functionality with debouncing
    if (searchInput) {
        const debouncedSearch = debounce((query) => {
            currentFilter = query;
            renderCurrentTab();
            announceToScreenReader(`Mostrando ${getFilteredTensesCount()} resultados`);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // Enhanced keyboard shortcuts for search
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                currentFilter = '';
                renderCurrentTab();
                searchInput.blur();
            }

            // Quick search suggestions
            if (e.key === 'ArrowDown' && !searchInput.value) {
                e.preventDefault();
                showSearchSuggestions();
            }
        });

        // Focus search with Cmd/Ctrl + K
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });

        // Search input enhancements
        searchInput.addEventListener('focus', () => {
            searchInput.parentElement.classList.add('ring-2', 'ring-indigo-500', 'ring-opacity-50');
        });

        searchInput.addEventListener('blur', () => {
            searchInput.parentElement.classList.remove('ring-2', 'ring-indigo-500', 'ring-opacity-50');
        });
    }

    // Tab switching
    $$('[data-tab]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.currentTarget.dataset.tab;
            switchTab(tab);
        });
    });

    // Timeline buttons
    $$('[data-time]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const time = e.currentTarget.dataset.time;
            filterByTime(time);
        });
    });

    if (timeOverlay) {
        timeOverlay.addEventListener('click', closeTimeModal);
    }

    // Walkthrough modal close handler
    if (walkthroughOverlay) {
        walkthroughOverlay.addEventListener('click', (e) => {
            // Only close if clicking the overlay itself, not the modal content
            if (e.target === walkthroughOverlay) {
                closeWalkthrough();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleGlobalKeyboard);

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.tab) {
            switchTab(e.state.tab, false);
        }
    });

    // Quick actions menu
    const quickActionsBtn = $('#quick-actions');
    const quickMenu = $('#quick-menu');

    if (quickActionsBtn && quickMenu) {
        quickActionsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            quickMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!quickActionsBtn.contains(e.target) && !quickMenu.contains(e.target)) {
                quickMenu.classList.add('hidden');
            }
        });
    }
}

function setupTabs() {
    // Set initial active tab
    const firstTabBtn = $('[data-tab="map"]');
    if (firstTabBtn) {
        firstTabBtn.classList.add('active');
    }
}

function switchTab(tabName, updateHistory = true) {
    if (currentTab === tabName) return;

    // Update button states
    $$('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = $(`[data-tab="${tabName}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Hide all tabs
    [tabMap, tabFlow, tabRef].forEach(tab => {
        if (tab) tab.classList.add('hidden');
    });

    // Show current tab
    const currentTabEl = $(`#tab-${tabName}`);
    if (currentTabEl) {
        currentTabEl.classList.remove('hidden');
    }

    currentTab = tabName;
    renderCurrentTab();

    // Save preference
    saveToStorage('currentTab', tabName);

    // Update URL without page reload
    if (updateHistory) {
        history.pushState({ tab: tabName }, '', `#${tabName}`);
    }

    announceToScreenReader(`Cambiado a pestaña ${tabName}`);
}

function renderCurrentTab() {
    const container = $(`#tab-${currentTab}`);
    if (!container) return;

    // Show loading state
    container.classList.add('loading');

    try {
        let content;

        switch (currentTab) {
            case 'map':
                content = MapGrid(currentFilter);
                break;
            case 'flow':
                content = FlowChart();
                break;
            case 'reference':
                content = ReferenceTable();
                break;
            case 'game':
                content = VerbMasteryGame();
                break;
            default:
                content = el('div', 'p-4 text-center text-slate-500', 'Contenido no disponible');
        }

        container.innerHTML = '';
        container.appendChild(content);

    } catch (error) {
        console.error('Error rendering tab:', error);
        container.innerHTML = '<div class="p-4 text-center text-red-500">Error al cargar el contenido</div>';
    } finally {
        container.classList.remove('loading');
    }
}

function filterByTime(time) {
    currentFilter = time.toLowerCase();
    if (searchInput) {
        searchInput.value = time.toLowerCase();
    }
    renderCurrentTab();
    announceToScreenReader(`Filtrado por ${time}`);
}

function getFilteredTensesCount() {
    return searchAmong(TENSES, currentFilter).length;
}

function showSearchSuggestions() {
    const suggestions = [
        'presente', 'pasado', 'futuro', 'subjuntivo', 'indicativo',
        'imperativo', 'condicional', 'perfecto', 'imperfecto', 'gerundio'
    ];

    // Create suggestions dropdown
    let dropdown = $('#search-suggestions');
    if (!dropdown) {
        dropdown = el('div', 'absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg mt-2 z-50 max-h-60 overflow-y-auto custom-scrollbar');
        dropdown.id = 'search-suggestions';
        searchInput.parentElement.appendChild(dropdown);
    }

    dropdown.innerHTML = '';

    const header = el('div', 'p-3 border-b border-slate-100');
    const headerText = el('div', 'text-sm font-semibold text-slate-600');
    headerText.textContent = 'Búsquedas sugeridas';
    header.appendChild(headerText);
    dropdown.appendChild(header);

    suggestions.forEach(suggestion => {
        const item = el('button', 'w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors flex items-center gap-3');

        const icon = el('div', 'w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs');
        icon.textContent = '🔍';

        const text = el('span', 'text-sm text-slate-700');
        text.textContent = suggestion;

        item.appendChild(icon);
        item.appendChild(text);

        item.onclick = () => {
            searchInput.value = suggestion;
            searchInput.dispatchEvent(new Event('input'));
            dropdown.remove();
            searchInput.focus();
        };

        dropdown.appendChild(item);
    });

    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
        if (!searchInput.parentElement.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    };

    setTimeout(() => {
        document.addEventListener('click', closeDropdown);
    }, 100);
}

function openDetail(tense) {
    if (!walkthroughModal || !walkthroughOverlay) return;

    isDetailOpen = true;

    // Build detail content using the same modal as walkthrough
    const content = buildDetailContent(tense);
    walkthroughModal.innerHTML = '';
    walkthroughModal.appendChild(content);

    // Show modal
    walkthroughOverlay.classList.remove('hidden');
    walkthroughModal.classList.remove('hidden');

    // Add animation classes
    walkthroughOverlay.classList.add('modal-enter');
    walkthroughModal.classList.add('sheet-enter');

    requestAnimationFrame(() => {
        walkthroughOverlay.classList.add('modal-enter-active');
        walkthroughModal.classList.add('sheet-enter-active');
    });

    // Focus management
    const firstFocusable = walkthroughModal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    announceToScreenReader(`Abierto detalle de ${tense.name}`);
}

function closeDetail() {
    if (!isDetailOpen) return;

    isDetailOpen = false;

    // Add exit animation
    walkthroughOverlay.classList.add('fade-exit-active');
    walkthroughModal.classList.add('sheet-exit-active');

    setTimeout(() => {
        walkthroughOverlay.classList.add('hidden');
        walkthroughModal.classList.add('hidden');

        // Clean up classes
        walkthroughOverlay.classList.remove('modal-enter', 'modal-enter-active', 'fade-exit-active');
        walkthroughModal.classList.remove('sheet-enter', 'sheet-enter-active', 'sheet-exit-active');

        // Restore body scroll
        document.body.style.overflow = '';
    }, 200);

    announceToScreenReader('Detalle cerrado');
}

function buildDetailContent(tense) {
    const container = el('div', 'h-full flex flex-col');

    // Enhanced Header
    const header = el('div', 'flex items-start justify-between mb-8 pb-6 border-b border-slate-200');
    const headerInfo = el('div', 'flex-1');

    const title = el('h2', 'text-3xl font-bold text-slate-900 mb-2');
    title.textContent = tense.name;

    const subtitle = el('div', 'flex items-center gap-3');
    const moodBadgeEl = el('span', `badge ${moodBadge(tense.mood)} shadow-sm`);
    moodBadgeEl.textContent = tense.mood;

    const timeChip = el('span', 'chip bg-slate-200 text-slate-700');
    timeChip.textContent = tense.time;

    if (tense.aspect && tense.aspect !== "—") {
        const aspectChip = el('span', 'chip bg-slate-100 text-slate-600');
        aspectChip.textContent = tense.aspect;
        subtitle.appendChild(aspectChip);
    }

    subtitle.appendChild(moodBadgeEl);
    subtitle.appendChild(timeChip);

    headerInfo.appendChild(title);
    headerInfo.appendChild(subtitle);

    const closeBtn = el('button', 'p-3 hover:bg-slate-100 rounded-xl transition-colors group');
    closeBtn.innerHTML = `
    <svg class="w-6 h-6 text-slate-400 group-hover:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 6L6 18"></path>
      <path d="M6 6l12 12"></path>
    </svg>
  `;
    closeBtn.onclick = closeDetail;
    closeBtn.setAttribute('aria-label', 'Cerrar');

    header.appendChild(headerInfo);
    header.appendChild(closeBtn);
    container.appendChild(header);

    // Enhanced Content area
    const content = el('div', 'flex-1 overflow-y-auto space-y-8 custom-scrollbar');

    // Quick stats
    const statsSection = el('div', 'grid grid-cols-3 gap-4');
    const stats = [
        { label: 'Ejemplos', value: (tense.examples || []).length, icon: '💬' },
        { label: 'Usos', value: (tense.usage || []).length, icon: '💡' },
        { label: 'Tags', value: (tense.tags || []).length, icon: '🏷️' }
    ];

    stats.forEach(stat => {
        const statCard = el('div', 'bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 text-center');
        const icon = el('div', 'text-2xl mb-2');
        icon.textContent = stat.icon;
        const value = el('div', 'text-2xl font-bold text-slate-800');
        value.textContent = stat.value;
        const label = el('div', 'text-sm text-slate-600 font-medium');
        label.textContent = stat.label;

        statCard.appendChild(icon);
        statCard.appendChild(value);
        statCard.appendChild(label);
        statsSection.appendChild(statCard);
    });
    content.appendChild(statsSection);

    // Usage
    if (tense.usage && tense.usage.length > 0) {
        const usageSection = el('div', '');
        const usageTitle = el('h3', 'font-semibold mb-3');
        usageTitle.textContent = 'Usos principales';
        usageSection.appendChild(usageTitle);

        const usageList = el('ul', 'space-y-2');
        tense.usage.forEach(use => {
            const item = el('li', 'flex items-start gap-2');
            const bullet = el('span', 'text-indigo-500 mt-1');
            bullet.textContent = '•';
            const text = el('span', 'text-sm');
            text.textContent = use;
            item.appendChild(bullet);
            item.appendChild(text);
            usageList.appendChild(item);
        });
        usageSection.appendChild(usageList);
        content.appendChild(usageSection);
    }

    // Examples
    if (tense.examples && tense.examples.length > 0) {
        const examplesSection = el('div', '');
        const examplesTitle = el('h3', 'font-semibold mb-3');
        examplesTitle.textContent = 'Ejemplos';
        examplesSection.appendChild(examplesTitle);

        const examplesList = el('div', 'space-y-3');
        tense.examples.forEach(example => {
            const item = el('div', 'p-3 bg-slate-50 rounded-lg');
            const spanish = el('div', 'font-medium');
            spanish.textContent = example.es;
            const english = el('div', 'text-sm text-slate-600 mt-1');
            english.textContent = example.en;
            item.appendChild(spanish);
            item.appendChild(english);
            examplesList.appendChild(item);
        });
        examplesSection.appendChild(examplesList);
        content.appendChild(examplesSection);
    }

    // Formation
    if (tense.formation) {
        const formationSection = el('div', '');
        const formationTitle = el('h3', 'font-semibold mb-3');
        formationTitle.textContent = 'Formación';
        formationSection.appendChild(formationTitle);

        const formationText = el('div', 'p-3 bg-blue-50 rounded-lg font-mono text-sm');
        formationText.textContent = tense.formation;
        formationSection.appendChild(formationText);
        content.appendChild(formationSection);
    }

    // Conjugation tables
    const conjugationSection = buildConjugationSection(tense);
    if (conjugationSection) {
        content.appendChild(conjugationSection);
    }

    container.appendChild(content);
    return container;
}

function buildConjugationSection(tense) {
    const section = el('div', '');
    const title = el('h3', 'font-semibold mb-3');
    title.textContent = 'Conjugación';
    section.appendChild(title);

    // Regular conjugation
    const regularTable = makeRegularTable(tense.id);
    if (regularTable) {
        const regularTitle = el('h4', 'font-medium mb-2 text-sm');
        regularTitle.textContent = 'Verbos regulares';
        section.appendChild(regularTitle);

        const tableContainer = el('div', 'grid gap-4 mb-4');
        regularTable.forEach(verbData => {
            const table = buildConjugationTable(verbData.title, verbData.forms);
            tableContainer.appendChild(table);
        });
        section.appendChild(tableContainer);
    }

    // Irregular conjugation
    const irregTable = makeIrregTable(tense.id);
    if (irregTable && !irregTable.stems) {
        const irregTitle = el('h4', 'font-medium mb-2 text-sm');
        irregTitle.textContent = 'Verbos irregulares';
        section.appendChild(irregTitle);

        const tableContainer = el('div', 'grid gap-4');
        irregTable.slice(0, 3).forEach(verbData => { // Show first 3 irregular verbs
            const table = buildConjugationTable(verbData.verb, verbData.forms);
            tableContainer.appendChild(table);
        });
        section.appendChild(tableContainer);
    }

    return section.children.length > 1 ? section : null;
}

function buildConjugationTable(title, forms) {
    const container = el('div', 'bg-slate-50 rounded-lg p-3');

    const titleEl = el('h5', 'font-medium mb-2 text-sm');
    titleEl.textContent = title;
    container.appendChild(titleEl);

    const table = el('table', 'w-full text-sm');
    const tbody = el('tbody');

    PRONOUNS.forEach((pronoun, i) => {
        const row = el('tr', '');

        const pronounCell = el('td', 'pr-3 text-slate-600 font-medium');
        pronounCell.textContent = pronoun;

        const formCell = el('td', 'font-mono');
        formCell.textContent = forms[i] || '';

        row.appendChild(pronounCell);
        row.appendChild(formCell);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);

    return container;
}

function handleGlobalKeyboard(e) {
    // Close modals with Escape
    if (e.key === 'Escape') {
        if (isDetailOpen) {
            closeDetail();
            return;
        }
    }

    // Tab navigation with Ctrl+Number
    if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        const tabs = ['map', 'flow', 'reference'];
        const tabIndex = parseInt(e.key) - 1;
        if (tabs[tabIndex]) {
            switchTab(tabs[tabIndex]);
        }
    }
}

function closeTimeModal() {
    if (timeOverlay && timeSheet) {
        timeOverlay.classList.add('hidden');
        timeSheet.classList.add('hidden');
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle initial URL hash
window.addEventListener('load', () => {
    const hash = window.location.hash.slice(1);
    if (hash && ['map', 'flow', 'reference'].includes(hash)) {
        switchTab(hash, false);
    }
});
// Quick action functions
function focusSearch() {
    if (searchInput) {
        searchInput.focus();
        searchInput.select();
    }
    $('#quick-menu').classList.add('hidden');
}

function showRandomTense() {
    const randomTense = TENSES[Math.floor(Math.random() * TENSES.length)];
    openDetail(randomTense);
    $('#quick-menu').classList.add('hidden');
    showToast(`¡Descubre el ${randomTense.name}!`, 'info');
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const container = $('#toast-container');
    if (!container) return;

    const toast = el('div', `toast-${type} bg-white border border-slate-200 rounded-xl shadow-lg p-4 max-w-sm transform transition-all duration-300 translate-x-full opacity-0`);

    const content = el('div', 'flex items-center gap-3');

    // Icon based on type
    const iconMap = {
        'info': { icon: 'ℹ️', color: 'text-blue-600' },
        'success': { icon: '✅', color: 'text-green-600' },
        'warning': { icon: '⚠️', color: 'text-yellow-600' },
        'error': { icon: '❌', color: 'text-red-600' }
    };

    const iconData = iconMap[type] || iconMap.info;
    const icon = el('div', `text-xl ${iconData.color}`);
    icon.textContent = iconData.icon;

    const text = el('div', 'flex-1 text-sm font-medium text-slate-800');
    text.textContent = message;

    const closeBtn = el('button', 'text-slate-400 hover:text-slate-600 transition-colors');
    closeBtn.innerHTML = `
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 6L6 18"></path>
      <path d="M6 6l12 12"></path>
    </svg>
  `;

    content.appendChild(icon);
    content.appendChild(text);
    content.appendChild(closeBtn);
    toast.appendChild(content);

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    });

    // Auto remove
    const removeToast = () => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    };

    closeBtn.onclick = removeToast;

    if (duration > 0) {
        setTimeout(removeToast, duration);
    }
}

// Enhanced error handling
function handleError(error, context = 'Unknown') {
    console.error(`Error in ${context}:`, error);
    showToast(`Error: ${error.message || 'Algo salió mal'}`, 'error');
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    try {
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${(end - start).toFixed(2)}ms`);
        return result;
    } catch (error) {
        handleError(error, name);
        throw error;
    }
}

// Enhanced tab switching with performance monitoring
const originalSwitchTab = switchTab;
switchTab = function (tabName, updateHistory = true) {
    return measurePerformance(`Switch to ${tabName}`, () => {
        return originalSwitchTab(tabName, updateHistory);
    });
};

// Add loading states for better UX
function showLoadingState(element, message = 'Cargando...') {
    if (!element) return;

    const loader = el('div', 'flex items-center justify-center py-12');
    const spinner = el('div', 'animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3');
    const text = el('span', 'text-slate-600 font-medium');
    text.textContent = message;

    loader.appendChild(spinner);
    loader.appendChild(text);

    element.innerHTML = '';
    element.appendChild(loader);
}

// Improved search with analytics
let searchAnalytics = {
    queries: [],
    popularTerms: {}
};

function trackSearch(query) {
    if (!query.trim()) return;

    searchAnalytics.queries.push({
        query: query.toLowerCase(),
        timestamp: Date.now()
    });

    const term = query.toLowerCase();
    searchAnalytics.popularTerms[term] = (searchAnalytics.popularTerms[term] || 0) + 1;

    // Keep only last 100 searches
    if (searchAnalytics.queries.length > 100) {
        searchAnalytics.queries = searchAnalytics.queries.slice(-100);
    }

    saveToStorage('searchAnalytics', searchAnalytics);
}

// Load search analytics on init
function loadSearchAnalytics() {
    const saved = loadFromStorage('searchAnalytics', {});
    searchAnalytics = {
        queries: saved.queries || [],
        popularTerms: saved.popularTerms || {}
    };
}

// Walkthrough data - most important tenses and their relationships
const WALKTHROUGH_STEPS = [
    {
        title: "Los Tiempos Esenciales",
        subtitle: "Domina estos 8 tiempos y tendrás el 80% del español",
        description: "Esta guía te llevará por los tiempos verbales más importantes del español y cómo se relacionan entre sí.",
        icon: "🎯",
        type: "intro"
    },
    {
        title: "Presente - Tu Base",
        subtitle: "El tiempo más usado en español",
        tenseId: "ind-presente",
        description: "El presente es tu punto de partida. Se usa para hechos actuales, hábitos y situaciones permanentes.",
        keyPoints: [
            "Hechos: 'Vivo en Madrid'",
            "Hábitos: 'Siempre desayuno café'", 
            "Futuro cercano: 'Mañana salgo temprano'"
        ],
        relationship: "Es la base para formar otros tiempos",
        icon: "⏰"
    },
    {
        title: "Pretérito Perfecto Simple",
        subtitle: "Para acciones completadas",
        tenseId: "ind-pret-perf-sim",
        description: "Úsalo para acciones que ocurrieron y terminaron en un momento específico del pasado.",
        keyPoints: [
            "Momento específico: 'Ayer comí paella'",
            "Secuencia: 'Llegó, saludó y se fue'",
            "Eventos puntuales: 'En 2020 me gradué'"
        ],
        relationship: "Contrasta con el imperfecto - este es para acciones terminadas",
        icon: "✅"
    },
    {
        title: "Pretérito Imperfecto", 
        subtitle: "Para descripciones y hábitos pasados",
        tenseId: "ind-imperfecto",
        description: "El tiempo de las descripciones, contexto y acciones habituales en el pasado.",
        keyPoints: [
            "Hábitos: 'De niño jugaba fútbol'",
            "Descripciones: 'Era una noche fría'",
            "Acciones en progreso: 'Mientras cocinaba...'"
        ],
        relationship: "Complementa al pretérito - este da contexto, el otro da acción",
        icon: "🔄"
    },
    {
        title: "Pretérito Perfecto Compuesto",
        subtitle: "Pasado conectado al presente", 
        tenseId: "ind-pret-perf-comp",
        description: "Para acciones pasadas que tienen relevancia en el presente o en períodos no terminados.",
        keyPoints: [
            "Hoy: 'Hoy he visto a María'",
            "Esta semana: 'He trabajado mucho'",
            "Experiencias: 'Nunca he estado en Japón'"
        ],
        relationship: "Conecta pasado y presente - usa 'haber' + participio",
        icon: "🔗"
    },
    {
        title: "Futuro Simple",
        subtitle: "Predicciones y planes",
        tenseId: "ind-futuro", 
        description: "Para hablar del futuro, hacer predicciones y expresar probabilidad.",
        keyPoints: [
            "Predicción: 'Mañana lloverá'",
            "Promesa: 'Te llamaré esta noche'",
            "Probabilidad: 'Estará en casa' (supongo)"
        ],
        relationship: "Alternativa: 'ir a + infinitivo' para planes cercanos",
        icon: "🔮"
    },
    {
        title: "Presente de Subjuntivo",
        subtitle: "Deseos, dudas y emociones",
        tenseId: "subj-presente",
        description: "El modo de la subjetividad - deseos, dudas, emociones y mandatos indirectos.",
        keyPoints: [
            "Deseo: 'Quiero que vengas'",
            "Duda: 'No creo que llueva'",
            "Emoción: 'Me alegra que estés aquí'"
        ],
        relationship: "Depende de otro verbo - nunca va solo en oraciones principales",
        icon: "💭"
    },
    {
        title: "Imperfecto de Subjuntivo",
        subtitle: "Hipótesis y cortesía",
        tenseId: "subj-imperf",
        description: "Para situaciones hipotéticas, cortesía y el pasado del subjuntivo.",
        keyPoints: [
            "Hipótesis: 'Si tuviera dinero, viajaría'",
            "Cortesía: 'Quisiera un café, por favor'",
            "Pasado: 'Quería que vinieras'"
        ],
        relationship: "La forma educada del condicional y el pasado del subjuntivo",
        icon: "🤔"
    },
    {
        title: "Condicional Simple",
        subtitle: "Situaciones hipotéticas",
        tenseId: "ind-cond",
        description: "Para expresar lo que harías en ciertas condiciones o para ser cortés.",
        keyPoints: [
            "Hipótesis: 'Yo estudiaría más'",
            "Cortesía: '¿Podrías ayudarme?'",
            "Consejo: 'Deberías descansar'"
        ],
        relationship: "Pareja del imperfecto de subjuntivo en oraciones condicionales",
        icon: "🎭"
    },
    {
        title: "¡Felicidades!",
        subtitle: "Has completado la guía esencial",
        description: "Ahora conoces los 8 tiempos más importantes del español. Con estos puedes expresar prácticamente cualquier idea.",
        keyPoints: [
            "Presente → Base para todo",
            "Pretéritos → Diferentes tipos de pasado", 
            "Futuro → Planes y predicciones",
            "Subjuntivo → Subjetividad",
            "Condicional → Hipótesis"
        ],
        nextSteps: [
            "Practica combinando estos tiempos",
            "Explora el mapa visual completo",
            "Usa el asistente para casos específicos"
        ],
        icon: "🎉",
        type: "conclusion"
    }
];

// Walkthrough functions
function startWalkthrough() {
    if (!walkthroughModal || !walkthroughOverlay) return;
    
    isWalkthroughOpen = true;
    currentWalkthroughStep = 0;
    
    // Show modal
    walkthroughOverlay.classList.remove('hidden');
    walkthroughModal.classList.remove('hidden');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Render first step
    renderWalkthroughStep();
    
    // Close quick menu
    const quickMenu = $('#quick-menu');
    if (quickMenu) quickMenu.classList.add('hidden');
    
    announceToScreenReader('Iniciada guía de tiempos esenciales');
}

function closeWalkthrough() {
    if (!isWalkthroughOpen && !isDetailOpen) return;
    
    isWalkthroughOpen = false;
    isDetailOpen = false;
    
    // Hide modal
    walkthroughOverlay.classList.add('hidden');
    walkthroughModal.classList.add('hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    announceToScreenReader('Modal cerrado');
}

function renderWalkthroughStep() {
    if (!walkthroughModal) return;
    
    const step = WALKTHROUGH_STEPS[currentWalkthroughStep];
    if (!step) return;
    
    walkthroughModal.innerHTML = '';
    
    const container = el('div', 'h-full flex flex-col');
    
    // Header
    const header = el('div', 'flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white');
    
    const headerInfo = el('div', 'flex items-center gap-4');
    const stepIcon = el('div', 'w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl');
    stepIcon.textContent = step.icon;
    
    const stepInfo = el('div', '');
    const stepTitle = el('h2', 'text-2xl font-bold');
    stepTitle.textContent = step.title;
    const stepSubtitle = el('p', 'text-white/90');
    stepSubtitle.textContent = step.subtitle;
    
    stepInfo.appendChild(stepTitle);
    stepInfo.appendChild(stepSubtitle);
    headerInfo.appendChild(stepIcon);
    headerInfo.appendChild(stepInfo);
    
    const closeBtn = el('button', 'p-2 hover:bg-white/20 rounded-lg transition-colors');
    closeBtn.innerHTML = `
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
        </svg>
    `;
    closeBtn.onclick = closeWalkthrough;
    
    header.appendChild(headerInfo);
    header.appendChild(closeBtn);
    container.appendChild(header);
    
    // Progress bar
    const progressContainer = el('div', 'px-6 py-4 bg-slate-50 border-b border-slate-200');
    const progressInfo = el('div', 'flex items-center justify-between mb-2');
    const progressText = el('span', 'text-sm font-medium text-slate-600');
    progressText.textContent = `Paso ${currentWalkthroughStep + 1} de ${WALKTHROUGH_STEPS.length}`;
    const progressPercent = el('span', 'text-sm text-slate-500');
    progressPercent.textContent = `${Math.round(((currentWalkthroughStep + 1) / WALKTHROUGH_STEPS.length) * 100)}%`;
    
    progressInfo.appendChild(progressText);
    progressInfo.appendChild(progressPercent);
    progressContainer.appendChild(progressInfo);
    
    const progressBar = el('div', 'w-full bg-slate-200 rounded-full h-2');
    const progressFill = el('div', 'bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500');
    progressFill.style.width = `${((currentWalkthroughStep + 1) / WALKTHROUGH_STEPS.length) * 100}%`;
    progressBar.appendChild(progressFill);
    progressContainer.appendChild(progressBar);
    container.appendChild(progressContainer);
    
    // Content
    const content = el('div', 'flex-1 overflow-y-auto p-6 custom-scrollbar');
    
    if (step.type === 'intro') {
        renderIntroStep(content, step);
    } else if (step.type === 'conclusion') {
        renderConclusionStep(content, step);
    } else {
        renderTenseStep(content, step);
    }
    
    container.appendChild(content);
    
    // Footer with navigation
    const footer = el('div', 'flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50');
    
    const prevBtn = el('button', 'btn-secondary flex items-center gap-2');
    prevBtn.innerHTML = `
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
        </svg>
        Anterior
    `;
    prevBtn.disabled = currentWalkthroughStep === 0;
    if (prevBtn.disabled) {
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
    prevBtn.onclick = () => {
        if (currentWalkthroughStep > 0) {
            currentWalkthroughStep--;
            renderWalkthroughStep();
            // Scroll to top of modal content
            setTimeout(() => {
                walkthroughModal.scrollTop = 0;
            }, 100);
        }
    };
    
    const nextBtn = el('button', 'btn-primary flex items-center gap-2');
    if (currentWalkthroughStep === WALKTHROUGH_STEPS.length - 1) {
        nextBtn.innerHTML = `
            Finalizar
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
            </svg>
        `;
        nextBtn.onclick = closeWalkthrough;
    } else {
        nextBtn.innerHTML = `
            Siguiente
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
            </svg>
        `;
        nextBtn.onclick = () => {
            currentWalkthroughStep++;
            renderWalkthroughStep();
            // Scroll to top of modal content
            setTimeout(() => {
                walkthroughModal.scrollTop = 0;
            }, 100);
        };
    }
    
    footer.appendChild(prevBtn);
    footer.appendChild(nextBtn);
    container.appendChild(footer);
    
    walkthroughModal.appendChild(container);
}

function renderIntroStep(content, step) {
    const intro = el('div', 'text-center max-w-2xl mx-auto');
    
    const bigIcon = el('div', 'text-6xl mb-6');
    bigIcon.textContent = step.icon;
    
    const description = el('p', 'text-lg text-slate-700 leading-relaxed mb-8');
    description.textContent = step.description;
    
    const features = el('div', 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8');
    const featureList = [
        { icon: '⚡', title: 'Rápido', desc: 'Solo 8 tiempos esenciales' },
        { icon: '🎯', title: 'Efectivo', desc: 'Cubre el 80% del uso diario' },
        { icon: '🔗', title: 'Conectado', desc: 'Aprende las relaciones entre tiempos' }
    ];
    
    featureList.forEach(feature => {
        const featureCard = el('div', 'bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center border border-indigo-100');
        const featureIcon = el('div', 'text-3xl mb-3');
        featureIcon.textContent = feature.icon;
        const featureTitle = el('h3', 'font-bold text-slate-800 mb-2');
        featureTitle.textContent = feature.title;
        const featureDesc = el('p', 'text-sm text-slate-600');
        featureDesc.textContent = feature.desc;
        
        featureCard.appendChild(featureIcon);
        featureCard.appendChild(featureTitle);
        featureCard.appendChild(featureDesc);
        features.appendChild(featureCard);
    });
    
    intro.appendChild(bigIcon);
    intro.appendChild(description);
    intro.appendChild(features);
    content.appendChild(intro);
}

function renderTenseStep(content, step) {
    const tense = TENSES.find(t => t.id === step.tenseId);
    if (!tense) return;
    
    // Tense overview
    const overview = el('div', 'bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 mb-6');
    const overviewHeader = el('div', 'flex items-center gap-4 mb-4');
    
    const tenseIcon = el('div', 'w-12 h-12 rounded-xl bg-gradient-to-r ' + moodColor(tense.mood) + ' flex items-center justify-center text-white text-xl');
    tenseIcon.textContent = step.icon;
    
    const tenseInfo = el('div', '');
    const tenseName = el('h3', 'text-xl font-bold text-slate-800');
    tenseName.textContent = tense.name;
    const tenseMood = el('div', 'flex items-center gap-2 mt-1');
    const moodBadgeEl = el('span', `badge ${moodBadge(tense.mood)} shadow-sm`);
    moodBadgeEl.textContent = tense.mood;
    const timeChip = el('span', 'chip bg-slate-200 text-slate-700');
    timeChip.textContent = tense.time;
    tenseMood.appendChild(moodBadgeEl);
    tenseMood.appendChild(timeChip);
    
    tenseInfo.appendChild(tenseName);
    tenseInfo.appendChild(tenseMood);
    overviewHeader.appendChild(tenseIcon);
    overviewHeader.appendChild(tenseInfo);
    overview.appendChild(overviewHeader);
    
    const description = el('p', 'text-slate-700 leading-relaxed');
    description.textContent = step.description;
    overview.appendChild(description);
    content.appendChild(overview);
    
    // Key points
    if (step.keyPoints) {
        const keyPointsSection = el('div', 'mb-6');
        const keyPointsTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        keyPointsTitle.innerHTML = `
            <svg class="w-5 h-5 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.03 0 3.89.67 5.39 1.8"></path>
            </svg>
            Puntos Clave
        `;
        
        const keyPointsList = el('div', 'space-y-3');
        step.keyPoints.forEach(point => {
            const pointCard = el('div', 'bg-white rounded-lg p-4 border border-slate-200 shadow-sm');
            const pointText = el('p', 'text-slate-700');
            pointText.textContent = point;
            pointCard.appendChild(pointText);
            keyPointsList.appendChild(pointCard);
        });
        
        keyPointsSection.appendChild(keyPointsTitle);
        keyPointsSection.appendChild(keyPointsList);
        content.appendChild(keyPointsSection);
    }
    
    // Examples from tense data
    if (tense.examples && tense.examples.length > 0) {
        const examplesSection = el('div', 'mb-6');
        const examplesTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        examplesTitle.innerHTML = `
            <svg class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 8h10"></path>
                <path d="M7 12h4"></path>
                <path d="M7 16h1"></path>
                <path d="M17 4v16l-5-3-5 3V4z"></path>
            </svg>
            Ejemplos
        `;
        
        const examplesList = el('div', 'space-y-3');
        tense.examples.slice(0, 2).forEach(example => {
            const exampleCard = el('div', 'bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200');
            const spanish = el('div', 'font-semibold text-slate-800 mb-1');
            spanish.textContent = `"${example.es}"`;
            const english = el('div', 'text-slate-600 text-sm');
            english.textContent = example.en;
            exampleCard.appendChild(spanish);
            exampleCard.appendChild(english);
            examplesList.appendChild(exampleCard);
        });
        
        examplesSection.appendChild(examplesTitle);
        examplesSection.appendChild(examplesList);
        content.appendChild(examplesSection);
    }
    
    // Relationship
    if (step.relationship) {
        const relationshipSection = el('div', 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200');
        const relationshipTitle = el('h4', 'font-bold text-blue-900 mb-3 flex items-center gap-2');
        relationshipTitle.innerHTML = `
            <svg class="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 6.1H3"></path>
                <path d="M21 12.1H3"></path>
                <path d="M15.1 18H3"></path>
            </svg>
            Relación con otros tiempos
        `;
        const relationshipText = el('p', 'text-blue-800 leading-relaxed');
        relationshipText.textContent = step.relationship;
        
        relationshipSection.appendChild(relationshipTitle);
        relationshipSection.appendChild(relationshipText);
        content.appendChild(relationshipSection);
    }
    
    // Quick action to show more details inline
    const actionSection = el('div', 'text-center mt-6');
    const exploreBtn = el('button', 'btn-secondary');
    exploreBtn.innerHTML = `
        <span class="flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"></path>
            </svg>
            Ver más detalles
        </span>
    `;
    exploreBtn.onclick = () => {
        showExpandedTenseDetails(content, tense, exploreBtn);
    };
    actionSection.appendChild(exploreBtn);
    content.appendChild(actionSection);
}

function renderConclusionStep(content, step) {
    const conclusion = el('div', 'text-center max-w-2xl mx-auto');
    
    const bigIcon = el('div', 'text-6xl mb-6');
    bigIcon.textContent = step.icon;
    
    const description = el('p', 'text-lg text-slate-700 leading-relaxed mb-8');
    description.textContent = step.description;
    
    // Summary of what was learned
    if (step.keyPoints) {
        const summarySection = el('div', 'mb-8');
        const summaryTitle = el('h4', 'font-bold text-slate-800 mb-4');
        summaryTitle.textContent = 'Resumen de lo aprendido:';
        
        const summaryList = el('div', 'space-y-2');
        step.keyPoints.forEach(point => {
            const pointItem = el('div', 'flex items-center gap-3 text-left bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200');
            const checkIcon = el('div', 'text-green-600');
            checkIcon.innerHTML = `
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
            `;
            const pointText = el('span', 'text-slate-700 font-medium');
            pointText.textContent = point;
            pointItem.appendChild(checkIcon);
            pointItem.appendChild(pointText);
            summaryList.appendChild(pointItem);
        });
        
        summarySection.appendChild(summaryTitle);
        summarySection.appendChild(summaryList);
        conclusion.appendChild(summarySection);
    }
    
    // Next steps
    if (step.nextSteps) {
        const nextStepsSection = el('div', 'mb-8');
        const nextStepsTitle = el('h4', 'font-bold text-slate-800 mb-4');
        nextStepsTitle.textContent = 'Próximos pasos:';
        
        const nextStepsList = el('div', 'grid grid-cols-1 md:grid-cols-3 gap-4');
        step.nextSteps.forEach((nextStep, index) => {
            const stepCard = el('div', 'bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200 text-center');
            const stepNumber = el('div', 'w-8 h-8 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center mx-auto mb-2');
            stepNumber.textContent = index + 1;
            const stepText = el('p', 'text-sm text-slate-700 font-medium');
            stepText.textContent = nextStep;
            stepCard.appendChild(stepNumber);
            stepCard.appendChild(stepText);
            nextStepsList.appendChild(stepCard);
        });
        
        nextStepsSection.appendChild(nextStepsTitle);
        nextStepsSection.appendChild(nextStepsList);
        conclusion.appendChild(nextStepsSection);
    }
    
    content.appendChild(conclusion);
}

// Enhanced initialization
const originalInit = init;
init = function () {
    try {
        loadSearchAnalytics();
        originalInit();
        showToast('¡Bienvenido al Atlas de Tiempos Verbales!', 'success');
    } catch (error) {
        handleError(error, 'Initialization');
    }
};

// Function to show expanded tense details inline in walkthrough
function showExpandedTenseDetails(content, tense, exploreBtn) {
    // Hide the explore button
    exploreBtn.style.display = 'none';
    
    // Create expanded details section
    const expandedSection = el('div', 'mt-6 space-y-6 border-t border-slate-200 pt-6');
    
    // All usage examples
    if (tense.usage && tense.usage.length > 2) {
        const allUsageSection = el('div', '');
        const allUsageTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        allUsageTitle.innerHTML = `
            <svg class="w-5 h-5 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"></path>
                <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.03 0 3.89.67 5.39 1.8"></path>
            </svg>
            Todos los Usos
        `;
        
        const allUsageList = el('div', 'space-y-3');
        tense.usage.forEach((use, index) => {
            const useCard = el('div', 'bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200');
            const useNumber = el('span', 'inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold mr-3');
            useNumber.textContent = index + 1;
            const useText = el('span', 'text-slate-700');
            useText.textContent = use;
            
            const useContent = el('div', 'flex items-start');
            useContent.appendChild(useNumber);
            useContent.appendChild(useText);
            useCard.appendChild(useContent);
            allUsageList.appendChild(useCard);
        });
        
        allUsageSection.appendChild(allUsageTitle);
        allUsageSection.appendChild(allUsageList);
        expandedSection.appendChild(allUsageSection);
    }
    
    // All examples
    if (tense.examples && tense.examples.length > 2) {
        const allExamplesSection = el('div', '');
        const allExamplesTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        allExamplesTitle.innerHTML = `
            <svg class="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 8h10"></path>
                <path d="M7 12h4"></path>
                <path d="M7 16h1"></path>
                <path d="M17 4v16l-5-3-5 3V4z"></path>
            </svg>
            Más Ejemplos
        `;
        
        const allExamplesList = el('div', 'grid grid-cols-1 md:grid-cols-2 gap-4');
        tense.examples.slice(2).forEach(example => {
            const exampleCard = el('div', 'bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200');
            const spanish = el('div', 'font-semibold text-slate-800 mb-1');
            spanish.textContent = `"${example.es}"`;
            const english = el('div', 'text-slate-600 text-sm');
            english.textContent = example.en;
            exampleCard.appendChild(spanish);
            exampleCard.appendChild(english);
            allExamplesList.appendChild(exampleCard);
        });
        
        allExamplesSection.appendChild(allExamplesTitle);
        allExamplesSection.appendChild(allExamplesList);
        expandedSection.appendChild(allExamplesSection);
    }
    
    // Formation details
    if (tense.formation) {
        const formationSection = el('div', '');
        const formationTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        formationTitle.innerHTML = `
            <svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Cómo se Forma
        `;
        
        const formationCard = el('div', 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200');
        const formationText = el('div', 'font-mono text-slate-800 text-lg font-semibold mb-3');
        formationText.textContent = tense.formation;
        
        const formationDesc = el('div', 'text-slate-600 text-sm');
        formationDesc.textContent = 'Fórmula para conjugar este tiempo verbal';
        
        formationCard.appendChild(formationText);
        formationCard.appendChild(formationDesc);
        formationSection.appendChild(formationTitle);
        formationSection.appendChild(formationCard);
        expandedSection.appendChild(formationSection);
    }
    
    // Conjugation preview
    const conjugationSection = buildConjugationSection(tense);
    if (conjugationSection) {
        const conjugationTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        conjugationTitle.innerHTML = `
            <svg class="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <path d="M14 2v6h6"></path>
                <path d="M16 13H8"></path>
                <path d="M16 17H8"></path>
                <path d="M10 9H8"></path>
            </svg>
            Conjugación
        `;
        
        const conjugationWrapper = el('div', '');
        conjugationWrapper.appendChild(conjugationTitle);
        conjugationWrapper.appendChild(conjugationSection);
        expandedSection.appendChild(conjugationWrapper);
    }
    
    // Tags if available
    if (tense.tags && tense.tags.length > 0) {
        const tagsSection = el('div', '');
        const tagsTitle = el('h4', 'font-bold text-slate-800 mb-3 flex items-center gap-2');
        tagsTitle.innerHTML = `
            <svg class="w-5 h-5 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            Etiquetas
        `;
        
        const tagsList = el('div', 'flex flex-wrap gap-2');
        tense.tags.forEach(tag => {
            const tagEl = el('span', 'chip bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium');
            tagEl.textContent = tag;
            tagsList.appendChild(tagEl);
        });
        
        tagsSection.appendChild(tagsTitle);
        tagsSection.appendChild(tagsList);
        expandedSection.appendChild(tagsSection);
    }
    
    // Add collapse button
    const collapseSection = el('div', 'text-center mt-6 pt-4 border-t border-slate-200');
    const collapseBtn = el('button', 'btn-secondary');
    collapseBtn.innerHTML = `
        <span class="flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 15l-6-6-6 6"></path>
            </svg>
            Ocultar detalles
        </span>
    `;
    collapseBtn.onclick = () => {
        expandedSection.remove();
        exploreBtn.style.display = 'block';
    };
    collapseSection.appendChild(collapseBtn);
    expandedSection.appendChild(collapseSection);
    
    // Add the expanded section to content
    content.appendChild(expandedSection);
    
    // Smooth scroll to the expanded content
    setTimeout(() => {
        expandedSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}