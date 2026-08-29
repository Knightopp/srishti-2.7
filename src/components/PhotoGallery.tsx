import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, ArrowUpRight } from 'lucide-react';

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
    category: 'Technical',
    date: 'Dec 2025',
    location: 'Innovation Hub',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    description: 'Teams hustling through the 6-hour hackathon with mentors guiding them to build working prototypes.',
  },
  {
    id: 'photo-3',
    title: 'Srishti 2.5 — Cultural Night & DJ Set',
    category: 'Cultural',
    date: 'Dec 2024',
    location: 'Open Air Stage',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    description: 'The legendary Srishti 2.5 cultural night with live band performances, dance acts, and a rooftop DJ set.',
  },
  {
    id: 'photo-4',
    title: 'Srishti 2.5 — Coding Contest Finals',
    category: 'Technical',
    date: 'Dec 2024',
    location: 'CS Lab Complex',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    description: 'The intense final round of Code Clash where 60 students competed head-to-head on algorithmic challenges.',
  },
  {
    id: 'photo-5',
    title: 'Srishti 2.6 — AI Workshop Session',
    category: 'Technical',
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
    category: 'Technical',
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

  const featuredPhotos = GALLERY_PHOTOS.slice(0, 4);

  const filteredModalPhotos = filterCategory === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === filterCategory);



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
      className="relative w-full py-14 sm:py-18 md:py-22 bg-[#050608] text-[#E8E8EC] border-t border-white/[0.08] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="gallery-header-content flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div className="space-y-2">
            <span className="text-[10px] md:text-[11px] font-technical text-cyan-400 tracking-widest uppercase block font-bold">
              03 // FESTIVAL PHOTO & VIDEO ARCHIVES
            </span>
            <h2 className="font-impact font-black text-3xl sm:text-5xl md:text-6xl tracking-tight text-white uppercase leading-[0.95]">
              SRISHTI <span className="text-gradient-27 font-impact font-black">GALLERY</span>
            </h2>
            <p className="text-xs sm:text-sm text-white/60 font-body font-light max-w-lg mt-1 leading-relaxed">
              Relive the energy and excitement from previous editions — hackathons, cultural nights, tech battles, and celebrations.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.12] hover:border-cyan-400/50 hover:bg-white/[0.08] text-white text-xs font-body font-semibold uppercase tracking-wider transition-all cursor-pointer self-start md:self-end shadow-sm"
          >
            <span>View All ({GALLERY_PHOTOS.length}) Photos</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* 4-CARD GALLERY GRID */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {featuredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(idx)}
              className="gallery-compact-card group relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#0A0D14] cursor-pointer h-[320px] sm:h-[380px] transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1"
            >
              {/* Photo Image */}
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="lazy"
              />

              {/* Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/40 to-transparent" />

              {/* Card Tag */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-technical text-cyan-300 uppercase">
                  {photo.category}
                </span>

                <div className="w-7 h-7 rounded bg-black/60 border border-white/10 flex items-center justify-center text-white/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Bottom Meta */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-1">
                <span className="text-[9px] font-technical text-white/40 block">
                  {photo.date} • {photo.location}
                </span>
                <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#050608]/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn">
          {/* Modal Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-technical text-cyan-400 font-bold uppercase">
                GALLERY EXPLORER
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-technical text-white/50">
                {activePhotoIndex + 1} / {filteredModalPhotos.length}
              </span>
            </div>

            {/* Category Filters */}
            <div className="hidden sm:flex items-center gap-2">
              {['All', 'Srishti 2.6', 'Srishti 2.5', 'Technical', 'Cultural'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setActivePhotoIndex(0);
                  }}
                  className={`px-3 py-1 rounded text-xs font-body font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-gradient-27 text-white'
                      : 'bg-white/[0.04] text-white/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded bg-white/[0.06] text-white/70 hover:text-white hover:bg-white/[0.1] transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Stage */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {filteredModalPhotos[activePhotoIndex] && (
              <div className="max-w-4xl max-h-[75vh] w-full flex flex-col items-center">
                <img
                  src={filteredModalPhotos[activePhotoIndex].url}
                  alt={filteredModalPhotos[activePhotoIndex].title}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-lg border border-white/[0.1]"
                />
                <div className="mt-4 text-center space-y-1">
                  <h4 className="font-display font-bold text-lg text-white">
                    {filteredModalPhotos[activePhotoIndex].title}
                  </h4>
                  <p className="text-xs text-white/50 max-w-lg mx-auto font-light">
                    {filteredModalPhotos[activePhotoIndex].description}
                  </p>
                </div>
              </div>
            )}

            {/* Nav Arrows */}
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Thumbnail Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-white/[0.08] scrollbar-none no-scrollbar">
            {filteredModalPhotos.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => setActivePhotoIndex(idx)}
                className={`shrink-0 w-16 h-12 rounded overflow-hidden cursor-pointer border transition-all ${
                  idx === activePhotoIndex
                    ? 'border-cyan-400 scale-105'
                    : 'border-white/[0.1] opacity-50 hover:opacity-100'
                }`}
              >
                <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
