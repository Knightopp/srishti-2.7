import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFest } from '../context/FestContext';

interface CaseShowcaseProps {
  onNavigateToRegister?: () => void;
}

export const CaseShowcase: React.FC<CaseShowcaseProps> = ({ onNavigateToRegister }) => {
  const { events } = useFest();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);

  // Map of all events with formatted display numbering
  const allEvents = useMemo(() => {
    return events.map((e, idx) => ({
      ...e,
      formattedNumber: String(idx + 1).padStart(2, '0'),
    }));
  }, [events]);

  // Categories list
  const categories = useMemo(() => {
    return ['ALL', 'HACKATHON', 'CODING', 'SECURITY', 'DESIGN', 'WORKSHOP', 'CULTURAL'];
  }, []);

  // Filter events based on active category
  const filteredEvents = useMemo(() => {
    if (activeCategory === 'ALL') return allEvents;
    return allEvents.filter((e) => {
      const matchCat = e.category?.toUpperCase() || '';
      const matchTags = e.tags?.join(' ').toUpperCase() || '';
      const matchTitle = e.title?.toUpperCase() || '';
      const query = activeCategory.toUpperCase();
      return matchCat.includes(query) || matchTags.includes(query) || matchTitle.includes(query);
    });
  }, [allEvents, activeCategory]);

  // Set initial selected event if none or outside filtered
  useEffect(() => {
    if (filteredEvents.length > 0) {
      const exists = filteredEvents.some((e) => e.id === selectedEventId);
      if (!exists) {
        setSelectedEventId(filteredEvents[0].id);
      }
    }
  }, [filteredEvents, selectedEventId]);

  // Active event
  const currentEvent = useMemo(() => {
    return allEvents.find((e) => e.id === selectedEventId) || allEvents[0] || events[0];
  }, [allEvents, selectedEventId, events]);

  const currentIndex = useMemo(() => {
    return filteredEvents.findIndex((e) => e.id === currentEvent?.id);
  }, [filteredEvents, currentEvent]);

  // Navigation handlers
  const handlePrev = () => {
    if (filteredEvents.length === 0) return;
    const newIdx = (currentIndex - 1 + filteredEvents.length) % filteredEvents.length;
    setSelectedEventId(filteredEvents[newIdx].id);
  };

  const handleNext = () => {
    if (filteredEvents.length === 0) return;
    const newIdx = (currentIndex + 1) % filteredEvents.length;
    setSelectedEventId(filteredEvents[newIdx].id);
  };

  // Scroll thumbnail into view
  const scrollToThumbnail = (id: string) => {
    setSelectedEventId(id);
    const container = thumbnailScrollRef.current;
    if (!container) return;
    const activeThumb = container.querySelector(`[data-event-id="${id}"]`) as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  return (
    <section id="cases" className="relative w-full bg-[#050608] text-[#E8E8EC] py-20 sm:py-24 md:py-28 overflow-hidden select-none border-t border-white/[0.08]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 xl:px-12">
        
        {/* =============================================
            SECTION HEADER & CATEGORY FILTER BAR
            ============================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2">
            <span className="text-[10px] md:text-[11px] font-technical text-white/40 uppercase tracking-widest block font-semibold">
              01 // FEATURED EVENTS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              EVENT SHOWCASE
            </h2>
            <p className="text-xs sm:text-sm font-body text-white/50 max-w-xl font-light">
              Competitions, hackathons, cybersecurity operations, workshops, and cultural performances.
            </p>
          </div>

          {/* Controls: Prev / Next pagination */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="font-technical text-xs text-white/40 tracking-wider">
              {currentIndex >= 0 ? String(currentIndex + 1).padStart(2, '0') : '01'} / {String(filteredEvents.length).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous Event"
                className="p-2 rounded bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Event"
                className="p-2 rounded bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs — Clean, Minimal, Non-Pill */}
        <div className="flex items-center gap-6 overflow-x-auto py-4 border-b border-white/[0.04] scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-body font-semibold uppercase tracking-wider whitespace-nowrap transition-colors duration-200 cursor-pointer py-1 relative ${
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2563EB]" />
                )}
              </button>
            );
          })}
        </div>

        {/* =============================================
            MAIN HERO EVENT CARD (CLEAN EDITORIAL SPLIT)
            ============================================= */}
        {currentEvent && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* LEFT COLUMN: Event Details & Typography */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              
              {/* Meta Topline */}
              <div className="flex items-center gap-3 text-xs font-technical text-white/40">
                <span className="font-bold text-cyan-400">EVENT #{currentEvent.formattedNumber}</span>
                <span>•</span>
                <span className="uppercase">{currentEvent.stageLabel || 'KEYNOTE'}</span>
                {currentEvent.fee !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-white/60">{currentEvent.fee === 0 ? 'FREE' : `₹${currentEvent.fee}`}</span>
                  </>
                )}
              </div>

              {/* Title & Category */}
              <div className="space-y-1">
                <h3 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-[1.1]">
                  {currentEvent.title}
                </h3>
                <p className="text-xs sm:text-sm font-body text-white/40 font-medium">
                  {currentEvent.category}
                </p>
              </div>

              {/* Highlight Quote */}
              {currentEvent.highlightText && (
                <div className="pl-3.5 border-l-2 border-cyan-400 py-1">
                  <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed">
                    {currentEvent.highlightText}
                  </p>
                </div>
              )}

              {/* Full Description */}
              <p className="text-xs sm:text-sm text-white/50 font-body leading-relaxed line-clamp-3">
                {currentEvent.description}
              </p>

              {/* Meta Grid — Clean Typography */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3 border-t border-white/[0.06] text-xs font-body">
                <div>
                  <span className="block text-[9px] font-technical text-white/30 uppercase tracking-wider">SCHEDULE</span>
                  <span className="text-white/80 font-medium">{currentEvent.time}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-technical text-white/30 uppercase tracking-wider">VENUE</span>
                  <span className="text-white/80 font-medium">{currentEvent.venue}</span>
                </div>
                {currentEvent.prize && (
                  <div>
                    <span className="block text-[9px] font-technical text-white/30 uppercase tracking-wider">PRIZE</span>
                    <span className="text-gradient-27 font-bold">{currentEvent.prize}</span>
                  </div>
                )}
              </div>

              {/* CTA Action */}
              <div className="pt-4">
                <button
                  onClick={onNavigateToRegister}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gradient-27-glow text-white font-body font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform cursor-pointer"
                >
                  <span>Register For Event</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Crisp Editorial Image */}
            <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[4/3] rounded-lg overflow-hidden border border-white/[0.1] bg-[#0D1015]">
              <img
                src={currentEvent.image}
                alt={currentEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608]/80 via-transparent to-transparent" />

              {/* Overlay Label */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-technical text-white/70">
                <span>{currentEvent.dayLabel || 'DECEMBER 2026'}</span>
                <span className="text-cyan-400 font-bold uppercase">{currentEvent.stageLabel}</span>
              </div>
            </div>

          </div>
        )}

        {/* =============================================
            ALL EVENTS THUMBNAIL EXPLORER
            ============================================= */}
        <div className="mt-12 pt-6 border-t border-white/[0.06]">
          <div className="flex items-center justify-between mb-4 text-[10px] font-technical text-white/40 uppercase tracking-widest">
            <span>EXPLORE ALL {filteredEvents.length} EVENTS</span>
            <span className="hidden sm:inline">← Click or scroll to switch →</span>
          </div>

          <div
            ref={thumbnailScrollRef}
            className="flex items-stretch gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none no-scrollbar"
          >
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === currentEvent?.id;
              return (
                <div
                  key={evt.id}
                  data-event-id={evt.id}
                  onClick={() => scrollToThumbnail(evt.id)}
                  className={`shrink-0 w-60 sm:w-64 p-3.5 rounded border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/40'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/[0.04] text-[10px] font-technical">
                    <span className="font-bold text-cyan-400">#{evt.formattedNumber}</span>
                    <span className="text-white/40 uppercase truncate max-w-[120px]">{evt.stageLabel}</span>
                  </div>

                  <div>
                    <h5 className="font-display font-bold text-xs sm:text-sm text-white/90 line-clamp-1">
                      {evt.title}
                    </h5>
                    <p className="text-[10px] font-body text-white/40 line-clamp-1 mt-0.5">
                      {evt.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/[0.04] text-[9px] font-technical text-white/40">
                    <span>{evt.time.split('•')[0] || 'DEC 4'}</span>
                    <span className="text-white/70 font-semibold">{evt.prize || 'CERTIFICATES'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default CaseShowcase;


