import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onNavigateToRegister?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onNavigateToRegister }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content-box',
        { y: 50, opacity: 0, scale: 0.97 },
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
      className="relative w-full py-32 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.06] select-none overflow-hidden"
    >
      <div className="cta-content-box max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-[10px] font-body font-medium text-[#2563EB] tracking-wider uppercase block mb-4">
          05 / Register for Srishti 2.7
        </span>

        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.9] text-white/90 max-w-5xl mx-auto">
          Ready To <br />
          <span className="font-serif-custom italic font-normal text-[#2563EB] lowercase text-5xl sm:text-7xl md:text-8xl lg:text-[9rem]">
            join us?
          </span>
        </h2>

        <p className="mt-8 text-sm md:text-lg text-white/35 font-light max-w-xl mx-auto">
          Grab your spot at Srishti 2.7. Register now for hackathons, workshops, competitions, and an unforgettable techno-cultural experience.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#register"
            onClick={(e) => {
              if (onNavigateToRegister) {
                e.preventDefault();
                onNavigateToRegister();
              }
            }}
            onMouseMove={handleExplodeMove}
            className="btn-outcrowd px-7 py-3.5 bg-[#2563EB] text-white font-body text-sm font-semibold tracking-wider uppercase border border-[#2563EB]"
          >
            <div className="explode" />
            <div className="btn-content">
              <span>Register Now</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </a>

          <a
            href="#roadmap"
            className="px-7 py-3.5 border border-white/[0.1] rounded-md text-white/50 font-body text-sm font-medium tracking-wider uppercase hover:border-white/20 hover:text-white/80 transition-all duration-300 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-white/30" />
            <span>View Schedule</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
