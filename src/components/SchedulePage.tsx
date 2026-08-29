import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import TimelineRoadmap from './TimelineRoadmap';

interface SchedulePageProps {
  onBackToHome: () => void;
  onNavigateToRegister: (eventId?: string) => void;
  onNavigateToEventDetail?: (eventId: string) => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({
  onBackToHome,
  onNavigateToRegister,
  onNavigateToEventDetail,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#050608] text-[#E8E8EC] antialiased select-none pb-20 overflow-x-hidden">
      {/* TOP STICKY NAVBAR */}
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
          <span>Register Pass</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* RENDER TIMELINE ROADMAP & CAMPUS MAP */}
      <TimelineRoadmap
        onNavigateToRegister={onNavigateToRegister}
        onNavigateToEventDetail={onNavigateToEventDetail}
      />
    </div>
  );
};

export default SchedulePage;
