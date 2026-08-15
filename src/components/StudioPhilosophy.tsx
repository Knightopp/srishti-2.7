import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Zap, Users, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const StudioPhilosophy: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background Theme Morph Trigger: Dark #0b0b0b -> Off-white #f5f5f7 -> Dark #0b0b0b
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          gsap.to('body', { backgroundColor: '#f5f5f7', color: '#0b0b0b', duration: 0.8, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to('body', { backgroundColor: '#0b0b0b', color: '#f5f5f7', duration: 0.8, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to('body', { backgroundColor: '#0b0b0b', color: '#f5f5f7', duration: 0.8, ease: 'power2.out' });
        },
      });

      // Text Lines Bi-Directional Entrance & Exit Scrub
      const lines = sectionRef.current?.querySelectorAll('.philosophy-text-line');
      lines?.forEach((line) => {
        gsap.fromTo(
          line,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top 90%',
              end: 'top 65%',
              scrub: 0.5,
            },
          }
        );
      });

      // Metrics Cards Bi-Directional Entrance & Exit Scrub
      const metrics = sectionRef.current?.querySelectorAll('.philosophy-metric-card');
      metrics?.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 70%',
              scrub: 0.5,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="philosophy"
      ref={sectionRef}
      className="relative w-full py-36 transition-colors duration-700 select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Tag */}
        <div className="mb-12">
          <span className="text-xs font-mono text-[#0077ff] tracking-widest uppercase block mb-3 font-bold">
            05 / ABOUT SRISHTI
          </span>
        </div>

        {/* Main Quote Statement */}
        <div className="max-w-5xl space-y-6">
          <h2 className="font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] text-current">
            <span className="philosophy-text-line block">Where code meets</span>
            <span className="philosophy-text-line block font-serif-custom italic font-normal text-[#0077ff] lowercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl my-2">
              creativity.
            </span>
            <span className="philosophy-text-line block">That is Srishti.</span>
          </h2>

          <p className="philosophy-text-line text-lg md:text-2xl font-light leading-relaxed max-w-3xl opacity-80 pt-6">
            Srishti is the flagship techno-cultural fest of the Computer Science Department at St. Thomas College. Since its inception, Srishti has been a platform for students to showcase their technical brilliance, creative talent, and collaborative spirit through hackathons, coding contests, workshops, and cultural performances.
          </p>
        </div>

        {/* Fest Metrics Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-current/15">
          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#0077ff]">
              <Award className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">EDITIONS</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">7th</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Year of Srishti</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#0077ff]">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">EVENTS</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">15+</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Technical & Cultural Events</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#0077ff]">
              <Users className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">REACH</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">500+</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Expected Participants</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#0077ff]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">PRIZES</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">₹50K+</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Total Prize Pool</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioPhilosophy;
