import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import { SiTiktok, SiTelegram } from 'react-icons/si';

export function Contact() {
  return (
    <section id="contact" className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Decorative gradient orb */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs font-bold text-primary tracking-[0.3em] uppercase mb-4 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-primary"></span>
              Kontakt
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-10">
              KDE NÁS <br/>
              <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>NAJDETE</span>
            </h3>
            
            <p className="text-white/60 text-xl font-light mb-16 max-w-lg leading-relaxed">
              Zavolejte nám, napište na Telegram nebo se za námi rovnou zastavte v Klíčanech. 
              Těšíme se na vaši návštěvu.
            </p>

            <div className="flex flex-col gap-10 mb-16">
              <a href="tel:+420777876406" className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                  <Phone className="text-white" size={32} />
                </div>
                <div>
                  <div className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-2">Zavolejte nám</div>
                  <div className="text-3xl font-black text-white group-hover:text-primary transition-colors tracking-tight">+420 777 876 406</div>
                </div>
              </a>

              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300">
                  <MapPin className="text-white" size={32} />
                </div>
                <div>
                  <div className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-2">Adresa</div>
                  <div className="text-xl font-bold text-white tracking-wide">Kostelecká 915, 196 00 Praha-Čakovice</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a 
                href="https://t.me/autonavse" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc] hover:text-white border border-[#0088cc]/20 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-105"
              >
                <SiTelegram size={24} />
                Telegram
              </a>
              <a 
                href="https://www.tiktok.com/@platinumautobazar?_r=1&_t=ZN-98xqcmCfFn4" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white hover:bg-white hover:text-black border border-white/10 rounded-full text-sm font-bold uppercase tracking-[0.1em] transition-all hover:scale-105"
              >
                <SiTiktok size={24} />
                TikTok
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative group"
          >
            <div className="absolute inset-0 border-[4px] border-white/5 rounded-[3rem] z-20 pointer-events-none" />
            <iframe 
              src="https://www.google.com/maps?q=Kosteleck%C3%A1%20915%2C%20196%2000%20Praha-%C4%8Cakovice&output=embed"
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(90%) contrast(120%) grayscale(20%)' }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Platinum Cars"
              className="group-hover:scale-105 transition-transform duration-1000 ease-out"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
