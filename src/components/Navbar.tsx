import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface NavbarProps {
  onNavigateToRegister?: () => void;
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToRegister,
  onNavigateToAdmin: _onNavigateToAdmin,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const secondaryGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const ctx = gsap.context(() => {
      // Create master scrub timeline synced to the 1200px Hero zoom
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=1200',
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // 1. Smoothly morph header capsule — shrinks to fit only permanent items
      tl.to(
        headerRef.current,
        {
          maxWidth: '540px',
          borderRadius: '9999px',
          paddingLeft: '18px',
          paddingRight: '18px',
          paddingTop: '8px',
          paddingBottom: '8px',
          backgroundColor: 'rgba(8, 12, 20, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.14)',
          ease: 'power1.inOut',
          duration: 1.0,
        },
        0.0
      );

      // 2. Secondary nav links fade out (opacity first, then collapse width)
      if (secondaryGroupRef.current) {
        tl.to(
          secondaryGroupRef.current,
          { opacity: 0, ease: 'power2.out', duration: 0.30 },
          0.0
        );
        tl.to(
          secondaryGroupRef.current,
          {
            width: 0,
            minWidth: 0,
            paddingLeft: 0,
            paddingRight: 0,
            gap: 0,
            ease: 'power1.inOut',
            duration: 0.40,
          },
          0.25
        );
      }
    });

    return () => ctx.revert();
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

  return (
    <>
      {/* =============================================
          FLOATING ROUNDED NAVBAR (SMOOTH FADE + EQUAL GAPS)
          ============================================= */}
      <div className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <header
          ref={headerRef}
          style={{
            maxWidth: '980px',
            width: '100%',
            borderRadius: '16px',
            paddingTop: '11px',
            paddingBottom: '11px',
            paddingLeft: '22px',
            paddingRight: '22px',
            backgroundColor: 'rgba(8, 12, 20, 0.82)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
          }}
          className="global-navbar pointer-events-auto backdrop-blur-2xl border shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex items-center justify-between select-none will-change-transform h-14 overflow-hidden"
        >
          {/* COL 1 — Brand Logo, fixed left */}
          <a href="#" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] p-1 flex items-center justify-center transition-all duration-200 group-hover:border-cyan-400/40 shrink-0">
              <img
                src="/srishti-logo-transparent.png"
                alt="Srishti Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-white flex items-center leading-none whitespace-nowrap">
              srishti
              <span className="text-gradient-27 font-technical font-black ml-1">2.7</span>
            </span>
          </a>

          {/* COL 2 — Nav links, fills center, perfectly centered */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-5 text-xs font-body font-semibold uppercase tracking-wider text-white/50">
            <a href="#cases" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Events
            </a>
            <a href="#roadmap" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Schedule
            </a>
            <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
              Contact
            </a>

            {/* Collapsible secondary links */}
            <div
              ref={secondaryGroupRef}
              className="flex items-center gap-5 overflow-hidden whitespace-nowrap"
            >
              <a href="#gallery" className="hover:text-white transition-colors shrink-0">
                Gallery
              </a>
              <a href="#philosophy" className="hover:text-white transition-colors shrink-0">
                About
              </a>
            </div>
          </nav>

          {/* COL 3 — Register button, fixed right, always visible */}
          <div className="hidden md:flex items-center shrink-0">
            <a
              href="#register"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              className="px-4 py-2 rounded-full bg-gradient-27-glow text-white font-body text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shrink-0 leading-none whitespace-nowrap"
            >
              <span>Register</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-2 h-full">
            <a
              href="#register"
              onClick={(e) => {
                if (onNavigateToRegister) {
                  e.preventDefault();
                  onNavigateToRegister();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-gradient-27 text-white font-body text-[11px] font-bold uppercase tracking-wider leading-none flex items-center justify-center"
            >
              Register
            </a>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </header>
      </div>

      {/* FULLSCREEN MOBILE MENU DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-[#050608]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 pt-24 transition-all duration-300 md:hidden ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-1 my-auto">
          <span className="text-[10px] font-technical text-white/30 tracking-widest uppercase font-semibold mb-4 px-2">
            NAVIGATION MATRIX
          </span>

          {[
            { href: '#cases', label: 'Events', number: '01' },
            { href: '#roadmap', label: 'Schedule', number: '02' },
            { href: '#gallery', label: 'Gallery', number: '03' },
            { href: '#philosophy', label: 'About', number: '04' },
            { href: '#contact', label: 'Contact', number: '05' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-3.5 border-b border-white/[0.04] text-white/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-technical text-cyan-400 font-bold">{link.number}</span>
                <span className="font-display font-bold text-lg text-white uppercase tracking-tight">
                  {link.label}
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/30" />
            </a>
          ))}
        </div>

        <div className="pt-6 border-t border-white/[0.06] space-y-3">
          <div className="flex items-center justify-between text-[10px] font-technical text-white/40">
            <span>SRISHTI 2.7 • ST. THOMAS COLLEGE</span>
            <span>DEC 4–5, 2026</span>
          </div>

          <a
            href="#register"
            onClick={(e) => {
              if (onNavigateToRegister) {
                e.preventDefault();
                onNavigateToRegister();
              }
              setIsMenuOpen(false);
            }}
            className="w-full py-3 text-center bg-gradient-27-glow text-white font-body font-bold uppercase text-xs rounded-xl flex items-center justify-center gap-2"
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
