import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, ArrowRight, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Srishti 2.5' | 'Srishti 2.6' | 'Backstage' | 'Cultural' | 'Technical';
  date: string;
  location: string;
  url: string;
  description: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Srishti 2.6 — Grand Inaugural Ceremony',
    category: 'Srishti 2.6',
    date: 'Dec 2025',
    location: 'Main Auditorium',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    description: 'The grand opening of Srishti 2.6 with lamp lighting, keynote by chief guest, and the official theme reveal.',
  },
  {
    id: 'photo-2',
    title: 'Srishti 2.6 — Hackathon Arena in Action',
    category: 'Srishti 2.6',
    date: 'Dec 2025',
    location: 'Innovation Hub',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    description: 'Teams hustling through the 6-hour hackathon with mentors guiding them to build working prototypes.',
  },
  {
    id: 'photo-3',
    title: 'Srishti 2.5 — Cultural Night & DJ Set',
    category: 'Srishti 2.5',
    date: 'Dec 2024',
    location: 'Open Air Stage',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'The legendary Srishti 2.5 cultural night with live band performances, dance acts, and a rooftop DJ set.',
  },
  {
    id: 'photo-4',
    title: 'Srishti 2.5 — Coding Contest Finals',
    category: 'Srishti 2.5',
    date: 'Dec 2024',
    location: 'CS Lab Complex',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'The intense final round of Code Clash where 60 students competed head-to-head on algorithmic challenges.',
  },
  {
    id: 'photo-5',
    title: 'Srishti 2.6 — AI Workshop Session',
    category: 'Srishti 2.6',
    date: 'Dec 2025',
    location: 'Conference Room',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    description: 'Hands-on machine learning workshop where students trained their first classification models on Google Colab.',
  },
  {
    id: 'photo-6',
    title: 'Srishti 2.5 — Prize Distribution Ceremony',
    category: 'Srishti 2.5',
    date: 'Dec 2024',
    location: 'Main Auditorium',
    url: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80',
    description: 'Winners receiving trophies and cash prizes at the Srishti 2.5 valedictory ceremony.',
  },
  {
    id: 'photo-7',
    title: 'Srishti 2.6 — Tech Quiz Buzzer Round',
    category: 'Srishti 2.6',
    date: 'Dec 2025',
    location: 'Seminar Hall',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    description: 'The electrifying buzzer round finals of ByteBlitz tech quiz with audience cheering teams on.',
  },
  {
    id: 'photo-8',
    title: 'Srishti 2.6 — Backstage Team Huddle',
    category: 'Backstage',
    date: 'Dec 2025',
    location: 'Green Room',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    description: 'The student organizing committee\'s behind-the-scenes planning and last-minute coordination.',
  },
];

export const PhotoGallery: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const containerRef = useRef<HTMLDivElement>(null);

  const featuredPhotos = GALLERY_PHOTOS.slice(0, 3);

  const filteredModalPhotos = filterCategory === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === filterCategory);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // 0. Bi-directional Header Scrub Animation
      gsap.fromTo(
        '.gallery-header-content',
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

      // 1. Bi-directional Photo Cards Scrub Animation
      const cards = containerRef.current?.querySelectorAll('.gallery-compact-card');
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0, scale: 0.93 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 68%',
              scrub: 0.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, activePhotoIndex, filteredModalPhotos.length]);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsModalOpen(true);
  };

  const nextPhoto = () => {
    setActivePhotoIndex((prev) => (prev + 1) % filteredModalPhotos.length);
  };

  const prevPhoto = () => {
    setActivePhotoIndex((prev) => (prev - 1 + filteredModalPhotos.length) % filteredModalPhotos.length);
  };

  return (
    <section
      id="gallery"
      ref={containerRef}
      className="relative w-full py-24 bg-[#0b0b0b] text-[#f5f5f7] border-t border-white/10 select-none overflow-hidden"
    >
      {/* Soft Ambient Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#0077ff]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="gallery-header-content text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/12 text-xs font-mono text-[#0077ff] tracking-widest uppercase mb-4">
            <Camera className="w-3.5 h-3.5 text-[#0077ff]" />
            <span>04 / PAST EDITIONS GALLERY</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]">
            Relive The{' '}
            <span className="font-serif-custom italic font-normal text-[#0077ff] lowercase text-4xl sm:text-6xl md:text-8xl block sm:inline">
              memories
            </span>
          </h2>

          <p className="mt-3 text-base text-white/60 font-light max-w-lg mx-auto">
            Highlights from Srishti 2.5 & Srishti 2.6 — hackathons, cultural nights, workshops, and more.
          </p>
        </div>

        {/* COMPACT 3-CARD GALLERY GRID (Minimal Scroll Required) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {featuredPhotos.map((photo, idx) => {
            const isLastCard = idx === 2;

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(idx)}
                className="gallery-compact-card group relative rounded-3xl overflow-hidden border border-white/15 bg-[#121217] cursor-pointer shadow-2xl h-[360px] sm:h-[420px] transition-all duration-500 hover:border-[#0077ff]/60 hover:-translate-y-1.5"
              >
                {/* Photo Image */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0b] via-[#0b0b0b]/40 to-transparent" />

                {/* Card Tag Header */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-white/80 uppercase backdrop-blur-md">
                    {photo.category}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                  <span className="text-[10px] font-mono text-[#d4ff00] block">
                    {photo.date} • {photo.location}
                  </span>
                  <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#0077ff] transition-colors leading-tight">
                    {photo.title}
                  </h3>
                </div>

                {/* OVERLAY ON THE 3RD CARD: "MORE / VIEW FULL GALLERY" */}
                {isLastCard && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#0077ff]/40 to-[#0b0b0b]/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20 group-hover:bg-[#0077ff]/80 transition-all duration-500">
                    <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center mb-3 shadow-2xl group-hover:scale-110 transition-transform">
                      <Sparkles className="w-6 h-6 text-[#0077ff]" />
                    </div>

                    <span className="font-syne font-black text-2xl text-white uppercase tracking-tight">
                      + More Photos
                    </span>

                    <p className="text-xs text-white/80 font-light mt-1 max-w-[200px]">
                      Browse full gallery from Srishti 2.5 & 2.6
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(2);
                      }}
                      className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-syne text-xs font-bold uppercase tracking-wider shadow-2xl hover:bg-[#d4ff00] transition-colors"
                    >
                      <span>Open Full Gallery</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-20">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-[#0077ff]" />
              <span className="font-syne font-bold text-base text-white uppercase">
                Srishti Gallery
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-white/60">
                {activePhotoIndex + 1} of {filteredModalPhotos.length}
              </span>
            </div>

            {/* Category Filter Pills inside Modal */}
            <div className="hidden md:flex items-center gap-2">
              {['All', 'Srishti 2.5', 'Srishti 2.6', 'Backstage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setActivePhotoIndex(0);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    filterCategory === cat
                      ? 'bg-[#0077ff] text-white font-bold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Main Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Previous Arrow Button */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#0077ff] hover:border-[#0077ff] transition-all backdrop-blur-md"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Active Image Container */}
            {filteredModalPhotos[activePhotoIndex] && (
              <div className="max-w-5xl max-h-[72vh] rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative">
                <img
                  src={filteredModalPhotos[activePhotoIndex].url}
                  alt={filteredModalPhotos[activePhotoIndex].title}
                  className="w-full h-full object-contain max-h-[72vh]"
                />
              </div>
            )}

            {/* Next Arrow Button */}
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 z-30 p-3 rounded-full bg-black/60 border border-white/20 text-white hover:bg-[#0077ff] hover:border-[#0077ff] transition-all backdrop-blur-md"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Bottom Caption */}
          {filteredModalPhotos[activePhotoIndex] && (
            <div className="max-w-3xl mx-auto text-center border-t border-white/10 pt-4 space-y-1 relative z-20">
              <span className="text-xs font-mono text-[#d4ff00]">
                {filteredModalPhotos[activePhotoIndex].date} • {filteredModalPhotos[activePhotoIndex].location}
              </span>
              <h4 className="font-syne font-bold text-xl text-white">
                {filteredModalPhotos[activePhotoIndex].title}
              </h4>
              <p className="text-xs text-white/60 font-light max-w-xl mx-auto">
                {filteredModalPhotos[activePhotoIndex].description}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
