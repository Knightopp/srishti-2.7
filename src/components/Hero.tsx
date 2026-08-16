import React, { useRef, useEffect, useState, memo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Users, 
  Trophy, 
  Sparkles, 
  ArrowUpRight, 
  Zap, 
  Code, 
  Cpu,
  Calendar
} from 'lucide-react';

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
    <div className="flex flex-col items-center px-1 sm:px-2 md:px-2.5">
      <span className="font-orbitron font-black text-[11px] sm:text-base md:text-2xl text-white leading-none">{value}</span>
      <span className="text-[6px] sm:text-[8px] md:text-[9px] font-mono font-bold text-white/60 uppercase tracking-widest pt-0.5 sm:pt-1">{label}</span>
    </div>
  );

  const Sep = () => <span className="font-orbitron font-extrabold text-[9px] sm:text-xs md:text-base text-white/40 pb-1 sm:pb-2.5">:</span>;

  return (
    <div className="my-1 sm:my-2 md:my-3.5 inline-flex flex-col items-center pointer-events-auto">
      <div className="flex items-center gap-1 sm:gap-2 md:gap-2.5 px-2.5 sm:px-5 md:px-6 py-1 sm:py-2 md:py-2.5 rounded-xl sm:rounded-2xl bg-black/70 border border-white/15 backdrop-blur-2xl shadow-2xl">
        <Digit value={timeLeft.days} label="DAYS" />
        <Sep />
        <Digit value={timeLeft.hours} label="HRS" />
        <Sep />
        <Digit value={timeLeft.minutes} label="MINS" />
        <Sep />
        <Digit value={timeLeft.seconds} label="SECS" />
      </div>
    </div>
  );
});

// =============================================
// HERO COMPONENT
// =============================================
interface HeroProps {
  onNavigateToRegister?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Desktop widget refs
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const pill1Ref = useRef<HTMLDivElement>(null);
  const pill2Ref = useRef<HTMLDivElement>(null);

  // Mobile widget refs
  const mobileCard1Ref = useRef<HTMLDivElement>(null);
  const mobileCard2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const mm = gsap.matchMedia();

    // ==========================================
    // DESKTOP ONLY (>= 1024px): Cinematic scroll zoom
    // ==========================================
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

      // Eyebrow + bottom bar fade
      tl.to([eyebrowRef.current, bottomBarRef.current], {
        opacity: 0, y: (i: number) => (i === 0 ? -25 : 25), ease: 'power1.inOut', duration: 0.35,
      }, 0.05);

      // Title group scales up — NEVER fades out
      tl.to(titleGroupRef.current, { scale: 1.85, ease: 'power1.inOut', duration: 0.75 }, 0.05);

      // Glow expands
      tl.to(glowRef.current, { scale: 1.6, opacity: 0.25, ease: 'power1.inOut', duration: 0.75 }, 0.05);

      // Left widgets retreat
      tl.to([card1Ref.current, card3Ref.current, pill1Ref.current], {
        x: -60, opacity: 0, scale: 0.9, ease: 'power1.inOut', duration: 0.4,
      }, 0.08);

      // Right widgets retreat
      tl.to([card2Ref.current, card4Ref.current, pill2Ref.current], {
        x: 60, opacity: 0, scale: 0.9, ease: 'power1.inOut', duration: 0.4,
      }, 0.08);
    });

    // ==========================================
    // MOBILE / TABLET (< 1024px): NO ANIMATION AT ALL
    // Static hero, native scroll, zero ScrollTrigger.
    // ==========================================
    // (intentionally empty — no mm.add for mobile)

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-[100dvh] min-h-[100dvh] overflow-hidden bg-[#060608] text-[#f5f5f7] flex flex-col justify-between pt-12 sm:pt-18 md:pt-24 pb-3 sm:pb-5 md:pb-8 select-none"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-15" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Center Glow */}
      <div ref={glowRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[500px] md:w-[680px] h-[240px] sm:h-[350px] md:h-[420px] bg-[#0077ff]/16 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none" />

      {/* Eyebrow */}
      <div ref={eyebrowRef} className="hero-eyebrow relative z-20 text-center w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="inline-flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1 md:py-1.5 rounded-full bg-white/[0.03] border border-white/12 text-[9px] sm:text-[10px] md:text-[11px] font-mono tracking-widest text-white/70 uppercase backdrop-blur-md">
          <img src="/srishti-logo-transparent.png" alt="Srishti Logo" className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 object-contain" />
          <span>ST. THOMAS COLLEGE • CS DEPARTMENT</span>
        </div>
      </div>

      {/* Center Stage */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-3 sm:px-6 md:px-12 my-auto flex flex-col items-center justify-center min-h-[300px] sm:min-h-[360px] md:min-h-[460px]">
        
        <div className="relative z-30 pointer-events-none flex flex-col items-center justify-center">
          <div ref={titleGroupRef} className="hero-title flex flex-col items-center justify-center text-center space-y-1 sm:space-y-2 md:space-y-3 origin-center pointer-events-none">
            {/* Logo */}
            <div className="flex justify-center mb-0.5">
              <img src="/srishti-logo-transparent.png" alt="Official Srishti Logo" className="w-7 h-7 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain drop-shadow-[0_0_25px_rgba(0,119,255,0.7)]" />
            </div>

            <div className="flex flex-col items-center justify-center leading-none">
              <h1 className="font-syne font-black text-[2.35rem] sm:text-5xl md:text-7xl lg:text-[7.5rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0f6ff] to-[#0044aa]/90 uppercase">
                SRISHTI
              </h1>

              <HeroCountdown />

              <div className="font-orbitron font-black text-xl sm:text-4xl md:text-6xl lg:text-[6.5rem] text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#0077ff] to-[#0055ff] tracking-tight mt-0.5 inline-block text-center">
                2.7
              </div>
            </div>

            <div className="hero-sub-text pt-0.5 sm:pt-1.5 md:pt-3">
              <p className="font-mono text-[8px] sm:text-[10px] md:text-sm tracking-[0.2em] sm:tracking-[0.35em] uppercase text-white/80 font-semibold">
                TECHNO CULTURAL FEST
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE WIDGETS — always visible, no animation */}
        <div className="flex lg:hidden justify-center items-center gap-2 sm:gap-3.5 mt-2.5 sm:mt-3.5 z-20 pointer-events-auto">
          <div ref={mobileCard1Ref} onClick={onNavigateToRegister} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0e0e14]/90 border border-[#0077ff]/40 backdrop-blur-xl shadow-lg cursor-pointer">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-[#0077ff]/20 flex items-center justify-center text-[#0077ff]"><Users className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>
            <div>
              <span className="block text-[7px] sm:text-[8px] font-mono text-white/60 uppercase font-bold leading-tight">REGISTRATIONS</span>
              <span className="font-syne font-black text-[10px] sm:text-xs text-white">500+ JOINED</span>
            </div>
          </div>
          <div ref={mobileCard2Ref} className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#0e0e14]/90 border border-[#00e5ff]/40 backdrop-blur-xl shadow-lg">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-lg bg-[#00e5ff]/20 flex items-center justify-center text-[#00e5ff]"><Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></div>
            <div>
              <span className="block text-[7px] sm:text-[8px] font-mono text-white/60 uppercase font-bold leading-tight">EVENT LINEUP</span>
              <span className="font-syne font-black text-[10px] sm:text-xs text-[#00e5ff]">15+ EVENTS</span>
            </div>
          </div>
        </div>

        {/* DESKTOP WIDGETS — animated via GSAP on scroll */}
        <div ref={card1Ref} className="hidden lg:flex absolute top-[4%] left-[1.5%] xl:left-[3%] z-20 p-4 bg-[#0e0e14]/95 border border-[#0077ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,119,255,0.25)] w-56 flex-col gap-2.5 group cursor-pointer" onClick={onNavigateToRegister}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#0077ff]/20 border border-[#0077ff]/60 flex items-center justify-center text-[#0077ff]"><Users className="w-3.5 h-3.5" /></div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">REGISTRATIONS</span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077ff] animate-ping" />
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-syne font-black text-2xl text-white tracking-tight">500+</span>
            <span className="text-[9px] font-mono text-[#00e5ff] font-bold uppercase tracking-widest">STUDENTS JOINED</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div className="bg-gradient-to-r from-[#0077ff] via-[#00e5ff] to-[#d4ff00] h-full rounded-full w-[84%]" />
          </div>
        </div>

        <div ref={card2Ref} className="hidden lg:flex absolute top-[20%] right-[1.5%] xl:right-[3%] z-20 p-4 bg-[#0e0e14]/95 border border-[#00e5ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,229,255,0.2)] w-60 flex-col gap-2.5 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#00e5ff]/20 border border-[#00e5ff]/60 flex items-center justify-center text-[#00e5ff]"><Zap className="w-3.5 h-3.5" /></div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">EVENT LINEUP</span>
            </div>
            <span className="px-2.5 py-0.5 text-[8px] font-mono font-bold bg-[#00e5ff]/20 text-[#00e5ff] rounded-full border border-[#00e5ff]/50">LIVE 2026</span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5"><span className="font-syne font-black text-2xl text-white tracking-tight">15+ EVENTS</span></div>
          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#0077ff]/20 text-[#0077ff] border border-[#0077ff]/40">HACKATHON</span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">CTF</span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-white/10 text-white/80">CULTURAL</span>
          </div>
        </div>

        <div ref={card3Ref} className="hidden lg:flex absolute bottom-[20%] left-[3%] xl:left-[5.5%] z-20 p-4 bg-[#0e0e14]/95 border border-[#00d4ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,212,255,0.2)] w-56 flex-col gap-2.5 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/60 flex items-center justify-center text-[#00d4ff]"><Trophy className="w-3.5 h-3.5" /></div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">PRIZE POOL</span>
            </div>
            <Sparkles className="w-4 h-4 text-[#d4ff00]" />
          </div>
          <div className="flex items-baseline justify-between pt-0.5"><span className="font-syne font-black text-2xl text-[#00d4ff]">₹50,000+</span></div>
          <p className="text-[9px] font-mono font-bold text-white/70 uppercase tracking-wider">CASH PRIZES & CERTIFICATES</p>
        </div>

        <div ref={card4Ref} className="hidden lg:flex absolute bottom-[4%] right-[1%] xl:right-[2.5%] z-20 p-4 bg-[#0e0e14]/95 border border-[#38bdf8]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(56,189,248,0.2)] w-60 flex-col gap-2.5 group cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/60 flex items-center justify-center text-[#38bdf8]"><Code className="w-3.5 h-3.5" /></div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">WORKSHOPS</span>
            </div>
            <Cpu className="w-4 h-4 text-[#38bdf8]" />
          </div>
          <div className="flex items-baseline justify-between pt-0.5"><span className="font-syne font-black text-lg text-white">AI • WEB • CYBER</span></div>
          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">HANDS-ON</span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-white/10 text-white/80">GPU COLAB</span>
          </div>
        </div>

        <div ref={pill1Ref} className="hidden xl:flex absolute top-[38%] left-[10%] xl:left-[14%] z-20 px-3.5 py-1.5 rounded-full bg-[#0077ff] text-white text-[10px] font-mono font-bold uppercase shadow-2xl shadow-[#0077ff]/50 -rotate-6 items-center gap-2 cursor-pointer">
          <Calendar className="w-3.5 h-3.5 text-white" /><span>2 DAYS</span>
        </div>

        <div ref={pill2Ref} className="hidden xl:flex absolute bottom-[32%] right-[12%] xl:right-[16%] z-20 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/60 text-[#00e5ff] text-[10px] font-mono font-bold uppercase backdrop-blur-2xl shadow-2xl shadow-[#00e5ff]/40 rotate-8 items-center gap-2 cursor-pointer">
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" /><span>DEC 4 & 5</span>
        </div>
      </div>

      {/* Bottom Bar */}
      <div ref={bottomBarRef} className="hero-bottom-bar relative z-20 max-w-7xl mx-auto px-3 sm:px-6 md:px-12 w-full flex items-center justify-between text-[8px] sm:text-[10px] md:text-xs font-mono text-white/50 border-t border-white/10 pt-2 sm:pt-3 md:pt-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0077ff]" />
          <span>SRISHTI 2.7 • ST. THOMAS COLLEGE</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
          <span className="tracking-widest uppercase text-[7px] sm:text-[9px] md:text-[10px]">SCROLL TO EXPLORE</span>
          <div className="w-3 sm:w-3.5 h-4 sm:h-5 md:h-6 border border-white/30 rounded-full flex justify-center p-0.5">
            <div className="w-1 h-1.5 bg-[#0077ff] rounded-full animate-bounce" />
          </div>
        </div>
        <a href="#register" onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }} className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#0077ff] font-syne font-bold uppercase transition-colors">
          <span>Register Now</span><ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
