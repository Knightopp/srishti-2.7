import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LOGO_BLOCKS } from './logoBlocks';
import logoPng from '../../../assets/images/srishti-logo.png';
import './LogoBuild.css';

gsap.registerPlugin(ScrollTrigger);

export const LogoBuild: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<{ [key: string]: SVGGElement | null }>({});
  const finalImageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isBuildComplete, setIsBuildComplete] = useState<boolean>(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State: Background scene & blocks hidden at 0% scroll
      gsap.set('.fixed-background-scene', { opacity: 0 });

      // 2. Master timeline tied to hero scroll scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.3,
          onUpdate: (self) => {
            setScrollProgress(self.progress);
            setIsBuildComplete(self.progress >= 0.88);
          },
        },
      });

      // 3. Fade in background scene only when scrolling starts (0.00 -> 0.08)
      tl.to(
        '.fixed-background-scene',
        {
          opacity: 1,
          ease: 'power1.out',
          duration: 0.08,
        },
        0
      );

      // 4. Animate each isometric block into position (0.08 -> 0.85)
      LOGO_BLOCKS.forEach((block) => {
        const el = blockRefs.current[block.id];
        if (!el) return;

        // Disassembled initial 3D state
        gsap.set(el, {
          x: block.startDx,
          y: block.startDy,
          scale: 0.7,
          opacity: block.initialOpacity,
          transformOrigin: `${block.x + block.w / 2}px ${block.y + block.h / 2}px`,
        });

        // Assembly keyframes
        tl.to(
          el,
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            duration: block.scrollEnd - block.scrollStart,
          },
          0.08 + block.scrollStart * 0.77
        );
      });

      // 5. Cross-fade into crisp high-res transparent artwork at 82% -> 85%
      if (finalImageRef.current) {
        gsap.set(finalImageRef.current, { opacity: 0 });
        tl.to(
          finalImageRef.current,
          {
            opacity: 1,
            ease: 'power1.inOut',
            duration: 0.05,
          },
          0.82
        );
      }

      // 6. Fade out progress indicator badge when build reaches completion
      if (badgeRef.current) {
        tl.to(
          badgeRef.current,
          {
            opacity: 0,
            y: 15,
            duration: 0.08,
          },
          0.88
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const progressPercent = Math.min(100, Math.max(0, Math.round((scrollProgress / 0.85) * 100)));

  return (
    <div className="logo-build-stage" ref={containerRef}>
      <div className="logo-viewport">
        {/* Main SVG Scene for Isometric 3D Blocks */}
        <svg
          className="logo-blocks-svg"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cyan to Blue Gradients */}
            {LOGO_BLOCKS.map((block) => (
              <linearGradient
                key={`grad_${block.id}`}
                id={`grad_${block.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={block.primaryColor} />
                <stop offset="100%" stopColor={block.secondaryColor} />
              </linearGradient>
            ))}

            {/* Cyan Glow Filter */}
            <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render 3D Isometric SVG Cuboids */}
          {LOGO_BLOCKS.map((block) => {
            const d = block.depth;
            const topOffset = d * 0.5;
            const sideOffset = d * 0.5;

            return (
              <g
                key={block.id}
                ref={(el) => {
                  blockRefs.current[block.id] = el;
                }}
                className="iso-block-group"
                filter="url(#cyanGlow)"
              >
                {/* Top Isometric Face */}
                <polygon
                  points={`
                    ${block.x},${block.y} 
                    ${block.x + sideOffset},${block.y - topOffset} 
                    ${block.x + block.w + sideOffset},${block.y - topOffset} 
                    ${block.x + block.w},${block.y}
                  `}
                  fill="#00E5FF"
                  opacity="0.85"
                />

                {/* Right Isometric Face */}
                <polygon
                  points={`
                    ${block.x + block.w},${block.y} 
                    ${block.x + block.w + sideOffset},${block.y - topOffset} 
                    ${block.x + block.w + sideOffset},${block.y + block.h - topOffset} 
                    ${block.x + block.w},${block.y + block.h}
                  `}
                  fill="#087FF0"
                  opacity="0.65"
                />

                {/* Front Face */}
                <rect
                  x={block.x}
                  y={block.y}
                  width={block.w}
                  height={block.h}
                  fill={`url(#grad_${block.id})`}
                  rx="1.5"
                  ry="1.5"
                  stroke="#00E5FF"
                  strokeWidth="0.8"
                  strokeOpacity="0.6"
                />
              </g>
            );
          })}
        </svg>

        {/* Final Srishti Logo Artwork Layer */}
        <img
          ref={finalImageRef}
          src={logoPng}
          alt="Srishti Logo"
          className="final-logo-artwork"
        />
      </div>

      {/* Floating Build Progress Badge */}
      <div
        className={`scroll-progress-badge ${isBuildComplete ? 'complete' : ''}`}
        ref={badgeRef}
      >
        <span>{isBuildComplete ? 'Assembled' : 'Building Logo'}</span>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="progress-text">{progressPercent}%</span>
      </div>
    </div>
  );
};

export default LogoBuild;
