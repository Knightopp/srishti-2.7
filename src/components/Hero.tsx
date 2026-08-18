import React, { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// =============================================
// Isolated Countdown — never re-renders parent
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

  const Digit = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center px-1.5 sm:px-2.5 md:px-3">
      <span className="font-technical font-bold text-[12px] sm:text-lg md:text-2xl text-white/90 leading-none tabular-nums">{value}</span>
      <span className="text-[6px] sm:text-[7px] md:text-[8px] font-body font-medium text-white/30 uppercase tracking-wider pt-0.5 sm:pt-1">{label}</span>
    </div>
  );

  const Sep = () => <span className="font-technical text-[10px] sm:text-sm md:text-base text-white/15 pb-1 sm:pb-2">:</span>;

  return (
    <div className="my-2 sm:my-3 md:my-4 inline-flex items-center pointer-events-auto">
      <Digit value={timeLeft.days} label="DAYS" />
      <Sep />
      <Digit value={timeLeft.hours} label="HRS" />
      <Sep />
      <Digit value={timeLeft.minutes} label="MIN" />
      <Sep />
      <Digit value={timeLeft.seconds} label="SEC" />
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
  const titleBlueRef = useRef<HTMLHeadingElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Ribbon refs
  const leftSideRibbonRef = useRef<HTMLDivElement>(null);
  const rightSideRibbonRef = useRef<HTMLDivElement>(null);

  // Desktop widget refs
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // Mobile widget refs
  const mobileCard1Ref = useRef<HTMLDivElement>(null);
  const mobileCard2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const mm = gsap.matchMedia();

    // DESKTOP ONLY (>= 1024px): Organic bending transformation into persistent side ribbons
    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=1200',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Navbar slides up
      const globalNav = document.querySelector('.global-navbar');
      if (globalNav) {
        tl.to(globalNav, { yPercent: -100, opacity: 0, ease: 'power1.inOut', duration: 0.35 }, 0.0);
      }

      // Bottom bar fade on scroll
      if (bottomBarRef.current) {
        tl.to(bottomBarRef.current, {
          opacity: 0, y: 25, ease: 'power1.inOut', duration: 0.35,
        }, 0.05);
      }


      // 2. Persistent Left Side Ribbon: Unrolls down while moving up to the ceiling
      if (leftSideRibbonRef.current) {
        tl.fromTo(leftSideRibbonRef.current, 
          { y: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            y: "-5rem",
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 0.75,
          },
          0.0
        );
      }

      // 3. Persistent Right Side Ribbon: Unrolls down while moving up to the ceiling
      if (rightSideRibbonRef.current) {
        tl.fromTo(rightSideRibbonRef.current,
          { y: 0, clipPath: 'inset(0% 0% 100% 0%)' },
          {
            y: "-5rem",
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.inOut',
            duration: 0.75,
          },
          0.0
        );
      }

      // Title group scales up — NEVER fades out
      tl.to(titleGroupRef.current, { scale: 1.85, ease: 'power1.inOut', duration: 0.75 }, 0.05);

      // Gradient transitions from Silver/White to Luminous White-to-Blue as it zooms in!
      if (titleBlueRef.current) {
        tl.to(titleBlueRef.current, { opacity: 1, ease: 'power1.inOut', duration: 0.65 }, 0.08);
      }

      // Glow expands and intensifies
      tl.to(glowRef.current, { scale: 1.8, opacity: 0.25, ease: 'power1.inOut', duration: 0.75 }, 0.05);

      // Left widgets retreat
      tl.to([card1Ref.current, card3Ref.current], {
        x: -50, opacity: 0, ease: 'power1.inOut', duration: 0.4,
      }, 0.08);

      // Right widgets retreat
      tl.to([card2Ref.current, card4Ref.current], {
        x: 50, opacity: 0, ease: 'power1.inOut', duration: 0.4,
      }, 0.08);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#050608] text-[#E8E8EC] flex flex-col justify-between pt-16 sm:pt-20 md:pt-24 pb-4 sm:pb-6 md:pb-8 select-none"
    >
      {/* Background Grid — barely visible */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Atmospheric Light — very subtle */}
      <div ref={glowRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[250px] sm:h-[350px] md:h-[450px] bg-[#2563EB]/[0.08] rounded-full blur-[100px] sm:blur-[140px] pointer-events-none transition-opacity duration-500" />

      {/* PERSISTENT SIDE RIBBONS — FIXED ON SCREEN EDGES FOR ALL SCROLLS DOWN TO FOOTER */}
      <div
        ref={leftSideRibbonRef}
        className="fixed left-0 top-20 -bottom-20 z-40 w-8 sm:w-9 md:w-10 bg-[#090b10] border-r border-white/[0.14] shadow-[4px_0_25px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center overflow-hidden pointer-events-none ribbon-edge-fade-v"
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
        className="fixed right-0 top-20 -bottom-20 z-40 w-8 sm:w-9 md:w-10 bg-[#090b10] border-l border-white/[0.14] shadow-[-4px_0_25px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center overflow-hidden pointer-events-none ribbon-edge-fade-v"
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
          <div ref={titleGroupRef} className="hero-title flex flex-col items-center justify-center text-center space-y-1 sm:space-y-2 origin-center pointer-events-none">
            
            <div className="flex flex-col items-center justify-center leading-none">
              {/* SRISHTI Wordmark with looping gradient animation & scroll zoom white-to-blue transition */}
              <div className="relative inline-block select-none">
                {/* Base State: Luminous Silver-Ice looping gradient */}
                <h1 className="font-display font-black text-[2.8rem] sm:text-6xl md:text-8xl lg:text-[8.5rem] tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.12em] uppercase srishti-gradient-base drop-shadow-[0_2px_25px_rgba(255,255,255,0.08)]">
                  SRISHTI
                </h1>

                {/* Zoomed State: Vibrant White-to-Blue looping gradient that fades in on zoom */}
                <h1
                  ref={titleBlueRef}
                  aria-hidden="true"
                  className="absolute inset-0 font-display font-black text-[2.8rem] sm:text-6xl md:text-8xl lg:text-[8.5rem] tracking-[0.08em] sm:tracking-[0.1em] md:tracking-[0.12em] uppercase srishti-gradient-blue opacity-0 pointer-events-none filter drop-shadow-[0_0_35px_rgba(37,99,235,0.4)]"
                >
                  SRISHTI
                </h1>
              </div>

              {/* Countdown — clean monospace */}
              <HeroCountdown />

              {/* 2.7 — Electric Cyan-to-Blue Looping Gradient */}
              <div className="font-technical font-black text-2xl sm:text-4xl md:text-6xl lg:text-[5.5rem] tracking-tight mt-0.5 inline-block text-center srishti-27-glow filter drop-shadow-[0_0_25px_rgba(37,99,235,0.3)]">
                2.7
              </div>
            </div>

            <div className="hero-sub-text pt-2 sm:pt-3 md:pt-4">
              <p className="font-body text-[9px] sm:text-[11px] md:text-xs tracking-[0.22em] sm:tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white/40 via-white/80 to-white/40 font-semibold">
                TECHNO CULTURAL FEST
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE WIDGETS — minimal text-based stats */}
        <div className="flex lg:hidden justify-center items-center gap-4 sm:gap-6 mt-4 sm:mt-5 z-20 pointer-events-auto">
          <div ref={mobileCard1Ref} onClick={onNavigateToRegister} className="flex flex-col items-center cursor-pointer group">
            <span className="font-display font-bold text-sm sm:text-base text-white/80 group-hover:text-white transition-colors">500+</span>
            <span className="text-[7px] sm:text-[8px] font-body font-medium text-white/30 uppercase tracking-wider">Registrations</span>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div ref={mobileCard2Ref} className="flex flex-col items-center">
            <span className="font-display font-bold text-sm sm:text-base text-white/80">15+</span>
            <span className="text-[7px] sm:text-[8px] font-body font-medium text-white/30 uppercase tracking-wider">Events</span>
          </div>
          <div className="w-px h-6 bg-white/8" />
          <div className="flex flex-col items-center">
            <span className="font-display font-bold text-sm sm:text-base text-white/80">₹50K+</span>
            <span className="text-[7px] sm:text-[8px] font-body font-medium text-white/30 uppercase tracking-wider">Prizes</span>
          </div>
        </div>

        {/* DESKTOP FLOATING ELEMENTS — recomposed with varied weights */}
        
        {/* Card 1: Registrations — dominant floating number, minimal framing */}
        <div ref={card1Ref} className="hidden lg:flex absolute top-[8%] left-[1%] xl:left-[2%] z-20 flex-col gap-1 pl-3 border-l border-white/[0.06] animate-float-1 cursor-pointer" onClick={onNavigateToRegister}>
          <span className="text-[9px] font-body font-medium text-white/25 uppercase tracking-wider">Registrations</span>
          <span className="font-display font-bold text-3xl text-white/80 tracking-tight leading-none">500+</span>
          <span className="text-[8px] font-body text-white/20">students joined</span>
        </div>

        {/* Card 2: Event Lineup — compact bordered module */}
        <div ref={card2Ref} className="hidden lg:flex absolute top-[18%] right-[1.5%] xl:right-[3%] z-20 flex-col gap-2 p-4 border border-white/[0.06] rounded-lg bg-transparent animate-float-2">
          <span className="text-[9px] font-body font-medium text-white/25 uppercase tracking-wider">Event Lineup</span>
          <span className="font-display font-bold text-xl text-white/80 tracking-tight leading-none">15+ Events</span>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 text-[8px] font-body font-medium rounded bg-white/[0.04] text-white/35">HACKATHON</span>
            <span className="px-2 py-0.5 text-[8px] font-body font-medium rounded bg-white/[0.04] text-white/35">CTF</span>
            <span className="px-2 py-0.5 text-[8px] font-body font-medium rounded bg-white/[0.04] text-white/35">CULTURAL</span>
          </div>
        </div>

        {/* Card 3: Prize Pool — minimal text marker, no container */}
        <div ref={card3Ref} className="hidden lg:flex absolute bottom-[22%] left-[3%] xl:left-[5%] z-20 flex-col gap-0.5 animate-float-3">
          <span className="text-[9px] font-body font-medium text-white/25 uppercase tracking-wider">Prize Pool</span>
          <span className="font-technical font-bold text-lg text-white/60 tracking-tight leading-none">₹50,000+</span>
        </div>

        {/* Card 4: Workshops — smallest, understated */}
        <div ref={card4Ref} className="hidden lg:flex absolute bottom-[8%] right-[2%] xl:right-[4%] z-20 flex-col gap-0.5 pl-2.5 border-l border-white/[0.06] animate-float-4">
          <span className="text-[9px] font-body font-medium text-white/25 uppercase tracking-wider">Workshops</span>
          <span className="text-xs font-body text-white/35">AI · WEB · CYBER</span>
        </div>
      </div>

      {/* Bottom Bar — quiet, informational */}
      <div ref={bottomBarRef} className="hero-bottom-bar relative z-20 max-w-7xl mx-auto px-3 sm:px-6 md:px-12 w-full flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs font-body text-white/25 border-t border-white/[0.06] pt-2 sm:pt-3 md:pt-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tiny coordinate detail */}
          <span className="font-technical text-white/15 hidden sm:inline">10.0°N 76.3°E</span>
          <span className="hidden sm:inline text-white/10">—</span>
          <span>SRISHTI 2.7 · ST. THOMAS COLLEGE</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-white/30">
          <span className="tracking-wider uppercase text-[7px] sm:text-[9px] md:text-[10px]">SCROLL TO EXPLORE</span>
          <div className="w-3 sm:w-3.5 h-4 sm:h-5 md:h-6 border border-white/15 rounded-full flex justify-center p-0.5">
            <div className="w-0.5 h-1.5 bg-white/25 rounded-full animate-bounce" />
          </div>
        </div>
        <a href="#register" onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }} className="hidden sm:flex items-center gap-1.5 text-white/40 hover:text-white font-display font-bold uppercase transition-colors text-[10px] tracking-wider">
          <span>Register Now</span><ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
