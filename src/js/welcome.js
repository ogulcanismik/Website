import { gsap } from 'gsap';
import { getContent } from './i18n.js';

const HOLD_DELAY = 0.5;
const REVEAL_DURATION = 0.9;

export function initWelcome() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nameEl = document.querySelector('.welcome__name');
  const stage = nameEl?.querySelector('.welcome__name-stage');
  const initialsEl = nameEl?.querySelector('.welcome__name-initials');
  const fullEl = nameEl?.querySelector('.welcome__name-full');
  const role = document.querySelector('.welcome__role');
  const hint = document.querySelector('.welcome__hint');

  if (!nameEl || !stage || !initialsEl || !fullEl || !role) return;

  const { site } = getContent();
  const fullName = nameEl.dataset.fullName || site.name;
  const initials = site.initials || 'OI';

  nameEl.dataset.fullName = fullName;
  initialsEl.textContent = initials;
  fullEl.textContent = fullName;

  if (prefersReducedMotion) {
    initialsEl.style.display = 'none';
    stage.style.width = 'auto';
    stage.style.overflow = 'visible';
    gsap.set(fullEl, { x: 0 });
    nameEl.classList.add('is-expanded');
    gsap.set([role, hint], { opacity: 1, y: 0 });
    return;
  }

  nameEl.classList.remove('is-expanded');

  const oiWidth = initialsEl.offsetWidth;
  gsap.set(stage, { width: 'auto', overflow: 'visible', visibility: 'hidden', position: 'absolute' });
  const fullWidth = stage.offsetWidth;
  gsap.set(stage, { width: oiWidth, overflow: 'hidden', visibility: 'visible', position: 'relative' });
  gsap.set(fullEl, { x: 0 });
  gsap.set([role, hint], { opacity: 0, y: 20 });

  const slideOffset = -(fullWidth - oiWidth);
  const revealEnd = 0.15 + REVEAL_DURATION;

  const tl = gsap.timeline({ delay: HOLD_DELAY });

  tl.to(initialsEl, { opacity: 0, x: -24, duration: 0.25, ease: 'power2.in' }, 0)
    .set(initialsEl, { display: 'none' }, 0.2)
    .to(stage, { width: fullWidth, duration: REVEAL_DURATION, ease: 'power2.inOut' }, 0.15)
    .to(fullEl, { x: slideOffset, duration: REVEAL_DURATION, ease: 'power2.inOut' }, 0.15)
    .add(() => nameEl.classList.add('is-expanded'), revealEnd)
    .to(role, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, revealEnd + 0.1)
    .to(hint, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, revealEnd + 0.4);
}
