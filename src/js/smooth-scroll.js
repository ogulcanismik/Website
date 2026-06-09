import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function initSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return { lenis: null, scrollTo };
  }

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  return { lenis, scrollTo };
}

export function scrollTo(target, options = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const offset = options.offset ?? 0;
  const duration = options.duration ?? 1.2;

  if (lenis) {
    const rect = el.getBoundingClientRect();
    const top = rect.top + lenis.scroll + offset;
    lenis.scrollTo(top, {
      duration,
      force: options.force ?? true,
      lock: options.lock ?? false,
    });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (offset) window.scrollBy({ top: offset, behavior: 'smooth' });
  }
}

export function getLenis() {
  return lenis;
}
