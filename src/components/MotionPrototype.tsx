import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const MotionPrototype: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Pinned 300vh Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%', // 300vh total height
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Layer 1: Background Watermark (Slow parallax shift)
      tl.to(bgTextRef.current, {
        xPercent: -20,
        opacity: 0.12,
        ease: 'none',
      }, 0);

      // Layer 2: Headline Split Words Shift (Typography motion)
      tl.to('.prototype-word-1', {
        x: -120,
        opacity: 0.3,
        ease: 'none',
      }, 0);

      tl.to('.prototype-word-2', {
        x: 120,
        opacity: 0.3,
        ease: 'none',
      }, 0);

      // Layer 3: Central Visual 3D Transform, Rotation & Scale
      tl.to(visualCardRef.current, {
        scale: 1.3,
        rotateX: -14,
        rotateY: 10,
        y: -30,
        borderRadius: '36px',
        boxShadow: '0 40px 100px rgba(99, 91, 255, 0.35)',
        ease: 'power1.inOut',
      }, 0);

      // Layer 4: Foreground Badges (Fastest Parallax)
      tl.to('.proto-fg-badge-1', {
        y: -280,
        x: 40,
        scale: 0.8,
        opacity: 0,
        ease: 'power2.out',
      }, 0);

      tl.to('.proto-fg-badge-2', {
        y: -220,
        x: -40,
        scale: 0.85,
        opacity: 0,
        ease: 'power2.out',
      }, 0);

      // Phase 2 (50% -> 100% of 300vh scroll):
      // Typography transforms into section 2 title and expands visual into next composition
      tl.to(visualCardRef.current, {
        scale: 1.7,
        rotateX: 0,
        rotateY: 0,
        opacity: 0,
        ease: 'power2.in',
      }, 0.55);

      tl.to(headlineRef.current, {
        y: -150,
        opacity: 0,
        ease: 'power2.in',
      }, 0.6);

      // Section 2 Title Reveal inside Pinned Timeline
      tl.to('.section-2-reveal-title', {
        y: 0,
        opacity: 1,
        scale: 1,
        ease: 'power2.out',
      }, 0.65);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#0b0b0b] text-[#f5f5f7] flex items-center justify-center select-none"
    >
      {/* Layer 1: Background Watermark */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap opacity-05 pointer-events-none font-syne text-[18vw] font-extrabold tracking-tighter text-white/10 uppercase"
      >
        OUT CROWD ✪ MOTION LAB
      </div>

      {/* Layer 2: Main Headline Typography */}
      <div className="absolute top-[12vh] z-20 text-center w-full px-6 pointer-events-none">
        <h1
          ref={headlineRef}
          className="font-syne text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight uppercase leading-none"
        >
          <span className="prototype-word-1 inline-block mr-4">Crafting</span>
          <span className="font-serif-custom italic font-normal text-[#635bff] lowercase text-6xl md:text-8xl lg:text-[10rem] mx-2">
            digital
          </span>
          <span className="prototype-word-2 inline-block ml-4">Embodiments</span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-white/50 tracking-widest uppercase font-medium max-w-xl mx-auto">
          Scrollytelling • 3D Motion System • Pinned Parallax Timelines
        </p>
      </div>

      {/* Layer 3: Central Visual Artwork (3D Card) */}
      <div
        ref={visualCardRef}
        className="relative z-30 w-[340px] md:w-[560px] h-[240px] md:h-[360px] bg-gradient-to-br from-[#16161a] to-[#0f0f13] border border-white/15 rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl transition-all"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#635bff]/20 border border-[#635bff]/40 flex items-center justify-center text-[#635bff]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="block font-syne text-xs font-bold tracking-wider uppercase text-white">
                Outcrowd Motion V1.0
              </span>
              <span className="block text-[10px] text-white/40 font-mono">
                SCRUBBED TIMELINE • 300VH
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-white/10 text-white/80 rounded-full border border-white/10">
            PROTOTYPE
          </span>
        </div>

        {/* Card Center Visual Canvas */}
        <div className="my-auto py-4 flex items-center justify-center relative">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-[#635bff] to-[#d4ff00]/60 opacity-20 blur-2xl absolute" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-md mb-3">
              <Cpu className="w-4 h-4 text-[#635bff]" />
              <span className="text-xs font-syne font-semibold text-white/90">
                Layered Composition Engine
              </span>
            </div>
            <p className="text-xs md:text-sm text-white/60 max-w-xs mx-auto font-light">
              Scroll down to trigger scale, rotation, layer separation, and continuous theme morphing.
            </p>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] text-white/50 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#635bff]" />
            <span>CINEMATIC SCROLL</span>
          </div>
          <span>01 / 05 SECTIONS</span>
        </div>
      </div>

      {/* Layer 4: Foreground Parallax Badges */}
      <div className="proto-fg-badge-1 absolute top-[25%] right-[10%] z-40 px-4 py-2 rounded-full bg-[#635bff] text-white text-xs font-syne font-bold tracking-wider shadow-lg pointer-events-none flex items-center gap-2">
        <Globe className="w-3.5 h-3.5" />
        <span>PARALLAX FAST LAYER</span>
      </div>

      <div className="proto-fg-badge-2 absolute bottom-[22%] left-[10%] z-40 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-mono tracking-wider shadow-lg pointer-events-none flex items-center gap-2">
        <ArrowRight className="w-3.5 h-3.5 text-[#635bff]" />
        <span>SCROLL CONTROLLED ROTATION</span>
      </div>

      {/* Section 2 Incoming Reveal Text (Inside Pinned Timeline) */}
      <div className="section-2-reveal-title absolute z-50 text-center opacity-0 transform translate-y-20 scale-90 pointer-events-none px-6">
        <span className="text-xs font-mono text-[#635bff] tracking-widest uppercase block mb-3">
          02 / SELECTED CASES
        </span>
        <h2 className="font-syne text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight text-white uppercase max-w-4xl mx-auto">
          We Design Products That <span className="font-serif-custom italic font-normal text-[#635bff]">Transform</span> Industries
        </h2>
      </div>

      {/* Bottom Scroll Cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 opacity-60">
        <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
          SCROLL TO SCRUB TIMELINE
        </span>
        <div className="w-4 h-7 border border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-[#635bff] rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default MotionPrototype;
