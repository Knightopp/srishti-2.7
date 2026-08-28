import React from 'react';
import { ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full bg-[#050608] text-[#E8E8EC] border-t border-white/[0.06] py-16 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Top Row: Brand & Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-white font-display font-bold text-xs">
                S
              </div>
              <span className="font-display font-semibold text-lg tracking-tight text-white/85">
                srishti<span className="font-technical text-[#2563EB] ml-0.5">2.7</span>
              </span>
            </div>
            <p className="text-xs text-white/30 font-light">
              Techno-Cultural Fest · CS Department · St. Thomas College
            </p>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap gap-5 text-[10px] font-body text-white/30">
            <span>ST. THOMAS COLLEGE</span>
            <span className="text-white/10">·</span>
            <span>DECEMBER 4–5, 2026</span>
            <span className="text-white/10">·</span>
            <span>CS DEPARTMENT</span>
          </div>
        </div>

        {/* Middle Row: Navigation & Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-body font-medium uppercase tracking-wider text-white/35">
          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-medium">Navigation</span>
            <a href="#roadmap" className="block hover:text-white/70 transition-colors">Schedule</a>
            <a href="#cases" className="block hover:text-white/70 transition-colors">Events</a>
            <a href="#gallery" className="block hover:text-white/70 transition-colors">Gallery</a>
            <a href="#philosophy" className="block hover:text-white/70 transition-colors">About</a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-medium">Social</span>
            <a href="https://instagram.com/srishti_stthomas" target="_blank" rel="noreferrer" className="block hover:text-white/70 transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="block hover:text-white/70 transition-colors">YouTube</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="block hover:text-white/70 transition-colors">LinkedIn</a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-medium">Connect</span>
            <a href="mailto:srishti@stthomas.ac.in" className="block hover:text-white/70 transition-colors">Email Us</a>
            <a href="#cta" className="block hover:text-white/70 transition-colors">Register</a>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-body text-white/20 tracking-wider block font-medium mb-3">Back to Top</span>
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-md bg-white/[0.04] border border-white/[0.06] hover:bg-[#2563EB] hover:border-[#2563EB] text-white/40 hover:text-white transition-all group"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[10px] font-body text-white/20 gap-4">
          <span>© {new Date().getFullYear()} SRISHTI 2.7 · CS DEPARTMENT · ST. THOMAS COLLEGE</span>
          <span 
            onClick={() => {
              if (onNavigateToAdmin) {
                onNavigateToAdmin();
              }
            }}
            className="cursor-pointer hover:text-white/40 transition-colors"
          >
            DESIGNED WITH ❤ BY THE SRISHTI TEAM
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
