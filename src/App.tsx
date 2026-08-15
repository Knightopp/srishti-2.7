import { useLenis } from './hooks/useLenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SponsorsTicker from './components/SponsorsTicker';
import TimelineRoadmap from './components/TimelineRoadmap';
import CaseShowcase from './components/CaseShowcase';
import PhotoGallery from './components/PhotoGallery';
import StudioPhilosophy from './components/StudioPhilosophy';
import CTA from './components/CTA';
import Footer from './components/Footer';

export function App() {
  // Initialize Lenis smooth scroll synchronized with GSAP ticker & ScrollTrigger
  useLenis();

  return (
    <div className="relative w-full min-h-screen bg-[#0b0b0b] text-[#f5f5f7] antialiased overflow-x-hidden">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Outcrowd Hero Section with Floating Widgets & Pinned Zoom Motion */}
      <section className="relative w-full">
        <Hero />
      </section>

      {/* 3. Continuous Infinite Moving Sponsors Ticker (Always moves independent of scroll) */}
      <section className="relative w-full">
        <SponsorsTicker />
      </section>

      {/* 4. Event Map & Timeline Roadmap Section (Bi-directional scrub animations) */}
      <section className="relative w-full">
        <TimelineRoadmap />
      </section>

      {/* 5. Selected Cases Section (Pinned Horizontal Scrub Animation - Zero Black Gap) */}
      <section className="relative w-full">
        <CaseShowcase />
      </section>

      {/* 6. Compact Photo Gallery Section (3 Cards + "+12 More" Lightbox Modal) */}
      <section className="relative w-full">
        <PhotoGallery />
      </section>

      {/* 7. Studio Philosophy Section (Bi-directional scrub reveals & Theme Morphing) */}
      <section className="relative w-full">
        <StudioPhilosophy />
      </section>

      {/* 8. Call To Action Section */}
      <section className="relative w-full">
        <CTA />
      </section>

      {/* 9. Agency Footer */}
      <Footer />
    </div>
  );
}

export default App;
