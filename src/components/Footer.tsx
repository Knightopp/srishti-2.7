import { ArrowUp } from 'lucide-react';
import srishtiLogo from '../assets/images/srishti-logo.png';
import { getRegistrationUrl } from '../config/links';

interface FooterProps {
  onNavigateToAdmin?: () => void;
  onNavigateToEvents?: () => void;
  onNavigateToSchedule?: () => void;
  onNavigateToContact?: () => void;
  onNavigateToRegister?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigateToAdmin,
  onNavigateToEvents,
  onNavigateToSchedule,
  onNavigateToContact,
  onNavigateToRegister,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050608] text-[#E8E8EC] border-t border-white/[0.06] py-16 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-12">
        {/* Top Row: Brand & Info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 p-1 flex items-center justify-center shrink-0">
                <img
                  src={srishtiLogo}
                  alt="Srishti Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white flex items-center leading-none">
                srishti<span className="text-gradient-27 font-technical font-black ml-1">2.7</span>
              </span>
            </div>
            <p className="text-xs text-white/40 font-light">
              Flagship Techno-Cultural Fest · CS Department · St. Thomas College (Autonomous), Thrissur
            </p>
          </div>

          {/* Event Details */}
          <div className="flex flex-wrap gap-5 text-[10px] font-body text-white/40">
            <span>ST. THOMAS COLLEGE</span>
            <span className="text-white/10">·</span>
            <span>DECEMBER 4–5, 2026</span>
            <span className="text-white/10">·</span>
            <span>CS DEPARTMENT</span>
          </div>
        </div>

        {/* Middle Row: Navigation & Social Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-body font-medium uppercase tracking-wider text-white/40">
          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-semibold">Pages</span>
            <a
              href="#events"
              onClick={(e) => {
                if (onNavigateToEvents) {
                  e.preventDefault();
                  onNavigateToEvents();
                }
              }}
              className="block hover:text-white/80 transition-colors cursor-pointer"
            >
              Events Hub
            </a>
            <a
              href="#schedule"
              onClick={(e) => {
                if (onNavigateToSchedule) {
                  e.preventDefault();
                  onNavigateToSchedule();
                }
              }}
              className="block hover:text-white/80 transition-colors cursor-pointer"
            >
              Schedule & Map
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                if (onNavigateToContact) {
                  e.preventDefault();
                  onNavigateToContact();
                }
              }}
              className="block hover:text-white/80 transition-colors cursor-pointer"
            >
              Contact Desk
            </a>
            <a href="#gallery" className="block hover:text-white/80 transition-colors">
              Gallery
            </a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-semibold">Social Media</span>
            <a href="https://instagram.com/srishti_stthomas" target="_blank" rel="noreferrer" className="block hover:text-white/80 transition-colors">Instagram</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="block hover:text-white/80 transition-colors">YouTube</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="block hover:text-white/80 transition-colors">LinkedIn</a>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-body text-white/20 tracking-wider block font-semibold">Quick Connect</span>
            <a href="mailto:srishti@stthomas.ac.in" className="block hover:text-white/80 transition-colors">Email Support</a>
            <a
              href={getRegistrationUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              className="block text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              Register Passes →
            </a>
            <a
              href="https://maps.app.goo.gl/Ngzox3SYdTJLwHes9"
              target="_blank"
              rel="noreferrer"
              className="block hover:text-white/80 transition-colors"
            >
              Campus Location ↗
            </a>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-body text-white/20 tracking-wider block font-semibold mb-3">Back to Top</span>
              <button
                onClick={scrollToTop}
                className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-[#2563EB] hover:border-[#2563EB] text-white/40 hover:text-white transition-all group cursor-pointer"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-[10px] font-body text-white/30 gap-4">
          <span>© {new Date().getFullYear()} SRISHTI 2.7 · CS DEPARTMENT · ST. THOMAS COLLEGE (AUTONOMOUS)</span>
          <span 
            onClick={() => {
              if (onNavigateToAdmin) {
                onNavigateToAdmin();
              }
            }}
            className="cursor-pointer hover:text-white/60 transition-colors font-technical"
          >
            DESIGNED WITH ❤ BY THE SRISHTI TEAM
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
