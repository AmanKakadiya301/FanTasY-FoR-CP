import React from 'react';
import { motion } from 'framer-motion';

export default function LoginCard({ children }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-sm mx-auto z-10 relative px-4"
    >
      {/* Neon aura glow behind card */}
      <div className="absolute -inset-6 rounded-3xl blur-3xl bg-neon-purple/10 pointer-events-none" />
      <div className="absolute -inset-10 rounded-3xl blur-[80px] bg-neon-cyan/5 pointer-events-none" />

      {/* Floating animation */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Animated neon border wrapper */}
        <div className="relative rounded-2xl p-[1px] overflow-hidden">
          {/* Rotating gradient border */}
          <motion.div 
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'conic-gradient(from 0deg, rgba(124,58,237,0.4), rgba(34,211,238,0.3), rgba(59,130,246,0.3), rgba(236,72,153,0.2), rgba(124,58,237,0.4))',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Glass card body */}
          <div 
            className="relative rounded-2xl"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 0 50px rgba(124,58,237,0.15), 0 0 100px rgba(34,211,238,0.05), 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Top glare line */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
            {/* Bottom subtle line */}
            <div className="absolute bottom-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10 p-7">
              {children}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
