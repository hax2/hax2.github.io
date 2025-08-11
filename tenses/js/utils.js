/* ------------------ UTILS ------------------ */

// DOM utilities - Fixed the duplicate function issue
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

// Element creation helper
const el = (tag, cls = "", html = "") => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
};

// Class name utility
function classNames(...xs) {
  return xs.filter(Boolean).join(" ");
}

// Search function with proper string handling
function searchAmong(tenses, q) {
  const s = q.trim().toLowerCase();
  if (!s) return tenses;

  return tenses.filter(t => {
    const searchableText = [
      t.name,
      t.mood,
      t.time,
      t.aspect,
      ...(t.tags || []),
      ...(t.usage || [])
    ].join(" ").toLowerCase();

    return searchableText.includes(s);
  });
}

// Debounce utility for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling wrapper
function safeExecute(fn, fallback = null) {
  try {
    return fn();
  } catch (error) {
    console.error('Error executing function:', error);
    return fallback;
  }
}

// Animation utilities
function fadeIn(element, duration = 200) {
  element.style.opacity = '0';
  element.style.display = 'block';

  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.min(progress / duration, 1);

    element.style.opacity = opacity;

    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function fadeOut(element, duration = 200) {
  let start = null;
  const initialOpacity = parseFloat(getComputedStyle(element).opacity);

  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const opacity = Math.max(initialOpacity - (progress / duration), 0);

    element.style.opacity = opacity;

    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      element.style.display = 'none';
    }
  }

  requestAnimationFrame(animate);
}

// Local storage utilities
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Could not save to localStorage:', error);
  }
}

function loadFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Could not load from localStorage:', error);
    return defaultValue;
  }
}

// Accessibility helpers
function announceToScreenReader(message) {
  const announcement = el('div', 'sr-only');
  announcement.setAttribute('aria-live', 'polite');
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Keyboard navigation helper
function handleKeyboardNavigation(event, elements, currentIndex) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      return Math.min(currentIndex + 1, elements.length - 1);
    case 'ArrowUp':
      event.preventDefault();
      return Math.max(currentIndex - 1, 0);
    case 'Home':
      event.preventDefault();
      return 0;
    case 'End':
      event.preventDefault();
      return elements.length - 1;
    default:
      return currentIndex;
  }
}