import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Continuous section background color transition
 */
export function setupSectionThemeTransition(
  section: HTMLElement | string,
  targetBgColor: string,
  targetTextColor: string,
  navSelector?: string
) {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 50%',
    end: 'bottom 50%',
    onEnter: () => {
      gsap.to('body', { backgroundColor: targetBgColor, color: targetTextColor, duration: 0.8, ease: 'power2.out' });
      if (navSelector) {
        gsap.to(navSelector, {
          borderColor: targetTextColor === '#ffffff' || targetTextColor === '#f5f5f7' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
          duration: 0.6,
        });
      }
    },
    onLeaveBack: () => {
      const prevBg = targetBgColor === '#f5f5f7' ? '#0b0b0b' : '#f5f5f7';
      const prevText = targetTextColor === '#0b0b0b' ? '#f5f5f7' : '#0b0b0b';
      gsap.to('body', { backgroundColor: prevBg, color: prevText, duration: 0.8, ease: 'power2.out' });
    },
  });
}
