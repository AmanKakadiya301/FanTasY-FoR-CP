import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ easyCount, easyTotal, mediumCount, mediumTotal, hardCount, hardTotal }) {
  const total = easyTotal + mediumTotal + hardTotal;
  
  const easyPct = total > 0 ? (easyCount / total) * 100 : 0;
  const mediumPct = total > 0 ? (mediumCount / total) * 100 : 0;
  const hardPct = total > 0 ? (hardCount / total) * 100 : 0;
  const remainingPct = 100 - (easyPct + mediumPct + hardPct);

  return (
    <div className="w-full">
      <div className="h-4 bg-white/5 rounded-full overflow-hidden flex border border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.3)] relative">
        {/* Easy Segment */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${easyPct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-neon-cyan/80 to-neon-cyan shadow-[0_0_15px_rgba(34,211,238,0.4)]"
        />
        {/* Medium Segment */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${mediumPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="h-full bg-gradient-to-r from-yellow-400/80 to-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.4)]"
        />
        {/* Hard Segment */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hardPct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="h-full bg-gradient-to-r from-neon-pink/80 to-neon-pink shadow-[0_0_15px_rgba(236,72,153,0.4)]"
        />
      </div>
      
      {/* Legend */}
      <div className="flex justify-between items-center mt-3 px-1">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-neon-cyan/70">
            <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
            EZ {easyCount}/{easyTotal}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-yellow-400/70">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
            MD {mediumCount}/{mediumTotal}
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-widest text-neon-pink/70">
            <div className="w-2 h-2 rounded-full bg-neon-pink shadow-[0_0_5px_rgba(236,72,153,0.5)]" />
            HD {hardCount}/{hardTotal}
          </div>
        </div>
      </div>
    </div>
  );
}
