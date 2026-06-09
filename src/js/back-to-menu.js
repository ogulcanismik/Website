import { scrollTo } from './smooth-scroll.js';
import { closePanel, getActivePanel } from './panels.js';

export function initBackToMenu() {
  const btn = document.querySelector('.back-to-menu');
  if (!btn) return;

  document.addEventListener('panel:opened', () => {
    btn.classList.add('is-visible');
    btn.setAttribute('aria-hidden', 'false');
  });

  document.addEventListener('panel:closed', () => {
    btn.classList.remove('is-visible');
    btn.setAttribute('aria-hidden', 'true');
  });

  btn.addEventListener('click', async () => {
    if (!getActivePanel()) {
      scrollTo('#menu');
      return;
    }

    await closePanel({ scroll: false });
    scrollTo('#menu', { duration: 1.2 });
  });
}
