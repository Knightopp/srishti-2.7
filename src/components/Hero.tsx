import React, { useRef, useEffect, useState } from 'react';
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

interface HeroProps {
  onNavigateToRegister?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToRegister }) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleGroupRef = useRef<HTMLDivElement>(null);
  const emblemRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const hudGridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Widget Cards & Organic Pills Refs
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);
  const pill1Ref = useRef<HTMLDivElement>(null);
  const pill2Ref = useRef<HTMLDivElement>(null);

  // Mouse Parallax Offset (applied to dedicated parallax sub-wrappers so GSAP transforms aren't overridden)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Live Fest Countdown Timer State (Target: Dec 4, 2026 10:00 AM)
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const targetDate = new Date('2026-12-04T10:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = Math.max(0, targetDate - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days < 10 ? `0${days}` : `${days}`,
        hours: hours < 10 ? `0${hours}` : `${hours}`,
        minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;

    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      // ONE PINNED SCROLL TIMELINE: heroTimeline
      // Controls the entire transition from giant initial typography -> final complete composition -> pin release
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: isMobile ? '+=1200' : '+=1600', // Pinned scrub distance
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0% -> 75%: Hero Title Group (SRISHTI + 2.7) zooms out together from huge to 1.0
      tl.fromTo(
        titleGroupRef.current,
        { scale: isMobile ? 1.6 : 2.4, y: isMobile ? 10 : 0 },
        { scale: 1.0, y: 0, ease: 'power1.inOut', duration: 0.75 },
        0
      );

      // 0% -> 30%: Background Grid & Ambient Glow fade in
      tl.fromTo(
        hudGridRef.current,
        { opacity: 0.03 },
        { opacity: 0.15, ease: 'power1.out', duration: 0.35 },
        0
      );

      tl.fromTo(
        glowRef.current,
        { opacity: 0.4, scale: 0.75 },
        { opacity: 1, scale: 1, ease: 'power1.out', duration: 0.45 },
        0
      );

      // 20% -> 60%: Eyebrow badge reveals smoothly
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.2
      );

      // 30% -> 70%: Countdown timer reveals between SRISHTI and 2.7
      tl.fromTo(
        countdownRef.current,
        { opacity: 0, scale: 0.75, y: 15 },
        { opacity: 1, scale: 1, y: 0, ease: 'power2.out', duration: 0.4 },
        0.3
      );

      // 45% -> 75%: Subtitle ("TECHNO CULTURAL FEST") reveals
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3 },
        0.45
      );

      // 30% -> 75%: Info Cards fly in from edges and settle at exact final positions
      tl.fromTo(
        card1Ref.current,
        { opacity: 0, x: -110, y: -40, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 0.45 },
        0.3
      );

      tl.fromTo(
        card2Ref.current,
        { opacity: 0, x: 110, y: -40, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 0.45 },
        0.3
      );

      tl.fromTo(
        card3Ref.current,
        { opacity: 0, x: -110, y: 40, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 0.45 },
        0.35
      );

      tl.fromTo(
        card4Ref.current,
        { opacity: 0, x: 110, y: 40, scale: 0.8 },
        { opacity: 1, x: 0, y: 0, scale: 1, ease: 'power2.out', duration: 0.45 },
        0.35
      );

      // 40% -> 75%: Date Pills reveal and settle
      tl.fromTo(
        pill1Ref.current,
        { opacity: 0, x: -60, scale: 0.75 },
        { opacity: 1, x: 0, scale: 1, ease: 'back.out(1.2)', duration: 0.35 },
        0.4
      );

      tl.fromTo(
        pill2Ref.current,
        { opacity: 0, x: 60, scale: 0.75 },
        { opacity: 1, x: 0, scale: 1, ease: 'back.out(1.2)', duration: 0.35 },
        0.4
      );

      // 0% -> 50%: Scroll bottom bar subtle fade-in of details
      tl.fromTo(
        bottomBarRef.current,
        { opacity: 0.6 },
        { opacity: 1, ease: 'power1.out', duration: 0.5 },
        0
      );

      // 75% -> 100%: Plateau / Final Composition resting state (no abrupt transitions, clean release at 100%)
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Mouse Parallax Handler (subtle 3D responsiveness)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[100dvh] overflow-hidden bg-[#060608] text-[#f5f5f7] flex flex-col justify-between pt-20 md:pt-24 pb-6 md:pb-8 select-none"
    >
      {/* Fine Background Grid & Center Ambient Glow */}
      <div 
        ref={hudGridRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <div 
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[300px] sm:h-[400px] bg-[#0077ff]/14 rounded-full blur-[130px] pointer-events-none" 
      />

      {/* TOP DEPT EYEBROW LABEL WITH OFFICIAL LOGO */}
      <div 
        ref={eyebrowRef}
        className="hero-eyebrow relative z-20 text-center w-full max-w-4xl mx-auto px-4 md:px-6"
      >
        <div className="inline-flex items-center gap-2 md:gap-2.5 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-white/[0.03] border border-white/12 text-[10px] md:text-[11px] font-mono tracking-widest text-white/70 uppercase backdrop-blur-md">
          <img src="/srishti-logo-transparent.png" alt="Srishti Logo" className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain" />
          <span>ST. THOMAS COLLEGE • CS DEPARTMENT</span>
        </div>
      </div>

      {/* CENTER STAGE: UNIFIED HERO TITLE GROUP & PERIPHERAL INFO CARDS */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 my-auto flex items-center justify-center min-h-[360px] md:min-h-[440px]">
        
        {/* Mouse Parallax Wrapper for Central Title */}
        <div 
          className="relative z-30 pointer-events-none flex items-center justify-center"
          style={{
            transform: `translate3d(${mousePos.x * 8}px, ${mousePos.y * 8}px, 0)`,
            willChange: 'transform',
          }}
        >
          {/* SINGLE HERO TITLE GROUP: SRISHTI + 2.7 + COUNTDOWN + SUBTITLE (SCALES TOGETHER AS ONE UNIT) */}
          <div 
            ref={titleGroupRef}
            className="hero-title flex flex-col items-center justify-center text-center space-y-2 md:space-y-3 origin-center pointer-events-none"
            style={{ willChange: 'transform' }}
          >
            {/* Official Srishti Emblem Icon */}
            <div ref={emblemRef} className="flex justify-center mb-0.5">
              <img 
                src="/srishti-logo-transparent.png" 
                alt="Official Srishti Logo" 
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain drop-shadow-[0_0_25px_rgba(0,119,255,0.7)] animate-pulse" 
              />
            </div>

            <div className="flex flex-col items-center justify-center leading-none">
              {/* Title Part 1: SRISHTI */}
              <h1 className="font-syne font-black text-4xl sm:text-7xl md:text-8xl lg:text-[7.5rem] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#f0f6ff] to-[#0044aa]/90 uppercase drop-shadow-[0_15px_30px_rgba(0,119,255,0.25)]">
                SRISHTI
              </h1>

              {/* LIVE FEST COUNTDOWN TIMER (ANCHORED DIRECTLY TO HERO TITLE GROUP) */}
              <div 
                ref={countdownRef}
                className="my-2 sm:my-3.5 inline-flex flex-col items-center pointer-events-auto"
              >
                <div className="flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-xl">
                  {/* DAYS */}
                  <div className="flex flex-col items-center px-1.5 sm:px-2.5">
                    <span className="font-orbitron font-black text-base sm:text-2xl text-white leading-none">
                      {timeLeft.days}
                    </span>
                    <span className="text-[7px] sm:text-[9px] font-mono font-bold text-white/60 uppercase tracking-widest pt-1">
                      DAYS
                    </span>
                  </div>

                  <span className="font-orbitron font-extrabold text-xs sm:text-base text-white/40 pb-2.5">:</span>

                  {/* HOURS */}
                  <div className="flex flex-col items-center px-1.5 sm:px-2.5">
                    <span className="font-orbitron font-black text-base sm:text-2xl text-white leading-none">
                      {timeLeft.hours}
                    </span>
                    <span className="text-[7px] sm:text-[9px] font-mono font-bold text-white/60 uppercase tracking-widest pt-1">
                      HRS
                    </span>
                  </div>

                  <span className="font-orbitron font-extrabold text-xs sm:text-base text-white/40 pb-2.5">:</span>

                  {/* MINUTES */}
                  <div className="flex flex-col items-center px-1.5 sm:px-2.5">
                    <span className="font-orbitron font-black text-base sm:text-2xl text-white leading-none">
                      {timeLeft.minutes}
                    </span>
                    <span className="text-[7px] sm:text-[9px] font-mono font-bold text-white/60 uppercase tracking-widest pt-1">
                      MINS
                    </span>
                  </div>

                  <span className="font-orbitron font-extrabold text-xs sm:text-base text-white/40 pb-2.5">:</span>

                  {/* SECONDS */}
                  <div className="flex flex-col items-center px-1.5 sm:px-2.5">
                    <span className="font-orbitron font-black text-base sm:text-2xl text-white leading-none">
                      {timeLeft.seconds}
                    </span>
                    <span className="text-[7px] sm:text-[9px] font-mono font-bold text-white/60 uppercase tracking-widest pt-1">
                      SECS
                    </span>
                  </div>
                </div>
              </div>

              {/* Title Part 2: 2.7 (ALWAYS ATTACHED DIRECTLY UNDER SRISHTI / COUNTDOWN) */}
              <div className="font-orbitron font-black text-3xl sm:text-6xl md:text-7xl lg:text-[6.5rem] text-transparent bg-clip-text bg-gradient-to-r from-[#00d4ff] via-[#0077ff] to-[#0055ff] tracking-tight mt-0.5 inline-block text-center drop-shadow-[0_10px_25px_rgba(0,119,255,0.4)]">
                2.7
              </div>
            </div>

            {/* Subheadline: TECHNO CULTURAL FEST */}
            <div ref={subtitleRef} className="hero-sub-text pt-1.5 sm:pt-3">
              <p className="font-mono text-[10px] sm:text-xs md:text-sm tracking-[0.25em] sm:tracking-[0.35em] uppercase text-white/80 font-semibold">
                TECHNO CULTURAL FEST
              </p>
            </div>
          </div>
        </div>

        {/* DYNAMIC FLOATING PARTICLES / LIGHT SPECKS BACKGROUND */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          <div className="absolute top-[20%] left-[15%] w-2 h-2 rounded-full bg-[#0077ff] animate-particle" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[60%] left-[80%] w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-particle" style={{ animationDelay: '1.2s' }} />
          <div className="absolute top-[40%] left-[70%] w-2 h-2 rounded-full bg-[#00d4ff] animate-particle" style={{ animationDelay: '2.4s' }} />
          <div className="absolute top-[75%] left-[25%] w-1 h-1 rounded-full bg-[#d4ff00] animate-particle" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-[15%] left-[85%] w-2.5 h-2.5 rounded-full bg-[#0077ff]/60 blur-[1px] animate-particle" style={{ animationDelay: '1.8s' }} />
        </div>

        {/* PERIPHERAL FLOATING WIDGET 1: TOP-LEFT — REGISTRATIONS */}
        <div
          ref={card1Ref}
          className="hidden lg:flex absolute top-[3%] left-[-1%] xl:left-[1%] z-40 p-4 bg-[#0e0e14]/95 border border-[#0077ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,119,255,0.25)] w-56 flex-col gap-2.5 animate-float-1 hover:scale-105 hover:border-[#0077ff] hover:shadow-[0_20px_50px_rgba(0,119,255,0.5)] transition-all duration-300 group cursor-pointer"
          style={{
            transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -16}px, 0)`,
          }}
          onClick={onNavigateToRegister}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#0077ff]/20 border border-[#0077ff]/60 flex items-center justify-center text-[#0077ff] group-hover:scale-110 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">
                REGISTRATIONS
              </span>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0077ff] animate-ping" />
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-syne font-black text-2xl text-white tracking-tight">500+</span>
            <span className="text-[9px] font-mono text-[#00e5ff] font-bold uppercase tracking-widest">STUDENTS JOINED</span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div className="bg-gradient-to-r from-[#0077ff] via-[#00e5ff] to-[#d4ff00] h-full rounded-full w-[84%] animate-pulse" />
          </div>
        </div>

        {/* PERIPHERAL FLOATING WIDGET 2: TOP-RIGHT — EVENT LINEUP */}
        <div
          ref={card2Ref}
          className="hidden lg:flex absolute top-[11%] right-[-1%] xl:right-[1%] z-40 p-4 bg-[#0e0e14]/95 border border-[#00e5ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,229,255,0.2)] w-60 flex-col gap-2.5 animate-float-2 hover:scale-105 hover:border-[#00e5ff] hover:shadow-[0_20px_50px_rgba(0,229,255,0.45)] transition-all duration-300 group cursor-pointer"
          style={{
            transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * -16}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#00e5ff]/20 border border-[#00e5ff]/60 flex items-center justify-center text-[#00e5ff] group-hover:scale-110 transition-transform">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">
                EVENT LINEUP
              </span>
            </div>
            <span className="px-2.5 py-0.5 text-[8px] font-mono font-bold bg-[#00e5ff]/20 text-[#00e5ff] rounded-full border border-[#00e5ff]/50 animate-pulse">
              LIVE 2026
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-syne font-black text-2xl text-white tracking-tight">15+ EVENTS</span>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#0077ff]/20 text-[#0077ff] border border-[#0077ff]/40">
              HACKATHON
            </span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40">
              CTF
            </span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-white/10 text-white/80">
              CULTURAL
            </span>
          </div>
        </div>

        {/* PERIPHERAL FLOATING WIDGET 3: BOTTOM-LEFT — PRIZE POOL */}
        <div
          ref={card3Ref}
          className="hidden lg:flex absolute bottom-[9%] left-[0.5%] xl:left-[2%] z-40 p-4 bg-[#0e0e14]/95 border border-[#00d4ff]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,212,255,0.2)] w-56 flex-col gap-2.5 animate-float-3 hover:scale-105 hover:border-[#00d4ff] hover:shadow-[0_20px_50px_rgba(0,212,255,0.45)] transition-all duration-300 group cursor-pointer"
          style={{
            transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * 18}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#00d4ff]/20 border border-[#00d4ff]/60 flex items-center justify-center text-[#00d4ff] group-hover:rotate-12 transition-transform">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">
                PRIZE POOL
              </span>
            </div>
            <Sparkles className="w-4 h-4 text-[#d4ff00] animate-spin" style={{ animationDuration: '8s' }} />
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-syne font-black text-2xl text-[#00d4ff] drop-shadow-[0_0_15px_rgba(0,212,255,0.6)]">
              ₹50,000+
            </span>
          </div>

          <p className="text-[9px] font-mono font-bold text-white/70 uppercase tracking-wider">
            CASH PRIZES & CERTIFICATES
          </p>
        </div>

        {/* PERIPHERAL FLOATING WIDGET 4: BOTTOM-RIGHT — WORKSHOPS */}
        <div
          ref={card4Ref}
          className="hidden lg:flex absolute bottom-[4%] right-[0.5%] xl:right-[2%] z-40 p-4 bg-[#0e0e14]/95 border border-[#38bdf8]/40 rounded-2xl backdrop-blur-2xl shadow-[0_15px_40px_rgba(56,189,248,0.2)] w-60 flex-col gap-2.5 animate-float-4 hover:scale-105 hover:border-[#38bdf8] hover:shadow-[0_20px_50px_rgba(56,189,248,0.45)] transition-all duration-300 group cursor-pointer"
          style={{
            transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 18}px, 0)`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#38bdf8]/20 border border-[#38bdf8]/60 flex items-center justify-center text-[#38bdf8] group-hover:scale-110 transition-transform">
                <Code className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono text-white/70 uppercase font-bold tracking-wider">
                WORKSHOPS
              </span>
            </div>
            <Cpu className="w-4 h-4 text-[#38bdf8] animate-pulse" />
          </div>

          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-syne font-black text-lg text-white">AI • WEB • CYBER</span>
          </div>

          <div className="flex items-center gap-1.5 pt-0.5">
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40">
              HANDS-ON
            </span>
            <span className="px-2 py-0.5 text-[8px] font-mono font-bold rounded-md bg-white/10 text-white/80">
              GPU COLAB
            </span>
          </div>
        </div>

        {/* ORGANIC FLOATING PILL 1: "2 DAYS" */}
        <div
          ref={pill1Ref}
          className="hidden xl:flex absolute top-[44%] left-[-1.5%] z-40 px-3.5 py-1.5 rounded-full bg-[#0077ff] text-white text-[10px] font-mono font-bold uppercase shadow-2xl shadow-[#0077ff]/50 -rotate-12 items-center gap-2 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-white animate-bounce" />
          <span>2 DAYS</span>
        </div>

        {/* ORGANIC FLOATING PILL 2: "DECEMBER 4 & 5" */}
        <div
          ref={pill2Ref}
          className="hidden xl:flex absolute top-[52%] right-[-1.5%] z-40 px-3.5 py-1.5 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/60 text-[#00e5ff] text-[10px] font-mono font-bold uppercase backdrop-blur-2xl shadow-2xl shadow-[#00e5ff]/40 rotate-12 items-center gap-2 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff] animate-pulse" />
          <span>DEC 4 & 5</span>
        </div>

      </div>

      {/* HERO BOTTOM STATUS BAR */}
      <div 
        ref={bottomBarRef}
        className="hero-bottom-bar relative z-30 max-w-7xl mx-auto px-4 md:px-12 w-full flex items-center justify-between text-[10px] md:text-xs font-mono text-white/50 border-t border-white/10 pt-3 md:pt-4"
      >
        {/* Left Info */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0077ff]" />
          <span>SRISHTI 2.7 • ST. THOMAS COLLEGE</span>
        </div>

        {/* Center Scroll Indicator */}
        <div className="flex items-center gap-2 text-white/60">
          <span className="tracking-widest uppercase text-[9px] md:text-[10px]">SCROLL TO EXPLORE</span>
          <div className="w-3.5 h-5 md:h-6 border border-white/30 rounded-full flex justify-center p-0.5">
            <div className="w-1 h-1.5 bg-[#0077ff] rounded-full animate-bounce" />
          </div>
        </div>

        {/* Right Action */}
        <a
          href="#register"
          onClick={(e) => {
            if (onNavigateToRegister) {
              e.preventDefault();
              onNavigateToRegister();
            }
          }}
          className="hidden sm:flex items-center gap-1.5 text-white hover:text-[#0077ff] font-syne font-bold uppercase transition-colors"
        >
          <span>Register Now</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
