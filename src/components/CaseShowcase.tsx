import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';

import { useFest } from '../context/FestContext';

gsap.registerPlugin(ScrollTrigger);

// =============================================
// TYPES
// =============================================
interface ShowcaseEvent {
  id: string;
  number: string;
  stageLabel: string;
  title: string;
  category: string;
  highlightText: string;
  description: string;
  time: string;
  venue: string;
  prize: string;
  tags: string[];
  color: string;
  bgGradient: string;
  image: string;
}

interface CaseShowcaseProps {
  onNavigateToRegister?: () => void;
}

const DESKTOP_BP = 1024;

// =============================================
// COMPONENT
// =============================================
export const CaseShowcase: React.FC<CaseShowcaseProps> = ({ onNavigateToRegister }) => {
  const { events } = useFest();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Filter to participating events only (skip Inauguration, Keynote, etc.)
  const showcaseEvents: ShowcaseEvent[] = useMemo(() => {
    const participating = events.filter((e) => e.isParticipating !== false);
    return (participating.length > 0 ? participating : events).map((e, i) => ({
      ...e,
      number: String(i + 1).padStart(2, '0'),
    }));
  }, [events]);

  const N = showcaseEvents.length;
  const activeEvent = showcaseEvents[activeIndex] || showcaseEvents[0];

  // Responsive check
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_BP);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ==========================================
  // DESKTOP: Scroll-driven sticky storytelling
  // ==========================================
  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(`(min-width: ${DESKTOP_BP}px)`, () => {
      // The outer section height provides real scroll distance.
      // The stage is CSS sticky and stays in view while the user scrolls through.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress; // 0.0 → 1.0
          // Map progress to event index with smooth interpolation
          const rawIndex = progress * (N - 1);
          const newIndex = Math.min(N - 1, Math.max(0, Math.round(rawIndex)));
          setActiveIndex(newIndex);
        },
      });
    });

    // MOBILE: No ScrollTrigger at all. Nothing. Zero.
    // (intentionally empty — no mm.add for mobile)

    return () => mm.revert();
  }, [N]);

  // ==========================================
  // DESKTOP RENDER
  // ==========================================
  if (isDesktop) {
    return (
      <section
        id="cases"
        ref={sectionRef}
        className="relative w-full bg-[#060608]"
        // Provide real scroll distance: N events × 100vh each
        style={{ height: `${N * 100}vh` }}
      >
        {/* Sticky Stage — stays in viewport while section scrolls */}
        <div
          ref={stageRef}
          className="sticky top-0 w-full h-screen overflow-hidden flex flex-col"
        >
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full flex items-end justify-between pt-8 pb-4 shrink-0 z-30">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0077ff] animate-pulse" />
                <span className="text-[10px] md:text-xs font-mono text-[#0077ff] tracking-widest uppercase font-semibold">
                  FEATURED EVENTS
                </span>
              </div>
              <h2 className="font-syne text-4xl xl:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
                Event <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase">Showcase</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-white/50">
              <span className="w-8 h-[1px] bg-white/20" />
              <span>SCROLL TO EXPLORE</span>
              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-xs">
                {activeEvent.number} / {String(N).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Two-Column Stage: Left Info + Right Large Visual */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full grid grid-cols-12 gap-8 xl:gap-12 items-center flex-1 min-h-0 z-20">
            
            {/* LEFT COLUMN: Event Information */}
            <div ref={leftColRef} className="col-span-5 flex flex-col justify-center space-y-5 z-30">
              {/* Stage & Category */}
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 text-[11px] font-mono font-semibold tracking-wider uppercase rounded-full border transition-all duration-500"
                  style={{ borderColor: `${activeEvent.color}60`, color: activeEvent.color, backgroundColor: `${activeEvent.color}15` }}
                >
                  {activeEvent.stageLabel}
                </span>
                <span className="text-xs font-mono text-white/40">EVENT {activeEvent.number}</span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <h3
                  key={activeEvent.id}
                  className="font-syne text-3xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1] transition-all duration-500"
                >
                  {activeEvent.title}
                </h3>
                <p className="text-sm font-mono tracking-wide transition-colors duration-500" style={{ color: activeEvent.color }}>
                  {activeEvent.category}
                </p>
              </div>

              {/* Highlight Box */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 relative overflow-hidden transition-all duration-500">
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-500" style={{ backgroundColor: activeEvent.color }} />
                <p className="text-base font-semibold text-white/90 leading-snug pl-3">
                  <span style={{ color: activeEvent.color }}>{activeEvent.highlightText.split(' ').slice(0, 3).join(' ')}</span>{' '}
                  {activeEvent.highlightText.split(' ').slice(3).join(' ')}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-white/70 leading-relaxed font-light line-clamp-3">
                {activeEvent.description}
              </p>

              {/* Time & Venue */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <Calendar className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span className="truncate">{activeEvent.time}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/5 border border-white/10 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#0077ff] shrink-0" />
                  <span className="truncate">{activeEvent.venue}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {activeEvent.tags.map((tag) => (
                  <span key={tag} className="px-2.5 py-0.5 text-[9px] font-mono font-bold rounded-md bg-white/5 border border-white/10 text-white/60 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-1">
                <a
                  href="#register"
                  onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-black font-syne text-xs font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:text-white transition-all duration-300 shadow-xl group"
                >
                  <span>Register</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <div className="text-xs font-mono text-white/50">
                  <span className="text-white/30">PRIZE</span>{' '}
                  <span className="text-white font-bold">{activeEvent.prize}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Large Event Visual Plane */}
            <div ref={rightColRef} className="col-span-7 relative flex items-center justify-center h-full">
              {/* Ambient glow */}
              <div
                className="absolute w-[450px] h-[450px] rounded-full opacity-15 pointer-events-none transition-colors duration-700 blur-[100px]"
                style={{ backgroundColor: activeEvent.color }}
              />

              {/* Large Visual Card — occupies substantial right half */}
              <div
                key={activeEvent.id}
                className="relative w-[90%] xl:w-[85%] aspect-[4/3] rounded-3xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-700"
                style={{
                  transform: 'perspective(1200px) rotateY(-4deg) rotateX(2deg)',
                  boxShadow: `0 30px 80px ${activeEvent.color}30, 0 0 0 1px ${activeEvent.color}20`,
                }}
              >
                {/* Background Image */}
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/40 to-transparent" />

                {/* Card Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" style={{ color: activeEvent.color }} />
                      </span>
                      <span className="text-xs font-mono font-bold tracking-widest text-white/80">{activeEvent.number}</span>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border bg-black/40 backdrop-blur-md"
                      style={{ color: activeEvent.color, borderColor: `${activeEvent.color}50` }}
                    >
                      {activeEvent.stageLabel}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div>
                    <h4 className="font-syne font-black text-3xl xl:text-4xl text-white tracking-tight leading-tight drop-shadow-lg mb-2">
                      {activeEvent.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-white/60">{activeEvent.time}</span>
                      <span className="text-white/30">•</span>
                      <span style={{ color: activeEvent.color }} className="font-bold">{activeEvent.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full flex items-center justify-between text-xs font-mono text-white/40 border-t border-white/10 py-3 shrink-0 z-30">
            <span>SRISHTI 2.7 • FEATURED EVENTS</span>
            {/* Progress dots */}
            <div className="flex items-center gap-1.5">
              {showcaseEvents.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === activeIndex ? activeEvent.color : 'rgba(255,255,255,0.15)',
                    transform: i === activeIndex ? 'scale(1.5)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <span>ST. THOMAS COLLEGE</span>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // MOBILE / TABLET RENDER
  // Static event cards — normal document flow, native scroll, zero animation.
  // ==========================================
  return (
    <section id="cases" className="relative w-full bg-[#060608] text-[#f5f5f7] py-12 sm:py-16">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#0077ff]" />
          <span className="text-[9px] sm:text-[10px] font-mono text-[#0077ff] tracking-widest uppercase font-semibold">
            FEATURED EVENTS
          </span>
        </div>
        <h2 className="font-syne text-2xl sm:text-3xl font-bold tracking-tight text-white uppercase">
          Event <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase">Showcase</span>
        </h2>
        <p className="text-xs sm:text-sm font-mono text-white/50 mt-2">
          {N} events across 2 days • Dec 4 & 5, 2026
        </p>
      </div>

      {/* Static Event Cards Grid */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5">
        {showcaseEvents.map((evt) => (
          <div
            key={evt.id}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0c101d] to-[#080b12]"
          >
            {/* Event Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c101d] via-[#0c101d]/60 to-transparent" />
              {/* Number Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: evt.color }} />
                </span>
                <span className="text-[10px] font-mono font-bold text-white/80 tracking-widest">{evt.number}</span>
              </div>
              {/* Stage Label */}
              <div className="absolute top-3 right-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase border bg-black/50 backdrop-blur-md"
                  style={{ color: evt.color, borderColor: `${evt.color}50` }}
                >
                  {evt.stageLabel}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h3 className="font-syne font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">{evt.title}</h3>
                <p className="text-[11px] sm:text-xs font-mono mt-0.5" style={{ color: evt.color }}>{evt.category}</p>
              </div>

              <p className="text-[11px] sm:text-xs text-white/65 leading-relaxed line-clamp-2">{evt.description}</p>

              {/* Meta Row */}
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono text-white/60">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-[#0077ff]" /><span>{evt.time}</span></div>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#0077ff]" /><span>{evt.venue}</span></div>
              </div>

              {/* Bottom: Prize + CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="text-[10px] sm:text-xs font-mono">
                  <span className="text-white/40">PRIZE </span>
                  <span className="text-white font-bold">{evt.prize}</span>
                </div>
                <a
                  href="#register"
                  onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white text-[9px] sm:text-[10px] font-syne font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:border-[#0077ff] transition-all"
                >
                  <span>Register</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseShowcase;
