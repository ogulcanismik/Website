import en from '../data/i18n/en.js';
import tr from '../data/i18n/tr.js';
import { refreshThemeToggle } from './theme.js';

const locales = { en, tr };
const STORAGE_KEY = 'locale';

let currentLocale = 'en';

const savedLocale = localStorage.getItem(STORAGE_KEY);
if (savedLocale && locales[savedLocale]) {
  currentLocale = savedLocale;
}

export function getLocale() {
  return currentLocale;
}

export function getContent() {
  return locales[currentLocale];
}

function resolveSocialLabel(social, ui) {
  if (social.labelKey) return ui.social[social.labelKey] ?? social.labelKey;
  return social.label;
}

export { resolveSocialLabel };

function updateMeta(content) {
  document.title = content.meta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', content.meta.description);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', content.meta.title);

  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute('content', content.meta.description);
}

function updateWelcome(content) {
  const nameEl = document.querySelector('.welcome__name');
  const roleEl = document.querySelector('.welcome__role');
  const hintEl = document.querySelector('.welcome__hint');

  if (nameEl) nameEl.textContent = content.site.name;
  if (roleEl) roleEl.textContent = content.site.role;
  if (hintEl) {
    hintEl.innerHTML = `${content.ui.scroll}<span class="welcome__hint-arrow">↓</span>`;
  }
}

function updateMenu(content) {
  document.querySelectorAll('.menu__column').forEach((col) => {
    const key = col.dataset.panel;
    const label = col.querySelector('.menu__label');
    if (label && content.ui.menu[key]) {
      label.textContent = content.ui.menu[key];
    }
  });
}

function updateBackButton(content) {
  const btn = document.querySelector('.back-to-menu');
  if (btn) btn.textContent = content.ui.backToMenu;
}

function updateLangToggle() {
  document.querySelectorAll('.lang-toggle__btn').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.lang === currentLocale);
    btn.setAttribute('aria-pressed', btn.dataset.lang === currentLocale ? 'true' : 'false');
  });
}

function updateThemeLabels(content) {
  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;
  btn.dataset.labelLight = content.ui.themeToLight;
  btn.dataset.labelDark = content.ui.themeToDark;
  refreshThemeToggle();
}

export function applyStaticContent() {
  const content = getContent();
  document.documentElement.lang = currentLocale;
  updateMeta(content);
  updateWelcome(content);
  updateMenu(content);
  updateBackButton(content);
  updateLangToggle();
  updateThemeLabels(content);
}

export function setLocale(locale) {
  if (!locales[locale] || locale === currentLocale) return;

  currentLocale = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  applyStaticContent();
  document.dispatchEvent(new CustomEvent('locale:changed'));
}

export function initI18n() {
  applyStaticContent();

  document.querySelectorAll('.lang-toggle__btn').forEach((btn) => {
    btn.addEventListener('click', () => setLocale(btn.dataset.lang));
  });
}
