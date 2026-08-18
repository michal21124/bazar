import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarCard } from '../../components/CarCard';
import { useCars } from '../../data/cars';

// Tag priority for sorting — higher = shown first
const TAG_PRIORITY: Record<string, number> = {
  'Doporučujeme': 4,
  'Premium':      3,
  'Top Stav':     2,
  'Novinka':      1,
};

const CARD_WIDTH = 372; // px + gap

export function FeaturedInventory() {
  const allCars = useCars();
  const trackRef = useRef<HTMLDivElement>(null);

  // Pick up to 6 cars: tagged first (by priority), then fill with others
  const featuredCars = React.useMemo(() => {
    const tagged   = allCars.filter(c => c.tag).sort((a, b) => (TAG_PRIORITY[b.tag!] ?? 0) - (TAG_PRIORITY[a.tag!] ?? 0));
    const untagged = allCars.filter(c => !c.tag);
    return [...tagged, ...untagged].slice(0, 6);
  }, [allCars]);

  const scroll = useCallback((dir: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'next' ? CARD_WIDTH : -CARD_WIDTH, behavior: 'smooth' });
  }, []);

  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="container mx-auto px-6">
        {/* Header row */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Naše vozy</p>
            <h2 className="font-heading text-5xl md:text-6xl font-black text-black uppercase">
              AKTUÁLNÍ NABÍDKA
            </h2>
          </motion.div>

          <div className="flex items-center gap-6">
            {/* Arrow buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll('prev')}
                className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Předchozí"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll('next')}
                className="w-11 h-11 rounded-full border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                aria-label="Další"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link
              href="/vozy"
              className="text-primary font-bold uppercase tracking-wider flex items-center gap-1 hover:underline transition-all text-sm"
            >
              Zobrazit vše <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredCars.map((car, index) => (
            <div key={car.id} className="flex-none w-[340px] md:w-[360px]">
              <CarCard
                car={car}
                index={index}
                onClick={() => { window.location.href = '/vozy'; }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
