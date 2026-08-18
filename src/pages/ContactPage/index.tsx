import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, CheckCircle } from 'lucide-react';
import { SiTiktok, SiTelegram } from 'react-icons/si';
import { SEO } from '@/components/SEO';

export default function ContactPage() {
  const [fields, setFields] = useState({ name: '', contact: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        ...fields,
      });
      const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body.toString() });
      if (res.ok) { setStatus('sent'); setFields({ name: '', contact: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="flex-1 w-full bg-white flex flex-col pt-[88px] min-h-screen">
      <SEO
        title="Kontakt"
        description="Navštivte Autobazar Platinum Cars v Klíčanech-Vodochodech nebo nás kontaktujte na +420 777 876 406. Rádi vám pomůžeme s výběrem, výkupem nebo výměnou vozu."
        canonical="/kontakt"
        breadcrumbs={[{ name: 'Kontakt', item: '/kontakt' }]}
      />
      
      {/* Top Banner */}
      <div className="bg-primary text-white py-16 md:py-24">
        <div className="container mx-auto px-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-white/80 text-sm font-bold uppercase tracking-widest mb-4">
              Domů / Kontakt
            </div>
            <h1 className="font-heading text-6xl md:text-7xl lg:text-[6rem] font-black uppercase leading-none drop-shadow-md">
              KONTAKTUJTE NÁS
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 flex-1">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column: Info & Form */}
          <div className="flex flex-col gap-12">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-heading text-4xl font-bold uppercase text-black mb-8">Jsme tu pro vás</h2>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Telefon</h3>
                    <a href="tel:+420777876406" className="text-2xl font-black text-black hover:text-primary transition-colors">+420 777 876 406</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Adresa</h3>
                    <p className="text-xl font-bold text-black">K pumpě, 250 69<br />Klíčany-Vodochody</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Otevírací doba</h3>
                    <p className="text-xl font-bold text-black">Po - Ne: Po předchozí domluvě</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-50 p-8 rounded-2xl border border-gray-100"
            >
              <h2 className="font-heading text-3xl font-bold uppercase text-black mb-6">Napište nám</h2>

              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4 py-10 text-center"
                  >
                    <CheckCircle className="text-emerald-500" size={52} />
                    <h3 className="font-heading text-2xl font-black uppercase text-black">Zpráva odeslána!</h3>
                    <p className="text-gray-500 text-sm">Ozveme se vám co nejdříve.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-2 px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      Odeslat další zprávu
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    name="contact"
                    data-netlify="true"
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit}
                  >
                    <input type="hidden" name="form-name" value="contact" />
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jméno</label>
                      <input
                        type="text" name="name" required
                        value={fields.name} onChange={e => setFields(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Vaše jméno"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefon / E-mail</label>
                      <input
                        type="text" name="contact" required
                        value={fields.contact} onChange={e => setFields(f => ({ ...f, contact: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Kam se vám ozveme?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Zpráva</label>
                      <textarea
                        rows={4} name="message" required
                        value={fields.message} onChange={e => setFields(f => ({ ...f, message: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                        placeholder="O co máte zájem?"
                      />
                    </div>
                    {status === 'error' && (
                      <p className="text-red-500 text-sm font-medium">Chyba při odesílání. Zkuste to prosím znovu.</p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full mt-2 py-4 bg-primary text-white font-bold uppercase tracking-wider rounded-lg hover:bg-[#152d52] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? 'Odesílání...' : 'Odeslat zprávu'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
            
          </div>

          {/* Right Column: Maps & Socials */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-8 h-full"
          >
            <div className="flex-1 w-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2553.864197361955!2d14.4172551!3d50.2102146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470bee4cd811a2bd%3A0xc07ce61d7b1b0b5c!2sK%20pump%C4%9B%2C%20250%2069%20Kl%C3%AD%C4%8Dany-Vodochody!5e0!3m2!1sen!2scz!4v1700000000000!5m2!1sen!2scz" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

            <div className="bg-black text-white p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-2xl font-bold uppercase mb-2">Sledujte nás online</h3>
                <p className="text-white/70 text-sm">Nové vozy, akce a komunita</p>
              </div>
              <div className="flex gap-4">
                <a href="https://www.tiktok.com/@platinumautobazar?_r=1&_t=ZN-98xqcmCfFn4" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors">
                  <SiTiktok size={20} />
                </a>
                <a href="https://t.me/autonavse" target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/10 hover:bg-[#0088cc] rounded-full flex items-center justify-center transition-colors">
                  <SiTelegram size={20} />
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
