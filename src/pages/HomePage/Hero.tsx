import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden bg-white">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg_3.jpg" 
          alt="Letecký pohled na autobazar" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 top-[60%]" />
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle general overlay to ensure readability */}
      </div>

      {/* Content */}
      <div className="absolute bottom-[64px] left-6 md:left-[60px] z-40 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          {/* Small Pill */}
          <div className="px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white border border-white/30 text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-full mb-6 shadow-sm">
            Prémiový Autobazar · Klíčany u Prahy
          </div>

          {/* Huge Heading */}
          <h1 className="font-heading text-6xl md:text-[7rem] lg:text-[8rem] font-black text-white leading-[0.95] mb-6 drop-shadow-lg max-w-[90vw]">
            KUPUJTE A PRODÁVEJTE <br />
            VOZY S JISTOTOU
          </h1>

          {/* Subtext */}
          <p className="text-white/90 text-lg md:text-xl font-medium mb-10 drop-shadow-md">
            Výkup · Prodej · Výměna — rychle, bez provize, se zárukou
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/vozy" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold uppercase tracking-wider rounded-md hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 group shadow-lg"
            >
              Nabídka vozů
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/kontakt" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider rounded-md hover:bg-white/10 transition-colors flex items-center justify-center text-center"
            >
              Výkup & Výměna
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Hero Car */}
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-[-20px] right-[-5%] z-30 hidden lg:block w-[45vw] max-w-[700px] pointer-events-none"
      >
        <img 
          src="/hero-car.jpg" 
          alt="BMW M8" 
          className="w-full h-auto object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-x-[-1]"
        />
      </motion.div>
    </section>
  );
}
