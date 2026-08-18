import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_KEY = 'pc_splash_v1';

export function SplashScreen() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SPLASH_KEY));
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    sessionStorage.setItem(SPLASH_KEY, '1');

    // Start exit animation at 2.6s, fully gone by ~3.3s
    const t = setTimeout(() => setExiting(true), 2600);
    const t2 = setTimeout(() => setVisible(false), 3350);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#060d1a' }}
          animate={exiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient glow behind logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2.5, opacity: 0.12 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="absolute w-72 h-72 rounded-full bg-[#1B3664] blur-3xl pointer-events-none"
          />

          {/* Logo + ring */}
          <motion.div
            className="relative flex items-center justify-center mb-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={exiting
              ? { scale: 1.15, opacity: 0 }
              : { scale: 1,    opacity: 1 }
            }
            transition={exiting
              ? { duration: 0.6, ease: 'easeIn' }
              : { duration: 0.8, delay: 0.15, ease: [0.34, 1.36, 0.64, 1] }
            }
          >
            {/* Pulsing outer ring */}
            <motion.div
              className="absolute rounded-full border border-[#1B3664]/60"
              animate={{ scale: [1, 1.22, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 168, height: 168 }}
            />
            {/* Rotating dashed ring */}
            <motion.div
              className="absolute rounded-full border border-dashed border-[#1B3664]/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              style={{ width: 148, height: 148 }}
            />
            <img
              src="/logo.png"
              alt="Platinum Cars"
              className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl"
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={exiting ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
            transition={exiting
              ? { duration: 0.4, ease: 'easeIn' }
              : { duration: 0.55, delay: 0.7 }
            }
            className="text-center"
          >
            <p className="text-white font-heading font-black text-3xl uppercase tracking-[0.2em] mb-3">
              Platinum Cars
            </p>
            <p className="text-white/45 text-xs font-bold uppercase tracking-[0.35em]">
              Prémiová jízda. Jistá volba.
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-10 w-36 h-[2px] bg-white/8 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#1B3664] via-blue-400 to-[#1B3664]"
              initial={{ scaleX: 0 }}
              animate={exiting ? { scaleX: 1 } : { scaleX: 1 }}
              style={{ originX: 0 }}
              transition={{ duration: 2.5, delay: 0.3, ease: 'linear' }}
            />
          </div>

          {/* Corner accents */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`absolute w-8 h-8 border-[#1B3664]/40 ${cls}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
