import { Globe } from 'lucide-react';
import { useFest } from '../context/FestContext';

export const SponsorsTicker: React.FC = () => {
  const { sponsors } = useFest();

  // Double the sponsors list for seamless loop
  const marqueeItems = sponsors.length > 0 ? [...sponsors, ...sponsors] : [];

  return (
    <section
      className="relative w-full py-14 bg-[#050608] border-t border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Header — plain text, no pill */}
      <div className="sponsors-header-content text-center mb-7 relative z-10">
        <span className="text-[10px] font-body font-medium text-white/20 tracking-wider uppercase">
          Powered by our sponsors & partners
        </span>
      </div>

      {/* INFINITE MARQUEE TICKER */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050608] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050608] to-transparent z-20 pointer-events-none" />

        <div className="animate-infinite-marquee gap-5 px-4">
          {marqueeItems.map((sponsor, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3 px-5 py-3 rounded-lg bg-[#0D1015] border border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 shrink-0 cursor-pointer"
            >
              <div
                className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center p-1.5 overflow-hidden shrink-0"
              >
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain" />
                ) : (
                  <Globe className="w-4 h-4 text-white/25" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-sm text-white/70 tracking-tight group-hover:text-white/90 transition-colors">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[8px] font-body font-medium tracking-wider px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 uppercase"
                  >
                    {sponsor.badge}
                  </span>
                </div>
                <span className="text-[10px] font-body text-white/25 block">
                  {sponsor.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsTicker;
