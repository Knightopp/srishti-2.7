import React, { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import srishtiLogo from '../assets/images/srishti-logo.png';
import { getRegistrationUrl } from '../config/links';

gsap.registerPlugin(ScrollTrigger);

// =============================================
// Isolated Countdown — never re-renders parent
// =============================================
// =============================================
// Isolated Countdown — minimal, non-boxy
// =============================================
const HeroCountdown = memo(() => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const targetDate = new Date('2026-12-04T10:00:00').getTime();
    const updateTimer = () => {
      const now = Date.now();
      const d = Math.max(0, targetDate - now);
      setTimeLeft({
        days: String(Math.floor(d / 86400000)).padStart(2, '0'),
        hours: String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0'),
        minutes: String(Math.floor((d % 3600000) / 60000)).padStart(2, '0'),
        seconds: String(Math.floor((d % 60000) / 1000)).padStart(2, '0'),
      });
    };
    updateTimer();
    const id = setInterval(updateTimer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-3 flex items-center justify-center gap-4 text-white/50 text-[11px] sm:text-xs font-technical">
      <div className="flex items-center gap-1.5">
        <span className="font-bold text-white/90 tabular-nums">{timeLeft.days}D</span>
        <span className="text-white/20">:</span>
        <span className="font-bold text-white/90 tabular-nums">{timeLeft.hours}H</span>
        <span className="text-white/20">:</span>
        <span className="font-bold text-white/90 tabular-nums">{timeLeft.minutes}M</span>
        <span className="text-white/20">:</span>
        <span className="font-bold text-cyan-400 tabular-nums">{timeLeft.seconds}S</span>
      </div>
    </div>
  );
});

// Vertical text sequence for side ribbons
const VerticalRibbonTextSequence = memo(() => (
  <div className="flex flex-col items-center shrink-0 select-none py-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <span
        key={i}
        className="inline-flex items-center gap-4 py-6 font-technical font-bold text-[10px] sm:text-[11px] tracking-[0.24em] text-white/90 uppercase whitespace-nowrap [writing-mode:vertical-rl]"
      >
        <span>SRISHTI 2.7</span>
        <span className="text-[#38bdf8]/60 text-[8px] font-normal">•</span>
      </span>
    ))}
  </div>
));

// =============================================
// HERO COMPONENT
// =============================================
interface HeroProps {
  onNavigateToRegister?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Ribbon refs
  const leftSideRibbonRef = useRef<HTMLDivElement>(null);
  const rightSideRibbonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    // ── MOBILE: skip all scroll-based animations entirely ──
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Show ribbons and everything immediately, no scroll effects
      if (leftSideRibbonRef.current) {
        gsap.set(leftSideRibbonRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      }
      if (rightSideRibbonRef.current) {
        gsap.set(rightSideRibbonRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=1200',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
        },
      });

      // Bottom bar fade on scroll
      if (bottomBarRef.current) {
        tl.to(bottomBarRef.current, {
          opacity: 0, y: 25, ease: 'power1.inOut', duration: 0.25,
        }, 0.0);
      }

      // 2. Left Side Ribbon
      if (leftSideRibbonRef.current) {
        tl.fromTo(leftSideRibbonRef.current, 
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 0.75,
          },
          0.0
        );
      }

      // 3. Right Side Ribbon
      if (rightSideRibbonRef.current) {
        tl.fromTo(rightSideRibbonRef.current,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 0.75,
          },
          0.0
        );
      }

      // Title group scales up smoothly across the entire 1200px scroll duration
      if (titleGroupRef.current) {
        tl.to(titleGroupRef.current, {
          scale: 1.85,
          transformOrigin: 'center center',
          ease: 'power1.inOut',
          duration: 0.95,
        }, 0.0);
      }

      // Glow expands subtly
      if (glowRef.current) {
        tl.to(glowRef.current, {
          scale: 1.6,
          opacity: 0.15,
          ease: 'power1.inOut',
          duration: 0.95,
        }, 0.0);
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#050608] text-[#E8E8EC] flex flex-col justify-between pt-16 sm:pt-20 md:pt-22 pb-4 sm:pb-6 select-none"
    >
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Atmospheric Subtle Light Glow */}
      <div ref={glowRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[600px] h-[250px] sm:h-[350px] md:h-[400px] bg-[#2563EB]/[0.06] rounded-full blur-[120px] pointer-events-none transition-opacity duration-500" />

      {/* SIDE RIBBONS */}
      <div
        ref={leftSideRibbonRef}
        className="absolute left-0 top-16 sm:top-20 bottom-14 sm:bottom-16 md:bottom-20 z-20 w-8 sm:w-9 md:w-10 bg-[#090b10] border-r border-white/[0.14] shadow-[4px_0_25px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center overflow-hidden pointer-events-none ribbon-edge-fade-v"
        style={{ willChange: 'transform, clip-path' }}
      >
        <div className="absolute inset-y-0 left-0 w-px bg-white/20 pointer-events-none" />
        <div className="animate-ribbon-marquee-v flex flex-col items-center">
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
        </div>
      </div>

      <div
        ref={rightSideRibbonRef}
        className="absolute right-0 top-16 sm:top-20 bottom-14 sm:bottom-16 md:bottom-20 z-20 w-8 sm:w-9 md:w-10 bg-[#090b10] border-l border-white/[0.14] shadow-[-4px_0_25px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center overflow-hidden pointer-events-none ribbon-edge-fade-v"
        style={{ willChange: 'transform, clip-path' }}
      >
        <div className="absolute inset-y-0 right-0 w-px bg-white/20 pointer-events-none" />
        <div className="animate-ribbon-marquee-v flex flex-col items-center">
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
          <VerticalRibbonTextSequence />
        </div>
      </div>

      {/* Center Stage */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 my-auto flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] md:min-h-[460px]">
        
        <div className="relative z-30 pointer-events-none flex flex-col items-center justify-center">
          <div ref={titleGroupRef} className="hero-title flex flex-col items-center justify-center text-center origin-center pointer-events-none">
            
            {/* 1. Iconic Floating Logo directly above title */}
            <div className="relative mb-2 sm:mb-3 pointer-events-auto cursor-pointer group">
              <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 animate-float-logo">
                <img
                  src={srishtiLogo}
                  alt="Srishti Logo"
                  className="w-full h-full object-contain hero-logo-emblem"
                />
              </div>
            </div>

            {/* 2. Direct Stacked High-Impact Typography Lockup */}
            <div className="flex flex-col items-center justify-center leading-none">
              <h1 className="font-impact font-black text-[3.2rem] sm:text-6xl md:text-7xl lg:text-[7.5rem] tracking-tight uppercase text-white srishti-impact-title select-none leading-[0.88] m-0 p-0">
                SRISHTI
              </h1>

              <div className="font-impact font-black text-[2.8rem] sm:text-5xl md:text-6xl lg:text-[6.2rem] tracking-tight text-center srishti-impact-number select-none leading-[0.9] mt-0.5 sm:mt-1">
                2.7
              </div>
            </div>

            {/* 3. Techno Cultural Fest Subtitle */}
            <div className="hero-sub-text pt-2 sm:pt-2.5">
              <p className="font-technical font-semibold text-[10px] sm:text-xs md:text-sm tracking-[0.24em] sm:tracking-[0.28em] uppercase text-white/50">
                TECHNO CULTURAL FEST
              </p>
            </div>

            {/* 4. Minimal Technical Countdown */}
            <div className="pt-1 pointer-events-auto">
              <HeroCountdown />
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Bar — clean, quiet, informational */}
      <div ref={bottomBarRef} className="hero-bottom-bar relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex items-center justify-between text-[9px] sm:text-[11px] font-body text-white/30 border-t border-white/[0.08] pt-3 sm:pt-4">
        <div>
          <span>ST. THOMAS COLLEGE • CS DEPARTMENT</span>
        </div>
        <div className="flex items-center gap-2 text-white/40">
          <span className="tracking-wider uppercase text-[8px] sm:text-[10px]">SCROLL TO EXPLORE</span>
          <div className="w-3 sm:w-3.5 h-4 sm:h-5 border border-white/20 rounded-full flex justify-center p-0.5">
            <div className="w-0.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
        <a
          href={getRegistrationUrl()}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }}
          className="flex items-center gap-1 text-white/60 hover:text-white font-body font-semibold uppercase transition-colors text-[10px] sm:text-xs tracking-wider"
        >
          <span>Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;


