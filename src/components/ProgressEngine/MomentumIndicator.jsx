import React from 'react';
import { motion } from 'framer-motion';

export default function MomentumIndicator({ momentum }) {
  // momentum: 'high', 'medium', 'low'
  const config = {
    high: { icon: '🔥', label: 'High', color: 'text-neon-pink', bg: 'bg-neon-pink/10', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.4)]' },
    medium: { icon: '⚡', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/10', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.4)]' },
    low: { icon: '🌱', label: 'Low', color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]' },
  };

  const active = config[momentum] || config.low;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`px-4 py-3 rounded-xl border border-white/5 flex items-center gap-3 ${active.bg} backdrop-blur-md relative overflow-hidden group`}
    >
      <div 
        className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity blur-md ${active.bg}`}
      />
      
      <motion.span
        animate={momentum === 'high' ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-2xl"
      >
        {active.icon}
      </motion.span>
      
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-50">Momentum</span>
        <span className={`text-sm font-black font-display tracking-widest uppercase ${active.color} ${active.glow}`}>
          {active.label}
        </span>
      </div>
    </motion.div>
  );
}
