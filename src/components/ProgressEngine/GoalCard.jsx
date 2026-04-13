import React from 'react';
import { motion } from 'framer-motion';

export default function GoalCard({
  title = "Next Goal",
  description = "Solve 3 Medium Problems",
  reward = "+75 XP",
  progress = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl 
      bg-white/5 backdrop-blur-2xl 
      border border-white/10 
      p-5 shadow-lg min-w-[220px] group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold">
            {title}
          </h3>

          <span className="text-xs text-neon-cyan font-black font-mono">
            {reward}
          </span>
        </div>

        {/* Description */}
        <p className="text-white text-lg font-black font-display tracking-tight mb-4">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
        </div>

        {/* Progress Text */}
        <div className="flex justify-between mt-2 text-[11px] text-gray-500 font-mono tracking-wider">
          <span>Progress</span>
          <span className="text-silver-200 font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
}
