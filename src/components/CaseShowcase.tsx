import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowUpRight,
  Calendar,
  MapPin,
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

  // DESKTOP: Scroll-driven sticky storytelling
  useEffect(() => {
    if (!sectionRef.current || !stageRef.current) return;

    const mm = gsap.matchMedia();

    mm.add(`(min-width: ${DESKTOP_BP}px)`, () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const progress = self.progress;
          const rawIndex = progress * (N - 1);
          const newIndex = Math.min(N - 1, Math.max(0, Math.round(rawIndex)));
          setActiveIndex(newIndex);
        },
      });
    });

    return () => mm.revert();
  }, [N]);

  // DESKTOP RENDER
  if (isDesktop) {
    return (
      <section
        id="cases"
        ref={sectionRef}
        className="relative w-full bg-[#050608]"
        style={{ height: `${N * 100}vh` }}
      >
        {/* Sticky Stage */}
        <div
          ref={stageRef}
          className="sticky top-0 w-full h-screen overflow-hidden flex flex-col"
        >
          {/* Section Header */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full flex items-end justify-between pt-8 pb-4 shrink-0 z-30">
            <div>
              <span className="text-[10px] md:text-[11px] font-body font-medium text-white/25 tracking-wider uppercase">
                01 / Featured Events
              </span>
              <h2 className="font-display text-3xl xl:text-4xl font-bold tracking-tight text-white/90 uppercase leading-tight mt-1">
                Event Showcase
              </h2>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-body text-white/25">
              <span className="w-6 h-px bg-white/10" />
              <span className="tracking-wider uppercase">Scroll to explore</span>
              <span className="font-technical text-white/35">
                {activeEvent.number}/{String(N).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Two-Column Stage: Left Info + Right Large Visual */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full grid grid-cols-12 gap-8 xl:gap-12 items-center flex-1 min-h-0 z-20">
            
            {/* LEFT COLUMN: Event Information */}
            <div ref={leftColRef} className="col-span-5 flex flex-col justify-center space-y-5 z-30">
              {/* Stage & Category */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-body font-medium tracking-wider uppercase text-white/35">
                  {activeEvent.stageLabel}
                </span>
                <span className="w-4 h-px bg-white/10" />
                <span className="text-[10px] font-technical text-white/20">EVENT {activeEvent.number}</span>
              </div>

              {/* Title */}
              <div className="space-y-1">
                <h3
                  key={activeEvent.id}
                  className="font-display text-3xl xl:text-5xl font-bold text-white/90 tracking-tight leading-[1.1] transition-all duration-500"
                >
                  {activeEvent.title}
                </h3>
                <p className="text-sm font-body tracking-wide transition-colors duration-500 text-white/40">
                  {activeEvent.category}
                </p>
              </div>

              {/* Highlight — clean text, thin top border */}
              <div className="pt-4 border-t border-white/[0.06]">
                <p className="text-sm font-medium text-white/60 leading-snug">
                  {activeEvent.highlightText}
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-white/40 leading-relaxed font-light line-clamp-3">
                {activeEvent.description}
              </p>

              {/* Time & Venue — minimal */}
              <div className="flex items-center gap-4 text-[11px] font-body text-white/35">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white/25 shrink-0" />
                  <span>{activeEvent.time}</span>
                </div>
                <span className="text-white/10">·</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/25 shrink-0" />
                  <span>{activeEvent.venue}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeEvent.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-[9px] font-body font-medium rounded bg-white/[0.03] text-white/30 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="#register"
                  onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-white text-[#050608] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#2563EB] hover:text-white transition-all duration-300 group"
                >
                  <span>Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                <div className="text-[11px] font-body text-white/25">
                  <span className="text-white/15">PRIZE</span>{' '}
                  <span className="text-white/50 font-medium">{activeEvent.prize}</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Large Event Visual */}
            <div ref={rightColRef} className="col-span-7 relative flex items-center justify-center h-full">
              {/* Large Visual Card — flat, no 3D */}
              <div
                key={activeEvent.id}
                className="relative w-[90%] xl:w-[85%] aspect-[4/3] rounded-xl overflow-hidden border border-white/[0.08] transition-all duration-700"
              >
                {/* Background Image */}
                <img
                  src={activeEvent.image}
                  alt={activeEvent.title}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/30 to-transparent" />

                {/* Card Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <span className="font-technical text-xs font-medium tracking-widest text-white/50">{activeEvent.number}</span>
                    <span className="text-[10px] font-body font-medium tracking-wider uppercase text-white/40">
                      {activeEvent.stageLabel}
                    </span>
                  </div>

                  {/* Bottom row */}
                  <div>
                    <h4 className="font-display font-bold text-2xl xl:text-3xl text-white/90 tracking-tight leading-tight mb-2">
                      {activeEvent.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] font-body">
                      <span className="text-white/40">{activeEvent.time}</span>
                      <span className="text-white/15">·</span>
                      <span className="text-white/50 font-medium">{activeEvent.prize}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="max-w-7xl mx-auto px-8 xl:px-12 w-full flex items-center justify-between text-[10px] font-body text-white/20 border-t border-white/[0.06] py-3 shrink-0 z-30">
            <span className="font-technical">SRISHTI 2.7 · FEATURED EVENTS</span>
            {/* Progress dots — muted */}
            <div className="flex items-center gap-1">
              {showcaseEvents.map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === activeIndex ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.08)',
                    transform: i === activeIndex ? 'scale(1.4)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <span className="font-technical">ST. THOMAS COLLEGE</span>
          </div>
        </div>
      </section>
    );
  }

  // MOBILE / TABLET RENDER
  return (
    <section id="cases" className="relative w-full bg-[#050608] text-[#E8E8EC] py-12 sm:py-16">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10">
        <span className="text-[9px] sm:text-[10px] font-body font-medium text-white/25 tracking-wider uppercase">
          01 / Featured Events
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white/90 uppercase mt-2">
          Event Showcase
        </h2>
        <p className="text-xs sm:text-sm font-body text-white/35 mt-2">
          {N} events across 2 days · Dec 4 & 5, 2026
        </p>
      </div>

      {/* Static Event Cards Grid */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5">
        {showcaseEvents.map((evt) => (
          <div
            key={evt.id}
            className="relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0D1015]"
          >
            {/* Event Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1015] via-[#0D1015]/60 to-transparent" />
              {/* Number */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-technical font-medium text-white/40 tracking-widest">{evt.number}</span>
              </div>
              {/* Stage Label */}
              <div className="absolute top-3 right-3">
                <span className="text-[9px] font-body font-medium tracking-wider uppercase text-white/35">
                  {evt.stageLabel}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 sm:p-5 space-y-3">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-white/85 tracking-tight leading-snug">{evt.title}</h3>
                <p className="text-[11px] sm:text-xs font-body mt-0.5 text-white/35">{evt.category}</p>
              </div>

              <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed line-clamp-2">{evt.description}</p>

              {/* Meta Row */}
              <div className="flex items-center gap-3 text-[10px] sm:text-[11px] font-body text-white/30">
                <div className="flex items-center gap-1"><Calendar className="w-3 h-3 text-white/20" /><span>{evt.time}</span></div>
                <span className="text-white/10">·</span>
                <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white/20" /><span>{evt.venue}</span></div>
              </div>

              {/* Bottom: Prize + CTA */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <div className="text-[10px] sm:text-xs font-body">
                  <span className="text-white/20">PRIZE </span>
                  <span className="text-white/60 font-medium">{evt.prize}</span>
                </div>
                <a
                  href="#register"
                  onClick={(e) => { if (onNavigateToRegister) { e.preventDefault(); onNavigateToRegister(); } }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-white/60 text-[9px] sm:text-[10px] font-body font-medium uppercase tracking-wider hover:bg-[#2563EB] hover:border-[#2563EB] hover:text-white transition-all"
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
