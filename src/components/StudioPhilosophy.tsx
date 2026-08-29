import React from 'react';
import { Award, Zap, Users, ShieldCheck } from 'lucide-react';

export const StudioPhilosophy: React.FC = () => {
  return (
    <section
      id="philosophy"
      className="relative w-full py-24 sm:py-32 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.08] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Tag */}
        <div className="mb-8">
          <span className="text-[10px] md:text-[11px] font-technical text-white/40 tracking-widest uppercase block font-semibold">
            04 // ABOUT SRISHTI
          </span>
        </div>

        {/* Main Quote Statement */}
        <div className="max-w-5xl space-y-6">
          <h2 className="font-impact font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.88] text-white">
            <span className="philosophy-text-line block">WHERE CODE MEETS</span>
            <span className="philosophy-text-line block font-serif italic font-normal text-gradient-27 lowercase text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] my-2">
              creativity.
            </span>
            <span className="philosophy-text-line block">THAT IS SRISHTI.</span>
          </h2>

          <p className="philosophy-text-line text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-3xl text-white/60 pt-4">
            Srishti is the flagship techno-cultural fest of the Computer Science Department at St. Thomas College. Since its inception, Srishti has been a crucible where innovation, competitive spirit, and collaborative energy collide across hackathons, cybersecurity operations, creative showcases, and cultural celebrations.
          </p>
        </div>

        {/* Fest Metrics Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/[0.08]">
          <div className="philosophy-metric-card p-6 rounded-lg bg-[#0A0D14] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-technical tracking-wider uppercase font-semibold">Editions</span>
            </div>
            <span className="font-impact font-black text-4xl md:text-5xl block text-white tracking-tight">7th</span>
            <span className="text-xs font-body text-white/40 uppercase block">Year of Srishti</span>
          </div>

          <div className="philosophy-metric-card p-6 rounded-lg bg-[#0A0D14] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-technical tracking-wider uppercase font-semibold">Events</span>
            </div>
            <span className="font-impact font-black text-4xl md:text-5xl block text-white tracking-tight">15+</span>
            <span className="text-xs font-body text-white/40 uppercase block">Technical & Cultural</span>
          </div>

          <div className="philosophy-metric-card p-6 rounded-lg bg-[#0A0D14] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-technical tracking-wider uppercase font-semibold">Reach</span>
            </div>
            <span className="font-impact font-black text-4xl md:text-5xl block text-white tracking-tight">500+</span>
            <span className="text-xs font-body text-white/40 uppercase block">Participants</span>
          </div>

          <div className="philosophy-metric-card p-6 rounded-lg bg-[#0A0D14] border border-white/[0.06] space-y-2">
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-technical tracking-wider uppercase font-semibold">Prizes</span>
            </div>
            <span className="font-impact font-black text-4xl md:text-5xl block text-gradient-27 tracking-tight">₹50K+</span>
            <span className="text-xs font-body text-white/40 uppercase block">Prize Pool</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioPhilosophy;

