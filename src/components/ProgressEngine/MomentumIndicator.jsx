import React from 'react';
import { motion } from 'framer-motion';

export default function MomentumIndicator({
  momentum = "low", // low | medium | high
  streak = 0,
}) {
  const config = {
    high: {
      label: "High Momentum",
      color: "from-green-400 to-emerald-500",
      glow: "shadow-green-500/20",
      icon: "🔥",
      description: "You're on fire. Keep solving.",
    },
    medium: {
      label: "Steady Momentum",
      color: "from-yellow-400 to-orange-500",
      glow: "shadow-yellow-500/20",
      icon: "⚡",
      description: "You're doing well. Stay consistent.",
    },
    low: {
      label: "Low Momentum",
      color: "from-cyan-400 to-blue-500",
      glow: "shadow-cyan-500/20",
      icon: "🌱",
      description: "Let's warm up your engine.",
    },
  };

  const current = config[momentum] || config.low;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl 
      bg-white/5 backdrop-blur-2xl 
      border border-white/10 
      p-5 shadow-lg ${current.glow} min-w-[220px]`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-10 blur-xl`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] text-gray-400 uppercase tracking-widest font-mono font-bold">
            Learning Momentum
          </h3>

          <span className="text-2xl">{current.icon}</span>
        </div>

        {/* Label */}
        <h2 className="text-white text-lg font-black font-display tracking-tight mb-1">
          {current.label}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-xs mb-4 font-sub leading-relaxed">
          {current.description}
        </p>

        {/* Streak */}
        <div className="flex justify-between text-[11px] text-gray-500 font-mono tracking-wider">
          <span>Current Streak</span>
          <span className="text-white font-black">
            {streak} days
          </span>
        </div>
      </div>
    </motion.div>
  );
}
