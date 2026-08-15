import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Clock,
  MapPin,
  User,
  Sparkles,
  Calendar,
  ChevronDown,
  ArrowUpRight,
  Code,
  Award,
  Zap,
  Music,
  Users,
  Compass,
  Layers,
  Radio
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface TimelineEvent {
  id: string;
  day: 'dec-3' | 'dec-4' | 'dec-5';
  dayLabel: string;
  time: string;
  title: string;
  subtitle: string;
  description: string;
  category: 'Keynote' | 'Workshop' | 'Hackathon' | 'Panel' | 'Social' | 'Awards';
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

export interface MapLocation {
  id: string;
  name: string;
  type: string;
  capacity: string;
  floor: string;
  coordinates: { x: number; y: number }; // percentage position on map canvas
  color: string;
  description: string;
}

const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'stage-alpha',
    name: 'Main Stage Alpha',
    type: 'Keynote & Main Stage',
    capacity: '2,500 Seats',
    floor: 'Ground Floor - Hall 1',
    coordinates: { x: 50, y: 28 },
    color: '#635bff',
    description: 'Central auditorium equipped with 8K LED surround displays, spatial audio, and live streaming rigs for keynotes.',
  },
  {
    id: 'lab-04',
    name: 'Lab Room 04',
    type: 'Interactive Technical Workshop',
    capacity: '150 Stations',
    floor: 'Level 2 - North Wing',
    coordinates: { x: 22, y: 45 },
    color: '#00e5ff',
    description: 'High-speed gigabit workstations with dual monitors for live coding, GSAP animation labs, and mentor guidance.',
  },
  {
    id: 'auditorium-b',
    name: 'Auditorium B',
    type: 'Panels & Product Demos',
    capacity: '800 Seats',
    floor: 'Level 1 - East Wing',
    coordinates: { x: 78, y: 48 },
    color: '#d4ff00',
    description: 'Intimate tiered seating for live debates, AI workflow showcases, and Q&A sessions with industry leaders.',
  },
  {
    id: 'skyline-terrace',
    name: 'Skyline Terrace Lounge',
    type: 'VIP Social & Gala Lounge',
    capacity: '500 Guests',
    floor: 'Rooftop Level 4',
    coordinates: { x: 50, y: 78 },
    color: '#ff5e62',
    description: 'Open-air panoramic cocktail lounge, live DJ booth, mixology bar, and evening networking areas.',
  },
  {
    id: 'innovation-arena',
    name: 'Innovation Arena',
    type: '24-Hour Hackathon Zone',
    capacity: '400 Hackers',
    floor: 'Level 2 - South Wing',
    coordinates: { x: 26, y: 72 },
    color: '#ff9900',
    description: 'Collaborative desk hubs, lounge pods, 24/7 refreshment bars, and mentor helpdesks for build teams.',
  },
  {
    id: 'executive-suite',
    name: 'Executive Boardroom',
    type: 'Founders & Investor Suite',
    capacity: '50 Guests',
    floor: 'Level 3 - West Wing',
    coordinates: { x: 74, y: 75 },
    color: '#a855f7',
    description: 'Private pitch room, private dining lounge, and high-level strategy roundtable setup.',
  },
];

const EVENTS_DATA: TimelineEvent[] = [
  // DECEMBER 3
  {
    id: 'ev-1',
    day: 'dec-3',
    dayLabel: 'DECEMBER 3, 2026',
    time: '09:00 AM - 10:30 AM',
    title: 'The Next Era of Digital Experiences',
    subtitle: 'Opening Keynote & Design Systems Vision',
    description:
      'Unveiling next-generation scrollytelling paradigm, dynamic user interfaces, and the convergence of high-end motion design with performant front-end engineering.',
    category: 'Keynote',
    categoryColor: 'border-[#635bff] text-[#635bff] bg-[#635bff]/10',
    location: 'Main Stage Alpha',
    locationId: 'stage-alpha',
    speaker: {
      name: 'Elena Rostova',
      role: 'Creative Director & Founder',
    },
    highlights: [
      'Interactive Design Paradigms 2027',
      'Micro-animations that increase conversion',
      'Live UI Architecture Breakdown',
    ],
    side: 'left',
    icon: <Sparkles className="w-5 h-5 text-[#635bff]" />,
  },
  {
    id: 'ev-2',
    day: 'dec-3',
    dayLabel: 'DECEMBER 3, 2026',
    time: '11:15 AM - 01:00 PM',
    title: 'Building Scrollytelling Systems with GSAP',
    subtitle: 'Hands-on Motion & Inertia Workshop',
    description:
      'Deep dive into scroll-driven animations, Lenis smooth scroll synchronization, performance optimization, and GPU-accelerated canvas layers.',
    category: 'Workshop',
    categoryColor: 'border-[#00e5ff] text-[#00e5ff] bg-[#00e5ff]/10',
    location: 'Lab Room 04',
    locationId: 'lab-04',
    speaker: {
      name: 'Alexandre V.',
      role: 'Lead Motion Engineer',
    },
    highlights: [
      'Pinning & scrub timeline setups',
      'Preventing layout thrashing on mobile',
      'Code templates provided to all attendees',
    ],
    side: 'right',
    icon: <Code className="w-5 h-5 text-[#00e5ff]" />,
  },
  {
    id: 'ev-3',
    day: 'dec-3',
    dayLabel: 'DECEMBER 3, 2026',
    time: '02:30 PM - 04:15 PM',
    title: 'Generative AI in Modern Product Design',
    subtitle: 'Expert Panel & Future Predictions',
    description:
      'Pioneering founders and product leads debate how generative UI, synthetic assets, and automated code generation reshape creative agency workflows.',
    category: 'Panel',
    categoryColor: 'border-[#d4ff00] text-[#d4ff00] bg-[#d4ff00]/10',
    location: 'Auditorium B',
    locationId: 'auditorium-b',
    speaker: {
      name: 'Marcus Vance & Panelists',
      role: 'Head of Product Strategy',
    },
    highlights: [
      'AI vs Human Craftsmanship',
      'Automated Figma to React pipelines',
      'Audience Q&A & live debates',
    ],
    side: 'left',
    icon: <Zap className="w-5 h-5 text-[#d4ff00]" />,
  },
  {
    id: 'ev-4',
    day: 'dec-3',
    dayLabel: 'DECEMBER 3, 2026',
    time: '06:00 PM - 09:30 PM',
    title: 'VIP Opening Gala & Night Lounge',
    subtitle: 'Exclusive Drinks, Music & Networking',
    description:
      'Connect with industry leaders, design visionaries, and engineering pioneers over crafted cocktails, immersive light installations, and live DJ sets.',
    category: 'Social',
    categoryColor: 'border-[#ff5e62] text-[#ff5e62] bg-[#ff5e62]/10',
    location: 'Skyline Terrace Lounge',
    locationId: 'skyline-terrace',
    speaker: {
      name: 'Outcrowd Hosts',
      role: 'Community & Event Leads',
    },
    highlights: [
      'Craft Mixology & Gourmet Catering',
      'Live Ambient Electronic Music',
      'Exclusive VIP Networking Lounge',
    ],
    side: 'right',
    icon: <Music className="w-5 h-5 text-[#ff5e62]" />,
  },

  // DECEMBER 4
  {
    id: 'ev-5',
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    time: '09:30 AM - 11:30 AM',
    title: 'Design Systems at Scale',
    subtitle: 'Architecting Design Tokens & React Components',
    description:
      'Learn how top design agencies bridge Figma design systems with production-grade React components using Tailwind CSS v4 and strict token registries.',
    category: 'Keynote',
    categoryColor: 'border-[#635bff] text-[#635bff] bg-[#635bff]/10',
    location: 'Main Stage Alpha',
    locationId: 'stage-alpha',
    speaker: {
      name: 'Sophia Lin',
      role: 'Principal Systems Architect',
    },
    highlights: [
      'Design Token Automation',
      'Atomic Component Hierarchy',
      'Zero-drift Designer-Developer Sync',
    ],
    side: 'left',
    icon: <Sparkles className="w-5 h-5 text-[#635bff]" />,
  },
  {
    id: 'ev-6',
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    time: '12:00 PM - 03:00 PM',
    title: 'Live Scrollytelling Hackathon',
    subtitle: '3-Hour Rapid Prototyping Challenge',
    description:
      'Teams race against the clock to craft the most stunning web animation prototype. Cash prizes, agency mentorship, and immediate feedback.',
    category: 'Hackathon',
    categoryColor: 'border-[#ff9900] text-[#ff9900] bg-[#ff9900]/10',
    location: 'Innovation Arena',
    locationId: 'innovation-arena',
    speaker: {
      name: 'Outcrowd Mentors',
      role: 'Hackathon Jury',
    },
    highlights: [
      '$10,000 Total Prize Pool',
      '1-on-1 Mentorship from Sr. Developers',
      'Live Stage Demo Presentations',
    ],
    side: 'right',
    icon: <Code className="w-5 h-5 text-[#ff9900]" />,
  },
  {
    id: 'ev-7',
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    time: '04:00 PM - 05:30 PM',
    title: 'Product Showcase & Future Demos',
    subtitle: 'Live Unveiling of Next-Gen Web Tools',
    description:
      'Witness live demonstrations of unreleased web performance tools, WebGL shader libraries, and interactive design prototypes built for 2027.',
    category: 'Panel',
    categoryColor: 'border-[#d4ff00] text-[#d4ff00] bg-[#d4ff00]/10',
    location: 'Auditorium B',
    locationId: 'auditorium-b',
    speaker: {
      name: 'Featured Startup Founders',
      role: 'Tech Innovators',
    },
    highlights: [
      '5 Frontier Tech Product Launches',
      'Interactive Audience Polling',
      'Beta Access Keys Distributed',
    ],
    side: 'left',
    icon: <Zap className="w-5 h-5 text-[#d4ff00]" />,
  },
  {
    id: 'ev-8',
    day: 'dec-4',
    dayLabel: 'DECEMBER 4, 2026',
    time: '06:30 PM - 10:00 PM',
    title: 'Hackathon Finale & After-Party',
    subtitle: 'Awards Ceremony & Neon Celebration',
    description:
      'Celebrating hackathon winners, project spotlights, and an unforgettable evening of electronic synth beats and visual light projections.',
    category: 'Awards',
    categoryColor: 'border-[#ff5e62] text-[#ff5e62] bg-[#ff5e62]/10',
    location: 'Main Stage Alpha',
    locationId: 'stage-alpha',
    speaker: {
      name: 'Guest DJ & Host Team',
      role: 'Event Finale',
    },
    highlights: [
      'Award Ceremony & Trophy Handout',
      'Laser Light & Projection Mapping Show',
      'After-Party Celebration',
    ],
    side: 'right',
    icon: <Award className="w-5 h-5 text-[#ff5e62]" />,
  },

  // DECEMBER 5
  {
    id: 'ev-9',
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    time: '10:00 AM - 12:30 PM',
    title: 'Founders & Investor Roundtable',
    subtitle: 'Scaling Creative Agencies & SaaS Products',
    description:
      'An intimate closed-door discussion on venture funding, agency positioning, client acquisition, and building recurring revenue models in design.',
    category: 'Social',
    categoryColor: 'border-[#a855f7] text-[#a855f7] bg-[#a855f7]/10',
    location: 'Executive Boardroom',
    locationId: 'executive-suite',
    speaker: {
      name: 'Partner VCs & Agency Founders',
      role: 'Roundtable Leaders',
    },
    highlights: [
      'Investor matchmaking sessions',
      'Growth metrics & valuation breakdown',
      'Private brunch included',
    ],
    side: 'left',
    icon: <Users className="w-5 h-5 text-[#a855f7]" />,
  },
  {
    id: 'ev-10',
    day: 'dec-5',
    dayLabel: 'DECEMBER 5, 2026',
    time: '02:00 PM - 04:00 PM',
    title: 'Closing Keynote & 2027 Vision',
    subtitle: 'Reflections & Community Roadmap',
    description:
      'Wrapping up three days of creative exploration, setting the stage for next year’s global summit, and announcing future community initiatives.',
    category: 'Keynote',
    categoryColor: 'border-[#635bff] text-[#635bff] bg-[#635bff]/10',
    location: 'Main Stage Alpha',
    locationId: 'stage-alpha',
    speaker: {
      name: 'Elena Rostova & Founders',
      role: 'Executive Committee',
    },
    highlights: [
      'Summit Highlights Reel',
      'Community Grant Announcement',
      '2027 Pre-Registration Access',
    ],
    side: 'right',
    icon: <Sparkles className="w-5 h-5 text-[#635bff]" />,
  },
];

export const TimelineRoadmap: React.FC = () => {
  const [viewMode, setViewMode] = useState<'timeline' | 'map'>('timeline');
  const [selectedDay, setSelectedDay] = useState<'all' | 'dec-3' | 'dec-4' | 'dec-5'>('all');
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeMapPinId, setActiveMapPinId] = useState<string>('stage-alpha');

  const containerRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const laserTipRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const nodeDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  const filteredEvents = selectedDay === 'all'
    ? EVENTS_DATA
    : EVENTS_DATA.filter((e) => e.day === selectedDay);

  const activeMapLocation = MAP_LOCATIONS.find((loc) => loc.id === activeMapPinId) || MAP_LOCATIONS[0];
  const activeLocationEvents = EVENTS_DATA.filter((ev) => ev.locationId === activeMapPinId);

  useEffect(() => {
    // Refresh ScrollTrigger so pinned sections below (like CaseShowcase) adjust their start positions when Roadmap height changes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    if (!containerRef.current) return () => clearTimeout(timer);

    const ctx = gsap.context(() => {
      // 0. Roadmap Header Bi-Directional Entrance & Exit Animation
      gsap.fromTo(
        '.roadmap-header-content',
        { y: 50, opacity: 0 },
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

      // 1. Vertical Line height growth scrub linked to scroll
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

      // 2. Animate cards sliding in from left and right (Bi-directional scrub on forward & reverse scroll)
      const isMobile = window.innerWidth < 768;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        const isLeft = card.dataset.side === 'left';
        const nodeDot = nodeDotsRef.current[index];

        // Responsive offset: on mobile cards slide in from right (+50px) or left (-50px)
        const initialX = isMobile ? (isLeft ? -45 : 45) : (isLeft ? -120 : 120);

        // Scrubbed Card Entrance & Reverse Exit animation
        gsap.fromTo(
          card,
          {
            x: initialX,
            opacity: 0,
            scale: 0.9,
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 65%',
              scrub: 0.5, // Enables smooth continuous scrub in BOTH scroll directions!
            },
          }
        );

        // Scrubbed Timeline Node Dot Activation
        if (nodeDot) {
          gsap.fromTo(
            nodeDot,
            {
              scale: 0.6,
              backgroundColor: '#18181c',
              borderColor: 'rgba(255,255,255,0.2)',
              boxShadow: '0 0 0px rgba(0,0,0,0)',
            },
            {
              scale: 1.3,
              backgroundColor: '#635bff',
              borderColor: '#d4ff00',
              boxShadow: '0 0 20px rgba(99, 91, 255, 0.9)',
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
      clearTimeout(timer);
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
      className="relative w-full py-24 bg-[#0b0b0b] text-[#f5f5f7] border-t border-white/10 overflow-hidden select-none"
    >
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[750px] h-[750px] bg-[#635bff]/12 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-[#d4ff00]/6 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="roadmap-header-content text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/12 text-xs font-mono text-[#635bff] tracking-widest uppercase mb-4">
            <Radio className="w-3.5 h-3.5 text-[#635bff] animate-pulse" />
            <span>02 / EVENT MAP & ROADMAP AGENDA</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]">
            Event Map{' '}
            <span className="font-serif-custom italic font-normal text-[#635bff] lowercase text-4xl sm:text-6xl md:text-8xl block sm:inline">
              & timeline
            </span>
          </h2>

          <p className="mt-4 text-base md:text-lg text-white/60 font-light max-w-xl mx-auto">
            Explore the venue map, main stages, and live schedule for December 3 - 5.
          </p>

          {/* VIEW MODE TOGGLE (Timeline Agenda vs Interactive Event Map) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center p-1.5 rounded-full bg-[#141419] border border-white/15 shadow-2xl">
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-syne font-bold uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'timeline'
                    ? 'bg-[#635bff] text-white shadow-lg shadow-[#635bff]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Timeline Schedule</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-syne font-bold uppercase tracking-wider transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-[#635bff] text-white shadow-lg shadow-[#635bff]/30'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Interactive Venue Map</span>
              </button>
            </div>
          </div>

          {/* DAY FILTER TABS (When in Timeline mode) */}
          {viewMode === 'timeline' && (
            <div className="mt-6 inline-flex items-center gap-2 p-1.5 rounded-full bg-[#121217] border border-white/10 shadow-lg">
              {[
                { id: 'all', label: 'All Days' },
                { id: 'dec-3', label: 'Dec 3, Thu' },
                { id: 'dec-4', label: 'Dec 4, Fri' },
                { id: 'dec-5', label: 'Dec 5, Sat' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDay(tab.id as typeof selectedDay)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-syne font-bold uppercase tracking-wider transition-all duration-300 ${
                    selectedDay === tab.id
                      ? 'bg-white/15 text-white border border-white/20'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: INTERACTIVE EVENT VENUE MAP */}
        {/* ------------------------------------------------------------- */}
        {viewMode === 'map' ? (
          <div className="mt-8 animate-fadeIn space-y-8">
            {/* Interactive Blueprint Map Stage Container */}
            <div className="relative w-full h-[520px] sm:h-[580px] rounded-3xl bg-gradient-to-br from-[#121218] via-[#0e0e13] to-[#0a0a0d] border border-white/15 p-6 overflow-hidden shadow-2xl">
              
              {/* Floorplan Grid Lines Background */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
              
              {/* Architectural Zone Outlines */}
              <div className="absolute top-[15%] left-[10%] w-[80%] h-[70%] border border-dashed border-white/15 rounded-2xl pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-mono tracking-widest text-white/15 uppercase">
                  SRISHTI CONVENTION CENTER - MAIN CONCOURSE
                </span>
              </div>

              {/* Map Title Tag */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-mono text-white/80">
                <Layers className="w-3.5 h-3.5 text-[#635bff]" />
                <span>INTERACTIVE STAGE & VENUE FLOORPLAN</span>
              </div>

              {/* MAP PINS & NODES */}
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
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-30 transition-all duration-300 focus:outline-none`}
                  >
                    {/* Pulsing Outer Ring */}
                    <div
                      className={`absolute -inset-3 rounded-full opacity-75 animate-ping ${
                        isActive ? 'bg-[#635bff]' : 'bg-transparent'
                      }`}
                    />

                    {/* Pin Circle */}
                    <div
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-[#635bff] border-white text-white scale-110 shadow-[0_0_20px_rgba(99,91,255,0.8)]'
                          : 'bg-[#181820] border-white/20 text-white/80 hover:border-white hover:bg-[#20202c]'
                      }`}
                    >
                      <MapPin
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: isActive ? '#ffffff' : loc.color }}
                      />
                      <span className="text-[11px] font-syne font-bold tracking-tight whitespace-nowrap">
                        {loc.name}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Map Legend Footer */}
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl text-xs font-mono">
                <div className="flex items-center gap-4">
                  <span className="text-white/50">CLICK PINS TO VIEW STAGE SCHEDULE</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#635bff]" />
                    <span className="text-white/80">Active Stage</span>
                  </div>
                </div>

                <div className="text-white/40 text-[11px]">
                  SRISHTI SUMMIT 2026 • VENUE HUB
                </div>
              </div>
            </div>

            {/* SELECTED LOCATION DETAILED PANEL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Location Info Card */}
              <div className="lg:col-span-5 p-8 rounded-3xl bg-[#14141a] border border-[#635bff]/40 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#635bff]/15 border border-[#635bff]/30 text-xs font-mono text-[#635bff] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeMapLocation.type}</span>
                  </div>

                  <span className="text-xs font-mono text-white/40">
                    {activeMapLocation.floor}
                  </span>
                </div>

                <div>
                  <h3 className="font-syne text-2xl md:text-3xl font-bold text-white uppercase tracking-tight">
                    {activeMapLocation.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/70 font-light leading-relaxed">
                    {activeMapLocation.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                  <span>CAPACITY:</span>
                  <span className="text-[#d4ff00] font-bold">
                    {activeMapLocation.capacity}
                  </span>
                </div>
              </div>

              {/* Scheduled Events at this Location */}
              <div className="lg:col-span-7 p-8 rounded-3xl bg-[#121217] border border-white/10 space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-xs font-mono text-[#635bff] font-bold tracking-widest uppercase">
                    SCHEDULED SESSIONS AT {activeMapLocation.name.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-white/40">
                    {activeLocationEvents.length} SESSIONS
                  </span>
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {activeLocationEvents.length > 0 ? (
                    activeLocationEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-[#635bff]">
                            <Clock className="w-3 h-3" />
                            <span>
                              {ev.dayLabel} • {ev.time}
                            </span>
                          </div>
                          <h4 className="font-syne font-bold text-base text-white">
                            {ev.title}
                          </h4>
                          <p className="text-xs text-white/50 font-light">
                            Speaker: {ev.speaker.name} ({ev.speaker.role})
                          </p>
                        </div>

                        <a
                          href="#cta"
                          className="shrink-0 px-4 py-2 rounded-full bg-[#635bff] text-white font-syne text-[11px] font-bold uppercase tracking-wider hover:bg-[#7952eb] transition-colors flex items-center gap-1"
                        >
                          <span>Reserve</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-white/40 italic py-4">
                      No additional public sessions scheduled at this room.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: SCROLL-DRIVEN TIMELINE ROADMAP (DYNAMIC LINE & CARDS) */
          /* ------------------------------------------------------------- */
          <div className="relative mt-16">
            {/* Central Vertical Line (Desktop Center / Mobile Left) */}
            <div
              ref={lineTrackRef}
              className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/10 z-0"
            >
              {/* Dynamic Growing Gradient Line */}
              <div
                ref={lineFillRef}
                className="w-full h-full bg-gradient-to-b from-[#635bff] via-[#00e5ff] to-[#d4ff00] origin-top shadow-[0_0_12px_rgba(99,91,255,0.8)]"
                style={{ transform: 'scaleY(0)' }}
              />

              {/* Glowing Laser Tip Follower */}
              <div
                ref={laserTipRef}
                className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#d4ff00] border-2 border-white shadow-[0_0_20px_#d4ff00] transition-all duration-75 pointer-events-none"
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
                    {/* Big Date Header Badge when day changes */}
                    {isFirstOfDay && (
                      <div className="flex justify-start md:justify-center my-8 pl-12 md:pl-0">
                        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-[#18181f] border border-[#635bff]/40 shadow-xl shadow-[#635bff]/10">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#d4ff00] animate-ping" />
                          <span className="font-syne font-black text-xs md:text-sm tracking-widest text-white uppercase">
                            {event.dayLabel}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* EVENT ITEM CONTAINER */}
                    <div
                      className={`relative flex flex-col md:flex-row items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Node Dot on Timeline */}
                      <div
                        ref={(el) => {
                          nodeDotsRef.current[index] = el;
                        }}
                        className="absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#18181c] border-2 border-white/20 z-20 flex items-center justify-center transition-all duration-300"
                      >
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>

                      {/* Left or Right Spacer to keep 50% grid layout on Desktop */}
                      <div className="w-full md:w-1/2" />

                      {/* EVENT WIDGET CARD */}
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
                          className={`group relative rounded-3xl p-6 sm:p-8 bg-[#121216]/90 backdrop-blur-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                            isExpanded
                              ? 'border-[#635bff] shadow-2xl shadow-[#635bff]/20 bg-[#16161c]'
                              : 'border-white/10 hover:border-white/30 hover:bg-[#16161c] hover:shadow-xl hover:shadow-black/50'
                          }`}
                        >
                          {/* Hover Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                          {/* Card Header: Category Badge & Time */}
                          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
                            <div
                              className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 ${event.categoryColor}`}
                            >
                              {event.icon}
                              <span>{event.category}</span>
                            </div>

                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                              <Clock className="w-3.5 h-3.5 text-[#635bff]" />
                              <span>{event.time}</span>
                            </div>
                          </div>

                          {/* Title & Subtitle */}
                          <div className="relative z-10">
                            <h3 className="font-syne text-xl sm:text-2xl font-bold text-white group-hover:text-[#635bff] transition-colors leading-tight">
                              {event.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-white/50 font-light mt-1">
                              {event.subtitle}
                            </p>
                          </div>

                          {/* Description */}
                          <p className="mt-4 text-xs sm:text-sm text-white/70 font-light leading-relaxed relative z-10">
                            {event.description}
                          </p>

                          {/* Location & Speaker Pills */}
                          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-white/60 relative z-10">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-[#d4ff00]" />
                              <span>{event.location}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-[#00e5ff]" />
                              <span className="text-white/80 font-semibold">
                                {event.speaker.name}
                              </span>
                            </div>
                          </div>

                          {/* Expandable Details Tray */}
                          {isExpanded && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-fadeIn relative z-10">
                              <span className="text-[11px] font-mono text-[#635bff] tracking-widest uppercase block font-semibold">
                                SESSION HIGHLIGHTS & AGENDA
                              </span>

                              <ul className="space-y-2">
                                {event.highlights.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center gap-2.5 text-xs text-white/80 font-light"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4ff00]" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>

                              <div className="pt-2 flex items-center justify-between">
                                <span className="text-xs font-mono text-white/40">
                                  Speaker: {event.speaker.role}
                                </span>

                                <a
                                  href="#cta"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#635bff] text-white font-syne text-xs font-bold uppercase tracking-wider hover:bg-[#7952eb] transition-colors"
                                >
                                  <span>Reserve Seat</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Card Footer Toggle Prompt */}
                          <div className="mt-4 flex items-center justify-center gap-1 text-[10px] font-mono text-white/30 group-hover:text-white/60 transition-colors pt-2">
                            <span>
                              {isExpanded
                                ? 'Click to collapse'
                                : 'Click to expand session details'}
                            </span>
                            <ChevronDown
                              className={`w-3 h-3 transition-transform duration-300 ${
                                isExpanded ? 'rotate-180 text-[#635bff]' : ''
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
