import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { useFest } from '../context/FestContext';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineEvent {
  id: string;
  day: 'dec-4' | 'dec-5';
  dayLabel: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  location: string;
  locationId: string;
  speaker: {
    name: string;
    role: string;
  };
  highlights: string[];
  side: 'left' | 'right';
}

export interface MapLocation {
  id: string;
  name: string;
  type: string;
  capacity: string;
  floor: string;
  coordinates: { x: number; y: number };
  description: string;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'main-auditorium',
    name: 'Main Auditorium',
    type: 'Inaugurations & Keynotes',
    capacity: '800 Seats',
    floor: 'Ground Floor - Block A',
    coordinates: { x: 50, y: 28 },
    description: 'The main auditorium for inaugural ceremony, keynote talks, award functions, and major cultural performances.',
  },
  {
    id: 'cs-lab',
    name: 'CS Lab Complex',
    type: 'Coding Competitions & Workshops',
    capacity: '120 Stations',
    floor: 'Level 2 - CS Department',
    coordinates: { x: 22, y: 45 },
    description: 'Computer lab complex equipped with high-speed workstations for coding contests, hackathons, and hands-on workshops.',
  },
  {
    id: 'seminar-hall',
    name: 'Seminar Hall',
    type: 'Tech Talks & Panels',
    capacity: '300 Seats',
    floor: 'Level 1 - Block B',
    coordinates: { x: 78, y: 48 },
    description: 'Modern seminar hall for technical talks, industry expert sessions, and interactive panel discussions.',
  },
  {
    id: 'open-stage',
    name: 'Open Air Stage',
    type: 'Cultural Events & DJ Night',
    capacity: '1000+ Standing',
    floor: 'Campus Grounds',
    coordinates: { x: 50, y: 78 },
    description: 'Outdoor stage area for cultural performances, band shows, DJ night, and the grand closing ceremony.',
  },
  {
    id: 'innovation-lab',
    name: 'Innovation Hub',
    type: 'Hackathon Zone',
    capacity: '200 Hackers',
    floor: 'Level 2 - Block C',
    coordinates: { x: 26, y: 72 },
    description: 'Dedicated space for the 6-hour hackathon with team desks, power strips, refreshment station, and mentor helpdesks.',
  },
  {
    id: 'conference-room',
    name: 'Conference Room',
    type: 'Workshops & Demos',
    capacity: '80 Seats',
    floor: 'Level 3 - Block A',
    coordinates: { x: 74, y: 75 },
    description: 'Intimate conference room for exclusive workshops, product demos, and career guidance sessions.',
  },
];

export const TimelineRoadmap: React.FC = () => {
  const { events } = useFest();
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [selectedDay, setSelectedDay] = useState<'all' | 'dec-4' | 'dec-5'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeMapPinId, setActiveMapPinId] = useState<string>('main-auditorium');

  const containerRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodeDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Map dynamic events from FestContext into TimelineEvent structure
  const roadmapEvents: TimelineEvent[] = events.map((e, index) => {
    return {
      id: e.id,
      day: e.day || (index < 6 ? 'dec-4' : 'dec-5'),
      dayLabel: e.dayLabel || (e.day === 'dec-5' || index >= 6 ? 'DECEMBER 5, 2026' : 'DECEMBER 4, 2026'),
      time: e.time,
      title: e.title,
      subtitle: e.subtitle || e.stageLabel || e.category,
      description: e.description,
      category: e.category,
      location: e.venue,
      locationId:
        e.locationId ||
        (e.venue.toLowerCase().includes('auditorium')
          ? 'main-auditorium'
          : e.venue.toLowerCase().includes('lab')
          ? 'cs-lab'
          : e.venue.toLowerCase().includes('seminar')
          ? 'seminar-hall'
          : e.venue.toLowerCase().includes('stage')
          ? 'open-stage'
          : e.venue.toLowerCase().includes('hub') || e.venue.toLowerCase().includes('innovation')
          ? 'innovation-lab'
          : 'conference-room'),
      speaker: e.speaker || { name: 'Event Coordinator', role: 'Srishti 2.7 Committee' },
      highlights: e.highlights && e.highlights.length > 0 ? e.highlights : [e.highlightText || 'Key festival event with certificates and awards.'],
      side: e.side || (index % 2 === 0 ? 'left' : 'right'),
    };
  });

  const filteredEvents = selectedDay === 'all'
    ? roadmapEvents
    : roadmapEvents.filter((e) => e.day === selectedDay);

  const activeMapLocation = MAP_LOCATIONS.find((loc) => loc.id === activeMapPinId) || MAP_LOCATIONS[0];
  const activeLocationEvents = roadmapEvents.filter((ev) => ev.locationId === activeMapPinId);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.roadmap-header-content',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.roadmap-header-content',
            start: 'top 90%',
            end: 'top 60%',
            scrub: 0.5,
          },
        }
      );

      if (viewMode !== 'timeline' || !lineFillRef.current) return;

      // Vertical line fill
      gsap.fromTo(
        lineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 65%',
            end: 'bottom 85%',
            scrub: 0.5,
          },
        }
      );

      // Animate cards
      const isMobile = window.innerWidth < 768;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isLeft = card.dataset.side === 'left';
        const nodeDot = nodeDotsRef.current[index];
        const initialX = isMobile ? (isLeft ? -20 : 20) : (isLeft ? -40 : 40);

        gsap.fromTo(
          card,
          { x: initialX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 68%',
              scrub: 0.5,
            },
          }
        );

        if (nodeDot) {
          gsap.fromTo(
            nodeDot,
            { opacity: 0.3 },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 68%',
                scrub: 0.5,
              },
            }
          );
        }
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [viewMode, selectedDay, filteredEvents]);

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <section
      id="roadmap"
      ref={containerRef}
      className="relative w-full py-20 sm:py-24 md:py-28 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.08] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* =============================================
            SECTION HEADER
            ============================================= */}
        <div className="roadmap-header-content text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <span className="text-[10px] md:text-[11px] font-technical text-white/40 uppercase tracking-widest block font-semibold">
            02 // EVENT SCHEDULE & VENUE MAP
          </span>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight uppercase leading-tight mt-2 text-white">
            SCHEDULE & CAMPUS MAP
          </h2>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-white/50 font-body max-w-xl mx-auto font-light leading-relaxed">
            The full two-day schedule across all stages, labs, and the main auditorium.
          </p>

          {/* VIEW MODE TOGGLE — Clean, Minimal, Non-Pill */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center p-1 rounded bg-[#0D1015] border border-white/[0.08]">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-5 py-2 rounded text-xs font-body font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-white text-[#050608]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                <span>Timeline</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`px-5 py-2 rounded text-xs font-body font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white text-[#050608]'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                <span>Campus Map</span>
              </button>
            </div>
          </div>

          {/* DAY FILTER TABS */}
          {viewMode === 'timeline' && (
            <div className="mt-5 inline-flex items-center gap-4 border-b border-white/[0.06] pb-2">
              {[
                { id: 'all', label: 'All Days' },
                { id: 'dec-4', label: 'Dec 4 • Day 1' },
                { id: 'dec-5', label: 'Dec 5 • Day 2' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDay(tab.id as typeof selectedDay)}
                  className={`text-xs font-body font-semibold uppercase tracking-wider transition-colors cursor-pointer py-1 ${
                    selectedDay === tab.id
                      ? 'text-white border-b-2 border-[#2563EB]'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =============================================
            INTERACTIVE EVENT VENUE MAP
            ============================================= */}
        {viewMode === 'map' ? (
          <div className="mt-8 animate-fadeIn space-y-8">
            <div className="relative w-full h-[500px] sm:h-[560px] rounded-lg bg-[#0A0D14] border border-white/[0.08] p-6 overflow-hidden">
              
              {/* Subtle Grid Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />

              {/* Tag */}
              <div className="absolute top-5 left-5 z-20 text-[10px] font-technical text-white/40 uppercase tracking-wider">
                ST. THOMAS COLLEGE — CAMPUS BLUEPRINT
              </div>

              {/* MAP PINS */}
              {MAP_LOCATIONS.map((loc) => {
                const isActive = activeMapPinId === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setActiveMapPinId(loc.id)}
                    style={{
                      left: `${loc.coordinates.x}%`,
                      top: `${loc.coordinates.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-30 transition-all duration-200 focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`px-3 py-1.5 rounded border text-xs font-body font-semibold uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-lg'
                          : 'bg-[#10141D] border-white/[0.12] text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span>{loc.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Location Details */}
            <div className="p-6 sm:p-8 rounded-lg bg-[#0A0D14] border border-white/[0.08]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-technical text-cyan-400 uppercase font-semibold">
                    {activeMapLocation.floor}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase mt-0.5">
                    {activeMapLocation.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-xl font-light">
                    {activeMapLocation.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-technical">
                  <div className="text-right">
                    <span className="block text-[9px] text-white/30 uppercase">CAPACITY</span>
                    <span className="text-white/80 font-bold">{activeMapLocation.capacity}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-white/30 uppercase">TYPE</span>
                    <span className="text-cyan-400 font-bold">{activeMapLocation.type}</span>
                  </div>
                </div>
              </div>

              {/* Events in this location */}
              <div className="mt-5">
                <h4 className="font-technical text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">
                  SCHEDULED AT THIS VENUE ({activeLocationEvents.length})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeLocationEvents.map((ev) => (
                    <div key={ev.id} className="p-3.5 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-[9px] font-technical text-white/40">{ev.dayLabel} • {ev.time}</span>
                        <h5 className="font-body font-semibold text-xs sm:text-sm text-white/90 mt-0.5">{ev.title}</h5>
                      </div>
                      <span className="text-[9px] font-technical text-cyan-400 uppercase font-semibold shrink-0">
                        {ev.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =============================================
             TIMELINE VIEW — CLEAN EDITORIAL STREAM
             ============================================= */
          <div className="relative mt-16 sm:mt-20">

            {/* Central Vertical Line */}
            <div
              ref={lineTrackRef}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/[0.08] z-0"
            >
              <div
                ref={lineFillRef}
                className="w-full h-full bg-gradient-27 origin-top"
                style={{ transform: 'scaleY(0)' }}
              />
            </div>

            {/* Timeline Events List */}
            <div className="space-y-12 md:space-y-16 relative z-10">
              {filteredEvents.map((event, index) => {
                const isLeft = event.side === 'left';
                const isExpanded = expandedCardId === event.id;
                const isFirstOfDay = index === 0 || filteredEvents[index - 1].day !== event.day;

                return (
                  <React.Fragment key={event.id}>
                    {/* Date Break Header */}
                    {isFirstOfDay && (
                      <div className="flex justify-start md:justify-center my-6 pl-10 md:pl-0">
                        <span className="font-technical text-xs text-cyan-400 uppercase font-bold tracking-widest bg-[#050608] px-3 py-1 border border-cyan-500/20 rounded">
                          {event.dayLabel}
                        </span>
                      </div>
                    )}

                    {/* EVENT ITEM ROW */}
                    <div
                      className={`relative flex flex-col md:flex-row items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Node Marker */}
                      <div
                        ref={(el) => {
                          nodeDotsRef.current[index] = el;
                        }}
                        className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#050608] border-2 border-white/40 z-20 transition-colors duration-200"
                      />

                      {/* Spacer */}
                      <div className="w-full md:w-1/2" />

                      {/* EVENT CARD */}
                      <div
                        ref={(el) => {
                          cardsRef.current[index] = el;
                        }}
                        data-side={isLeft ? 'left' : 'right'}
                        className={`w-full md:w-1/2 pl-10 md:pl-0 ${
                          isLeft ? 'md:pr-10 lg:pr-14' : 'md:pl-10 lg:pl-14'
                        }`}
                      >
                        <div
                          onClick={() => toggleExpand(event.id)}
                          className={`group rounded-lg p-5 sm:p-6 bg-[#0A0D14] border transition-all duration-200 cursor-pointer ${
                            isExpanded
                              ? 'border-white/30 bg-[#0E121B]'
                              : 'border-white/[0.08] hover:border-white/[0.18]'
                          }`}
                        >
                          {/* Top Meta Line */}
                          <div className="flex items-center justify-between text-xs font-technical text-white/40 mb-2">
                            <span className="uppercase font-semibold text-cyan-400">{event.category}</span>
                            <span>{event.time}</span>
                          </div>

                          {/* Title & Subtitle */}
                          <div>
                            <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-tight">
                              {event.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/50 font-body mt-1">
                              {event.subtitle}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="mt-3 text-xs sm:text-sm text-white/40 font-body leading-relaxed line-clamp-2">
                            {event.description}
                          </p>

                          {/* Location & Coordinator Meta */}
                          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-body text-white/40">
                            <span className="text-white/70">{event.location}</span>
                            <span>{event.speaker?.name}</span>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                              <span className="text-[10px] font-technical text-white/30 tracking-widest uppercase block font-semibold">
                                KEY HIGHLIGHTS
                              </span>

                              <ul className="space-y-1.5">
                                {(event.highlights || []).map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-white/70 font-body flex items-start gap-2"
                                  >
                                    <span className="text-white/30">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-[11px] font-body text-white/40">
                                  {event.speaker.role}
                                </span>

                                <a
                                  href="#register"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-gradient-27-glow text-white font-body font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform"
                                >
                                  <span>Register</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Toggle Prompt */}
                          <div className="mt-2 flex items-center justify-center gap-1 text-[9px] font-technical text-white/25 group-hover:text-white/50 transition-colors pt-1">
                            <span>{isExpanded ? 'COLLAPSE' : 'EXPAND DETAILS'}</span>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-200 ${
                                isExpanded ? 'rotate-180 text-cyan-400' : ''
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineRoadmap;

