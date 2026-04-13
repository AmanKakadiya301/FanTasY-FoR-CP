import React from 'react';
import { motion } from 'framer-motion';

export default function RankTier({
  tier = "Bronze",
  xp = 0,
  nextXp = 150,
}) {
  const tiers = {
    Bronze: {
      icon: "🥉",
      color: "from-amber-600 to-yellow-500",
      glow: "shadow-amber-500/20",
    },
    Silver: {
      icon: "🥈",
      color: "from-gray-400 to-slate-300",
      glow: "shadow-gray-400/20",
    },
    Gold: {
      icon: "🥇",
      color: "from-yellow-400 to-amber-300",
      glow: "shadow-yellow-400/20",
    },
    Platinum: {
      icon: "💎",
      color: "from-cyan-400 to-blue-400",
      glow: "shadow-cyan-400/20",
    },
    Diamond: {
      icon: "👑",
      color: "from-purple-400 to-pink-400",
      glow: "shadow-purple-400/20",
    },
  };

  const current = tiers[tier] || tiers.Bronze;
  const progress = Math.min((xp / nextXp) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl 
      bg-white/5 backdrop-blur-2xl 
      border border-white/10 
      p-5 shadow-lg ${current.glow}`}
    >
      {/* Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-10 blur-xl transition-all duration-700`}
      />

      <div className="relative z-10 text-silver-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase font-mono font-black tracking-widest text-gray-400">
            Rank Tier
          </h3>

          <span className="text-2xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">{current.icon}</span>
        </div>

        {/* Tier Name */}
        <h2 className="text-lg font-black font-display tracking-tight mb-3">
          {tier}
        </h2>

        {/* Progress Bar */}
        <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6 }}
            className={`h-full bg-gradient-to-r ${current.color} shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
          />
        </div>

        {/* XP Info */}
        <div className="flex justify-between mt-2 text-[10px] font-mono tracking-wider font-bold text-gray-500">
          <span>{xp} XP</span>
          <span>{nextXp} XP</span>
        </div>
      </div>
    </motion.div>
  );
}
