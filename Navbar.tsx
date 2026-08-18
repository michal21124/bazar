import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '82 000+', label: 'sledujících TikTok' },
  { value: '900 000+', label: 'oblíbení' },
  { value: '10+', label: 'let zkušeností' },
  { value: 'Praha', label: 'a okolí' },
];

export function About() {
  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-5xl md:text-6xl font-black text-black uppercase mb-8">
              PROČ PLATINUM CARS?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-12">
              Nejsme jen další obyčejný autobazar. Zaměřujeme se na transparentní prodej a výkup vozidel, kde jednáte přímo s námi — rychle, fér a bez skrytých poplatků. Ať už hledáte spolehlivé auto do rodiny nebo prémiový kousek pro radost, každý náš vůz prochází pečlivou kontrolou, abyste měli jistotu, že kupujete kvalitu.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10">
              {stats.map((stat, index) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="font-heading text-4xl md:text-5xl font-black text-primary uppercase mb-1">
                    {stat.value}
                  </span>
                  <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-full min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <img 
              src="/hero-car.jpg" 
              alt="BMW M8 Premium Car" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle gradient overlay just to make the image fit the light theme better if it's very dark */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
