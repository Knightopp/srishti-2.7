import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Calendar, Sparkles, Compass, Mail, Camera } from 'lucide-react';

interface NavbarProps {
  onNavigateToRegister?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToRegister,
  onNavigateToAdmin: _onNavigateToAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Liquid Explode MouseMove Handler — only for Register CTA
  const handleExplodeMove = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const button = e.currentTarget;
    const explode = button.querySelector('.explode') as HTMLElement;
    if (!explode) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    explode.style.left = `${x}px`;
    explode.style.top = `${y}px`;
  };

  const navLinks = [
    { href: '#roadmap', label: 'Schedule', number: '01', icon: <Calendar className="w-4 h-4 text-white/40" /> },
    { href: '#cases', label: 'Highlights', number: '02', icon: <Sparkles className="w-4 h-4 text-white/40" /> },
    { href: '#gallery', label: 'Gallery', number: '03', icon: <Camera className="w-4 h-4 text-white/40" /> },
    { href: '#philosophy', label: 'About', number: '04', icon: <Compass className="w-4 h-4 text-white/40" /> },
    { href: '#register', label: 'Register', number: '05', icon: <Mail className="w-4 h-4 text-white/40" />, onClick: onNavigateToRegister },
  ];

  return (
    <>
      <header
        className={`global-navbar fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3 bg-[#050608]/92 backdrop-blur-lg border-b border-white/[0.06]'
            : 'py-5 md:py-6 bg-transparent'
        }`}
      >

        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Srishti 2.7 Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group relative z-50">
            <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] p-1 flex items-center justify-center transition-all duration-300">
              <img src="/srishti-logo-transparent.png" alt="Srishti 2.7 Logo" className="w-full h-full object-contain opacity-70" />
            </div>
            <span className="font-display font-semibold text-base md:text-lg tracking-tight text-white/90">
              srishti<span className="font-technical font-bold text-[#2563EB] ml-0.5">2.7</span>
            </span>
          </a>

          {/* Desktop Navigation Links — plain typography */}
          <nav className="hidden md:flex items-center gap-7 text-[11px] font-body font-medium tracking-wider uppercase text-white/40">
            {navLinks.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                onClick={(e) => {
                  if (link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
                className="text-flip-wrap"
              >
                <span className="text-default">{link.label}</span>
                <span className="text-hover">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* CTA Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Event Highlights — secondary, restrained */}
            <a
              href="#cases"
              className="px-4 py-2 border border-white/[0.08] rounded-md text-white/50 font-body text-[11px] font-medium tracking-wider uppercase hover:border-white/20 hover:text-white/80 transition-all duration-300 flex items-center gap-2"
            >
              <span>Highlights</span>
              <ArrowUpRight className="w-3 h-3 text-white/30" />
            </a>

            {/* Register Now — primary CTA */}
            <a
              href="#register"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              onMouseMove={handleExplodeMove}
              className="btn-outcrowd px-5 py-2.5 bg-[#2563EB] text-white border border-[#2563EB] font-body text-[11px] font-semibold tracking-wider uppercase"
            >
              <div className="explode" />
              <div className="btn-content">
                <span>Register Now</span>
              </div>
            </a>
          </div>

          {/* Mobile Menu Toggle Button — simple */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden relative z-50 p-2.5 rounded-lg border transition-all duration-300 flex items-center justify-center ${
              isMenuOpen
                ? 'bg-white/10 border-white/15 text-white'
                : 'bg-white/[0.03] border-white/[0.08] text-white/70 hover:bg-white/[0.06]'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* FULLSCREEN MOBILE MENU DRAWER — editorial, clean */}
      <div
        className={`fixed inset-0 z-40 bg-[#050608]/97 backdrop-blur-xl flex flex-col justify-between p-6 sm:p-10 pt-28 transition-all duration-500 ease-out md:hidden ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        {/* Mobile Nav Links List — simple stacked links */}
        <div className="flex flex-col gap-1 relative z-10 my-auto">
          <span className="text-[10px] font-body text-white/20 tracking-wider uppercase font-medium mb-4 pl-4">
            Navigation
          </span>

          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                if (link.onClick) link.onClick();
                setIsMenuOpen(false);
              }}
              className={`group flex items-center justify-between px-4 py-4 border-b border-white/[0.05] hover:bg-white/[0.02] transition-all duration-300 ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${(idx + 1) * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-technical text-white/15">{link.number}</span>
                <span className="font-display font-bold text-xl text-white/80 group-hover:text-white transition-colors uppercase tracking-tight">
                  {link.label}
                </span>
              </div>

              <ArrowUpRight className="w-4 h-4 text-white/15 group-hover:text-white/40 transition-colors" />
            </a>
          ))}
        </div>

        {/* Mobile Drawer Footer */}
        <div className="relative z-10 pt-6 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between text-[10px] font-body text-white/25">
            <span>Srishti 2.7 — St. Thomas College</span>
            <span className="font-technical text-white/30">DEC 4–5, 2026</span>
          </div>

          <a
            href="#cta"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-3.5 text-center bg-[#2563EB] text-white font-display font-bold uppercase text-xs rounded-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span>Register Now</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
