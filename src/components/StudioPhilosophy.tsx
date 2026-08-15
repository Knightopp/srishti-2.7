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
          <span className="text-xs font-mono text-[#635bff] tracking-widest uppercase block mb-3 font-bold">
            04 / OUR PHILOSOPHY
          </span>
        </div>

        {/* Main Quote Statement */}
        <div className="max-w-5xl space-y-6">
          <h2 className="font-syne text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-[0.95] text-current">
            <span className="philosophy-text-line block">Design is not just</span>
            <span className="philosophy-text-line block font-serif-custom italic font-normal text-[#635bff] lowercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl my-2">
              what it looks like.
            </span>
            <span className="philosophy-text-line block">Design is how it works.</span>
          </h2>

          <p className="philosophy-text-line text-lg md:text-2xl font-light leading-relaxed max-w-3xl opacity-80 pt-6">
            At Outcrowd, motion is not a decoration—it is a functional catalyst. We engineer interactive scrollytelling systems that retain focus, communicate complex product value instantly, and convert passive visitors into loyal users.
          </p>
        </div>

        {/* Agency Metrics Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-current/15">
          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#635bff]">
              <Award className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">RECOGNITION</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">18+</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Global Design Awards</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#635bff]">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">RETENTION RATE</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">98%</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Client Partnership Retention</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#635bff]">
              <Users className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">REACH</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">4.2M</span>
            <span className="text-xs font-mono opacity-60 uppercase block">End Users Reached Daily</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#635bff]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase">ACCELERATION</span>
            </div>
            <span className="font-syne font-black text-5xl md:text-6xl block">3.5x</span>
            <span className="text-xs font-mono opacity-60 uppercase block">Average Conversion Lift</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioPhilosophy;
