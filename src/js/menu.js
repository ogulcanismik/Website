import { openPanel } from './panels.js';

export function initMenu() {
  const columns = document.querySelectorAll('.menu__column');

  columns.forEach((col) => {
    col.addEventListener('click', () => {
      const panelId = col.dataset.panel;
      if (panelId) openPanel(panelId);
    });
  });
}
