import React from 'react';
import { motion } from 'framer-motion';

export default function Heatmap({ data = [] }) {
  const getColor = (count) => {
    if (count === 0) return "bg-white/5";
    if (count === 1) return "bg-green-500/20 border-green-500/30";
    if (count === 2) return "bg-green-500/40 border-green-500/50";
    if (count === 3) return "bg-green-500/60 border-green-500/70 shadow-[0_0_10px_rgba(34,197,94,0.3)]";
    return "bg-green-400 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
  };

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
            Activity Heatmap <span className="text-lg">🔥</span>
          </h2>
          <p className="text-[9px] uppercase font-mono tracking-wider text-gray-500 mt-0.5">
            System Synchronization: Last 30 Cycles
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-[9px] font-mono text-gray-500">
          <span>Less</span>
          <div className="flex gap-1 px-1 py-0.5 bg-black/40 rounded border border-white/5 shadow-inner">
            <div className="w-2 h-2 bg-white/5 rounded-[1px]" />
            <div className="w-2 h-2 bg-green-500/20 rounded-[1px]" />
            <div className="w-2 h-2 bg-green-500/40 rounded-[1px]" />
            <div className="w-2 h-2 bg-green-500/60 rounded-[1px]" />
            <div className="w-2 h-2 bg-green-400 rounded-[1px]" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-cols-6 sm:grid-cols-10 lg:grid-cols-15 gap-2.5">
        {data.map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={`w-full aspect-square rounded-sm border ${getColor(day.count)} transition-all duration-300 hover:scale-110 cursor-help relative group/item`}
          >
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-obsidian border border-white/10 rounded-lg text-[9px] font-mono text-white opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-2xl">
              <span className="text-neon-cyan">{day.date}</span>: {day.count} solved
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
