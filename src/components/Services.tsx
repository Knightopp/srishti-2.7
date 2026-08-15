import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Palette, Code2, Film, Compass, ChevronRight, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  icon: React.ReactNode;
  deliverables: string[];
  description: string;
}

const SERVICES: ServiceItem[] = [
  {
    id: 'branding',
    number: '01',
    title: 'Branding & Identity',
    tagline: 'Crafting unforgettable brand worlds that resonate.',
    icon: <Palette className="w-6 h-6 text-[#0077ff]" />,
    deliverables: ['Brand Strategy', 'Logo & Visual Identity', '3D Design Language', 'Brand Guidelines'],
    description: 'We turn emerging startups and market leaders into high-value brands with bespoke visual systems, logo marks, and cohesive design languages.',
  },
  {
    id: 'development',
    number: '02',
    title: 'Web & App Development',
    tagline: 'Building ultra-fast, responsive digital products.',
    icon: <Code2 className="w-6 h-6 text-[#00e5ff]" />,
    deliverables: ['React & Next.js Platforms', 'Tailwind & Motion Systems', 'Web Applications', 'API Integration'],
    description: 'Engineering high-performance web applications and digital interfaces with clean architecture, sub-second load times, and flawless responsiveness.',
  },
  {
    id: 'motion',
    number: '03',
    title: 'Motion & Scrollytelling',
    tagline: 'Turning passive scroll into an interactive narrative.',
    icon: <Film className="w-6 h-6 text-[#00e5ff]" />,
    deliverables: ['GSAP ScrollTrigger', 'Lenis Inertia Scroll', 'Custom 3D Animations', 'Interactive Prototypes'],
    description: 'Creating cinematic web experiences where scroll position controls animation timelines, turning brand stories into engaging visual journeys.',
  },
  {
    id: 'strategy',
    number: '04',
    title: 'Product Strategy & UX',
    tagline: 'Structuring retention-driven user experiences.',
    icon: <Compass className="w-6 h-6 text-[#00d4ff]" />,
    deliverables: ['User Research', 'Information Architecture', 'High-Fidelity Wireframes', 'Conversion Optimization'],
    description: 'Applying user journey mapping to structure seamless interfaces that guide visitors toward conversion, retain users, and drive long-term value.',
  },
];

export const Services: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('branding');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered title word reveal on scroll enter
      gsap.from('.service-title-word', {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full py-28 bg-[#0b0b0b] text-[#f5f5f7] border-t border-white/10 select-none"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-20">
          <span className="text-xs font-mono text-[#635bff] tracking-widest uppercase block mb-3 font-semibold">
            03 / OUR CAPABILITIES
          </span>
          <h2 className="font-syne text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white uppercase leading-[0.95]">
            <span className="service-title-word inline-block mr-3">Services</span>
            <span className="font-serif-custom italic font-normal text-[#635bff] lowercase text-5xl sm:text-7xl md:text-9xl mx-2">
              engineered
            </span>
            <br className="hidden sm:block" />
            <span className="service-title-word inline-block">For Conversion</span>
          </h2>
        </div>

        {/* Interactive Accordion / Cards List */}
        <div className="space-y-4">
          {SERVICES.map((item) => {
            const isOpen = activeId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setActiveId(item.id)}
                className={`rounded-3xl border transition-all duration-500 overflow-hidden cursor-pointer ${
                  isOpen
                    ? 'bg-gradient-to-r from-[#141418] via-[#111115] to-[#0b0b0b] border-[#635bff]/50 p-8 md:p-12 shadow-2xl shadow-[#635bff]/10'
                    : 'bg-[#121215]/60 border-white/10 p-6 md:p-8 hover:bg-[#16161b] hover:border-white/20'
                }`}
              >
                {/* Accordion Header Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 md:gap-8">
                    <span className="font-syne font-black text-2xl md:text-4xl text-white/30">
                      {item.number}
                    </span>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-syne text-xl md:text-3xl font-bold text-white tracking-tight uppercase">
                        {item.title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/50 font-light mt-1 hidden sm:block">
                        {item.tagline}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#635bff] border-[#635bff] text-white rotate-90'
                        : 'border-white/20 text-white/60 group-hover:border-white'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>

                {/* Expanded Content Section */}
                {isOpen && (
                  <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
                    <div className="lg:col-span-7 space-y-4">
                      <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-4">
                        <span className="text-xs font-mono text-[#635bff] tracking-widest uppercase block mb-3 font-semibold">
                          DELIVERABLES & OUTPUTS
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {item.deliverables.map((del, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white/80"
                            >
                              <CheckCircle2 className="w-4 h-4 text-[#635bff] shrink-0" />
                              <span>{del}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#0b0b0b] rounded-2xl border border-white/10 p-6 flex flex-col justify-between h-full space-y-6">
                      <div className="flex items-center justify-between text-xs font-mono text-white/40">
                        <span>ESTIMATED TIMELINE</span>
                        <span className="text-[#635bff] font-bold">2 - 4 WEEKS</span>
                      </div>
                      <p className="text-xs text-white/60 font-light">
                        Every project begins with full user journey mapping before motion engineering.
                      </p>
                      <a
                        href="#cta"
                        className="w-full py-3 rounded-full bg-[#635bff] text-white font-syne font-semibold text-xs text-center uppercase tracking-wider hover:bg-[#7952eb] transition-colors"
                      >
                        Start {item.title}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
