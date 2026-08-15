import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowUpRight, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Code, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Calendar, 
  MapPin 
} from 'lucide-react';

import { useFest } from '../context/FestContext';

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

  // Map dynamic events from FestContext
  const WHEEL_EVENTS: WheelEventItem[] = events.map((e, i) => ({
    ...e,
    number: (i + 1).toString().padStart(2, '0'),
    icon: <Sparkles className="w-5 h-5" style={{ color: e.color || '#0077ff' }} />,
  }));

  // 3D Circular Ring Math: 360 / N degrees per spoke
  const N = WHEEL_EVENTS.length;
  const ANGLE_STEP = 360 / N; 

  // Perfectly proportioned 3D Wheel radii (cards stay 100% inside screen bounds!)
  const RADIUS_X = isMobile ? 110 : 220; // Keeps side cards safely inside viewport width!
  const RADIUS_Y = isMobile ? 40 : 60;
  const RADIUS_Z = isMobile ? 160 : 260;

  const rotationProxy = useRef({ angle: 0 });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const lastWheelTime = useRef<number>(0);

  // Smooth rotation function to bring target card to front focus cleanly without React re-render thrashing
  const spinToCard = useCallback((targetIndex: number) => {
    const validIndex = Math.max(0, Math.min(N - 1, targetIndex));
    const targetAngle = -validIndex * ANGLE_STEP;

    setActiveIndex(validIndex);
    setWheelRotation(targetAngle);
  }, [ANGLE_STEP, N]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation when section enters viewport
      gsap.fromTo(
        '.wheel-header',
        { y: -20, opacity: 0 },
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardWheel = (e: React.WheelEvent) => {
    // Debounce wheel events so fast trackpad scroll inertia doesn't cause rapid jitter
    const now = Date.now();
    if (now - lastWheelTime.current < 350) return;

    if (Math.abs(e.deltaY) > 12) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        spinToCard(activeIndex + 1);
      } else {
        spinToCard(activeIndex - 1);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY.current - touchEndY;

    if (Math.abs(diffY) > 30) {
      if (diffY > 0) {
        spinToCard(activeIndex + 1);
      } else {
        spinToCard(activeIndex - 1);
      }
    }
    touchStartY.current = null;
  };

  const activeEvent = WHEEL_EVENTS[activeIndex];

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="relative w-full h-[100dvh] bg-[#060608] text-[#f5f5f7] flex flex-col justify-between py-5 md:py-8 overflow-hidden select-none"
    >
      {/* Top Section Header */}
      <div className="wheel-header max-w-7xl mx-auto px-5 md:px-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-3 z-30 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0077ff] animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono text-[#0077ff] tracking-widest uppercase font-semibold">
              03 / 3D ROTATING WHEEL CAROUSEL
            </span>
          </div>
          <h2 className="font-syne text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Featured <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase">Events</span>
          </h2>
        </div>

        {/* Desktop Meta Counter */}
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-2">
            <span className="w-6 md:w-8 h-[1px] bg-white/20" />
            <span className="text-[10px] md:text-xs">
              SCROLL / CLICK CARDS TO SPIN & REGISTER
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
              className={`px-3 py-1.5 rounded-full text-[10px] font-mono whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
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
      <div className="max-w-7xl mx-auto px-5 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto z-20 flex-1 min-h-0">
        
        {/* LEFT COLUMN: Active Event Information Panel (Synchronized with 3D Wheel Front Card) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-3.5 md:space-y-6 z-30">
          
          {/* Stage & Category Pills */}
          <div className="flex flex-wrap items-center gap-3">
            <span 
              key={activeEvent.id + '-stage'}
              className="px-3 py-1 text-[10px] md:text-[11px] font-mono font-semibold tracking-wider uppercase rounded-full border transition-all duration-500 animate-fadeIn"
              style={{ 
                borderColor: `${activeEvent.color}60`,
                color: activeEvent.color,
                backgroundColor: `${activeEvent.color}15`
              }}
            >
              {activeEvent.stageLabel}
            </span>
            <span className="text-[10px] md:text-xs font-mono text-white/40">
              STAGE {activeEvent.number}
            </span>
          </div>

          {/* Title & Category with fade transition */}
          <div className="space-y-1">
            <h3 
              key={activeEvent.id + '-title'}
              className="font-syne text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight transition-all duration-300 animate-fadeIn"
            >
              {activeEvent.title}
            </h3>
            <p 
              key={activeEvent.id + '-cat'}
              className="text-xs font-mono text-[#0077ff] tracking-wide animate-fadeIn"
            >
              {activeEvent.category}
            </p>
          </div>

          {/* Outcrowd Style Highlight Stat Box */}
          <div 
            key={activeEvent.id + '-stat'}
            className="p-3.5 md:p-5 rounded-2xl bg-white/[0.04] border border-white/10 relative overflow-hidden transition-all duration-300 animate-fadeIn"
          >
            <div 
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-colors duration-500" 
              style={{ backgroundColor: activeEvent.color }} 
            />
            <p className="text-xs md:text-base font-semibold text-white/90 leading-snug">
              <span style={{ color: activeEvent.color }}>
                {activeEvent.highlightText.split(' ').slice(0, 3).join(' ')}
              </span>{' '}
              {activeEvent.highlightText.split(' ').slice(3).join(' ')}
            </p>
          </div>

          {/* Event Description */}
          <p 
            key={activeEvent.id + '-desc'}
            className="text-xs md:text-sm text-white/75 leading-relaxed font-light line-clamp-3 md:line-clamp-none animate-fadeIn"
          >
            {activeEvent.description}
          </p>

          {/* Time & Venue Chips */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 pt-0.5">
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/80 bg-white/5 border border-white/10 p-2 md:p-2.5 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-[#0077ff] shrink-0" />
              <span className="truncate">{activeEvent.time}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/80 bg-white/5 border border-white/10 p-2 md:p-2.5 rounded-xl">
              <MapPin className="w-3.5 h-3.5 text-[#0077ff] shrink-0" />
              <span className="truncate">{activeEvent.venue}</span>
            </div>
          </div>

          {/* Action CTA & Arrow Stepper */}
          <div className="pt-1 flex items-center justify-between gap-3">
            <a
              href="#register"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-3 md:px-7 md:py-3.5 rounded-full bg-white text-black font-syne text-[11px] md:text-xs font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:text-white transition-all duration-300 shadow-xl group"
            >
              <span>Register For Event</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={() => spinToCard(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Previous Event"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => spinToCard(activeIndex + 1)}
                disabled={activeIndex === N - 1}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Next Event"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: 3D Elliptical Rotating Wheel (100% Clickable, Hover-Wheel Controlled) */}
        <div 
          className="lg:col-span-7 relative h-[360px] sm:h-[440px] md:h-[500px] w-full flex items-center justify-center"
          onWheel={handleCardWheel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ambient Glow behind active front card */}
          <div 
            className="absolute w-[280px] md:w-[380px] h-[280px] md:h-[380px] rounded-full opacity-20 pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: activeEvent.color, filter: 'blur(100px)' }}
          />

          {/* 3D Viewport with Perspective */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-visible"
            style={{
              perspective: isMobile ? '800px' : '1200px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* 3D Wheel Container */}
            <div 
              className="relative w-[85vw] sm:w-[380px] md:w-[420px] h-[240px] sm:h-[270px] md:h-[300px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {WHEEL_EVENTS.map((item, index) => {
                // Angular position of card 'index' on 3D wheel orbit
                const cardAngle = index * ANGLE_STEP + wheelRotation;
                const rad = (cardAngle * Math.PI) / 180;
                
                // 3D Orbit Coordinates
                const x = Math.sin(rad) * RADIUS_X;
                const y = -Math.sin(rad) * (RADIUS_Y * 0.45);
                const z = (Math.cos(rad) - 1) * RADIUS_Z;
                
                const rotateY = isMobile ? 0 : (rad * 180 / Math.PI) * -0.25; // 0deg on mobile eliminates 3D plane slicing!
                const cosNorm = (Math.cos(rad) + 1) / 2; // 1.0 at front, 0.0 at back
                
                const scale = isMobile ? (index === activeIndex ? 1.0 : 0.85) : (0.75 + 0.28 * cosNorm);
                
                // On mobile, only the active card is 1.0 opacity, back cards fade out to 0 so they NEVER pierce!
                const opacity = isMobile 
                  ? (index === activeIndex ? 1.0 : 0.0) 
                  : (0.45 + 0.55 * Math.pow(cosNorm, 1.2));
                
                const zIndex = index === activeIndex ? 2000 : Math.round(1000 + Math.cos(rad) * 500);

                const isActive = index === activeIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => spinToCard(index)}
                    className="absolute inset-0 cursor-pointer rounded-3xl"
                    style={{
                      transformStyle: isMobile ? 'flat' : 'preserve-3d',
                      transform: isMobile 
                        ? `scale(${scale})` 
                        : `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : (isMobile ? 'none' : 'auto'),
                      transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
                      willChange: 'transform, opacity',
                    }}
                  >
                    {/* Event Card Container */}
                    <div 
                      className={`relative w-full h-full rounded-2xl md:rounded-3xl bg-gradient-to-br ${item.bgGradient} border p-4 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 group ${
                        isActive 
                          ? 'border-white/50 ring-2 ring-[#0077ff]/80 shadow-[0_20px_50px_rgba(0,119,255,0.4)] scale-[1.02]' 
                          : 'border-white/15 hover:border-white/30'
                      }`}
                    >
                      {/* Background Image with Dark Vignette */}
                      <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-500">
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
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                            {item.icon}
                          </span>
                          <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-white/80">
                            {item.number}
                          </span>
                        </div>

                        <a
                          href="#cta"
                          onClick={(e) => {
                            e.stopPropagation();
                            spinToCard(index);
                          }}
                          className="px-2.5 py-1 text-[9px] md:text-[10px] font-mono uppercase tracking-wider rounded-full bg-[#0077ff] text-white font-bold hover:bg-white hover:text-black transition-colors flex items-center gap-1 shadow-lg"
                        >
                          <span>REGISTER</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Card Content Row */}
                      <div className="relative z-10 space-y-1 md:space-y-1.5">
                        <span 
                          className="text-[9px] md:text-[10px] font-mono font-semibold tracking-wider uppercase block"
                          style={{ color: item.color }}
                        >
                          {item.category}
                        </span>

                        <h4 className="font-syne text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-tight group-hover:text-[#0077ff] transition-colors">
                          {item.title}
                        </h4>

                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {item.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[8px] font-mono uppercase rounded-md bg-white/10 text-white/70"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Active Glowing Border Effect */}
                      {isActive && (
                        <div 
                          className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 pointer-events-none transition-opacity duration-300"
                          style={{ borderColor: `${item.color}90` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Rotator Controls Bar */}
      <div className="md:hidden max-w-7xl mx-auto px-5 w-full flex items-center justify-between z-30 pt-2 shrink-0">
        <button
          onClick={() => spinToCard(activeIndex - 1)}
          disabled={activeIndex === 0}
          className="flex-1 py-2.5 mr-2 rounded-xl bg-white/10 border border-white/20 text-white font-syne text-[11px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREV</span>
        </button>

        <div className="flex items-center gap-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl">
          {WHEEL_EVENTS.map((_, i) => (
            <span
              key={i}
              onClick={() => spinToCard(i)}
              className={`h-2 rounded-full cursor-pointer transition-all ${
                i === activeIndex ? 'bg-[#0077ff] w-4' : 'bg-white/30 w-2'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => spinToCard(activeIndex + 1)}
          disabled={activeIndex === N - 1}
          className="flex-1 py-2.5 ml-2 rounded-xl bg-[#0077ff] text-white font-syne text-[11px] font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#0077ff]/30"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Meta Row */}
      <div className="max-w-7xl mx-auto px-5 md:px-12 w-full flex items-center justify-between z-30 text-[10px] md:text-xs font-mono text-white/40 border-t border-white/5 pt-3 shrink-0">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0077ff]" />
          SRISHTI 2.7 • 3D ROTATING WHEEL CAROUSEL
        </span>
        <span className="hidden sm:inline">
          CLICK ANY CARD OR USE ARROWS TO SPIN & REGISTER
        </span>
      </div>
    </section>
  );
};

export default CaseShowcase;
