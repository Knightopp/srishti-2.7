import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Mail, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const CTA: React.FC = () => {
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
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#635bff]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="cta-content-box max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-xs font-mono text-[#635bff] tracking-widest uppercase block mb-4 font-bold">
          05 / START A CONVERSATION
        </span>

        <h2 className="font-syne text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight uppercase leading-[0.9] text-white max-w-6xl mx-auto">
          Have a Project <br />
          <span className="font-serif-custom italic font-normal text-[#635bff] lowercase text-5xl sm:text-7xl md:text-9xl lg:text-[10rem]">
            in mind?
          </span>
        </h2>

        <p className="mt-8 text-base md:text-xl text-white/60 font-light max-w-xl mx-auto">
          Let’s build a digital product that elevates your brand and engages users with cinematic motion.
        </p>

        {/* Buttons Group */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <a
            href="mailto:hello@outcrowd.io"
            onMouseMove={handleExplodeMove}
            className="btn-outcrowd px-8 py-4 bg-[#635bff] text-white font-syne text-sm font-bold tracking-wider uppercase border border-[#635bff] shadow-2xl shadow-[#635bff]/30"
          >
            <div className="explode" />
            <div className="btn-content">
              <Mail className="w-4 h-4" />
              <span>hello@outcrowd.io</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          <a
            href="#"
            onMouseMove={handleExplodeMove}
            className="btn-outcrowd px-8 py-4 border border-white/20 text-white font-syne text-sm font-bold tracking-wider uppercase hover:border-white"
          >
            <div className="explode" />
            <div className="btn-content">
              <Calendar className="w-4 h-4 text-[#635bff]" />
              <span>Book a 15-min Call</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
