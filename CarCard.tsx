import React from 'react';
import { motion } from 'framer-motion';

export function BackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#050505]">
      {/* Slow shifting gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#020202] via-[#050810] to-[#020202]"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 25s ease infinite'
        }}
      />
      
      {/* Floating Orbs for breathing effect */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -100, 50, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary opacity-[0.08] blur-[130px]"
      />
      
      <motion.div
        animate={{
          x: [0, -150, 50, 0],
          y: [0, 150, -100, 0],
          scale: [1, 1.1, 0.8, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600 opacity-[0.06] blur-[150px]"
      />
      
      {/* Subtle overlay noise to keep it textured */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} 
      />
    </div>
  );
}
