import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Search, 
  Clock, 
  MapPin, 
  Sparkles, 
  X, 
  Layers 
} from 'lucide-react';
import { useFest } from '../context/FestContext';

interface EventsPageProps {
  onBackToHome: () => void;
  onSelectEventDetail: (eventId: string) => void;
  onNavigateToRegister: (eventId?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onBackToHome,
  onSelectEventDetail,
  onNavigateToRegister,
}) => {
  const { events } = useFest();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDay, setSelectedDay] = useState<'ALL' | 'dec-4' | 'dec-5'>('ALL');
  const [selectedFeeType, setSelectedFeeType] = useState<'ALL' | 'FREE' | 'PAID'>('ALL');

  // Extract all distinct categories dynamically from active events
  const categories = useMemo(() => {
    return ['ALL', 'CODING', 'ROBOTICS', 'WEB & AI', 'IDEATHON', 'GAMES', 'DANCE & ARTS'];
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.tags && e.tags.some((t) => t.toLowerCase().includes(q))) ||
        e.venue.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);

      // Category match
      let matchCategory = selectedCategory === 'ALL';
      if (selectedCategory === 'CODING') matchCategory = ['codex', 'debugging', 'blind-coding'].includes(e.id);
      if (selectedCategory === 'ROBOTICS') matchCategory = e.id === 'tracebot';
      if (selectedCategory === 'WEB & AI') matchCategory = e.id === 'ai-webdev';
      if (selectedCategory === 'IDEATHON') matchCategory = e.id === 'ideathon';
      if (selectedCategory === 'GAMES') matchCategory = ['treasure-hunt', 'mind-game', 'tech-quiz'].includes(e.id);
      if (selectedCategory === 'DANCE & ARTS') matchCategory = ['waltz', 'face-painting'].includes(e.id);

      // Day match
      const matchDay =
        selectedDay === 'ALL' ||
        e.day === selectedDay;

      // Fee match
      const matchFee =
        selectedFeeType === 'ALL' ||
        (selectedFeeType === 'FREE' && (e.fee === 0 || !e.fee)) ||
        (selectedFeeType === 'PAID' && e.fee && e.fee > 0);

      return matchSearch && matchCategory && matchDay && matchFee;
    });
  }, [events, searchQuery, selectedCategory, selectedDay, selectedFeeType]);

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased select-none pb-24 overflow-x-hidden">
      
      {/* =============================================
          TOP STICKY NAVBAR
          ============================================= */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-27 flex items-center justify-center text-white font-display font-bold text-xs">
            S
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-white hidden sm:inline">
            srishti<span className="text-gradient-27 font-technical font-black ml-1">2.7</span>
          </span>
        </div>

        <button
          onClick={() => onNavigateToRegister()}
          className="px-4 py-1.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.35)]"
        >
          <span>All Pass Checkout</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* =============================================
          HERO BANNER & SEARCH
          ============================================= */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-b border-white/[0.08] overflow-hidden bg-[#07090E]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-technical font-semibold tracking-wider uppercase">
            <Sparkles className="w-3 h-3" />
            <span>01 // COMPLETE FESTIVAL DIRECTORY</span>
          </div>

          <h1 className="font-impact font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-tight">
            SRISHTI 2.7 <span className="text-gradient-27 font-impact font-black">EVENTS HUB</span>
          </h1>

          <p className="font-body text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Discover hackathons, competitive programming battles, CTF cybersecurity operations, UI/UX sprints, and cultural performances.
          </p>

          {/* Search Input Bar */}
          <div className="max-w-2xl mx-auto mt-6 relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-white/40 absolute left-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search events by title, keyword, tech stack, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-[#0B0E16] border border-white/[0.12] focus:border-cyan-400 text-xs sm:text-sm font-body text-white placeholder:text-white/30 focus:outline-none shadow-2xl transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-md text-white/40 hover:text-white absolute right-3 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =============================================
          FILTERS BAR
          ============================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-8 space-y-4">
        
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-body font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-27 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] font-bold'
                    : 'bg-[#0A0D14] border border-white/[0.08] text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sub-Filters: Day & Fee */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.04] text-xs font-technical text-white/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-white/30">DAY:</span>
            {[
              { id: 'ALL', label: 'All Days' },
              { id: 'dec-4', label: 'Dec 4 (Day 1)' },
              { id: 'dec-5', label: 'Dec 5 (Day 2)' },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id as typeof selectedDay)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  selectedDay === d.id
                    ? 'bg-white/10 text-cyan-300 font-bold border border-cyan-400/30'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-white/30">ENTRY:</span>
            {[
              { id: 'ALL', label: 'All Fees' },
              { id: 'FREE', label: 'Free Only' },
              { id: 'PAID', label: 'Paid Pass' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFeeType(f.id as typeof selectedFeeType)}
                className={`px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                  selectedFeeType === f.id
                    ? 'bg-white/10 text-emerald-300 font-bold border border-emerald-400/30'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <span className="text-white/40 font-semibold">
            SHOWING {filteredEvents.length} EVENT{filteredEvents.length === 1 ? '' : 'S'}
          </span>
        </div>
      </div>

      {/* =============================================
          EVENTS GRID
          ============================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-8">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onSelectEventDetail(event.id)}
                className="group rounded-2xl bg-[#0A0D14] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.08)] cursor-pointer"
              >
                {/* Event Card Image / Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-black/40">
                  <img
                    src={
                      event.image ||
                      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-technical text-cyan-300 font-bold uppercase truncate">
                        {event.category}
                      </span>
                      {event.teamSize && (
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 backdrop-blur-md border border-sky-400/30 text-[9px] font-technical text-sky-200 font-bold whitespace-nowrap">
                          {event.teamSize}
                        </span>
                      )}
                    </div>

                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-technical text-emerald-300 font-bold shrink-0">
                      {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                    </span>
                  </div>
                </div>

                {/* Event Card Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-technical text-white/40">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{event.time}</span>
                    </div>

                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-xs text-white/50 font-body line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Meta Footer */}
                  <div className="pt-4 border-t border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between text-xs font-body text-white/50">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </span>

                      {event.prize && (
                        <span className="text-gradient-27 font-bold shrink-0 font-technical text-[11px]">
                          {event.prize}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEventDetail(event.id);
                        }}
                        className="py-2 px-3 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-body font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToRegister(event.id);
                        }}
                        className="py-2 px-3 rounded-lg bg-gradient-27 text-white text-xs font-body font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.35)]"
                      >
                        <span>Register</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3 bg-[#0A0D14] rounded-2xl border border-white/[0.08] p-8">
            <Layers className="w-10 h-10 text-white/30 mx-auto" />
            <h4 className="font-display font-bold text-lg text-white">No Events Match Your Filters</h4>
            <p className="text-xs text-white/50 font-body max-w-sm mx-auto">
              Try searching for a different keyword or resetting your category/day filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setSelectedDay('ALL');
                setSelectedFeeType('ALL');
              }}
              className="mt-2 text-xs font-technical text-cyan-400 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
