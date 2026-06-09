import { gsap } from 'gsap';

export function initWelcome() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const name = document.querySelector('.welcome__name');
  const role = document.querySelector('.welcome__role');
  const hint = document.querySelector('.welcome__hint');

  if (!name || !role) return;

  if (prefersReducedMotion) {
    gsap.set([name, role, hint], { opacity: 1, y: 0 });
    return;
  }

  gsap.set([name, role, hint], { opacity: 0, y: 24 });

  const tl = gsap.timeline({ delay: 0.3 });
  tl.to(name, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' })
    .to(role, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
    .to(hint, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
}
