import { getContent } from './i18n.js';
import { parseNameParts } from './name-parts.js';

const HOLD_DELAY = 850;
const EXPAND_DURATION = 800;

function measurePartWidth(text, referenceEl) {
  const probe = document.createElement('span');
  probe.textContent = text;
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText =
    'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;pointer-events:none;';
  const style = getComputedStyle(referenceEl);
  probe.style.font = style.font;
  probe.style.letterSpacing = style.letterSpacing;
  referenceEl.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

function applyNameParts(nameEl, parts) {
  nameEl.querySelector('.welcome__name-o').textContent = parts.first;
  nameEl.querySelector('.welcome__name-middle').textContent = parts.middle;
  nameEl.querySelector('.welcome__name-i').textContent = parts.lastInitial;
  nameEl.querySelector('.welcome__name-rest').textContent = parts.lastRest;
}

function finishExpanded(welcome, nameEl, middleEl, restEl) {
  welcome.classList.add('is-expanded', 'is-revealed');
  nameEl.classList.add('is-expanded', 'is-revealed');
  middleEl.style.maxWidth = '';
  restEl.style.maxWidth = '';
}

async function runWelcomeMorph() {
  const welcome = document.querySelector('.welcome');
  const nameEl = document.querySelector('.welcome__name');
  const middleEl = nameEl?.querySelector('.welcome__name-middle');
  const restEl = nameEl?.querySelector('.welcome__name-rest');

  if (!welcome || !nameEl || !middleEl || !restEl) return;

  const { site } = getContent();
  const parts = parseNameParts(site.name);
  applyNameParts(nameEl, parts);
  nameEl.setAttribute('aria-label', site.name);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const middleWidth = measurePartWidth(parts.middle, nameEl);
  const restWidth = measurePartWidth(parts.lastRest, nameEl);

  middleEl.style.setProperty('--expand-width', `${middleWidth}px`);
  restEl.style.setProperty('--expand-width', `${restWidth}px`);

  welcome.classList.add('is-ready');

  if (prefersReducedMotion) {
    finishExpanded(welcome, nameEl, middleEl, restEl);
    return;
  }

  window.setTimeout(() => {
    welcome.classList.add('is-expanded');
    nameEl.classList.add('is-expanded');

    window.setTimeout(() => {
      finishExpanded(welcome, nameEl, middleEl, restEl);
    }, EXPAND_DURATION);
  }, HOLD_DELAY);
}

export function initWelcome() {
  void runWelcomeMorph();
}
