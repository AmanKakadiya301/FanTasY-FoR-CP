import React from 'react';
import { motion } from 'framer-motion';
import LogoImg from '../../assets/branding/logo.png';

export default function LoginHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="flex justify-center mb-6"
    >
      {/* Floating logo box */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {/* Pulsing glow behind box */}
        <motion.div 
          className="absolute -inset-3 rounded-2xl blur-xl"
          style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.5), rgba(34,211,238,0.4))' }}
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Glass box */}
        <div 
          className="relative p-5 rounded-2xl border border-white/15"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 30px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan/50 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-cyan/50 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-purple/50 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-purple/50 rounded-br-2xl" />
          
          <img 
            src={LogoImg}
            alt="FanTasY Logo"
            className="w-14 h-14 object-contain"
            style={{ filter: 'brightness(1.5) drop-shadow(0 0 12px rgba(124,58,237,0.6))', transform: 'scale(1.4)' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
