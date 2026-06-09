import { gsap } from 'gsap';
import { scrollTo } from './smooth-scroll.js';

let activePanel = null;
let isAnimating = false;

const wrapper = () => document.querySelector('.panels__wrapper');
const panels = () => document.querySelectorAll('.panel');
const menuColumns = () => document.querySelectorAll('.menu__column');

function setMenuState(panelId) {
  menuColumns().forEach((col) => {
    const id = col.dataset.panel;
    col.classList.toggle('is-active', id === panelId);
    col.classList.toggle('is-dimmed', panelId !== null && id !== panelId);
  });
}

function showPanel(panelId) {
  panels().forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.panel === panelId);
  });
}

export function openPanel(panelId, { scroll = true } = {}) {
  if (isAnimating) return;
  const wrap = wrapper();
  const panel = document.getElementById(`panel-${panelId}`);
  if (!wrap || !panel) return;

  const isSamePanel = activePanel === panelId;
  if (isSamePanel && wrap.classList.contains('is-open')) {
    if (scroll) scrollTo(panel, { offset: -20 });
    return;
  }

  isAnimating = true;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finishOpen = () => {
    activePanel = panelId;
    setMenuState(panelId);
    isAnimating = false;
    document.dispatchEvent(new CustomEvent('panel:opened', { detail: { panelId } }));
    if (scroll) {
      requestAnimationFrame(() => scrollTo(panel, { offset: -20, duration: prefersReducedMotion ? 0 : 1.2 }));
    }
  };

  if (activePanel && activePanel !== panelId) {
    closePanel({ scroll: false }).then(() => openPanel(panelId, { scroll }));
    return;
  }

  showPanel(panelId);
  wrap.classList.add('is-open');

  if (prefersReducedMotion) {
    gsap.set(wrap, { height: 'auto' });
    finishOpen();
    return;
  }

  gsap.fromTo(
    wrap,
    { height: 0 },
    {
      height: 'auto',
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: finishOpen,
    }
  );

  gsap.fromTo(
    panel,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: 0.15 }
  );
}

export function closePanel({ scroll = false } = {}) {
  return new Promise((resolve) => {
    const wrap = wrapper();
    if (!wrap || !activePanel) {
      resolve();
      return;
    }

    isAnimating = true;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finishClose = () => {
      wrap.classList.remove('is-open');
      panels().forEach((p) => p.classList.remove('is-active'));
      activePanel = null;
      setMenuState(null);
      isAnimating = false;
      document.dispatchEvent(new CustomEvent('panel:closed'));
      if (scroll) scrollTo('#menu');
      resolve();
    };

    if (prefersReducedMotion) {
      gsap.set(wrap, { height: 0 });
      finishClose();
      return;
    }

    gsap.to(wrap, {
      height: 0,
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: finishClose,
    });
  });
}

export function getActivePanel() {
  return activePanel;
}

export function initPanels() {
  setMenuState(null);
}
