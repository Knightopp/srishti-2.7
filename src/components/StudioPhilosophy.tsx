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
      // Background Theme Morph: Dark → Off-white → Dark
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          gsap.to('body', { backgroundColor: '#f5f5f7', color: '#0b0b0b', duration: 0.8, ease: 'power2.out' });
        },
        onLeaveBack: () => {
          gsap.to('body', { backgroundColor: '#050608', color: '#E8E8EC', duration: 0.8, ease: 'power2.out' });
        },
        onLeave: () => {
          gsap.to('body', { backgroundColor: '#050608', color: '#E8E8EC', duration: 0.8, ease: 'power2.out' });
        },
      });

      // Text Lines Scrub
      const lines = sectionRef.current?.querySelectorAll('.philosophy-text-line');
      lines?.forEach((line) => {
        gsap.fromTo(
          line,
          { y: 40, opacity: 0 },
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

      // Metrics Cards Scrub
      const metrics = sectionRef.current?.querySelectorAll('.philosophy-metric-card');
      metrics?.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
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
          <span className="text-[10px] font-body font-medium text-[#2563EB] tracking-wider uppercase block mb-3">
            04 / About Srishti
          </span>
        </div>

        {/* Main Quote Statement */}
        <div className="max-w-5xl space-y-6">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight uppercase leading-[0.95] text-current">
            <span className="philosophy-text-line block">Where code meets</span>
            <span className="philosophy-text-line block font-serif-custom italic font-normal text-[#2563EB] lowercase text-5xl sm:text-7xl md:text-8xl lg:text-9xl my-2">
              creativity.
            </span>
            <span className="philosophy-text-line block">That is Srishti.</span>
          </h2>

          <p className="philosophy-text-line text-lg md:text-2xl font-light leading-relaxed max-w-3xl opacity-70 pt-6">
            Srishti is the flagship techno-cultural fest of the Computer Science Department at St. Thomas College. Since its inception, Srishti has been a platform for students to showcase their technical brilliance, creative talent, and collaborative spirit through hackathons, coding contests, workshops, and cultural performances.
          </p>
        </div>

        {/* Fest Metrics Grid */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-current/10">
          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <Award className="w-4 h-4" />
              <span className="text-[10px] font-body font-medium tracking-wider uppercase">Editions</span>
            </div>
            <span className="font-display font-bold text-5xl md:text-6xl block">7th</span>
            <span className="text-xs font-body opacity-45 uppercase block">Year of Srishti</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-body font-medium tracking-wider uppercase">Events</span>
            </div>
            <span className="font-display font-bold text-5xl md:text-6xl block">15+</span>
            <span className="text-xs font-body opacity-45 uppercase block">Technical & Cultural Events</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-body font-medium tracking-wider uppercase">Reach</span>
            </div>
            <span className="font-display font-bold text-5xl md:text-6xl block">500+</span>
            <span className="text-xs font-body opacity-45 uppercase block">Expected Participants</span>
          </div>

          <div className="philosophy-metric-card space-y-2">
            <div className="flex items-center gap-2 text-[#2563EB]">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-body font-medium tracking-wider uppercase">Prizes</span>
            </div>
            <span className="font-display font-bold text-5xl md:text-6xl block">₹50K+</span>
            <span className="text-xs font-body opacity-45 uppercase block">Total Prize Pool</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudioPhilosophy;
