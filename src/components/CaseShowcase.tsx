import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Calendar, 
  MapPin 
} from 'lucide-react';

import { useFest } from '../context/FestContext';

gsap.registerPlugin(ScrollTrigger);

export interface WheelEventItem {
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
  icon: React.ReactNode;
}

interface CaseShowcaseProps {
  onNavigateToRegister?: () => void;
}

export const CaseShowcase: React.FC<CaseShowcaseProps> = ({ onNavigateToRegister }) => {
  const { events } = useFest();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartY = useRef<number | null>(null);

  // Map dynamic participating events from FestContext
  const participatingEvents = events.filter((e) => e.isParticipating !== false);
  const WHEEL_EVENTS: WheelEventItem[] = (participatingEvents.length > 0 ? participatingEvents : events).map((e, i) => ({
    ...e,
    number: (i + 1).toString().padStart(2, '0'),
    icon: <Sparkles className="w-5 h-5" style={{ color: e.color || '#0077ff' }} />,
  }));

  // 3D Circular Ring Math: 360 / N degrees per spoke
  const N = WHEEL_EVENTS.length;
  const ANGLE_STEP = 360 / N; 

  // Proportionate 3D Wheel radii for true circular orbit (perfectly fitted for mobile & desktop)
  const RADIUS_X = isMobile ? 70 : 220;
  const RADIUS_Z = isMobile ? 95 : 240;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lastWheelTime = useRef<number>(0);

  // Smooth rotation function to bring target card to front focus
  const spinToCard = useCallback((targetIndex: number) => {
    const validIndex = Math.max(0, Math.min(N - 1, targetIndex));
    const targetAngle = -validIndex * ANGLE_STEP;

    setActiveIndex(validIndex);
    setWheelRotation(targetAngle);
  }, [ANGLE_STEP, N]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    // 1. Entrance animation when emerging after fullscreen hero
    gsap.fromTo(
      '.wheel-header, .wheel-stage-container',
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      }
    );

    // Desktop Pinned Wheel Timeline
    mm.add('(min-width: 769px)', () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1600',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetAngle = -progress * (N - 1) * ANGLE_STEP;
          setWheelRotation(targetAngle);
          const newIdx = Math.min(N - 1, Math.max(0, Math.round(progress * (N - 1))));
          setActiveIndex(newIdx);
        },
      });
    });

    // Mobile Pinned Wheel Timeline (crisp, continuous scrub, zero blank gap)
    mm.add('(max-width: 768px)', () => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=650',
        pin: true,
        pinSpacing: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          const targetAngle = -progress * (N - 1) * ANGLE_STEP;
          setWheelRotation(targetAngle);
          const newIdx = Math.min(N - 1, Math.max(0, Math.round(progress * (N - 1))));
          setActiveIndex(newIdx);
        },
      });
    });

    return () => mm.revert();
  }, [ANGLE_STEP, N]);

  const handleCardWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 250) return;

    if (Math.abs(e.deltaY) > 15) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        spinToCard(activeIndex + 1);
      } else {
        spinToCard(activeIndex - 1);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartY.current - touchEndX;

    if (Math.abs(diffX) > 30) {
      if (diffX > 0) {
        spinToCard(activeIndex + 1);
      } else {
        spinToCard(activeIndex - 1);
      }
    }
    touchStartY.current = null;
  };

  const activeEvent = WHEEL_EVENTS[activeIndex] || WHEEL_EVENTS[0];

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] md:h-[100dvh] bg-[#060608] text-[#f5f5f7] flex flex-col justify-between py-4 sm:py-6 md:py-8 overflow-hidden select-none"
    >
      {/* Top Section Header */}
      <div className="wheel-header max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-2 sm:gap-3 z-30 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0077ff] animate-pulse" />
            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#0077ff] tracking-widest uppercase font-semibold">
              03 / 3D ROTATING EVENT WHEEL
            </span>
          </div>
          <h2 className="font-syne text-xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white uppercase leading-tight">
            Featured <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase">Events</span>
          </h2>
        </div>

        {/* Desktop Meta Counter */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-6 md:w-8 h-[1px] bg-white/20" />
            <span className="text-[10px] md:text-xs">
              SCROLL TO ROTATE WHEEL
            </span>
          </div>
          <div className="px-2.5 py-0.5 md:px-3 md:py-1 rounded-full bg-white/5 border border-white/10 text-white/80 font-mono text-[10px] md:text-xs">
            0{activeIndex + 1} / 0{N}
          </div>
        </div>

        {/* MOBILE QUICK EVENT SELECTOR TABS */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full pt-1">
          {WHEEL_EVENTS.map((item, idx) => (
            <button
              key={item.id + '-tab'}
              onClick={() => spinToCard(idx)}
              className={`px-2.5 py-1 rounded-full text-[9px] font-mono whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                idx === activeIndex
                  ? 'bg-[#0077ff] text-white font-bold shadow-lg shadow-[#0077ff]/30'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              <span>{item.number}</span>
              <span>{item.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: Left Active Info Panel + Right 3D Rotating Wheel */}
      <div className="wheel-stage-container max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center my-auto z-20 flex-1 min-h-0 py-2 sm:py-4 md:py-0">
        
        {/* LEFT COLUMN: Active Event Information Panel */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-2 sm:space-y-3 md:space-y-5 z-30">
          
          {/* Stage & Category Pills */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <span 
              key={activeEvent.id + '-stage'}
              className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] md:text-[11px] font-mono font-semibold tracking-wider uppercase rounded-full border transition-all duration-300"
              style={{ 
                borderColor: `${activeEvent.color}60`,
                color: activeEvent.color,
                backgroundColor: `${activeEvent.color}15`
              }}
            >
              {activeEvent.stageLabel}
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40">
              STAGE {activeEvent.number}
            </span>
          </div>

          {/* Title & Category */}
          <div className="space-y-0.5">
            <h3 
              key={activeEvent.id + '-title'}
              className="font-syne text-lg sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight transition-all duration-300"
            >
              {activeEvent.title}
            </h3>
            <p 
              key={activeEvent.id + '-cat'}
              className="text-[11px] sm:text-xs font-mono text-[#0077ff] tracking-wide"
            >
              {activeEvent.category}
            </p>
          </div>

          {/* Highlight Stat Box */}
          <div 
            key={activeEvent.id + '-stat'}
            className="p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl bg-white/[0.04] border border-white/10 relative overflow-hidden transition-all duration-300"
          >
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-500" 
              style={{ backgroundColor: activeEvent.color }} 
            />
            <p className="text-xs sm:text-sm md:text-base font-semibold text-white/90 leading-snug">
              <span style={{ color: activeEvent.color }}>
                {activeEvent.highlightText.split(' ').slice(0, 3).join(' ')}
              </span>{' '}
              {activeEvent.highlightText.split(' ').slice(3).join(' ')}
            </p>
          </div>

          {/* Description */}
          <p 
            key={activeEvent.id + '-desc'}
            className="text-[11px] sm:text-xs md:text-sm text-white/75 leading-relaxed font-light line-clamp-2 md:line-clamp-3"
          >
            {activeEvent.description}
          </p>

          {/* Time & Venue Chips */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 pt-0.5">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-xs text-white/80 bg-white/5 border border-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-xl">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0077ff] shrink-0" />
              <span className="truncate">{activeEvent.time}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] md:text-xs text-white/80 bg-white/5 border border-white/10 p-1.5 sm:p-2 md:p-2.5 rounded-xl">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0077ff] shrink-0" />
              <span className="truncate">{activeEvent.venue}</span>
            </div>
          </div>

          {/* Action CTA & Arrow Stepper */}
          <div className="pt-1 flex items-center justify-between gap-2.5 sm:gap-3">
            <a
              href="#register"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-white text-black font-syne text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:text-white transition-all duration-300 shadow-xl group shrink-0"
            >
              <span>Register For Event</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => spinToCard(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Event"
              >
                <ChevronLeft className="w-3.5 h-3.5 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => spinToCard(activeIndex + 1)}
                disabled={activeIndex === N - 1}
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next Event"
              >
                <ChevronRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: TRUE 3D CIRCULAR / ELLIPTICAL ROTATING WHEEL */}
        <div 
          className="lg:col-span-7 relative h-[220px] sm:h-[300px] md:h-[460px] w-full flex items-center justify-center my-1 sm:my-2 md:my-0"
          onWheel={handleCardWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Glow behind active front card */}
          <div 
            className="absolute w-[220px] sm:w-[300px] md:w-[380px] h-[220px] sm:h-[300px] md:h-[380px] rounded-full opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: activeEvent.color, filter: 'blur(90px)' }}
          />

          {/* 3D Viewport with Perspective */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-visible"
            style={{
              perspective: isMobile ? '650px' : '1200px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* 3D Wheel Container */}
            <div 
              className="relative w-[230px] sm:w-[300px] md:w-[380px] h-[175px] sm:h-[220px] md:h-[270px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {WHEEL_EVENTS.map((item, index) => {
                // Angular position of card 'index' on 3D wheel orbit
                const cardAngle = index * ANGLE_STEP + wheelRotation;
                // Normalize angle to [-180, 180]
                const diff = ((cardAngle % 360) + 540) % 360 - 180;
                const rad = (diff * Math.PI) / 180;
                
                // 3D Orbit Coordinates
                const x = Math.sin(rad) * RADIUS_X;
                const z = (Math.cos(rad) - 1) * RADIUS_Z;
                const rotateY = -diff * 0.38; // Subtle 3D card tilt facing inward
                
                const cosNorm = (Math.cos(rad) + 1) / 2; // 1.0 at front, 0.0 at back
                
                const scale = isMobile 
                  ? (0.78 + 0.22 * cosNorm) 
                  : (0.72 + 0.28 * cosNorm);
                
                // Both mobile and desktop show front card (1.0) and side orbiting cards (~0.65-0.75)
                const opacity = Math.max(0, cosNorm * 1.15 - 0.15);
                
                const zIndex = Math.round(cosNorm * 1000);
                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => spinToCard(index)}
                    className="absolute inset-0 cursor-pointer rounded-2xl md:rounded-3xl"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: opacity > 0.3 ? 'auto' : 'none',
                      transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Event Card Container */}
                    <div 
                      className={`relative w-full h-full rounded-xl sm:rounded-2xl md:rounded-3xl bg-gradient-to-br ${item.bgGradient} border p-3 sm:p-4 md:p-5 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 group ${
                        isActive 
                          ? 'border-white/60 ring-2 ring-[#0077ff]/80 shadow-[0_15px_40px_rgba(0,119,255,0.4)]' 
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      {/* Background Image with Dark Vignette */}
                      <div className="absolute inset-0 z-0 opacity-40">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-[#060608]/60 to-transparent" />
                      </div>

                      {/* Card Top Row */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                            {item.icon}
                          </span>
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-widest text-white/80">
                            {item.number}
                          </span>
                        </div>

                        <span 
                          className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase border bg-black/40 backdrop-blur-md"
                          style={{ color: item.color, borderColor: `${item.color}50` }}
                        >
                          {item.stageLabel}
                        </span>
                      </div>

                      {/* Card Center Title */}
                      <div className="relative z-10 space-y-0.5 my-auto py-1">
                        <h4 className="font-syne font-black text-sm sm:text-lg md:text-2xl text-white tracking-tight leading-snug drop-shadow-md">
                          {item.title}
                        </h4>
                        <p className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#0077ff]">
                          {item.category}
                        </p>
                      </div>

                      {/* Card Bottom Row: Prize & Action */}
                      <div className="relative z-10 flex items-center justify-between pt-1 border-t border-white/10 text-[9px] sm:text-[10px] md:text-xs font-mono">
                        <div className="text-white/80">
                          <span className="text-white/40 block text-[7px] sm:text-[8px] uppercase">PRIZE POOL</span>
                          <span className="font-bold text-[#00e5ff]">{item.prize}</span>
                        </div>

                        <div className="flex items-center gap-1 text-white/70 group-hover:text-white transition-colors">
                          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider font-bold">VIEW</span>
                          <ArrowUpRight className="w-3 h-3 text-[#0077ff]" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Section Bottom Subtle Indicator */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 w-full flex items-center justify-between text-[8px] sm:text-[9px] md:text-xs font-mono text-white/40 border-t border-white/10 pt-2 shrink-0">
        <span>03 / 06 SECTIONS</span>
        <div className="flex items-center gap-1">
          <span>SRISHTI 2.7</span>
          <span className="text-[#0077ff]">•</span>
          <span>ST. THOMAS COLLEGE</span>
        </div>
      </div>
    </section>
  );
};

export default CaseShowcase;
