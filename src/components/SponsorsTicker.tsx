import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Shield, Cpu, Flame, Layers, Globe, Terminal, Box } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface Sponsor {
  name: string;
  category: string;
  badge: string;
  icon: React.ReactNode;
  accentColor: string;
}

const SPONSORS: Sponsor[] = [
  {
    name: 'Vercel',
    category: 'Cloud & Edge Hosting',
    badge: 'DIAMOND',
    icon: <Globe className="w-5 h-5 text-white" />,
    accentColor: '#ffffff',
  },
  {
    name: 'Supabase',
    category: 'Backend & Realtime Data',
    badge: 'DIAMOND',
    icon: <Flame className="w-5 h-5 text-[#3ecf8e]" />,
    accentColor: '#3ecf8e',
  },
  {
    name: 'Stripe',
    category: 'Financial Infrastructure',
    badge: 'PLATINUM',
    icon: <Shield className="w-5 h-5 text-[#635bff]" />,
    accentColor: '#635bff',
  },
  {
    name: 'Figma',
    category: 'Design Systems',
    badge: 'PLATINUM',
    icon: <Layers className="w-5 h-5 text-[#ff7262]" />,
    accentColor: '#ff7262',
  },
  {
    name: 'OpenAI',
    category: 'Generative Intelligence',
    badge: 'TITANIUM',
    icon: <Cpu className="w-5 h-5 text-[#10a37f]" />,
    accentColor: '#10a37f',
  },
  {
    name: 'Linear',
    category: 'Product Engineering',
    badge: 'GOLD',
    icon: <Box className="w-5 h-5 text-[#5e6ad2]" />,
    accentColor: '#5e6ad2',
  },
  {
    name: 'GitHub',
    category: 'Developer Platform',
    badge: 'GOLD',
    icon: <Terminal className="w-5 h-5 text-[#d4ff00]" />,
    accentColor: '#d4ff00',
  },
  {
    name: 'Spline 3D',
    category: 'Spatial Design & WebGL',
    badge: 'FEATURED',
    icon: <Sparkles className="w-5 h-5 text-[#00e5ff]" />,
    accentColor: '#00e5ff',
  },
];

export const SponsorsTicker: React.FC = () => {
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
  const marqueeItems = [...SPONSORS, ...SPONSORS];

  return (
    <section
      ref={containerRef}
      className="relative w-full py-16 bg-[#09090c] border-t border-b border-white/10 overflow-hidden select-none"
    >
      {/* Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-[#635bff]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Tag */}
      <div className="sponsors-header-content text-center mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#d4ff00]" />
          <span>POWERED BY GLOBAL TECH PARTNERS & SPONSORS</span>
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
                className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                style={{ borderColor: `${sponsor.accentColor}30` }}
              >
                {sponsor.icon}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-syne font-bold text-base text-white tracking-tight group-hover:text-[#635bff] transition-colors">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[9px] font-mono font-black tracking-wider px-2 py-0.5 rounded-full border bg-white/5 uppercase"
                    style={{
                      color: sponsor.accentColor,
                      borderColor: `${sponsor.accentColor}40`,
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
