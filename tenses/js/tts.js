/* ------------------ TEXT-TO-SPEECH FUNCTIONS ------------------ */

// TTS functionality for Spanish text
function speakText(text, lang = 'es-ES') {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8; // Slightly slower for learning
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Try to use a Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') || 
      voice.name.toLowerCase().includes('spanish') ||
      voice.name.toLowerCase().includes('español')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Text-to-speech not supported in this browser');
  }
}

// Create a TTS button component
function createTTSButton(text, className = "btn-secondary text-sm") {
  const btn = el("button", className);
  btn.innerHTML = `
    <span class="flex items-center gap-2">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 5L6 9H2v6h4l5 4V5z"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      </svg>
      Escuchar
    </span>
  `;
  
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    speakText(text);
  };
  
  return btn;
}

// Initialize voices when they become available
function initializeTTS() {
  if ('speechSynthesis' in window) {
    // Load voices
    window.speechSynthesis.getVoices();
    
    // Some browsers need this event to load voices
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }
}

// Initialize TTS when the page loads
document.addEventListener('DOMContentLoaded', initializeTTS);