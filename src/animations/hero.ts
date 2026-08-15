import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function createHeroTimeline(container: HTMLElement) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: '+=200%', // 300vh pinned duration
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
    },
  });

  // Layer 1: Background Grid & Subtle Ambient Backdrop
  tl.to(
    container.querySelector('.hero-bg-layer'),
    {
      scale: 1.15,
      opacity: 0.2,
      y: 100,
      ease: 'none',
    },
    0
  );

  // Layer 2: Typographic Backdrop ("OUT CROWD ✪ DESIGN STUDIO")
  tl.to(
    container.querySelector('.hero-text-backdrop'),
    {
      xPercent: -35,
      opacity: 0.15,
      ease: 'none',
    },
    0
  );

  // Layer 3: Central Visual Artwork (Card expand & 3D tilt)
  tl.to(
    container.querySelector('.hero-visual-card'),
    {
      scale: 1.25,
      rotateX: -12,
      rotateY: 8,
      y: -40,
      borderRadius: '32px',
      boxShadow: '0 30px 90px rgba(99, 91, 255, 0.25)',
      ease: 'power1.inOut',
    },
    0
  );

  // Layer 4: Main Headline Typography (Translate & scale)
  tl.to(
    container.querySelector('.hero-headline-left'),
    {
      x: -120,
      opacity: 0.4,
      ease: 'none',
    },
    0
  );

  tl.to(
    container.querySelector('.hero-headline-right'),
    {
      x: 120,
      opacity: 0.4,
      ease: 'none',
    },
    0
  );

  // Layer 5: Foreground Floating Badges (Fastest motion)
  tl.to(
    container.querySelectorAll('.hero-badge'),
    {
      y: -220,
      scale: 0.85,
      opacity: 0,
      stagger: 0.05,
      ease: 'power2.out',
    },
    0
  );

  // Phase 2 of Hero Timeline (50% -> 100% scroll):
  // Main artwork expands into full viewport width, headline transforms smoothly into next section
  tl.to(
    container.querySelector('.hero-visual-card'),
    {
      scale: 1.6,
      rotateX: 0,
      rotateY: 0,
      opacity: 0,
      ease: 'power2.in',
    },
    0.6
  );

  tl.to(
    container.querySelector('.hero-headline-container'),
    {
      y: -180,
      opacity: 0,
      ease: 'power2.in',
    },
    0.7
  );

  return tl;
}
