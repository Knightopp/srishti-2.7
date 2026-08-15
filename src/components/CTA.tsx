import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onNavigateToRegister?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onNavigateToRegister }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Bi-Directional Entrance & Exit animation for CTA Content
      gsap.fromTo(
        '.cta-content-box',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  const handleExplodeMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const button = e.currentTarget;
    const explode = button.querySelector('.explode') as HTMLElement;
    if (!explode) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    explode.style.left = `${x}px`;
    explode.style.top = `${y}px`;
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative w-full py-32 bg-[#0b0b0b] text-[#f5f5f7] border-t border-white/10 select-none overflow-hidden"
    >
      {/* Background Accent Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0077ff]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="cta-content-box max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-xs font-mono text-[#0077ff] tracking-widest uppercase block mb-4 font-bold">
          06 / REGISTER FOR SRISHTI 2.7
        </span>

        <h2 className="font-syne text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-[0.9] text-white max-w-6xl mx-auto">
          Ready To <br />
          <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase text-5xl sm:text-7xl md:text-9xl lg:text-[10rem]">
            join us?
          </span>
        </h2>

        <p className="mt-8 text-base md:text-xl text-white/60 font-light max-w-xl mx-auto">
          Grab your spot at Srishti 2.7. Register now for hackathons, workshops, competitions, and an unforgettable techno-cultural experience.
        </p>

        {/* Buttons Group */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="#register"
            onClick={(e) => {
              if (onNavigateToRegister) {
                e.preventDefault();
                onNavigateToRegister();
              }
            }}
            onMouseMove={handleExplodeMove}
            className="btn-outcrowd px-8 py-4 bg-[#0077ff] text-white font-syne text-sm font-bold tracking-wider uppercase border border-[#0077ff] shadow-2xl shadow-[#0077ff]/30"
          >
            <div className="explode" />
            <div className="btn-content">
              <Mail className="w-4 h-4" />
              <span>Official Event Registration</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          <a
            href="#roadmap"
            onMouseMove={handleExplodeMove}
            className="btn-outcrowd px-8 py-4 border border-white/20 text-white font-syne text-sm font-bold tracking-wider uppercase hover:border-white"
          >
            <div className="explode" />
            <div className="btn-content">
              <Calendar className="w-4 h-4 text-[#0077ff]" />
              <span>View Full Schedule</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
