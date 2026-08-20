import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Domů', href: '/' },
    { name: 'Vozy na prodej', href: '/vozy' },
    { name: 'Kontakt', href: '/kontakt' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 ${
        scrolled ? 'bg-white shadow-md py-4' : 'bg-white py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-3 group">
          <img src="/logo.png" alt="Platinum Cars Logo" className="w-[48px] h-[48px] object-contain transition-transform group-hover:scale-105" />
          <span className="font-brand text-xl xl:text-2xl tracking-[0.025em] text-black">
            Platinum Cars
          </span>
        </Link>

        {/* Desktop Nav Center */}
        <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href}
              className={`text-sm font-bold uppercase transition-colors relative group ${
                location === link.href ? 'text-primary' : 'text-[#333333] hover:text-primary'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transition-transform origin-left ${
                location === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`} />
            </Link>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <a href="tel:+420777876406" className="text-[#333333] font-bold text-lg hover:text-primary transition-colors flex items-center gap-2">
            <Phone size={20} className="text-primary" />
            +420 777 876 406
          </a>
          <a 
            href="tel:+420777876406"
            className="px-6 py-2.5 bg-primary text-white text-sm font-bold uppercase tracking-wide rounded-md hover:bg-[#152d52] transition-colors"
          >
            Zavolat
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-black p-2 hover:text-primary transition-colors z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[76px] bg-white z-40 flex flex-col items-center justify-center gap-10 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-3xl font-heading font-black uppercase ${
                  location === link.href ? 'text-primary' : 'text-black hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col items-center gap-6 mt-8">
              <a href="tel:+420777876406" className="text-2xl font-bold text-black flex items-center gap-3">
                <Phone size={24} className="text-primary" />
                +420 777 876 406
              </a>
              <a 
                href="tel:+420777876406"
                className="px-10 py-4 bg-primary text-white font-bold uppercase tracking-widest rounded-md"
              >
                Zavolat Nyní
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
