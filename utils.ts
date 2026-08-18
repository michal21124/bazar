import React from 'react';
import { Link } from 'wouter';
import { MapPin, Phone, Mail } from 'lucide-react';
import { SiTiktok, SiTelegram } from 'react-icons/si';

export function Footer() {
  return (
    <footer className="bg-[#1A1A1A] pt-20 pb-10 text-white relative border-t-4 border-primary">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo-icon.png" alt="Platinum Cars Logo" className="w-[40px] h-[40px] object-contain brightness-0 invert" />
              <span className="font-heading font-black text-2xl tracking-wide uppercase text-white">
                Platinum Cars
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-medium">
              Váš spolehlivý partner pro nákup, prodej a výměnu osobních i prémiových vozů. Přímé jednání, rychlý výkup a žádné skryté poplatky.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 uppercase tracking-wider">Odkazy</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-white/60 hover:text-primary transition-colors text-sm font-medium">Domů</Link></li>
              <li><Link href="/vozy" className="text-white/60 hover:text-primary transition-colors text-sm font-medium">Nabídka vozů</Link></li>
              <li><Link href="/kontakt" className="text-white/60 hover:text-primary transition-colors text-sm font-medium">Kontakt</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <h4 className="font-heading font-bold text-lg mb-6 uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm font-medium">
                <MapPin className="text-primary shrink-0" size={18} />
                <span>K pumpě<br/>250 69 Klíčany-Vodochody<br/>Czech Republic</span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-medium">
                <Phone className="text-primary shrink-0" size={18} />
                <a href="tel:+420777876406" className="hover:text-primary transition-colors">+420 777 876 406</a>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm font-medium">
                <Mail className="text-primary shrink-0" size={18} />
                <a href="mailto:info@platinumcars.cz" className="hover:text-primary transition-colors">info@platinumcars.cz</a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 uppercase tracking-wider">Sociální Sítě</h4>
            <div className="flex gap-4">
              <a href="https://www.tiktok.com/@platinumautobazar?_r=1&_t=ZN-98xqcmCfFn4" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <SiTiktok size={18} />
              </a>
              <a href="https://t.me/autonavse" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <SiTelegram size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-white/40 text-sm font-medium">
              © {new Date().getFullYear()} Autobazar Platinum Cars. Všechna práva vyhrazena.
            </p>
            <p className="text-white/25 text-xs mt-1">
              Vytvořeno:{' '}
              <a
                href="https://pidhornyi.eu"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white/50 transition-colors"
              >
                Pidhornyi.eu
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-white/40 text-sm font-medium">
            <Link href="/podminky" className="hover:text-white transition-colors">Podmínky použití</Link>
            <Link href="/zasady-soukromi" className="hover:text-white transition-colors">Zásady soukromí</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
