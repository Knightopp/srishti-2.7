import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CaseStudy {
  id: string;
  number: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  color: string;
  bgGradient: string;
  image: string;
}

const CASES: CaseStudy[] = [
  {
    id: 'hackathon',
    number: '01',
    title: 'BuildBlitz Hackathon',
    category: '6-Hour Rapid Prototyping Challenge',
    tags: ['Hackathon', 'Full Stack', 'Team Event'],
    description: 'Teams of 3-4 race against the clock to build a working prototype from scratch. Industry mentors, live demos, and a ₹25,000 grand prize await.',
    color: '#0077ff',
    bgGradient: 'from-[#0a1526] via-[#0e1a2f] to-[#0b0b0b]',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ctf',
    number: '02',
    title: 'CyberSec CTF Challenge',
    category: 'Capture The Flag — Offensive Security',
    tags: ['Cybersecurity', 'CTF', 'Forensics'],
    description: 'Crack ciphers, exploit web vulnerabilities, and race through digital forensics puzzles in this adrenaline-pumping team-based CTF showdown.',
    color: '#00d4ff',
    bgGradient: 'from-[#0a1e28] via-[#09151c] to-[#0b0b0b]',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'ai-workshop',
    number: '03',
    title: 'AI & ML Workshop',
    category: 'Hands-on Machine Learning with Python',
    tags: ['AI/ML', 'Python', 'Workshop'],
    description: 'Build your first machine learning model in a beginner-friendly, hands-on workshop using scikit-learn and Google Colab with real-world datasets.',
    color: '#d4ff00',
    bgGradient: 'from-[#1b2410] via-[#141a0b] to-[#0b0b0b]',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  },
];

export const CaseShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [cursorActive, setCursorActive] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // 0. Section Header Bi-Directional Entrance & Exit animation
      gsap.fromTo(
        '.cases-header-content',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.5,
          },
        }
      );

      // 1. Precise Pinned Horizontal Scrub Track (Unpins immediately at Card 3 without extra scroll delay)
      gsap.to(trackRef.current, {
        xPercent: -66.66,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=45%', // Unpins as soon as Card 3 centers!
          pin: true,
          pinSpacing: true,
          scrub: 0.3,
          anticipatePin: 1,
        },
      });

      // 2. Scroll-driven typewriter clip reveal for each case title
      const titles = sectionRef.current?.querySelectorAll('.case-title-typewriter');
      titles?.forEach((title) => {
        gsap.set(title, { clipPath: 'polygon(0 0, 0% 0, 0% 100%, 0 100%)' });
        gsap.to(title, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          ease: 'none',
          scrollTrigger: {
            trigger: title,
            containerAnimation: gsap.getTweensOf(trackRef.current)[0],
            start: 'left 80%',
            end: 'left 20%',
            scrub: 0.4,
          },
        });
      });

      // Card hover 3D tilt
      const cards = sectionRef.current?.querySelectorAll('.case-card');
      cards?.forEach((card) => {
        card.addEventListener('mousemove', (e: Event) => {
          const mouseEvent = e as MouseEvent;
          const rect = (card as HTMLElement).getBoundingClientRect();
          const x = mouseEvent.clientX - rect.left - rect.width / 2;
          const y = mouseEvent.clientY - rect.top - rect.height / 2;

          gsap.to(card, {
            rotateY: x * 0.04,
            rotateX: -y * 0.04,
            duration: 0.4,
            ease: 'power2.out',
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.6,
            ease: 'power2.out',
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <section
      id="cases"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-[#0b0b0b] text-[#f5f5f7] flex flex-col justify-between py-10 select-none"
    >
      {/* Custom Cursor Follower Badge */}
      <div
        className={`custom-cursor-follower ${cursorActive ? 'active' : ''}`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) scale(${cursorActive ? 1 : 0})`,
        }}
      >
        <span>Explore →</span>
      </div>

      {/* Section Header */}
      <div className="cases-header-content max-w-7xl mx-auto px-6 md:px-12 w-full flex items-end justify-between z-20">
        <div>
          <span className="text-xs font-mono text-[#0077ff] tracking-widest uppercase block mb-2 font-semibold">
            03 / EVENT HIGHLIGHTS
          </span>
          <h2 className="font-syne text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white uppercase">
            Featured <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase">events</span>
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs font-mono text-white/50">
          <span>SCROLL TO EXPLORE EVENTS</span>
          <div className="w-12 h-[1px] bg-white/20" />
        </div>
      </div>

      {/* Horizontal Track Container */}
      <div className="w-full overflow-hidden my-auto py-4 z-10">
        <div
          ref={trackRef}
          className="flex w-[300vw] gap-8 md:gap-16 px-6 md:px-12 items-center"
        >
          {CASES.map((item) => (
            <div
              key={item.id}
              className="w-[85vw] md:w-[70vw] lg:w-[60vw] max-w-5xl shrink-0"
              onMouseEnter={() => setCursorActive(true)}
              onMouseLeave={() => setCursorActive(false)}
            >
              <div
                className={`case-card relative rounded-3xl bg-gradient-to-br ${item.bgGradient} border border-white/15 p-6 md:p-12 transition-all duration-500 overflow-hidden group shadow-2xl`}
                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
              >
                {/* Background Image with Dark Vignette Overlay */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:scale-105 transition-transform duration-700 ease-out">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/60 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="relative z-10 flex flex-col justify-between h-[420px] md:h-[500px]">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <span className="font-syne font-black text-4xl md:text-6xl text-white/20 group-hover:text-white transition-colors duration-500">
                      {item.number}
                    </span>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {item.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase rounded-full bg-white/10 border border-white/15 text-white/80 backdrop-blur-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Text & Meta with Typewriter Scroll Reveal */}
                  <div className="space-y-4 max-w-2xl">
                    <span className="text-xs font-mono text-[#0077ff] tracking-widest uppercase block font-semibold">
                      {item.category}
                    </span>

                    <h3 className="case-title-typewriter font-syne text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white uppercase group-hover:text-[#0077ff] transition-colors duration-300">
                      {item.title}
                    </h3>

                    <p className="text-sm md:text-base text-white/70 font-light leading-relaxed">
                      {item.description}
                    </p>

                    <div className="pt-3 flex items-center gap-4">
                      <a
                        href="#cta"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-syne text-xs font-bold uppercase tracking-wider hover:bg-[#0077ff] hover:text-white transition-colors duration-300 shadow-lg"
                      >
                        <span>Register Now</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Indicator Bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex items-center justify-between z-20 text-xs font-mono text-white/40">
        <span>03 FEATURED EVENTS</span>
        <span>SRISHTI 2.7 • CS DEPARTMENT</span>
      </div>
    </section>
  );
};

export default CaseShowcase;
