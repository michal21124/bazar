import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="bg-primary text-white py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/20">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start md:pl-0 pt-8 md:pt-0"
          >
            <Phone className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-heading text-2xl font-bold uppercase mb-2">Zavolejte nám</h3>
            <a href="tel:+420777876406" className="text-3xl font-black hover:text-white/80 transition-colors">
              +420 777 876 406
            </a>
            <p className="mt-4 text-white/80 text-sm font-medium">K dispozici každý den</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center md:items-start md:pl-12 pt-8 md:pt-0"
          >
            <MapPin className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-heading text-2xl font-bold uppercase mb-2">Kde nás najdete</h3>
            <p className="text-xl font-bold leading-snug">
              K pumpě<br />
              250 69 Klíčany-Vodochody
            </p>
            <p className="mt-4 text-white/80 text-sm font-medium">Pouze 10 minut od Prahy</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center md:items-start md:pl-12 pt-8 md:pt-0"
          >
            <MessageCircle className="w-10 h-10 mb-6 text-white/90" />
            <h3 className="font-heading text-2xl font-bold uppercase mb-2">Sociální sítě</h3>
            <p className="text-lg font-bold leading-snug mb-4">
              Sledujte nás a buďte u nových vozů první.
            </p>
            <div className="flex gap-4">
              <a href="https://t.me/autonavse" target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-primary font-bold uppercase text-sm rounded hover:bg-white/90 transition-colors">Telegram</a>
              <a href="https://www.tiktok.com/@platinumautobazar?_r=1&_t=ZN-98xqcmCfFn4" target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-primary font-bold uppercase text-sm rounded hover:bg-white/90 transition-colors">TikTok</a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
