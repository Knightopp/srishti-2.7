import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
});

const DESKTOP_BREAKPOINT = 1024;

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only initialize Lenis smooth scrolling on desktop.
    // Mobile/tablet uses native touch scrolling — zero interference.
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

    if (!isDesktop) {
      // No Lenis, no smooth scroll override on mobile.
      // Just ensure ScrollTrigger works with native scroll if any desktop
      // animations accidentally leaked (they shouldn't).
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.0,
      syncTouch: false, // Desktop only, no touch sync needed
    });

    lenisRef.current = lenis;

    // Connect Lenis to ScrollTrigger so scrub animations are fluid
    lenis.on('scroll', ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    const handleResize = () => {
      // If resized below desktop, destroy Lenis
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        gsap.ticker.remove(updateTicker);
        lenis.destroy();
        lenisRef.current = null;
      }
    };
    window.addEventListener('resize', handleResize);

    // Initial refresh
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh());
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}

export default useLenis;
