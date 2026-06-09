import '../styles/base.css';
import '../styles/controls.css';
import '../styles/identity.css';
import '../styles/welcome.css';
import '../styles/menu.css';
import '../styles/panels.css';
import '../styles/fantasy.css';
import '../styles/responsive.css';

import { initTheme } from './theme.js';
import { initI18n, applyStaticContent } from './i18n.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initWelcome } from './welcome.js';
import { renderPanels, rerenderPanels } from './render-panels.js';
import { initPanels, getActivePanel, restorePanelOpen } from './panels.js';
import { initMenu } from './menu.js';
import { initBackToMenu } from './back-to-menu.js';

function handleLocaleChange() {
  const activePanel = getActivePanel();
  const container = document.querySelector('.panels__wrapper');
  if (!container) return;

  rerenderPanels(container);
  if (activePanel) restorePanelOpen(activePanel);
}

function init() {
  initTheme();
  applyStaticContent();

  const panelsContainer = document.querySelector('.panels__wrapper');
  if (panelsContainer) renderPanels(panelsContainer);

  initI18n();
  document.addEventListener('locale:changed', handleLocaleChange);

  initSmoothScroll();
  initWelcome();
  initPanels();
  initMenu();
  initBackToMenu();
}

document.addEventListener('DOMContentLoaded', init);
