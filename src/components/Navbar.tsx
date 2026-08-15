import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Menu, X, Sparkles, Calendar, Compass, Mail, Camera } from 'lucide-react';

export const Navbar: React.FC = () => {
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

  // Outcrowd Signature Liquid Explode MouseMove Handler
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
    { href: '#roadmap', label: 'Event Map', number: '01', icon: <Calendar className="w-5 h-5 text-[#635bff]" /> },
    { href: '#cases', label: 'Cases', number: '02', icon: <Sparkles className="w-5 h-5 text-[#ff5e62]" /> },
    { href: '#gallery', label: 'Gallery', number: '03', icon: <Camera className="w-5 h-5 text-[#d4ff00]" /> },
    { href: '#philosophy', label: 'About us', number: '04', icon: <Compass className="w-5 h-5 text-[#00e5ff]" /> },
    { href: '#cta', label: 'Contact', number: '05', icon: <Mail className="w-5 h-5 text-[#a855f7]" /> },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#0b0b0b]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-5 md:py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 flex items-center justify-between">
          {/* Outcrowd Brand Logo */}
          <a href="#" className="flex items-center gap-3 group relative z-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#635bff] to-[#d4ff00] flex items-center justify-center font-syne font-black text-black text-lg tracking-tighter group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#635bff]/20">
              O
            </div>
            <span className="font-syne font-bold text-lg md:text-xl tracking-tight text-white group-hover:text-[#635bff] transition-colors">
              outcrowd<span className="text-[#635bff]">.</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-syne font-semibold tracking-widest uppercase text-white/70">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-flip-wrap">
                <span className="text-default">{link.label}</span>
                <span className="text-hover">{link.label}</span>
              </a>
            ))}
          </nav>

          {/* CTA Buttons with Liquid Explode Hover Effect (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#cta"
              onMouseMove={handleExplodeMove}
              className="btn-outcrowd px-5 py-2.5 border border-white/20 text-white font-syne text-xs font-semibold tracking-wider uppercase"
            >
              <div className="explode" />
              <div className="btn-content">
                <span>Book a call</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </a>

            <a
              href="#cta"
              onMouseMove={handleExplodeMove}
              className="btn-outcrowd px-5 py-2.5 bg-[#635bff] text-white border border-[#635bff] font-syne text-xs font-semibold tracking-wider uppercase shadow-lg shadow-[#635bff]/20"
            >
              <div className="explode" />
              <div className="btn-content">
                <span>Get in touch</span>
              </div>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden relative z-50 p-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
              isMenuOpen
                ? 'bg-[#635bff] border-[#635bff] text-white rotate-90 shadow-lg shadow-[#635bff]/40'
                : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* FULLSCREEN ANIMATED MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-[#0b0b0b]/96 backdrop-blur-3xl flex flex-col justify-between p-6 sm:p-10 pt-28 transition-all duration-500 ease-out md:hidden ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-8 pointer-events-none'
        }`}
      >
        {/* Ambient Glow background inside drawer */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#635bff]/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile Nav Links List */}
        <div className="flex flex-col gap-5 relative z-10 my-auto">
          <span className="text-[11px] font-mono text-[#635bff] tracking-widest uppercase font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NAVIGATION MENU</span>
          </span>

          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#635bff] hover:bg-[#15151c] transition-all duration-300 transform ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: `${(idx + 1) * 70}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {link.icon}
                </div>
                <div>
                  <span className="font-syne font-extrabold text-2xl text-white group-hover:text-[#635bff] transition-colors uppercase tracking-tight block">
                    {link.label}
                  </span>
                  <span className="text-xs font-mono text-white/40 group-hover:text-white/60">
                    Section {link.number}
                  </span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-[#635bff] group-hover:text-white transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Mobile Drawer Footer Actions */}
        <div className="relative z-10 pt-6 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4ff00] animate-ping" />
              Srishti Summit 2026
            </span>
            <span className="text-[#635bff] font-bold">DECEMBER 3-5</span>
          </div>

          <a
            href="#cta"
            onClick={() => setIsMenuOpen(false)}
            className="w-full py-4 text-center bg-gradient-to-r from-[#635bff] to-[#7952eb] text-white font-syne font-bold uppercase text-xs rounded-full shadow-lg shadow-[#635bff]/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Book a Call & Reserve Ticket</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
