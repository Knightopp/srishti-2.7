import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface ParallaxLayerConfig {
  element: HTMLElement | string;
  speed: number; // Speed multiplier (e.g. -0.2 for slow background, -1.2 for fast foreground)
  rotate?: number;
  scale?: number;
}

/**
 * Setup multi-layer parallax depth on a container
 */
export function setupParallaxLayers(
  trigger: HTMLElement | string,
  layers: ParallaxLayerConfig[]
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  layers.forEach(({ element, speed, rotate, scale }) => {
    const vars: gsap.TweenVars = {
      y: speed * 200,
      ease: 'none',
    };

    if (rotate !== undefined) vars.rotate = rotate;
    if (scale !== undefined) vars.scale = scale;

    tl.to(element, vars, 0);
  });

  return tl;
}

/**
 * Pin a section for N vh duration while scrubbing internal timelines
 */
export function createPinnedScrubSection(
  trigger: HTMLElement | string,
  scrollDistanceVh: number = 300,
  onUpdate?: (progress: number) => void
) {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: `+=${scrollDistanceVh}%`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      onUpdate: (self) => {
        if (onUpdate) onUpdate(self.progress);
      },
    },
  });
}
