import React from 'react';
import { motion } from 'framer-motion';

export default function GoalCard({ goal, progress, total, reward }) {
  const pct = total > 0 ? (progress / total) * 100 : 0;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-4 glass-card rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group min-w-[200px]"
    >
      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
        <span className="text-4xl text-neon-cyan">🎯</span>
      </div>

      <div className="relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-neon-cyan/70 font-bold block mb-2">Next Objective</span>
        <h4 className="text-sm font-bold text-silver-100 mb-3 pr-8">{goal}</h4>
        
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-silver-400">Progress</span>
            <span className="text-neon-cyan font-bold">{progress} / {total}</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-mono text-neon-purple font-bold">REWARD: {reward} XP</span>
          </div>
          {pct === 100 && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity }}
              className="text-xs"
            >
              🎉
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
