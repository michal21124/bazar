import React from 'react';
import { SEO } from '../../components/SEO';
import { Hero } from './Hero';
import { About } from '../../components/About';
import { Services } from '../../components/Services';
import { FeaturedInventory } from './FeaturedInventory';
import { ContactSection } from '../../components/ContactSection';

export default function HomePage() {
  return (
    <div className="flex-1 w-full bg-white">
      <SEO
        canonical="/"
        description="Autobazar Platinum Cars — prémiová ojetá vozidla v Klíčanech-Vodochodech u Prahy. Výkup, prodej a výměna vozů. Prémiové značky: BMW, Audi, Mercedes, Škoda. ☎ +420 777 876 406"
        faq={[
          { question: 'Kde se Autobazar Platinum Cars nachází?', answer: 'Nacházíme se na adrese K pumpě, 250 69 Klíčany-Vodochody u Prahy, přibližně 20 km severně od centra Prahy.' },
          { question: 'Jak mohu kontaktovat autobazar Platinum Cars?', answer: 'Zavolejte nám na +420 777 876 406 nebo napište na Telegram: t.me/autonavse. Jsme k dispozici Po–Pá 9:00–18:00, So 9:00–14:00.' },
          { question: 'Vykupujete ojetá auta za hotové?', answer: 'Ano, vykupujeme všechny značky a typy vozů za nejvyšší možnou tržní cenu. Platba probíhá ihned na ruku nebo převodem.' },
          { question: 'Je možné vyměnit stávající auto za jiné?', answer: 'Samozřejmě. Přijímáme váš vůz jako část platby (trade-in) za nový vůz z naší nabídky. Vše vyřídíme na místě bez komplikací.' },
          { question: 'Jsou vozy v nabídce prověřené?', answer: 'Ano, každý vůz v naší nabídce prochází pečlivou kontrolou technického stavu a má jasnou historii.' },
        ]}
      />
      <Hero />
      <FeaturedInventory />
      <About />
      <Services />
      <ContactSection />
    </div>
  );
}
