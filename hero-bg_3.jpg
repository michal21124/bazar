import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';

export default function PodminkyPage() {
  return (
    <div className="flex-1 w-full bg-white flex flex-col pt-[88px]">
      <SEO
        title="Podmínky použití"
        description="Obchodní podmínky a podmínky použití webu Autobazar Platinum Cars, se sídlem K pumpě, 250 69 Klíčany-Vodochody."
        canonical="/podminky"
        noIndex
      />

      {/* Banner */}
      <div className="bg-primary text-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            {' / '}Podmínky použití
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase leading-none">
            PODMÍNKY POUŽITÍ
          </h1>
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-16 max-w-4xl"
      >
        <div className="prose prose-gray max-w-none">

          <p className="text-gray-500 text-sm mb-10">Platné od 1. ledna 2024 · Autobazar Platinum Cars</p>

          <Section title="1. Provozovatel">
            <p>
              Provozovatelem webových stránek <strong>platinumcars.cz</strong> je autobazar Platinum Cars,
              se sídlem K pumpě, 250 69 Klíčany-Vodochody, Česká republika.
              Kontakt: <a href="tel:+420777876406" className="text-primary hover:underline">+420 777 876 406</a>,
              e-mail: <a href="mailto:info@platinumcars.cz" className="text-primary hover:underline">info@platinumcars.cz</a>.
            </p>
          </Section>

          <Section title="2. Účel stránek">
            <p>
              Tyto webové stránky slouží jako informační a prezentační platforma autobazaru Platinum Cars.
              Jejich prostřednictvím prezentujeme aktuální nabídku vozů, podmínky výkupu a výměny
              a kontaktní informace. Stránky nejsou e-shopem a neprovádí se zde platby.
            </p>
          </Section>

          <Section title="3. Nabídka vozů">
            <p>
              Veškeré informace o vozidlech (cena, stav tachometru, rok výroby, výbava) jsou
              uváděny v dobré víře a mohou se průběžně měnit. Zobrazená cena je orientační
              a konečná cena se sjednává individuálně při osobní prohlídce vozidla. Platinum Cars
              si vyhrazuje právo kdykoli aktualizovat, přidat nebo odebrat vozidla z nabídky
              bez předchozího upozornění.
            </p>
          </Section>

          <Section title="4. Autorská práva">
            <p>
              Veškerý obsah těchto stránek — texty, fotografie, grafika, logo a celkový design —
              je chráněn autorským právem. Kopírování, šíření nebo jiné užití obsahu bez
              předchozího písemného souhlasu provozovatele je zakázáno.
            </p>
          </Section>

          <Section title="5. Ochrana osobních údajů">
            <p>
              Zpracování osobních údajů je upraveno samostatným dokumentem{' '}
              <Link href="/zasady-soukromi" className="text-primary hover:underline">Zásady soukromí</Link>.
              Používáním těchto stránek potvrzujete, že jste se s těmito zásadami seznámili.
            </p>
          </Section>

          <Section title="6. Omezení odpovědnosti">
            <p>
              Platinum Cars vynakládá veškeré úsilí k tomu, aby informace na stránkách byly
              přesné a aktuální. Přesto nenese odpovědnost za případné chyby, nepřesnosti
              ani škody vzniklé spoléháním se na obsah stránek. Doporučujeme vždy
              ověřit aktuální dostupnost a parametry vozidla telefonicky nebo osobně.
            </p>
          </Section>

          <Section title="7. Dostupnost stránek">
            <p>
              Provozovatel se snaží zajistit nepřetržitý provoz stránek, ale neodpovídá
              za výpadky způsobené technickými problémy, údržbou nebo okolnostmi mimo
              jeho kontrolu.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Stránky mohou používat technické cookies nezbytné pro správné fungování
              webu. Analytické nebo marketingové cookies používáme pouze se souhlasem
              uživatele v souladu s GDPR.
            </p>
          </Section>

          <Section title="9. Změny podmínek">
            <p>
              Platinum Cars si vyhrazuje právo tyto podmínky kdykoli upravit.
              Aktuální verze je vždy dostupná na této stránce. Doporučujeme podmínky
              pravidelně kontrolovat.
            </p>
          </Section>

          <Section title="10. Rozhodné právo">
            <p>
              Tyto podmínky se řídí právním řádem České republiky. Veškeré případné
              spory budou řešeny před příslušnými soudy České republiky.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-gray-400 text-sm">
              Máte-li dotazy k těmto podmínkám, kontaktujte nás na{' '}
              <a href="mailto:info@platinumcars.cz" className="text-primary hover:underline">
                info@platinumcars.cz
              </a>.
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-heading text-2xl font-black uppercase text-black mb-4 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed text-[15px] space-y-3">{children}</div>
    </div>
  );
}
