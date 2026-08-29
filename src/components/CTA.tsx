import React from 'react';
import { ArrowUpRight, Calendar } from 'lucide-react';

interface CTAProps {
  onNavigateToRegister?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onNavigateToRegister }) => {
  return (
    <section
      id="cta"
      className="relative w-full py-24 sm:py-32 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.08] select-none overflow-hidden"
    >
      <div className="cta-content-box max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-[10px] md:text-[11px] font-technical text-white/40 tracking-widest uppercase block mb-4 font-semibold">
          05 // REGISTRATION PORTAL
        </span>

        <h2 className="font-impact font-black text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.92] text-white max-w-5xl mx-auto">
          READY TO <br />
          <span className="inline-block font-serif italic font-normal text-gradient-27 lowercase text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] my-1 leading-[1.1] pb-3 pr-3 overflow-visible">
            join us?
          </span>
        </h2>

        <p className="mt-8 text-sm md:text-base text-white/50 font-light max-w-xl mx-auto">
          Grab your spot at Srishti 2.7. Register now for hackathons, workshops, competitions, and an unforgettable techno-cultural experience.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            onClick={(e) => {
              if (onNavigateToRegister) {
                e.preventDefault();
                onNavigateToRegister();
              }
            }}
            className="px-8 py-3.5 bg-gradient-27-glow text-white font-body text-xs font-bold tracking-wider uppercase rounded hover:scale-105 transition-transform cursor-pointer flex items-center gap-2"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a
            href="#roadmap"
            className="px-8 py-3.5 border border-white/[0.12] rounded text-white/70 font-body text-xs font-semibold tracking-wider uppercase hover:border-white/30 hover:text-white transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white/40" />
            <span>View Schedule</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
