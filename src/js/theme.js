const STORAGE_KEY = 'theme';
const THEMES = ['dark', 'light'];

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

export function getTheme() {
  return currentTheme;
}

export function setTheme(theme) {
  if (!THEMES.includes(theme) || theme === currentTheme) return;

  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  updateThemeColor(theme);
  updateToggle(theme);
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

  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeColor(currentTheme);
  updateToggle(currentTheme);

  const btn = document.querySelector('.theme-toggle');
  if (btn) {
    btn.addEventListener('click', () => {
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }
}
