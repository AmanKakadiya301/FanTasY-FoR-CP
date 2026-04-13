import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({
  easySolved = 0,
  easyTotal = 0,
  mediumSolved = 0,
  mediumTotal = 0,
  hardSolved = 0,
  hardTotal = 0,
}) {
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = easyTotal + mediumTotal + hardTotal;

  const easyPercent = totalProblems === 0 ? 0 : (easySolved / totalProblems) * 100;
  const mediumPercent = totalProblems === 0 ? 0 : (mediumSolved / totalProblems) * 100;
  const hardPercent = totalProblems === 0 ? 0 : (hardSolved / totalProblems) * 100;
  const overall = totalProblems === 0 ? 0 : (totalSolved / totalProblems) * 100;

  return (
    <div className="space-y-4">
      {/* Overall Percent */}
      <div className="flex justify-between items-baseline">
        <span className="text-[10px] uppercase font-mono font-black tracking-[0.3em] text-gray-500">Overall Progress</span>
        <span className="text-lg font-black font-display text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          {Math.round(overall)}%
        </span>
      </div>

      {/* Multi Segment Bar */}
      <div className="relative w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-[inner_0_2px_4px_rgba(0,0,0,0.5)]">
        {/* Easy */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${easyPercent}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full 
          bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_10px_rgba(74,222,128,0.3)]"
        />

        {/* Medium */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${mediumPercent}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          style={{ left: `${easyPercent}%` }}
          className="absolute top-0 h-full 
          bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(250,204,21,0.3)]"
        />

        {/* Hard */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${hardPercent}%` }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          style={{ left: `${easyPercent + mediumPercent}%` }}
          className="absolute top-0 h-full 
          bg-gradient-to-r from-red-400 to-pink-500 shadow-[0_0_10px_rgba(244,114,182,0.3)]"
        />
      </div>

      {/* Legend */}
      <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest text-gray-500 uppercase italic">
        <span className="flex items-center gap-1.5 transition-colors hover:text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
          Easy
        </span>

        <span className="flex items-center gap-1.5 transition-colors hover:text-yellow-400">
          <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
          Medium
        </span>

        <span className="flex items-center gap-1.5 transition-colors hover:text-pink-400">
          <div className="w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_5px_rgba(244,114,182,0.5)]" />
          Hard
        </span>
      </div>
    </div>
  );
}
