import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CarFront, Banknote, RefreshCw, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const services = [
  {
    title: 'VÝKUP AUT',
    description: 'Vykoupíme váš vůz za nejvyšší možnou tržní cenu. Peníze ihned na ruku bez zbytečných průtahů.',
    icon: Banknote,
    accent: 'Rychle & Férově',
  },
  {
    title: 'PRODEJ VOZŮ',
    description: 'Široký výběr pečlivě prověřených prémiových i cenově dostupných vozů s jasnou historií.',
    icon: CarFront,
    accent: 'Prověřená kvalita',
  },
  {
    title: 'VÝMĚNA',
    description: 'Chcete novější model? Vyměňte svůj starý vůz za nový s výhodným doplatkem přímo u nás.',
    icon: RefreshCw,
    accent: 'Bez komplikací',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 56, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: {
      duration: 0.65,
      delay: i * 0.14,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = service.icon;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -10,
        transition: { type: 'spring', stiffness: 320, damping: 22 },
      }}
      className="relative bg-white rounded-2xl overflow-hidden cursor-default flex flex-col"
      style={{
        boxShadow: hovered
          ? '0 24px 64px rgba(27,54,100,0.16), 0 4px 16px rgba(27,54,100,0.10)'
          : '0 2px 16px rgba(27,54,100,0.07)',
        transition: 'box-shadow 0.35s ease',
      }}
    >
      {/* Top accent bar — expands on hover */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#1B3664] to-blue-500 origin-left"
        animate={{ height: hovered ? 4 : 3, scaleX: hovered ? 1 : 0.6 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />

      {/* Shine sweep on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ x: hovered ? '110%' : '-30%', opacity: hovered ? 0.06 : 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)',
          width: '80%',
        }}
      />

      <div className="p-8 flex flex-col flex-1">
        {/* Accent label */}
        <motion.span
          className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/60 mb-5 block"
          animate={{ opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.25 }}
        >
          {service.accent}
        </motion.span>

        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl bg-primary/8 flex items-center justify-center mb-6 relative overflow-hidden"
          animate={{
            backgroundColor: hovered ? 'rgba(27,54,100,0.12)' : 'rgba(27,54,100,0.08)',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={hovered ? { rotate: 360, scale: 1.15 } : { rotate: 0, scale: 1 }}
            transition={hovered
              ? { type: 'spring', stiffness: 200, damping: 14, duration: 0.6 }
              : { duration: 0.4 }
            }
          >
            <Icon className="w-7 h-7 text-primary" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <h3 className="font-heading text-3xl font-black text-black uppercase mb-4 leading-tight">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-base leading-relaxed flex-grow mb-8">
          {service.description}
        </p>

        {/* CTA */}
        <Link href="/kontakt">
          <motion.div
            className="flex items-center gap-2 text-primary font-bold uppercase text-sm tracking-wider group"
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            Zjistit více
            <motion.div
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <ArrowRight size={16} />
            </motion.div>
          </motion.div>
        </Link>
      </div>

      {/* Bottom navy line that fills on hover */}
      <motion.div
        className="h-0.5 bg-gradient-to-r from-[#1B3664] to-blue-400 origin-left"
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="py-28 bg-[#F7F8FA]">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-5"
          >
            JAK PRACUJEME
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="font-heading text-5xl md:text-6xl font-black text-black uppercase"
          >
            NAŠE SLUŽBY
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-7">
          {services.map((service, index) => (
            <ServiceCard key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
