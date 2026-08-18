import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, ArrowRight, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

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
      gsap.fromTo(
        '.gallery-header-content',
        { y: 30, opacity: 0 },
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

      const cards = containerRef.current?.querySelectorAll('.gallery-compact-card');
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0, scale: 0.96 },
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

  // Keyboard navigation for Lightbox
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
      className="relative w-full py-24 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.06] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="gallery-header-content text-center max-w-3xl mx-auto mb-14">
          <span className="text-[10px] font-body font-medium text-white/25 tracking-wider uppercase">
            03 / Past Editions Gallery
          </span>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white/90 uppercase leading-[1.05] mt-2">
            Relive The{' '}
            <span className="font-serif-custom italic font-normal text-[#2563EB] lowercase text-3xl sm:text-5xl md:text-7xl block sm:inline">
              memories
            </span>
          </h2>

          <p className="mt-3 text-sm text-white/35 font-light max-w-lg mx-auto">
            Highlights from Srishti 2.5 & Srishti 2.6 — hackathons, cultural nights, workshops, and more.
          </p>
        </div>

        {/* 3-CARD GALLERY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {featuredPhotos.map((photo, idx) => {
            const isLastCard = idx === 2;

            return (
              <div
                key={photo.id}
                onClick={() => openLightbox(idx)}
                className="gallery-compact-card group relative rounded-xl overflow-hidden border border-white/[0.06] bg-[#0D1015] cursor-pointer h-[360px] sm:h-[420px] transition-all duration-500 hover:border-white/[0.12] hover:-translate-y-1"
              >
                {/* Photo Image */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-transparent" />

                {/* Card Tag */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="text-[9px] font-body font-medium text-white/40 uppercase tracking-wider">
                    {photo.category}
                  </span>

                  <div className="w-7 h-7 rounded-md bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card Bottom Meta */}
                <div className="absolute bottom-4 left-4 right-4 z-10 space-y-1">
                  <span className="text-[9px] font-body text-white/30 block">
                    {photo.date} · {photo.location}
                  </span>
                  <h3 className="font-display font-semibold text-base text-white/80 group-hover:text-white transition-colors leading-tight">
                    {photo.title}
                  </h3>
                </div>

                {/* OVERLAY ON 3RD CARD */}
                {isLastCard && (
                  <div className="absolute inset-0 bg-[#050608]/90 flex flex-col items-center justify-center text-center p-6 z-20 group-hover:bg-[#050608]/80 transition-all duration-500">
                    <span className="font-display font-bold text-xl text-white/80 uppercase tracking-tight">
                      + More Photos
                    </span>

                    <p className="text-xs text-white/35 font-light mt-1 max-w-[200px]">
                      Browse full gallery from Srishti 2.5 & 2.6
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openLightbox(2);
                      }}
                      className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-[#050608] font-body text-xs font-semibold uppercase tracking-wider hover:bg-[#2563EB] hover:text-white transition-colors"
                    >
                      <span>Open Gallery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050608]/97 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 relative z-20">
            <div className="flex items-center gap-3">
              <Camera className="w-4 h-4 text-white/30" />
              <span className="font-display font-semibold text-sm text-white/70 uppercase">
                Gallery
              </span>
              <span className="text-[10px] font-technical text-white/30">
                {activePhotoIndex + 1}/{filteredModalPhotos.length}
              </span>
            </div>

            {/* Category Filters */}
            <div className="hidden md:flex items-center gap-1.5">
              {['All', 'Srishti 2.5', 'Srishti 2.6', 'Backstage'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setActivePhotoIndex(0);
                  }}
                  className={`px-3 py-1 rounded-md text-[11px] font-body transition-all ${
                    filterCategory === cat
                      ? 'bg-white/[0.08] text-white/80 font-medium'
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white/50 transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 z-30 p-2.5 rounded-md bg-[#0D1015] border border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {filteredModalPhotos[activePhotoIndex] && (
              <div className="max-w-5xl max-h-[72vh] rounded-xl overflow-hidden border border-white/[0.08] relative">
                <img
                  src={filteredModalPhotos[activePhotoIndex].url}
                  alt={filteredModalPhotos[activePhotoIndex].title}
                  className="w-full h-full object-contain max-h-[72vh]"
                />
              </div>
            )}

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 z-30 p-2.5 rounded-md bg-[#0D1015] border border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Bottom Caption */}
          {filteredModalPhotos[activePhotoIndex] && (
            <div className="max-w-3xl mx-auto text-center border-t border-white/[0.06] pt-4 space-y-1 relative z-20">
              <span className="text-[10px] font-body text-white/25">
                {filteredModalPhotos[activePhotoIndex].date} · {filteredModalPhotos[activePhotoIndex].location}
              </span>
              <h4 className="font-display font-semibold text-lg text-white/80">
                {filteredModalPhotos[activePhotoIndex].title}
              </h4>
              <p className="text-xs text-white/35 font-light max-w-xl mx-auto">
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
