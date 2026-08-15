import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Refresh ScrollTrigger on window load to ensure exact position calculations
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleRefresh);
    return () => window.removeEventListener('resize', handleRefresh);
  }, []);

  return lenisRef;
}
