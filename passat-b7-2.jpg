import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { SEO } from '@/components/SEO';

export default function ZasadyPage() {
  return (
    <div className="flex-1 w-full bg-white flex flex-col pt-[88px]">
      <SEO
        title="Zásady soukromí"
        description="Zásady ochrany osobních údajů a GDPR informace – Autobazar Platinum Cars. Správce: K pumpě, 250 69 Klíčany-Vodochody."
        canonical="/zasady-soukromi"
        noIndex
      />

      {/* Banner */}
      <div className="bg-primary text-white py-14">
        <div className="container mx-auto px-6">
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
            <Link href="/" className="hover:text-white transition-colors">Domů</Link>
            {' / '}Zásady soukromí
          </div>
          <h1 className="font-heading text-5xl md:text-6xl font-black uppercase leading-none">
            ZÁSADY SOUKROMÍ
          </h1>
          <p className="text-white/70 mt-2 text-sm">Ochrana osobních údajů · GDPR</p>
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

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10">
            <p className="text-[15px] text-gray-700 leading-relaxed">
              Platinum Cars respektuje vaše soukromí a chrání vaše osobní údaje v souladu s nařízením
              Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb.,
              o zpracování osobních údajů.
            </p>
          </div>

          <Section title="1. Správce osobních údajů">
            <p>
              Správcem vašich osobních údajů je:
            </p>
            <ul>
              <li><strong>Autobazar Platinum Cars</strong></li>
              <li>Sídlo: K pumpě, 250 69 Klíčany-Vodochody, Česká republika</li>
              <li>Telefon: <a href="tel:+420777876406" className="text-primary hover:underline">+420 777 876 406</a></li>
              <li>E-mail: <a href="mailto:info@platinumcars.cz" className="text-primary hover:underline">info@platinumcars.cz</a></li>
              <li>Telegram: <a href="https://t.me/autonavse" target="_blank" rel="noreferrer" className="text-primary hover:underline">t.me/autonavse</a></li>
            </ul>
          </Section>

          <Section title="2. Jaké osobní údaje zpracováváme">
            <p>V závislosti na způsobu komunikace s námi zpracováváme tyto kategorie údajů:</p>
            <ul>
              <li><strong>Kontaktní údaje</strong> — jméno, příjmení, telefonní číslo, e-mailová adresa</li>
              <li><strong>Komunikační údaje</strong> — obsah zpráv zaslaných přes kontaktní formulář, Telegram nebo telefonní hovor</li>
              <li><strong>Technické údaje</strong> — IP adresa, typ prohlížeče, navštívené stránky (pouze pokud používáme analytiku)</li>
            </ul>
            <p>Nezpracováváme citlivé osobní údaje (zdravotní stav, politické názory apod.).</p>
          </Section>

          <Section title="3. Účel a právní základ zpracování">
            <table>
              <thead>
                <tr>
                  <th>Účel</th>
                  <th>Právní základ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Odpověď na váš dotaz / nabídka vozidel</td>
                  <td>Oprávněný zájem (čl. 6 odst. 1 písm. f) GDPR)</td>
                </tr>
                <tr>
                  <td>Uzavření a plnění smlouvy o prodeji/výkupu</td>
                  <td>Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR)</td>
                </tr>
                <tr>
                  <td>Plnění zákonných povinností (účetnictví, daně)</td>
                  <td>Právní povinnost (čl. 6 odst. 1 písm. c) GDPR)</td>
                </tr>
                <tr>
                  <td>Analytika webu (pokud je aktivní)</td>
                  <td>Souhlas (čl. 6 odst. 1 písm. a) GDPR)</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Section title="4. Doba uchování osobních údajů">
            <p>Osobní údaje uchováváme pouze po dobu nezbytně nutnou:</p>
            <ul>
              <li>Kontaktní dotazy — do vyřízení dotazu, max. 12 měsíců</li>
              <li>Smluvní dokumentace — 10 let od uzavření smlouvy (zákonná povinnost)</li>
              <li>Účetní doklady — 5 let dle zákona o účetnictví</li>
            </ul>
          </Section>

          <Section title="5. Příjemci osobních údajů">
            <p>
              Vaše údaje neprodáváme třetím stranám. Mohou být sdíleny výhradně s:
            </p>
            <ul>
              <li>Poskytovateli technické infrastruktury (hosting, e-mail) — vázanými mlčenlivostí</li>
              <li>Státními orgány — pouze na základě zákonné povinnosti</li>
            </ul>
            <p>Údaje nepředáváme do třetích zemí mimo EU/EHP.</p>
          </Section>

          <Section title="6. Vaše práva">
            <p>Jako subjekt údajů máte právo:</p>
            <ul>
              <li><strong>Přístupu</strong> — získat potvrzení, zda zpracováváme vaše údaje, a jejich kopii</li>
              <li><strong>Opravy</strong> — požádat o opravu nepřesných nebo doplnění neúplných údajů</li>
              <li><strong>Výmazu</strong> — požádat o smazání údajů (právo být zapomenut)</li>
              <li><strong>Omezení zpracování</strong> — požádat o dočasné omezení zpracování</li>
              <li><strong>Přenositelnosti</strong> — obdržet vaše údaje ve strojově čitelném formátu</li>
              <li><strong>Námitky</strong> — vznést námitku proti zpracování na základě oprávněného zájmu</li>
              <li><strong>Odvolání souhlasu</strong> — kdykoli odvolat udělený souhlas bez dopadu na zákonnost předchozího zpracování</li>
            </ul>
            <p>
              Žádost podejte e-mailem na{' '}
              <a href="mailto:info@platinumcars.cz" className="text-primary hover:underline">
                info@platinumcars.cz
              </a>. Odpovíme do 30 dnů.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Stránky používají technické cookies nezbytné pro jejich správné fungování (např. uchování
              nastavení). Tyto cookies nevyžadují váš souhlas. Analytické nebo marketingové cookies
              aktivujeme pouze na základě vašeho výslovného souhlasu uděleného přes cookie lištu.
            </p>
            <p>
              Cookies třetích stran (Google Analytics apod.) zpracovávají data v souladu se zásadami
              soukromí příslušného poskytovatele.
            </p>
          </Section>

          <Section title="8. Zabezpečení">
            <p>
              Přijímáme přiměřená technická a organizační opatření k ochraně vašich údajů
              před neoprávněným přístupem, ztrátou nebo zničením. Přístup k osobním údajům
              je omezen na nezbytné minimum zaměstnanců.
            </p>
          </Section>

          <Section title="9. Právo podat stížnost">
            <p>
              Máte právo podat stížnost u dozorového úřadu — Úřadu pro ochranu osobních údajů (ÚOOÚ):
            </p>
            <ul>
              <li>Web: <a href="https://www.uoou.cz" target="_blank" rel="noreferrer" className="text-primary hover:underline">www.uoou.cz</a></li>
              <li>Datová schránka: qkbaa2n</li>
              <li>Adresa: Pplk. Sochora 27, 170 00 Praha 7</li>
            </ul>
          </Section>

          <Section title="10. Změny zásad">
            <p>
              Tyto zásady soukromí můžeme průběžně aktualizovat. O podstatných změnách vás
              informujeme. Aktuální verze je vždy dostupná na této stránce.
            </p>
          </Section>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <p className="text-gray-400 text-sm">
              Dotazy ohledně ochrany osobních údajů:{' '}
              <a href="mailto:info@platinumcars.cz" className="text-primary hover:underline">
                info@platinumcars.cz
              </a>
            </p>
            <Link
              href="/podminky"
              className="text-sm text-primary font-bold hover:underline"
            >
              Podmínky použití →
            </Link>
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
      <div className="text-gray-600 leading-relaxed text-[15px] space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_table]:w-full [&_table]:border-collapse [&_th]:text-left [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-gray-400 [&_th]:pb-2 [&_th]:border-b [&_th]:border-gray-100 [&_td]:py-2 [&_td]:border-b [&_td]:border-gray-50 [&_td]:text-sm">
        {children}
      </div>
    </div>
  );
}
