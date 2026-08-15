import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, TrendingUp, BarChart3, Zap, ArrowUpRight, Sparkles, CreditCard, PieChart, Activity, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const browserFrameRef = useRef<HTMLDivElement>(null);
  const screenCanvasRef = useRef<HTMLDivElement>(null);

  const widgetLeft1Ref = useRef<HTMLDivElement>(null);
  const widgetLeft2Ref = useRef<HTMLDivElement>(null);
  const widgetRight1Ref = useRef<HTMLDivElement>(null);
  const widgetRight2Ref = useRef<HTMLDivElement>(null);
  const widgetBottomRef = useRef<HTMLDivElement>(null);

  // Floating 3D Pills inside Browser Screen
  const pillMarketRef = useRef<HTMLDivElement>(null);
  const pillPaymentsRef = useRef<HTMLDivElement>(null);
  const pillToolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // 300vh Pinned Hero Zoom Timeline (Clean GSAP control, zero CSS transition conflict)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.4, // Responsive scrub without ghost drift
          anticipatePin: 1,
        },
      });

      // 1. Headline translates up and fades out (0% -> 20%)
      tl.to('.hero-headline-container', {
        y: -120,
        opacity: 0,
        ease: 'none',
      }, 0);

      // 2. Orbiting Side Widgets translate straight UP and fade out (0% -> 20%)
      // Scale is strictly kept at 1.0; no strange rotation or multi-axis drift
      tl.to([widgetLeft1Ref.current, widgetLeft2Ref.current, widgetRight1Ref.current, widgetRight2Ref.current, widgetBottomRef.current], {
        y: -160,
        opacity: 0,
        stagger: 0.02,
        ease: 'none',
      }, 0);

      // 3. Floating Pills Parallax Shift inside Browser Window (0% -> 50%)
      tl.to(pillMarketRef.current, {
        y: -40,
        x: 20,
        ease: 'none',
      }, 0);

      tl.to(pillPaymentsRef.current, {
        y: -30,
        x: -30,
        ease: 'none',
      }, 0);

      tl.to(pillToolsRef.current, {
        y: 40,
        x: -10,
        ease: 'none',
      }, 0);

      // 4. Central Browser Widget Zooms in to 100vw AFTER side widgets vanish (22% -> 75%)
      tl.to(browserFrameRef.current, {
        scale: 2.7,
        y: 0,
        borderRadius: '0px',
        borderWidth: '0px',
        boxShadow: 'none',
        ease: 'power2.inOut',
      }, 0.22);

      // 5. Fade out browser address bar as screen reaches 100vw full screen (38% -> 58%)
      tl.to('.browser-address-bar', {
        opacity: 0,
        ease: 'none',
      }, 0.38);

      // 6. User scrolls through screen canvas content smoothly (60% -> 100%)
      tl.to(screenCanvasRef.current, {
        y: -100,
        ease: 'none',
      }, 0.6);

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-[#0b0b0b] text-[#f5f5f7] flex flex-col justify-between pt-20 pb-8 select-none"
    >
      {/* Background Soft Ambient Lighting */}
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[#0077ff]/14 rounded-full blur-[150px] pointer-events-none" />

      {/* Hero Headline Area */}
      <div className="hero-headline-container relative z-20 text-center w-full max-w-5xl mx-auto px-6 pointer-events-none space-y-3">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/12 text-xs font-mono tracking-widest text-white/80 uppercase backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#00d4ff]" />
          <span>St. Thomas College • CS Department</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.02] uppercase">
          Srishti <br />
          <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl mx-2">
            2.7
          </span>
          <br className="hidden sm:block" />
          Techno Cultural Fest
        </h1>
      </div>

      {/* Main Composition Stage with Generous Spacing */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12 my-auto flex items-center justify-center min-h-[420px]">
        
        {/* WIDGET 1: Top-Left Event Registration Widget */}
        <div
          ref={widgetLeft1Ref}
          className="hidden xl:flex absolute top-[2%] left-[-20px] z-40 flex-col gap-3 p-4 bg-[#141419]/90 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl w-48"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <Rocket className="w-5 h-5 text-[#00d4ff]" />
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00d4ff]/20 text-[#00d4ff] rounded-full">
              500+
            </span>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-syne font-bold text-white uppercase block">
              Registrations
            </span>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#00d4ff] to-[#0044ff] h-full w-[78%]" />
            </div>
          </div>
        </div>

        {/* WIDGET 2: Bottom-Left Event Stats Widget */}
        <div
          ref={widgetLeft2Ref}
          className="hidden lg:flex absolute bottom-[2%] left-[-30px] z-40 p-4 bg-[#121217]/95 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl w-56 flex-col gap-3"
        >
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span>Event Lineup</span>
            <TrendingUp className="w-4 h-4 text-[#0077ff]" />
          </div>

          <div className="w-full h-14 flex items-end gap-1 px-1">
            <div className="w-1/6 bg-white/10 h-[30%] rounded-t-sm" />
            <div className="w-1/6 bg-white/10 h-[50%] rounded-t-sm" />
            <div className="w-1/6 bg-white/10 h-[40%] rounded-t-sm" />
            <div className="w-1/6 bg-[#0077ff] h-[75%] rounded-t-sm" />
            <div className="w-1/6 bg-[#0077ff] h-[90%] rounded-t-sm" />
            <div className="w-1/6 bg-[#00d4ff] h-[100%] rounded-t-sm" />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-xs text-[#d4ff00] font-mono font-bold">Events</span>
            <span className="px-3 py-1 bg-[#0077ff] text-white text-xs font-syne font-bold rounded-full shadow-lg">
              15+ Events
            </span>
          </div>
        </div>

        {/* CENTRAL SCREEN-LIKE BROWSER WIDGET (NO CSS TRANSITIONS TO PREVENT GHOST DRIFT) */}
        <div
          ref={browserFrameRef}
          className="relative z-30 w-full max-w-xl bg-[#0e0e12] border border-white/15 rounded-2xl p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col justify-between"
          style={{ willChange: 'transform' }}
        >
          {/* macOS Browser Window Bar */}
          <div className="browser-address-bar flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] font-mono text-white/60 ml-2">
                <Lock className="w-3 h-3 text-[#27c93f]" />
                <span>srishti27.stthomas.ac.in</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-1 bg-[#0077ff]/20 text-[#0077ff] rounded-full font-bold">
              LIVE EVENT HUB
            </span>
          </div>

          {/* Interactive Screen Canvas Inside Browser Widget */}
          <div ref={screenCanvasRef} className="relative z-10 space-y-4">
            
            {/* FLOATING 3D PILL 1: "Code Sprint" */}
            <div
              ref={pillMarketRef}
              className="absolute top-[8%] right-[4%] z-40 px-4 py-2 bg-[#27c93f] text-black font-syne font-bold text-xs rounded-xl shadow-2xl rotate-6 pointer-events-none flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>Code Sprint Live</span>
            </div>

            {/* FLOATING 3D PILL 2: "Hackathon Arena" */}
            <div
              ref={pillPaymentsRef}
              className="absolute top-[48%] left-[2%] z-40 px-4 py-2 bg-[#0055ff] text-white font-syne font-bold text-xs rounded-xl shadow-2xl -rotate-6 pointer-events-none flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Hackathon Arena</span>
            </div>

            {/* FLOATING 3D PILL 3: "Tech Talks" */}
            <div
              ref={pillToolsRef}
              className="absolute bottom-[4%] left-[28%] z-40 px-4 py-2 bg-[#00d4ff] text-black font-syne font-bold text-xs rounded-xl shadow-2xl rotate-3 pointer-events-none flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Tech Talks & Workshops</span>
            </div>

            {/* Screen Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-mono text-white/40 uppercase block">Srishti 2.7 Event Dashboard</span>
                <h4 className="font-syne text-xl md:text-3xl font-extrabold text-white uppercase tracking-tight">
                  December 4 – 5, 2026
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0077ff] flex items-center justify-center font-bold text-xs">
                  CS
                </div>
              </div>
            </div>

            {/* Live Metrics Grid inside Screen Widget */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#15151c] border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-white/40 block">TOTAL EVENTS</span>
                <span className="font-syne font-black text-base md:text-xl text-white">15+</span>
              </div>
              <div className="p-3 bg-[#15151c] border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-white/40 block">PRIZE POOL</span>
                <span className="font-syne font-black text-base md:text-xl text-[#0077ff]">₹50K+</span>
              </div>
              <div className="p-3 bg-[#15151c] border border-white/10 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-white/40 block">PARTICIPANTS</span>
                <span className="font-syne font-black text-base md:text-xl text-[#d4ff00]">500+</span>
              </div>
            </div>

            {/* Animated Chart Canvas inside Screen Widget */}
            <div className="w-full h-32 md:h-44 bg-gradient-to-tr from-[#14141e] via-[#0e1a28] to-[#12101f] border border-white/12 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-white/60">
                <span>EVENT CATEGORIES & PARTICIPATION</span>
                <span className="text-[#27c93f] font-bold">2-Day Schedule</span>
              </div>

              {/* Bar Chart Bars with Color Accents */}
              <div className="w-full flex items-end justify-between gap-2 h-24 pt-4">
                <div className="w-full bg-[#0077ff]/40 h-[35%] rounded-t-lg" />
                <div className="w-full bg-[#0077ff]/60 h-[50%] rounded-t-lg" />
                <div className="w-full bg-[#0077ff] h-[75%] rounded-t-lg" />
                <div className="w-full bg-[#00d4ff] h-[95%] rounded-t-lg flex items-center justify-center text-[10px] font-mono font-bold text-black pb-1">
                  CTF
                </div>
                <div className="w-full bg-[#0055ff] h-[80%] rounded-t-lg flex items-center justify-center text-[10px] font-mono font-bold text-white pb-1">
                  AI
                </div>
                <div className="w-full bg-[#0077ff]/40 h-[50%] rounded-t-lg" />
              </div>
            </div>

            {/* Bottom Footer Meta info inside Screen Widget */}
            <div className="flex items-center justify-between text-xs font-mono text-white/40 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <PieChart className="w-3.5 h-3.5 text-[#0077ff]" />
                <span>DEPT: COMPUTER SCIENCE</span>
              </div>
              <span className="text-white/60">ST. THOMAS COLLEGE</span>
            </div>

          </div>
        </div>

        {/* WIDGET 3: Top-Right "Workshops" Widget */}
        <div
          ref={widgetRight1Ref}
          className="hidden xl:flex absolute top-[2%] right-[-20px] z-40 p-4 bg-[#141419]/95 border border-white/15 rounded-2xl backdrop-blur-xl shadow-2xl w-56 flex-col gap-3"
        >
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span>Workshops</span>
            <BarChart3 className="w-4 h-4 text-[#d4ff00]" />
          </div>

          <div className="flex items-end justify-between h-20 gap-1.5 px-1 pt-2">
            <div className="w-full bg-white/10 h-[35%] rounded-t-md" />
            <div className="w-full bg-white/10 h-[55%] rounded-t-md" />
            <div className="w-full bg-white/10 h-[40%] rounded-t-md" />
            <div className="w-full bg-[#d4ff00] h-[95%] rounded-t-md flex items-center justify-center text-[9px] font-mono font-bold text-black pb-1">
              AI
            </div>
            <div className="w-full bg-[#ffbd2e] h-[70%] rounded-t-md flex items-center justify-center text-[9px] font-mono font-bold text-black pb-1">
              Web
            </div>
            <div className="w-full bg-white/10 h-[45%] rounded-t-md" />
          </div>

          <div className="flex justify-between text-[9px] font-mono text-white/30 pt-1 border-t border-white/10">
            <span>Day 1</span>
            <span>Day 2</span>
            <span>Fin</span>
            <span>Post</span>
          </div>
        </div>

        {/* WIDGET 4: Bottom-Right Bright Blue Circle — Days Counter */}
        <div
          ref={widgetRight2Ref}
          className="hidden lg:flex absolute bottom-[2%] right-[-30px] z-40 w-32 h-32 rounded-full bg-[#0077ff] text-white p-3 flex-col items-center justify-center text-center shadow-2xl shadow-[#0077ff]/40"
        >
          <span className="font-syne font-black text-xl leading-none">2 Days</span>
          <span className="text-[9px] font-mono tracking-tight leading-tight opacity-90 mt-1">
            Dec 4 & 5 of nonstop CS action
          </span>
        </div>

        {/* WIDGET 5: Bottom Floating Key Features Pill + Register Button */}
        <div
          ref={widgetBottomRef}
          className="hidden sm:flex absolute -bottom-[12%] right-[5%] z-40 items-center gap-3"
        >
          <div className="px-4 py-2.5 rounded-full bg-[#121217] border border-white/15 text-white font-syne text-xs font-semibold flex items-center gap-2 shadow-xl">
            <div className="w-5 h-5 rounded-full bg-[#00d4ff] flex items-center justify-center text-black">
              <Zap className="w-3 h-3 fill-black" />
            </div>
            <span>15+ Events</span>
          </div>

          <a
            href="#cta"
            className="px-6 py-3 rounded-full bg-[#0055ff] hover:bg-[#0077ff] text-white font-syne text-xs font-bold uppercase tracking-wider shadow-2xl transition-colors flex items-center gap-2"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="relative z-30 flex flex-col items-center gap-2 opacity-50 pb-2">
        <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase">
          SCROLL TO EXPLORE SRISHTI 2.7
        </span>
        <div className="w-4 h-7 border border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-1.5 bg-[#0077ff] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
