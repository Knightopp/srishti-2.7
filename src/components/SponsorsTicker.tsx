import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Globe } from 'lucide-react';
import { useFest } from '../context/FestContext';

gsap.registerPlugin(ScrollTrigger);

export const SponsorsTicker: React.FC = () => {
  const { sponsors } = useFest();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Bi-directional header scrub animation
      gsap.fromTo(
        '.sponsors-header-content',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            end: 'top 65%',
            scrub: 0.5,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Double the sponsors list to create seamless 100% infinite marquee loop
  const marqueeItems = sponsors.length > 0 ? [...sponsors, ...sponsors] : [];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 bg-[#09090c] border-t border-b border-white/10 overflow-hidden select-none"
    >
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-[#0077ff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Tag */}
      <div className="sponsors-header-content text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
          <span>POWERED BY OUR SPONSORS & PARTNERS</span>
        </div>
      </div>

      {/* INFINITE MOVING MARQUEE TICKER CONTAINER */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left & Right Fade Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090c] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090c] to-transparent z-20 pointer-events-none" />

        <div className="animate-infinite-marquee gap-6 px-4">
          {marqueeItems.map((sponsor, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#121217]/90 border border-white/10 hover:border-white/30 backdrop-blur-xl shadow-xl transition-all duration-300 shrink-0 cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300"
                style={{ borderColor: `${sponsor.accentColor || '#0077ff'}30` }}
              >
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain" />
                ) : (
                  <Globe className="w-5 h-5 text-[#0077ff]" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-syne font-bold text-base text-white tracking-tight group-hover:text-[#0077ff] transition-colors">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[9px] font-mono font-black tracking-wider px-2 py-0.5 rounded-full border bg-white/5 uppercase"
                    style={{
                      color: sponsor.accentColor || '#00e5ff',
                      borderColor: `${sponsor.accentColor || '#00e5ff'}40`,
                    }}
                  >
                    {sponsor.badge}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-white/40 block">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsTicker;
