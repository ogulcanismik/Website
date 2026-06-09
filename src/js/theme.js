const STORAGE_KEY = 'theme';
const THEMES = ['dark', 'light'];
const THEME_TRANSITION_MS = 450;

let currentTheme = 'dark';

function updateThemeColor(theme) {
  const color = theme === 'light' ? '#e8eaef' : '#12151c';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', color);
}

function updateToggle(theme) {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  const isDark = theme === 'dark';
  btn.setAttribute('aria-label', isDark ? btn.dataset.labelLight : btn.dataset.labelDark);
  btn.textContent = isDark ? '☀' : '☾';
}

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateThemeColor(theme);
  updateToggle(theme);
}

function applyThemeWithTransition(theme) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    applyTheme(theme);
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(() => applyTheme(theme));
    return;
  }

  const root = document.documentElement;
  root.classList.add('theme-transition');
  applyTheme(theme);
  window.setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_MS);
}

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  if (!THEMES.includes(theme) || theme === currentTheme) return;
  applyThemeWithTransition(theme);
}

export function refreshThemeToggle() {
  updateToggle(currentTheme);
}

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && THEMES.includes(saved)) {
    currentTheme = saved;
  } else {
    currentTheme = 'dark';
  }

  applyTheme(currentTheme);

  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }
}
