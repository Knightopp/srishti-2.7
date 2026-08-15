import React from 'react';
import { ArrowUp, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#070709] text-[#f5f5f7] border-t border-white/10 py-16 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Top Row: Brand & Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#0044ff] flex items-center justify-center text-white font-syne font-black text-xs">
                S
              </div>
              <span className="font-syne font-bold text-xl tracking-tight text-white">
                srishti<span className="text-[#00d4ff]">2.7</span>
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">
              Techno-Cultural Fest • CS Department • St. Thomas College
            </p>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap gap-6 text-xs font-mono text-white/60">
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#0077ff]" />
              <span>ST. THOMAS COLLEGE</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#d4ff00]" />
              <span>DECEMBER 4-5, 2026</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>CS DEPARTMENT</span>
            </div>
          </div>
        </div>

        {/* Middle Row: Navigation & Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-syne font-semibold uppercase tracking-wider text-white/60">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#0077ff] tracking-widest block font-bold">NAVIGATION</span>
            <a href="#roadmap" className="block hover:text-white transition-colors">Schedule</a>
            <a href="#cases" className="block hover:text-white transition-colors">Events</a>
            <a href="#gallery" className="block hover:text-white transition-colors">Gallery</a>
            <a href="#philosophy" className="block hover:text-white transition-colors">About</a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#0077ff] tracking-widest block font-bold">SOCIAL</span>
            <a href="https://instagram.com/srishti_stthomas" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">YouTube</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="block hover:text-white transition-colors">LinkedIn</a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-mono text-[#0077ff] tracking-widest block font-bold">CONNECT</span>
            <a href="mailto:srishti@stthomas.ac.in" className="block hover:text-white transition-colors">Email Us</a>
            <a href="#cta" className="block hover:text-white transition-colors">Register</a>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#0077ff] tracking-widest block font-bold mb-3">BACK TO TOP</span>
              <button
                onClick={scrollToTop}
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-[#0077ff] hover:border-[#0077ff] text-white transition-all group"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-4">
          <span>© {new Date().getFullYear()} SRISHTI 2.7 • CS DEPARTMENT • ST. THOMAS COLLEGE. ALL RIGHTS RESERVED.</span>
          <span>DESIGNED WITH ❤ BY THE SRISHTI TEAM</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
