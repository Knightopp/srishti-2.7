import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven typewriter / clip-path writing reveal
 */
export function setupScrollTypewriter(
  target: string | HTMLElement | Element[],
  trigger: string | HTMLElement,
  start: string = 'top 80%',
  end: string = 'top 30%'
) {
  gsap.set(target, {
    clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)',
    opacity: 1,
  });

  return gsap.to(target, {
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    ease: 'none',
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub: 0.4,
    },
  });
}

/**
 * Animate words with clip-path mask unveil
 */
export function animateTextReveal(
  target: string | HTMLElement | Element[],
  options?: {
    stagger?: number;
    duration?: number;
    delay?: number;
    ease?: string;
    yPercent?: number;
    trigger?: string | HTMLElement;
  }
) {
  const {
    stagger = 0.04,
    duration = 1.0,
    delay = 0,
    ease = 'power3.out',
    yPercent = 100,
    trigger,
  } = options || {};

  const config: gsap.TweenVars = {
    yPercent: 0,
    opacity: 1,
    duration,
    stagger,
    delay,
    ease,
  };

  if (trigger) {
    config.scrollTrigger = {
      trigger,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    };
  }

  gsap.set(target, { yPercent, opacity: 0 });

  return gsap.to(target, config);
}
