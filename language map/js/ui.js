// UI Components and Rendering (Refactored)
import MapView from './MapView.js';
import FlashcardView from './FlashcardView.js';
import QuizView from './QuizView.js';
import CallResponseView from './CallResponseView.js';
import SettingsModal from './SettingsModal.js';
import ProgressView from './ProgressView.js';
import { makeWordsClickable, showPopup, hidePopup } from './uiUtils.js';

class LanguageGameUI {
  constructor() {
    this.elements = {
      xpCounter: document.getElementById('xpCounter'),
      mapContainer: document.getElementById('mapContainer'),
      panelTitle: document.getElementById('panelTitle'),
      panelBody: document.getElementById('panelBody'),
      progressContainer: document.getElementById('progressContainer'),
      flashcardBtn: document.getElementById('flashcardBtn'),
      quizBtn: document.getElementById('quizBtn'),
      crBtn: document.getElementById('crBtn'),
      levelLabel: document.getElementById('levelLabel'),
      xpBar: document.getElementById('xpBar')
    };

    // Instantiate views
    this.mapView = new MapView(this);
    this.flashcardView = new FlashcardView(this);
    this.quizView = new QuizView(this);
    this.callResponseView = new CallResponseView(this);
    this.settingsModal = new SettingsModal(this);
    this.progressView = new ProgressView(this);

    this.currentTab = 'map';
    this.currentCardIndex = 0;
    this.currentCards = [];
    this.currentCard = null;
    this.popup = null;

    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.elements.flashcardBtn.addEventListener('click', () => this.switchMode('flashcard'));
    this.elements.quizBtn.addEventListener('click', () => this.switchMode('quiz'));
    this.elements.crBtn.addEventListener('click', () => this.switchMode('call-response'));

    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        this.switchTab(tabName);
      });
    });

    document.addEventListener('click', (e) => {
      if (this.popup && !this.popup.contains(e.target) && !e.target.classList.contains('clickable-word')) {
        hidePopup();
      }
    });
  }

  switchTab(tabName) {
    switch (tabName) {
      case 'map':
        this.mapView.renderMap();
        break;
      case 'game':
        this.renderCurrentMode();
        break;
      case 'progress':
        this.progressView.renderProgress();
        break;
    }
    this.currentTab = tabName;
    localStorage.setItem('currentTab', tabName);
  }

  renderCurrentMode() {
    switch (game.currentMode) {
      case 'flashcard':
        this.flashcardView.renderFlashcards();
        break;
      case 'quiz':
        this.quizView.renderQuiz();
        break;
      case 'call-response':
        this.callResponseView.renderCallResponse();
        break;
    }
  }

  showSettings() {
    this.settingsModal.showSettings();
  }

  saveSettings() {
    this.settingsModal.saveSettings();
  }

  resetSettings() {
    this.settingsModal.resetSettings();
  }

  closeSettings() {
    this.settingsModal.closeSettings();
  }

  speakCard(text, lang = 'es') {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported.');
    }
  }
}

const ui = new LanguageGameUI();
// Expose subcomponents for global access (for inline event handlers)
ui.mapView = ui.mapView;
ui.flashcardView = ui.flashcardView;
ui.quizView = ui.quizView;
ui.callResponseView = ui.callResponseView;
ui.settingsModal = ui.settingsModal;
ui.progressView = ui.progressView;

// Expose ui globally for inline event handlers and other modules
window.ui = ui;