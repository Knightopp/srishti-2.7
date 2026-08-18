import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Clock,
  MapPin,
  User,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Code,
  Award,
  Zap,
  Music,
  Compass,
  Layers,
  Sparkles,
} from 'lucide-react';
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
  categoryColor: string;
  location: string;
  locationId: string;
  speaker: {
    name: string;
    role: string;
  };
  highlights: string[];
  side: 'left' | 'right';
  icon: React.ReactNode;
}

const getCategoryBadge = (category: string) => {
  const catLower = (category || '').toLowerCase();
  if (catLower.includes('hackathon') || catLower.includes('prototype')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Code className="w-4 h-4 text-white/35" />,
    };
  }
  if (catLower.includes('competition') || catLower.includes('ctf') || catLower.includes('quiz') || catLower.includes('battle')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Sparkles className="w-4 h-4 text-white/35" />,
    };
  }
  if (catLower.includes('workshop') || catLower.includes('masterclass') || catLower.includes('learning')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Layers className="w-4 h-4 text-white/35" />,
    };
  }
  if (catLower.includes('talk') || catLower.includes('keynote')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Zap className="w-4 h-4 text-white/35" />,
    };
  }
  if (catLower.includes('cultural') || catLower.includes('music') || catLower.includes('dj')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Music className="w-4 h-4 text-white/35" />,
    };
  }
  if (catLower.includes('award') || catLower.includes('valedictory') || catLower.includes('closing')) {
    return {
      categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
      icon: <Award className="w-4 h-4 text-white/35" />,
    };
  }
  return {
    categoryColor: 'border-white/[0.08] text-white/50 bg-white/[0.03]',
    icon: <Sparkles className="w-4 h-4 text-white/35" />,
  };
};

export interface MapLocation {
  id: string;
  name: string;
  type: string;
  capacity: string;
  floor: string;
  coordinates: { x: number; y: number };
  color: string;
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
    color: '#2563EB',
    description: 'The main auditorium for inaugural ceremony, keynote talks, award functions, and major cultural performances.',
  },
  {
    id: 'cs-lab',
    name: 'CS Lab Complex',
    type: 'Coding Competitions & Workshops',
    capacity: '120 Stations',
    floor: 'Level 2 - CS Department',
    coordinates: { x: 22, y: 45 },
    color: '#2563EB',
    description: 'Computer lab complex equipped with high-speed workstations for coding contests, hackathons, and hands-on workshops.',
  },
  {
    id: 'seminar-hall',
    name: 'Seminar Hall',
    type: 'Tech Talks & Panels',
    capacity: '300 Seats',
    floor: 'Level 1 - Block B',
    coordinates: { x: 78, y: 48 },
    color: '#2563EB',
    description: 'Modern seminar hall for technical talks, industry expert sessions, and interactive panel discussions.',
  },
  {
    id: 'open-stage',
    name: 'Open Air Stage',
    type: 'Cultural Events & DJ Night',
    capacity: '1000+ Standing',
    floor: 'Campus Grounds',
    coordinates: { x: 50, y: 78 },
    color: '#2563EB',
    description: 'Outdoor stage area for cultural performances, band shows, DJ night, and the grand closing ceremony.',
  },
  {
    id: 'innovation-lab',
    name: 'Innovation Hub',
    type: 'Hackathon Zone',
    capacity: '200 Hackers',
    floor: 'Level 2 - Block C',
    coordinates: { x: 26, y: 72 },
    color: '#2563EB',
    description: 'Dedicated space for the 6-hour hackathon with team desks, power strips, refreshment station, and mentor helpdesks.',
  },
  {
    id: 'conference-room',
    name: 'Conference Room',
    type: 'Workshops & Demos',
    capacity: '80 Seats',
    floor: 'Level 3 - Block A',
    coordinates: { x: 74, y: 75 },
    color: '#2563EB',
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
  const laserTipRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodeDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Map dynamic events from FestContext into TimelineEvent structure
  const roadmapEvents: TimelineEvent[] = events.map((e, index) => {
    const badgeInfo = getCategoryBadge(e.category);
    return {
      id: e.id,
      day: e.day || (index < 6 ? 'dec-4' : 'dec-5'),
      dayLabel: e.dayLabel || (e.day === 'dec-5' || index >= 6 ? 'DECEMBER 5, 2026' : 'DECEMBER 4, 2026'),
      time: e.time,
      title: e.title,
      subtitle: e.subtitle || e.stageLabel || e.category,
      description: e.description,
      category: e.category,
      categoryColor: badgeInfo.categoryColor,
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
      speaker: e.speaker || { name: 'Event Coordinators', role: 'Srishti 2.7 Team' },
      highlights: e.highlights && e.highlights.length > 0 ? e.highlights : [e.highlightText || 'Exciting competition with awards and certificates.'],
      side: e.side || (index % 2 === 0 ? 'left' : 'right'),
      icon: badgeInfo.icon,
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
        { y: 40, opacity: 0 },
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

      // Vertical Line growth
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
            onUpdate: (self) => {
              if (laserTipRef.current) {
                laserTipRef.current.style.top = `${self.progress * 100}%`;
              }
            },
          },
        }
      );

      // Animate cards
      const isMobile = window.innerWidth < 768;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isLeft = card.dataset.side === 'left';
        const nodeDot = nodeDotsRef.current[index];

        const initialX = isMobile ? (isLeft ? -35 : 35) : (isLeft ? -80 : 80);

        gsap.fromTo(
          card,
          { x: initialX, opacity: 0, scale: 0.95 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 65%',
              scrub: 0.5,
            },
          }
        );

        if (nodeDot) {
          gsap.fromTo(
            nodeDot,
            {
              scale: 0.6,
              backgroundColor: '#13161C',
              borderColor: 'rgba(255,255,255,0.1)',
            },
            {
              scale: 1.2,
              backgroundColor: '#2563EB',
              borderColor: '#2563EB',
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 65%',
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
      className="relative w-full py-24 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.06] overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="roadmap-header-content text-center max-w-3xl mx-auto mb-12">
          <span className="text-[10px] font-body font-medium text-white/25 tracking-wider uppercase">
            02 / Event Schedule & Venue Map
          </span>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white/90 uppercase leading-[1.05] mt-2">
            Event Schedule{' '}
            <span className="font-serif-custom italic font-normal text-[#2563EB] lowercase text-3xl sm:text-5xl md:text-7xl block sm:inline">
              & venue map
            </span>
          </h2>

          <p className="mt-4 text-sm md:text-base text-white/35 font-light max-w-xl mx-auto">
            Explore the campus venue map, event stages, and the full 2-day schedule for December 4 – 5.
          </p>

          {/* VIEW MODE TOGGLE */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center p-1 rounded-lg bg-[#0D1015] border border-white/[0.06]">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-[11px] font-body font-medium uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'timeline'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-[11px] font-body font-medium uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-white/35 hover:text-white/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Venue Map</span>
              </button>
            </div>
          </div>

          {/* DAY FILTER TABS */}
          {viewMode === 'timeline' && (
            <div className="mt-5 inline-flex items-center gap-1.5 p-1 rounded-lg bg-[#0D1015] border border-white/[0.06]">
              {[
                { id: 'all', label: 'All Days' },
                { id: 'dec-4', label: 'Dec 4' },
                { id: 'dec-5', label: 'Dec 5' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDay(tab.id as typeof selectedDay)}
                  className={`px-4 py-1.5 rounded-md text-[11px] font-body font-medium uppercase tracking-wider transition-all duration-300 ${
                    selectedDay === tab.id
                      ? 'bg-white/[0.08] text-white/80'
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INTERACTIVE EVENT VENUE MAP */}
        {viewMode === 'map' ? (
          <div className="mt-8 animate-fadeIn space-y-8">
            <div className="relative w-full h-[520px] sm:h-[580px] rounded-xl bg-[#0D1015] border border-white/[0.06] p-6 overflow-hidden">
              
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }} />
              
              {/* Zone Outline */}
              <div className="absolute top-[15%] left-[10%] w-[80%] h-[70%] border border-dashed border-white/[0.06] rounded-xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-body tracking-wider text-white/[0.06] uppercase">
                  ST. THOMAS COLLEGE — CAMPUS LAYOUT
                </span>
              </div>

              {/* Map Tag */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2 text-[10px] font-body text-white/25">
                <Layers className="w-3.5 h-3.5 text-white/20" />
                <span className="tracking-wider uppercase">Interactive Venue Map</span>
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
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-30 transition-all duration-300 focus:outline-none"
                  >
                    <div
                      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border transition-all duration-300 ${
                        isActive
                          ? 'bg-[#2563EB] border-[#2563EB] text-white'
                          : 'bg-[#13161C] border-white/[0.08] text-white/60 hover:border-white/15 hover:text-white/80'
                      }`}
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="text-[10px] font-display font-semibold tracking-tight whitespace-nowrap">
                        {loc.name}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Map Legend Footer */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg bg-[#050608]/80 border border-white/[0.06] text-[10px] font-body">
                <span className="text-white/20 tracking-wider uppercase">Click pins to view schedule</span>
                <span className="font-technical text-white/15">SRISHTI 2.7</span>
              </div>
            </div>

            {/* SELECTED LOCATION PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Location Info */}
              <div className="lg:col-span-5 p-7 rounded-xl bg-[#0D1015] border border-white/[0.06] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-body font-medium text-white/30 tracking-wider uppercase">
                    {activeMapLocation.type}
                  </span>
                  <span className="text-[10px] font-body text-white/20">
                    {activeMapLocation.floor}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold text-white/85 uppercase tracking-tight">
                    {activeMapLocation.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/40 font-light leading-relaxed">
                    {activeMapLocation.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-body text-white/30">
                  <span className="tracking-wider uppercase">Capacity</span>
                  <span className="text-white/50 font-medium">
                    {activeMapLocation.capacity}
                  </span>
                </div>
              </div>

              {/* Scheduled Events */}
              <div className="lg:col-span-7 p-7 rounded-xl bg-[#0D1015] border border-white/[0.06] space-y-5">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <span className="text-[10px] font-body font-medium text-white/30 tracking-wider uppercase">
                    Events at {activeMapLocation.name}
                  </span>
                  <span className="text-[10px] font-technical text-white/20">
                    {activeLocationEvents.length} events
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {activeLocationEvents.length > 0 ? (
                    activeLocationEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-body text-white/25">
                            <Clock className="w-3 h-3" />
                            <span>{ev.dayLabel} · {ev.time}</span>
                          </div>
                          <h4 className="font-display font-bold text-sm text-white/80">
                            {ev.title}
                          </h4>
                          <p className="text-[11px] text-white/30 font-light">
                            {ev.speaker?.name || 'Coordinator'}
                          </p>
                        </div>

                        <a
                          href="#cta"
                          className="shrink-0 px-4 py-2 rounded-md bg-[#2563EB] text-white font-body text-[10px] font-medium uppercase tracking-wider hover:bg-[#1D4ED8] transition-colors flex items-center gap-1"
                        >
                          <span>Register</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-white/25 italic py-4">
                      No additional public events scheduled at this venue.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TIMELINE VIEW */
          <div className="relative mt-16">
            {/* Central Vertical Line */}
            <div
              ref={lineTrackRef}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-white/[0.06] z-0"
            >
              {/* Growing Line */}
              <div
                ref={lineFillRef}
                className="w-full h-full bg-[#2563EB] origin-top"
                style={{ transform: 'scaleY(0)' }}
              />

              {/* Simple Tip Dot */}
              <div
                ref={laserTipRef}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white transition-all duration-75 pointer-events-none"
                style={{ top: '0%' }}
              />
            </div>

            {/* Timeline Events List */}
            <div className="space-y-16 md:space-y-24 relative z-10">
              {filteredEvents.map((event, index) => {
                const isLeft = event.side === 'left';
                const isExpanded = expandedCardId === event.id;

                const isFirstOfDay =
                  index === 0 || filteredEvents[index - 1].day !== event.day;

                return (
                  <React.Fragment key={event.id}>
                    {/* Date Header */}
                    {isFirstOfDay && (
                      <div className="flex justify-start md:justify-center my-8 pl-12 md:pl-0">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#0D1015] border border-white/[0.06]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                          <span className="font-display font-bold text-xs md:text-sm tracking-wider text-white/60 uppercase">
                            {event.dayLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* EVENT ITEM */}
                    <div
                      className={`relative flex flex-col md:flex-row items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Node Dot */}
                      <div
                        ref={(el) => {
                          nodeDotsRef.current[index] = el;
                        }}
                        className="absolute left-6 md:left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#13161C] border-2 border-white/[0.08] z-20 flex items-center justify-center transition-all duration-300"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                      </div>

                      {/* Spacer */}
                      <div className="w-full md:w-1/2" />

                      {/* EVENT CARD */}
                      <div
                        ref={(el) => {
                          cardsRef.current[index] = el;
                        }}
                        data-side={isLeft ? 'left' : 'right'}
                        className={`w-full md:w-1/2 pl-14 md:pl-0 ${
                          isLeft ? 'md:pr-12' : 'md:pl-12'
                        }`}
                      >
                        <div
                          onClick={() => toggleExpand(event.id)}
                          className={`group relative rounded-xl p-6 sm:p-7 bg-[#0D1015] border transition-all duration-400 cursor-pointer overflow-hidden ${
                            isExpanded
                              ? 'border-white/[0.12] bg-[#10131A]'
                              : 'border-white/[0.06] hover:border-white/[0.1] hover:bg-[#10131A]'
                          }`}
                        >
                          {/* Card Header */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <div
                              className={`px-2.5 py-1 rounded-md border text-[10px] font-body font-medium tracking-wider uppercase flex items-center gap-1.5 ${event.categoryColor}`}
                            >
                              {event.icon}
                              <span>{event.category}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-[11px] font-body text-white/30">
                              <Clock className="w-3 h-3 text-white/20" />
                              <span>{event.time}</span>
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <div>
                            <h3 className="font-display text-lg sm:text-xl font-bold text-white/80 group-hover:text-white/95 transition-colors leading-tight">
                              {event.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/30 font-light mt-1">
                              {event.subtitle}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="mt-3 text-xs sm:text-sm text-white/40 font-light leading-relaxed">
                            {event.description}
                          </p>

                          {/* Location & Speaker */}
                          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[11px] font-body text-white/30">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-white/20" />
                              <span>{event.location}</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <User className="w-3 h-3 text-white/20" />
                              <span className="text-white/40 font-medium">
                                {event.speaker?.name || 'Coordinator'}
                              </span>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-5 pt-5 border-t border-white/[0.06] space-y-4 animate-fadeIn">
                              <span className="text-[10px] font-body text-white/25 tracking-wider uppercase block font-medium">
                                Event Highlights
                              </span>

                              <ul className="space-y-2">
                                {(event.highlights || []).map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-white/50 font-light"
                                  >
                                    <span className="w-1 h-1 rounded-full bg-white/20" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-[11px] font-body text-white/20">
                                  {event.speaker.role}
                                </span>

                                <a
                                  href="#cta"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#2563EB] text-white font-body text-[11px] font-medium uppercase tracking-wider hover:bg-[#1D4ED8] transition-colors"
                                >
                                  <span>Register Now</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Toggle Prompt */}
                          <div className="mt-3 flex items-center justify-center gap-1 text-[9px] font-body text-white/15 group-hover:text-white/30 transition-colors pt-1">
                            <span>
                              {isExpanded ? 'Click to collapse' : 'Click to expand'}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180' : ''
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
