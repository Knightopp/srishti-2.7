import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDown, ArrowUpRight, MapPin, ExternalLink, Navigation, Calendar, Clock, Sparkles } from 'lucide-react';
import { useFest } from '../context/FestContext';

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
  fee?: number;
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
    name: 'Main Auditorium (Medlycott Hall)',
    type: 'Inaugurations & Keynotes',
    capacity: '800+ Seats',
    floor: 'Ground Floor — Main Block',
    coordinates: { x: 50, y: 28 },
    description: 'The premier college auditorium hosting the inaugural ceremony, keynote addresses, theme reveal, and grand valedictory function.',
  },
  {
    id: 'cs-lab',
    name: 'CS Lab Complex',
    type: 'Coding Contests & AI Labs',
    capacity: '120 High-Speed Stations',
    floor: 'Level 2 — CS Department Block',
    coordinates: { x: 22, y: 45 },
    description: 'Advanced computing facility equipped with gigabit LAN, dual monitors, and Linux environments for competitive coding and AI testing.',
  },
  {
    id: 'seminar-hall',
    name: 'Menachery Seminar Hall',
    type: 'Tech Talks & Paper Presentations',
    capacity: '300 Seats',
    floor: 'Level 1 — Block B',
    coordinates: { x: 78, y: 48 },
    description: 'Acoustically tuned hall equipped with dual projection and digital podium for tech talks and student presentations.',
  },
  {
    id: 'open-stage',
    name: 'Jubilee Open Air Stage',
    type: 'Cultural Events & DJ Night',
    capacity: '1500+ Capacity',
    floor: 'Central Campus Quadrangle',
    coordinates: { x: 50, y: 78 },
    description: 'Outdoor stadium arena for festival inaugurals, battle of the bands, dance showdowns, and the grand DJ night.',
  },
  {
    id: 'innovation-lab',
    name: 'Innovation & Maker Hub',
    type: '24H Hackathon Arena',
    capacity: '200 Hackers',
    floor: 'Level 2 — Block C',
    coordinates: { x: 26, y: 72 },
    description: 'Dedicated hackathon zone with uninterrupted power backup, high-speed Wi-Fi, mentorship bays, and recharge pods.',
  },
  {
    id: 'conference-room',
    name: 'Executive Boardroom',
    type: 'Workshops & VIP Panels',
    capacity: '80 Seats',
    floor: 'Level 3 — Administrative Block',
    coordinates: { x: 74, y: 75 },
    description: 'Executive conference space for exclusive tech masterclasses, sponsor interactions, and panel jury deliberations.',
  },
];

interface TimelineRoadmapProps {
  onNavigateToRegister?: (eventId?: string) => void;
  onNavigateToEventDetail?: (eventId: string) => void;
}

export const TimelineRoadmap: React.FC<TimelineRoadmapProps> = ({
  onNavigateToRegister,
  onNavigateToEventDetail,
}) => {
  const { events } = useFest();
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [mapType, setMapType] = useState<'google' | 'blueprint'>('google');
  const [selectedDay, setSelectedDay] = useState<'all' | 'dec-4' | 'dec-5'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeMapPinId, setActiveMapPinId] = useState<string>('main-auditorium');

  const [activeReachedIndices, setActiveReachedIndices] = useState<number[]>([]);
  const [laserHeightPercent, setLaserHeightPercent] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const eventsListRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Stable memoized roadmap events
  const roadmapEvents: TimelineEvent[] = useMemo(() => {
    return events.map((e, index) => ({
      id: e.id,
      day: e.day || (index < Math.ceil(events.length / 2) ? 'dec-4' : 'dec-5'),
      dayLabel: e.dayLabel || (e.day === 'dec-5' || index >= Math.ceil(events.length / 2) ? 'DECEMBER 5, 2026' : 'DECEMBER 4, 2026'),
      time: e.time,
      title: e.title,
      subtitle: e.subtitle || e.stageLabel || e.category,
      description: e.description,
      category: e.category,
      location: e.venue,
      locationId:
        e.locationId ||
        (e.venue?.toLowerCase().includes('auditorium')
          ? 'main-auditorium'
          : e.venue?.toLowerCase().includes('lab')
          ? 'cs-lab'
          : e.venue?.toLowerCase().includes('seminar')
          ? 'seminar-hall'
          : e.venue?.toLowerCase().includes('stage')
          ? 'open-stage'
          : e.venue?.toLowerCase().includes('hub') || e.venue?.toLowerCase().includes('innovation')
          ? 'innovation-lab'
          : 'conference-room'),
      speaker: e.speaker || { name: 'Event Coordinator', role: 'Srishti 2.7 Committee' },
      highlights: e.highlights && e.highlights.length > 0 ? e.highlights : [e.highlightText || 'Official flagship event of Srishti 2.7 with certificates & cash pool.'],
      side: e.side || (index % 2 === 0 ? 'left' : 'right'),
      fee: e.fee,
    }));
  }, [events]);

  const filteredEvents = useMemo(() => {
    return selectedDay === 'all'
      ? roadmapEvents
      : roadmapEvents.filter((e) => e.day === selectedDay);
  }, [roadmapEvents, selectedDay]);

  const activeMapLocation = useMemo(() => {
    return MAP_LOCATIONS.find((loc) => loc.id === activeMapPinId) || MAP_LOCATIONS[0];
  }, [activeMapPinId]);

  const activeLocationEvents = useMemo(() => {
    return roadmapEvents.filter((ev) => ev.locationId === activeMapPinId);
  }, [roadmapEvents, activeMapPinId]);

  // Mathematical scroll tracking: line grows exactly as cards scroll, activating nodes upon contact
  useEffect(() => {
    if (viewMode !== 'timeline') return;

    // Reset card refs
    cardsRef.current = [];

    const handleScroll = () => {
      const validCards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validCards.length === 0) return;

      const windowH = window.innerHeight;
      const targetActivationY = windowH * 0.65;

      const firstCard = validCards[0];
      const lastCard = validCards[validCards.length - 1];

      const firstRect = firstCard.getBoundingClientRect();
      const lastRect = lastCard.getBoundingClientRect();

      // Start line at vertical center of first card
      const startPointY = firstRect.top + 28;
      // End line at vertical center of last card
      const endPointY = lastRect.top + 28;

      const totalSpan = Math.max(1, (endPointY - startPointY) + (windowH * 0.15));
      const scrolledDist = targetActivationY - startPointY;

      // Calculate smooth progress
      let progress = 0;
      if (validCards.length === 1) {
        progress = startPointY <= targetActivationY ? 1 : 0;
      } else {
        progress = Math.max(0, Math.min(1, scrolledDist / totalSpan));
      }

      setLaserHeightPercent(progress * 100);

      // Light up only cards that have crossed the line's reach
      const reached: number[] = [];
      validCards.forEach((card, idx) => {
        const cRect = card.getBoundingClientRect();
        const nodeY = cRect.top + 28;
        if (nodeY <= targetActivationY) {
          reached.push(idx);
        }
      });

      setActiveReachedIndices(reached);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [viewMode, selectedDay, filteredEvents]);

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleEventClick = (eventId: string) => {
    if (onNavigateToEventDetail) {
      onNavigateToEventDetail(eventId);
    } else {
      window.location.hash = `event/${eventId}`;
    }
  };

  const handleRegisterClick = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (onNavigateToRegister) {
      onNavigateToRegister(eventId);
    } else {
      window.location.hash = `register`;
    }
  };

  return (
    <section
      id="roadmap"
      ref={containerRef}
      className="relative w-full pt-12 pb-14 sm:pt-16 sm:pb-18 md:pt-18 md:pb-20 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.08] overflow-hidden select-none"
    >
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-blue-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* =============================================
            SECTION HEADER (Always Solid & Visible)
            ============================================= */}
        <div className="roadmap-header-content text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] sm:text-xs font-technical font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3 h-3" />
            <span>02 // OFFICIAL SCHEDULE & VENUE DIRECTORY</span>
          </div>

          <h2 className="font-impact font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-tight text-white">
            SCHEDULE & <span className="text-gradient-27 font-impact font-black">CAMPUS MAP</span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm md:text-base text-white/60 font-body max-w-xl mx-auto font-light leading-relaxed">
            The complete two-day agenda across all computing arenas, auditoriums, and open air stages at St. Thomas College.
          </p>

          {/* VIEW MODE TOGGLE */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center p-1 rounded-xl bg-[#0D1015] border border-white/[0.12] shadow-xl">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-body font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  viewMode === 'timeline'
                    ? 'bg-gradient-27 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline Schedule</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-body font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-gradient-27 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Campus Venue Map</span>
              </button>
            </div>
          </div>

          {/* DAY FILTER TABS */}
          {viewMode === 'timeline' && (
            <div className="mt-6 inline-flex items-center gap-2 sm:gap-3 p-1 rounded-lg bg-[#0A0D14] border border-white/[0.06]">
              {[
                { id: 'all', label: 'All Days', count: roadmapEvents.length },
                { id: 'dec-4', label: 'Dec 4 • Day 1', count: roadmapEvents.filter(e => e.day === 'dec-4').length },
                { id: 'dec-5', label: 'Dec 5 • Day 2', count: roadmapEvents.filter(e => e.day === 'dec-5').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDay(tab.id as typeof selectedDay)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-body font-semibold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedDay === tab.id
                      ? 'bg-white/10 text-cyan-300 border border-cyan-400/30 shadow-sm font-bold'
                      : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/5 text-white/50">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* =============================================
            CAMPUS VENUE MAP VIEW
            ============================================= */}
        {viewMode === 'map' ? (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Map Header & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#0A0D14] border border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">
                    St. Thomas College (Autonomous), Thrissur
                  </h4>
                  <p className="text-xs text-white/50 font-body">
                    College Road, Thrissur, Kerala 680001
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="inline-flex items-center p-1 rounded-lg bg-black/40 border border-white/[0.08] text-xs">
                  <button
                    onClick={() => setMapType('google')}
                    className={`px-3 py-1.5 rounded font-body font-semibold transition-colors cursor-pointer ${
                      mapType === 'google'
                        ? 'bg-blue-600 text-white'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Google Maps View
                  </button>
                  <button
                    onClick={() => setMapType('blueprint')}
                    className={`px-3 py-1.5 rounded font-body font-semibold transition-colors cursor-pointer ${
                      mapType === 'blueprint'
                        ? 'bg-blue-600 text-white'
                        : 'text-white/40 hover:text-white'
                    }`}
                  >
                    Interactive Blueprint
                  </button>
                </div>

                <a
                  href="https://maps.app.goo.gl/Ngzox3SYdTJLwHes9"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs text-cyan-300 font-semibold transition-all hover:scale-105 shrink-0"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {mapType === 'google' ? (
              /* LIVE GOOGLE MAPS EMBED */
              <div className="relative w-full h-[460px] sm:h-[520px] rounded-xl overflow-hidden border border-white/[0.12] bg-[#07090E] shadow-2xl">
                <iframe
                  title="St. Thomas College Thrissur Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.563964950444!2d76.2166589758784!3d10.523673289610214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba7ee4bf854649f%3A0xd4b05e53a9abdc9c!2sSt.%20Thomas%20College%20(Autonomous)%2C%20Thrissur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                <div className="absolute top-4 left-4 z-10 p-3 sm:p-4 rounded-xl bg-[#050608]/90 backdrop-blur-md border border-white/[0.12] shadow-2xl max-w-xs pointer-events-auto">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-technical font-bold uppercase mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>VENUE GEO-LOCATION</span>
                  </div>
                  <h5 className="font-display font-bold text-sm text-white">St. Thomas College (Autonomous)</h5>
                  <p className="text-[11px] text-white/60 font-body mt-1 leading-relaxed">
                    Centrally located in Thrissur city, Kerala. 2.5 km from Thrissur Railway Station (TCR).
                  </p>
                  <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
                    <span className="text-[10px] font-technical text-white/40">GEO: 10.5236° N, 76.2192° E</span>
                    <a
                      href="https://maps.app.goo.gl/Ngzox3SYdTJLwHes9"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-body text-cyan-400 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Directions</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* INTERACTIVE BLUEPRINT VIEW */
              <div className="relative w-full h-[460px] sm:h-[520px] rounded-xl bg-[#0A0D14] border border-white/[0.08] p-6 overflow-hidden">
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />

                <div className="absolute top-5 left-5 z-20 text-[10px] font-technical text-cyan-400 uppercase tracking-wider font-semibold">
                  SRISHTI 2.7 — CAMPUS ARCHITECTURAL BLUEPRINT
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
                        className={`px-3 py-1.5 rounded-lg border text-xs font-body font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                          isActive
                            ? 'bg-gradient-27 border-cyan-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.7)] scale-105'
                            : 'bg-[#10141D]/90 border-white/[0.15] text-white/75 hover:border-cyan-400/50 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-cyan-400'}`} />
                        <span>{loc.name.split(' (')[0]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Selected Location Details Panel */}
            <div className="p-5 sm:p-7 rounded-xl bg-[#0A0D14] border border-white/[0.08] shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                <div>
                  <span className="text-[10px] font-technical text-cyan-400 uppercase font-semibold">
                    {activeMapLocation.floor}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white uppercase mt-0.5">
                    {activeMapLocation.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-xl font-light">
                    {activeMapLocation.description}
                  </p>
                </div>

                <div className="flex items-center gap-5 text-xs font-technical bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <div>
                    <span className="block text-[9px] text-white/40 uppercase">CAPACITY</span>
                    <span className="text-white font-bold">{activeMapLocation.capacity}</span>
                  </div>
                  <div className="border-l border-white/[0.08] pl-5">
                    <span className="block text-[9px] text-white/40 uppercase">CATEGORY</span>
                    <span className="text-cyan-400 font-bold">{activeMapLocation.type}</span>
                  </div>
                </div>
              </div>

              {/* Events in this location */}
              <div className="mt-5">
                <h4 className="font-technical text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  <span>SCHEDULED AT THIS VENUE ({activeLocationEvents.length})</span>
                </h4>
                {activeLocationEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeLocationEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={() => handleEventClick(ev.id)}
                        className="p-3.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/30 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                      >
                        <div>
                          <span className="block text-[10px] font-technical text-cyan-400 font-medium">
                            {ev.dayLabel} • {ev.time}
                          </span>
                          <h5 className="font-body font-semibold text-xs sm:text-sm text-white group-hover:text-cyan-200 mt-0.5">
                            {ev.title}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] font-technical px-2 py-0.5 rounded bg-white/5 text-white/60 uppercase">
                            {ev.category}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/40 italic font-body">No specific competitive events bound to this venue.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* =============================================
             TIMELINE VIEW — EXACT SCROLL-LINKED LASER SPINE
             ============================================= */
          <div ref={eventsListRef} className="relative mt-8 sm:mt-10">

            {/* Central Vertical Laser Line Track */}
            {/* Anchored strictly from vertical center of first node to last node */}
            <div 
              className="absolute left-4 md:left-1/2 -translate-x-1/2 z-0 pointer-events-none"
              style={{ top: '28px', bottom: '28px' }}
            >
              {/* Soft ambient aura */}
              <div className="absolute inset-y-0 w-8 -left-3.5 bg-cyan-500/[0.10] blur-md rounded-full pointer-events-none" />

              {/* Inactive Line Backbone (2px clean rail) */}
              <div className="w-[2px] h-full bg-white/[0.08] relative overflow-hidden rounded-full">
                
                {/* Active Glowing Laser Spine Fill */}
                <div
                  className="w-full timeline-deep-glow-line origin-top transition-all duration-500 ease-out"
                  style={{ height: `${laserHeightPercent}%` }}
                />
              </div>
            </div>

            {/* Timeline Events List */}
            <div className="space-y-6 sm:space-y-8 relative z-10">
              {filteredEvents.map((event, index) => {
                const isLeft = event.side === 'left';
                const isExpanded = expandedCardId === event.id;
                const isFirstOfDay = index === 0 || filteredEvents[index - 1].day !== event.day;
                const isNodeActive = activeReachedIndices.includes(index);

                return (
                  <React.Fragment key={event.id}>
                    {/* Date Break Header */}
                    {isFirstOfDay && (
                      <div className="flex justify-start md:justify-center my-3 pl-12 md:pl-0">
                        <div className="inline-flex items-center gap-2 font-technical text-xs text-cyan-300 uppercase font-bold tracking-widest bg-[#050608] px-4 py-1.5 border border-cyan-400/40 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.25)] z-20">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{event.dayLabel}</span>
                        </div>
                      </div>
                    )}

                    {/* EVENT ITEM ROW */}
                    <div
                      ref={(el) => {
                        cardsRef.current[index] = el;
                      }}
                      className={`relative flex flex-col md:flex-row items-start md:items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Node Marker — exactly at top 28px center of card */}
                      <div
                        className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
                        style={{ top: '28px' }}
                      >
                        {/* Radar Pulse Ring (ONLY active when reached by laser line) */}
                        {isNodeActive && (
                          <div className="absolute w-7 h-7 rounded-full bg-cyan-400/25 animate-node-ping pointer-events-none" />
                        )}

                        {/* Core Node Dot: Dark dormant when unreached, neon cyan when active */}
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isNodeActive
                              ? 'bg-[#050608] border-2 border-cyan-400 timeline-node-active-ring scale-110'
                              : 'bg-[#0E121A] border-2 border-white/20 scale-90'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              isNodeActive
                                ? 'bg-cyan-300 shadow-[0_0_8px_#00f0ff]'
                                : 'bg-white/30'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Spacer for 50/50 alignment on Desktop */}
                      <div className="w-full md:w-1/2" />

                      {/* EVENT CARD */}
                      <div
                        data-side={isLeft ? 'left' : 'right'}
                        className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                          isLeft ? 'md:pr-8 lg:pr-12' : 'md:pl-8 lg:pl-12'
                        }`}
                      >
                        <div
                          onClick={() => toggleExpand(event.id)}
                          className={`group rounded-xl p-5 sm:p-6 bg-[#0A0D14] border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden ${
                            isExpanded
                              ? 'border-cyan-400/50 bg-[#0D121F] shadow-[0_0_30px_rgba(0,240,255,0.12)]'
                              : 'border-white/[0.08] hover:border-cyan-400/30 hover:bg-[#0E131E]'
                          }`}
                        >
                          {/* Accent Top Border Highlight on Card */}
                          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Top Meta Line */}
                          <div className="flex items-center justify-between text-xs font-technical text-white/50 mb-2.5">
                            <span className="uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_6px_#00f0ff]" />
                              {event.category}
                            </span>
                            <span className="font-semibold text-white/70 bg-white/5 px-2 py-0.5 rounded">
                              {event.time}
                            </span>
                          </div>

                          {/* Title & Subtitle */}
                          <div className="space-y-1">
                            <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-tight">
                              {event.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/55 font-body font-medium">
                              {event.subtitle}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="mt-2.5 text-xs sm:text-sm text-white/50 font-body leading-relaxed line-clamp-2">
                            {event.description}
                          </p>

                          {/* Location & Coordinator Meta */}
                          <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-body text-white/45">
                            <span className="text-white/80 flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                              {event.location}
                            </span>
                            <span className="text-white/60">{event.speaker?.name}</span>
                          </div>

                          {/* Expandable Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3.5 animate-fadeIn">
                              <span className="text-[10px] font-technical text-cyan-400 tracking-widest uppercase block font-bold">
                                KEY HIGHLIGHTS & OUTCOMES
                              </span>

                              <ul className="space-y-1.5">
                                {(event.highlights || []).map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-xs text-white/80 font-body flex items-start gap-2"
                                  >
                                    <span className="text-cyan-400 font-bold">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06]">
                                <span className="text-[11px] font-body text-white/50">
                                  {event.speaker.role}
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEventClick(event.id);
                                    }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white font-body font-semibold text-xs transition-colors cursor-pointer"
                                  >
                                    <span>Full Details</span>
                                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                                  </button>

                                  <button
                                    onClick={(e) => handleRegisterClick(e, event.id)}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer"
                                  >
                                    <span>Register</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Toggle Prompt */}
                          <div className="mt-2.5 flex items-center justify-center gap-1 text-[10px] font-technical text-white/30 group-hover:text-cyan-300 transition-colors pt-1">
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
