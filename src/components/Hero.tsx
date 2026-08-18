import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-black">
      {/* Film Grain Overlay */}
      <div className="absolute inset-0 z-30 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      {/* Parallax Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        {/* Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[150px] rounded-full z-10 mix-blend-screen pointer-events-none" />
        
        <img 
          src="/hero-bg.jpg" 
          alt="Premium cars at dusk" 
          className="w-full h-full object-cover object-center scale-105"
        />
      </motion.div>

      {/* Content */}
      <div className="container relative z-40 mx-auto px-6 mt-20 md:mt-0">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full scale-150" />
            <Logo size={120} className="shadow-[0_0_50px_rgba(255,255,255,0.15)] border-4 border-white/20 relative z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary shadow-[0_0_10px_#1A73E8]"></span>
            </span>
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase">Prémiový Autobazar u Prahy</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white leading-[0.9] mb-8 tracking-tighter"
          >
            DRIVE <span className="text-stroke-transparent">YOUR</span> <br className="hidden md:block" /> 
            DREAM <span className="text-primary drop-shadow-[0_0_30px_rgba(26,115,232,0.4)]">TODAY.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-2xl text-white/70 font-light max-w-3xl mb-12 leading-relaxed"
          >
            Nákup, prodej a výměna prémiových vozů. Důvěřuje nám přes 82 000 sledujících. 
            Váš nový vůz čeká v Klíčanech.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto"
          >
            <a 
              href="#inventory" 
              className="w-full sm:w-auto px-10 py-5 bg-primary text-primary-foreground font-black uppercase tracking-[0.15em] rounded-full hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group shadow-[0_0_30px_rgba(26,115,232,0.3)]"
            >
              Nabídka vozů
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={24} />
            </a>
            <a 
              href="#services" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 font-bold uppercase tracking-[0.15em] rounded-full hover:bg-white/10 transition-all duration-300 text-center"
            >
              Výkup & Výměna
            </a>
          </motion.div>
        </div>
      </div>

      <motion.a 
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 text-white/40 hover:text-white transition-colors flex flex-col items-center gap-2 group"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">Objevte více</span>
        <ChevronDown size={32} className="animate-bounce" />
      </motion.a>
    </section>
  );
}
