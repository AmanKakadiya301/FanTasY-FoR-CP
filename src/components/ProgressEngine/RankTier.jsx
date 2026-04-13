import React from 'react';
import { motion } from 'framer-motion';

export default function RankTier({ tier, xp, nextXp }) {
  if (!tier) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-5 glass-card rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group min-w-[200px]"
    >
      <div 
        className="absolute inset-0 opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: tier.color }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] mb-3 group-hover:scale-110 transition-transform duration-500">
          {tier.icon}
        </span>
        
        <h3 className="text-[10px] uppercase tracking-[0.3em] font-mono text-gray-500 font-bold mb-1">
          Rank Status
        </h3>
        
        <h2 
          className="text-xl font-black font-display tracking-widest uppercase mb-4"
          style={{ color: tier.color, textShadow: `0 0 10px ${tier.color}44` }}
        >
          {tier.label}
        </h2>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-[10px] font-mono tracking-wider">
            <span className="text-gray-500">Total XP</span>
            <span className="text-white font-bold">{xp}</span>
          </div>
          
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tier.progress || 0}%` }}
              className="h-full"
              style={{ backgroundColor: tier.color, boxShadow: `0 0 10px ${tier.color}` }}
            />
          </div>
          
          <div className="text-[9px] text-gray-600 font-mono text-right">
            {tier.nextTier ? `Next Rank: ${tier.nextTier.minXP} XP` : 'MAX RANK REACHED'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
