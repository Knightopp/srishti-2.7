import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationCallback = (ctx: gsap.Context, element: HTMLElement) => void;

export function useScrollAnimation(
  callback: AnimationCallback,
  deps: React.DependencyList = []
): RefObject<HTMLDivElement | null> {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      if (containerRef.current) {
        callback(ctx, containerRef.current);
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, deps);

  return containerRef;
}
