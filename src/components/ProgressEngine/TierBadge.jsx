import React from 'react';
import { motion } from 'framer-motion';

export default function TierBadge({ tier }) {
  if (!tier) return null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      className="relative p-4 glass-card rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[140px] overflow-hidden group"
    >
      {/* Background Glow */}
      <div 
        className="absolute inset-0 opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40"
        style={{ backgroundColor: tier.color }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] mb-2 group-hover:scale-125 transition-transform duration-500">
          {tier.icon}
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] font-display font-black text-white/50 group-hover:text-white transition-colors">
          Rank Tier
        </span>
        <span 
          className="text-lg font-black font-display tracking-widest uppercase mt-1"
          style={{ 
            color: tier.color,
            textShadow: `0 0 10px ${tier.color}66`
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Progress to next tier visual */}
      {tier.nextTier && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${tier.progress}%` }}
            className="h-full"
            style={{ backgroundColor: tier.color }}
          />
        </div>
      )}
    </motion.div>
  );
}
