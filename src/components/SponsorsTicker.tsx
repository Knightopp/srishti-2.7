import { Globe } from 'lucide-react';
import { useFest } from '../context/FestContext';

export const SponsorsTicker: React.FC = () => {
  const { sponsors } = useFest();

  // Multiply sponsors array 4x so wide screens have zero blank gaps
  const marqueeItems = sponsors.length > 0 ? [...sponsors, ...sponsors, ...sponsors, ...sponsors] : [];

  return (
    <section
      className="relative w-full py-12 bg-[#050608] border-t border-b border-white/[0.06] overflow-hidden select-none"
    >
      {/* Header */}
      <div className="sponsors-header-content text-center mb-6 relative z-10">
        <span className="text-[10px] font-body font-medium text-white/30 tracking-wider uppercase">
          Powered by our sponsors & partners
        </span>
      </div>

      {/* INFINITE GAPLESS MARQUEE TICKER */}
      <div className="relative w-full overflow-hidden py-2 ribbon-edge-fade">
        <div className="animate-ribbon-marquee-linear flex items-center gap-6">
          {marqueeItems.map((sponsor, idx) => (
            <div
              key={idx}
              className="group flex items-center gap-3.5 px-5 py-3 rounded-xl bg-[#0B0E14] border border-white/[0.08] hover:border-cyan-400/40 hover:bg-[#0E121B] transition-all duration-300 shrink-0 cursor-pointer shadow-md"
            >
              <div
                className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-1.5 overflow-hidden shrink-0 group-hover:border-cyan-400/30"
              >
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} className="w-full h-full object-contain" />
                ) : (
                  <Globe className="w-4 h-4 text-white/30" />
                )}
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-display font-semibold text-sm text-white/80 tracking-tight group-hover:text-white transition-colors">
                    {sponsor.name}
                  </span>
                  <span
                    className="text-[8px] font-body font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 uppercase"
                  >
                    {sponsor.badge}
                  </span>
                </div>
                <span className="text-[10px] font-body text-white/35 block">
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
