import { scrollTo, getLenis } from './smooth-scroll.js';
import { closePanel, getActivePanel } from './panels.js';

const MENU_VISIBILITY_THRESHOLD = 72;

function isMenuSubstantiallyVisible(menu) {
  const rect = menu.getBoundingClientRect();
  const vh = window.innerHeight;
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(vh, rect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  return visibleHeight > MENU_VISIBILITY_THRESHOLD;
}

function updateBackToMenuVisibility(btn, panelOpen) {
  const menu = document.getElementById('menu');
  const shouldShow = panelOpen && menu && !isMenuSubstantiallyVisible(menu);

  btn.classList.toggle('is-visible', shouldShow);
  btn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
}

export function initBackToMenu() {
  const btn = document.querySelector('.back-to-menu');
  if (!btn) return;

  let panelOpen = false;

  const onScroll = () => updateBackToMenuVisibility(btn, panelOpen);

  document.addEventListener('panel:opened', () => {
    panelOpen = true;
    onScroll();
  });

  document.addEventListener('panel:closed', () => {
    panelOpen = false;
    onScroll();
  });

  const lenis = getLenis();
  if (lenis) {
    lenis.on('scroll', onScroll);
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  window.addEventListener('resize', onScroll, { passive: true });

  btn.addEventListener('click', async () => {
    if (!getActivePanel()) {
      scrollTo('#menu');
      return;
    }

    await closePanel({ scroll: false });
    scrollTo('#menu', { duration: 1.2 });
  });
}
