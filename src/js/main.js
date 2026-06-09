import '../styles/base.css';
import '../styles/welcome.css';
import '../styles/menu.css';
import '../styles/panels.css';
import '../styles/responsive.css';

import { site } from '../data/site.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initWelcome } from './welcome.js';
import { renderPanels } from './render-panels.js';
import { initPanels } from './panels.js';
import { initMenu } from './menu.js';
import { initBackToMenu } from './back-to-menu.js';

function populateSiteContent() {
  const nameEl = document.querySelector('.welcome__name');
  const roleEl = document.querySelector('.welcome__role');
  if (nameEl) nameEl.textContent = site.name;
  if (roleEl) roleEl.textContent = site.role;
}

function init() {
  populateSiteContent();

  const panelsContainer = document.querySelector('.panels__wrapper');
  if (panelsContainer) renderPanels(panelsContainer);

  initSmoothScroll();
  initWelcome();
  initPanels();
  initMenu();
  initBackToMenu();
}

document.addEventListener('DOMContentLoaded', init);
