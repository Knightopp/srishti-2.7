import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  Share2, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useFest } from '../context/FestContext';

interface EventDetailPageProps {
  eventId: string;
  onBackToEvents: () => void;
  onBackToHome: () => void;
  onNavigateToRegister: (eventId?: string) => void;
  onSelectEventDetail?: (id: string) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  eventId,
  onBackToEvents,
  onBackToHome,
  onNavigateToRegister,
  onSelectEventDetail,
}) => {
  const { events } = useFest();
  const [copied, setCopied] = useState(false);

  // Dynamically look up the event
  const currentEvent = useMemo(() => {
    return (
      events.find((e) => e.id.toLowerCase() === eventId.toLowerCase()) ||
      events.find((e) => e.title.toLowerCase().replace(/\s+/g, '-').includes(eventId.toLowerCase()))
    );
  }, [events, eventId]);

  // Related events
  const relatedEvents = useMemo(() => {
    if (!currentEvent) return [];
    return events
      .filter((e) => e.id !== currentEvent.id)
      .slice(0, 3);
  }, [events, currentEvent]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!currentEvent) {
    return (
      <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-cyan-400 mb-4">
          <Info className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-white uppercase">
          Event Not Found
        </h2>
        <p className="text-xs sm:text-sm text-white/50 font-body mt-2 max-w-md">
          The requested event may have been updated or does not exist in the active Srishti 2.7 schedule.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onBackToEvents}
            className="px-5 py-2.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            Browse All Events
          </button>
          <button
            onClick={onBackToHome}
            className="px-5 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white/80 font-body font-semibold text-xs transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased select-none pb-24 overflow-x-hidden">
      
      {/* =============================================
          TOP STICKY NAVIGATION BAR
          ============================================= */}
      <header className="sticky top-0 z-50 bg-[#050608]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToEvents}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-body font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Events</span>
          </button>

          <span className="text-white/20 hidden sm:inline">/</span>

          <span className="font-body text-xs text-white/50 truncate max-w-[200px] sm:max-w-xs hidden sm:inline">
            {currentEvent.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-body font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          <button
            onClick={() => onNavigateToRegister(currentEvent.id)}
            className="px-4 py-1.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(56,189,248,0.35)]"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* =============================================
          EVENT HERO BANNER
          ============================================= */}
      <div className="relative border-b border-white/[0.08] bg-[#07090E] overflow-hidden">
        
        {/* Dynamic Event Background Image / Ambient Blur */}
        {currentEvent.image && (
          <div className="absolute inset-0 z-0 opacity-20 filter blur-xl scale-105 pointer-events-none">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050608]/80 via-[#050608]/95 to-[#050608] z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* LEFT: Meta & Title */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-technical text-xs font-bold uppercase tracking-wider">
                  {currentEvent.category}
                </span>

                <span className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-white/70 font-technical text-xs font-semibold uppercase">
                  {currentEvent.stageLabel || 'KEY EVENT'}
                </span>

                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-technical text-xs font-bold uppercase">
                  {currentEvent.fee === 0 ? 'FREE ENTRY' : `FEE: ₹${currentEvent.fee}`}
                </span>
              </div>

              {/* Title & Stage */}
              <div className="space-y-2">
                <h1 className="font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-[1.05]">
                  {currentEvent.title}
                </h1>
                {currentEvent.subtitle && (
                  <p className="font-body text-base sm:text-lg text-white/60 font-medium">
                    {currentEvent.subtitle}
                  </p>
                )}
              </div>

              {/* Highlight Punchline */}
              {currentEvent.highlightText && (
                <div className="p-4 rounded-xl bg-white/[0.03] border-l-4 border-cyan-400 border-t border-r border-b border-white/[0.06]">
                  <p className="text-xs sm:text-sm text-cyan-100 font-body font-medium leading-relaxed">
                    "{currentEvent.highlightText}"
                  </p>
                </div>
              )}

              {/* Meta Quick Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="block text-[9px] font-technical text-white/40 uppercase tracking-wider">
                    SCHEDULE TIME
                  </span>
                  <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">
                    {currentEvent.time}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="block text-[9px] font-technical text-white/40 uppercase tracking-wider">
                    CAMPUS VENUE
                  </span>
                  <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">
                    {currentEvent.venue}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="block text-[9px] font-technical text-white/40 uppercase tracking-wider">
                    PRIZE POOL
                  </span>
                  <span className="font-body font-bold text-xs sm:text-sm text-gradient-27 mt-0.5 block">
                    {currentEvent.prize || 'Certificates & Awards'}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                  <span className="block text-[9px] font-technical text-white/40 uppercase tracking-wider">
                    HOST DEPARTMENT
                  </span>
                  <span className="font-body font-semibold text-xs sm:text-sm text-white mt-0.5 block">
                    CS Department
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: Featured Media Poster Card */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0A0D14] shadow-2xl group">
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-black/40">
                  <img
                    src={
                      currentEvent.image ||
                      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={currentEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-technical text-cyan-300">
                    SRISHTI 2.7 EXCLUSIVE
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-technical border-b border-white/[0.06] pb-3">
                    <span className="text-white/40 uppercase">REGISTRATION STATUS</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      OPEN NOW
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigateToRegister(currentEvent.id)}
                    className="w-full py-3 rounded-xl bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Registration</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =============================================
          EVENT DEEP DIVE BODY CONTENT
          ============================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Detailed Description, Rules, and Deliverables */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Section 1: Detailed Overview */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white uppercase tracking-tight flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>ABOUT THIS EVENT</span>
              </h2>

              <div className="prose prose-invert max-w-none text-xs sm:text-sm text-white/70 font-body leading-relaxed space-y-3">
                <p>{currentEvent.description}</p>
                <p>
                  Participants will be provided with industry-standard development and execution environments. Mentors and jury members from tech startups and academic institutions will evaluate solutions based on technical depth, execution speed, innovation, and presentation clarity.
                </p>
              </div>
            </div>

            {/* Section 2: Key Highlights & Outcomes */}
            {currentEvent.highlights && currentEvent.highlights.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>KEY HIGHLIGHTS & OUTCOMES</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentEvent.highlights.map((h, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#0A0D14] border border-white/[0.06] flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs font-body text-white/80 leading-relaxed font-medium">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section 3: Rules & Regulations */}
            <div className="space-y-4">
              <h3 className="font-display font-bold text-lg sm:text-xl text-white uppercase tracking-tight flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>GENERAL GUIDELINES & RULES</span>
              </h3>

              <div className="p-5 rounded-xl bg-[#0A0D14] border border-white/[0.08] space-y-3 text-xs font-body text-white/70 leading-relaxed">
                <ul className="space-y-2.5 list-disc pl-4">
                  <li>Valid physical College/University ID card is mandatory for all team members upon entry.</li>
                  <li>Participants must report to the designated venue at least 20 minutes prior to the scheduled start time.</li>
                  <li>Use of unauthorized code libraries or plagiarism will result in immediate disqualification.</li>
                  <li>The decision of the jury panel and event coordinators is final and binding.</li>
                  <li>E-Certificates will be issued to all verified participants, and cash prizes will be awarded during the valedictory ceremony.</li>
                </ul>
              </div>
            </div>

            {/* Tags Cloud */}
            {currentEvent.tags && currentEvent.tags.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-technical text-white/40 uppercase tracking-wider font-semibold block">
                  ASSOCIATED DOMAINS & SKILLS
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentEvent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-technical text-white/60"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Coordinator Card & Related Events */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Coordinator Card */}
            <div className="p-6 rounded-2xl bg-[#0A0D14] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="space-y-1">
                <span className="text-[10px] font-technical text-cyan-400 uppercase font-semibold">
                  EVENT IN-CHARGE
                </span>
                <h4 className="font-display font-bold text-lg text-white">
                  {currentEvent.speaker?.name || 'Festival Coordinator'}
                </h4>
                <p className="text-xs text-white/50 font-body">
                  {currentEvent.speaker?.role || 'Srishti 2.7 Event Committee'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] space-y-2 text-xs font-body">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Venue: {currentEvent.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentEvent.time}</span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToRegister(currentEvent.id)}
                className="w-full py-2.5 rounded-lg bg-gradient-27 text-white font-body font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.35)]"
              >
                <span>Register for {currentEvent.title.split(' ')[0]}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Related Events Widget */}
            {relatedEvents.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#0A0D14] border border-white/[0.08] space-y-4 shadow-xl">
                <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  EXPLORE OTHER EVENTS
                </h4>

                <div className="space-y-3">
                  {relatedEvents.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        if (onSelectEventDetail) {
                          onSelectEventDetail(rel.id);
                        } else {
                          window.location.hash = `event/${rel.id}`;
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-400/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-[10px] font-technical text-white/40 mb-1">
                        <span className="text-cyan-400 uppercase font-semibold">{rel.category}</span>
                        <span>{rel.fee === 0 ? 'FREE' : `₹${rel.fee}`}</span>
                      </div>
                      <h5 className="font-body font-semibold text-xs text-white group-hover:text-cyan-200 transition-colors">
                        {rel.title}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
