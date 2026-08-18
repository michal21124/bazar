import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Settings2, Calendar, Fuel } from 'lucide-react';

const cars = [
  {
    name: 'BMW X5 M50d',
    price: '1 250 000 Kč',
    image: '/car-1.jpg',
    specs: { year: '2020', mileage: '65 000 km', fuel: 'Diesel' },
    tag: 'Novinka'
  },
  {
    name: 'Audi M3 Competition',
    price: '1 420 000 Kč',
    image: '/car-2.jpg',
    specs: { year: '2021', mileage: '42 000 km', fuel: 'Benzín' },
    tag: 'Top Stav'
  },
  {
    name: 'Mercedes-Benz A45 AMG',
    price: '980 000 Kč',
    image: '/car-3.jpg',
    specs: { year: '2019', mileage: '88 000 km', fuel: 'Benzín' },
    tag: 'Ihned k odběru'
  }
];

export function Inventory() {
  return (
    <section id="inventory" className="py-32 bg-black relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary"></span>
              Vozy Na Prodej
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">
              Aktuální <br/>
              <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Výběr</span>
            </h3>
          </motion.div>
          
          <motion.a 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            href="https://t.me/autonavse"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 text-white text-sm font-bold uppercase tracking-[0.2em] hover:text-primary transition-colors group border border-white/10 px-8 py-4 rounded-full hover:bg-white/5"
          >
            Zobrazit vše
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {cars.map((car, index) => (
            <motion.div
              key={car.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="group bg-[#0A0A0A] border border-white/5 hover:border-primary/30 rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              <div className="relative h-[350px] overflow-hidden bg-black">
                <div className="absolute top-6 left-6 z-10 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/20">
                  {car.tag}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 opacity-80" />
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                />
              </div>
              
              <div className="p-10 relative z-20 -mt-10">
                <h4 className="text-3xl font-black text-white mb-2 tracking-tight">{car.name}</h4>
                <div className="text-2xl font-bold text-primary mb-8 tracking-tight">{car.price}</div>
                
                <div className="grid grid-cols-3 gap-2 mb-10 pt-8 border-t border-white/5">
                  <div className="flex flex-col items-start gap-2">
                    <Calendar className="text-primary mb-1" size={24} strokeWidth={1.5} />
                    <span className="text-xs font-bold text-white/50 tracking-wider uppercase">Rok</span>
                    <span className="text-sm font-bold text-white">{car.specs.year}</span>
                  </div>
                  <div className="flex flex-col items-start gap-2 border-x border-white/5 px-4">
                    <Settings2 className="text-primary mb-1" size={24} strokeWidth={1.5} />
                    <span className="text-xs font-bold text-white/50 tracking-wider uppercase">Nájezd</span>
                    <span className="text-sm font-bold text-white">{car.specs.mileage}</span>
                  </div>
                  <div className="flex flex-col items-start gap-2 pl-4">
                    <Fuel className="text-primary mb-1" size={24} strokeWidth={1.5} />
                    <span className="text-xs font-bold text-white/50 tracking-wider uppercase">Palivo</span>
                    <span className="text-sm font-bold text-white">{car.specs.fuel}</span>
                  </div>
                </div>

                <a 
                  href="tel:+420777876406"
                  className="block w-full py-5 bg-white text-black hover:bg-primary hover:text-white text-center text-sm font-black uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-lg"
                >
                  Mám zájem
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
