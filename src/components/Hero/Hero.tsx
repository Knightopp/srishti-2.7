import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import HeroText from "./HeroText";
import HeroRing from "./HeroRing";
import HeroPlanet from "./HeroPlanet";

import "../../styles/hero.css";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero scroll parallax timeline
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      timeline
        .to(
          ".hero-title",
          {
            y: -220,
            scale: 0.8,
            opacity: 0.25,
            ease: "none",
          },
          0
        )
        .to(
          ".ring-system",
          {
            y: 140,
            scale: 1.15,
            rotateZ: 10,
            ease: "none",
          },
          0
        )
        .to(
          ".planet",
          {
            y: 120,
            scale: 1.08,
            ease: "none",
          },
          0
        )
        .to(
          ".hero-eyebrow",
          {
            y: -100,
            opacity: 0,
            ease: "none",
          },
          0
        );

      // Continuous ring rotations
      gsap.to(".ring", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
      });

      // Small floating particles
      gsap.to(".particle", {
        y: -25,
        opacity: 0.4,
        duration: 2.2,
        stagger: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Locked Fixed Background Orbit & Logo Scene */}
      <div className="fixed-background-scene">
        <div className="background-glow" />
        <HeroRing />
        <HeroPlanet />
      </div>

      <section ref={heroRef} className="hero">
        <div className="hero-eyebrow">
          <span>STCT PRESENTS</span>
          <span>TECHNO • CULTURE • INNOVATION</span>
        </div>

        <HeroText />

        {/* Decorative floating particles */}
        <div className="particles">
          <span className="particle particle-1" />
          <span className="particle particle-2" />
          <span className="particle particle-3" />
          <span className="particle particle-4" />
          <span className="particle particle-5" />
          <span className="particle particle-6" />
        </div>

        <div className="hero-bottom">
          <p className="hero-tagline">
            IDEAS <span>•</span> INNOVATION <span>•</span> IMPACT
          </p>

          <div className="scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <span className="scroll-arrow">↓</span>
          </div>
        </div>
      </section>
    </>
  );
}
