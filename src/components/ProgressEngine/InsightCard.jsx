import React from 'react';
import { motion } from 'framer-motion';

export default function InsightCard({
  title = "Smart Insight",
  message = "You're doing great. Keep solving.",
  type = "info", // info | warning | success | focus
}) {
  const config = {
    info: {
      icon: "🧠",
      color: "from-cyan-400 to-blue-500",
      glow: "shadow-cyan-500/20",
    },
    warning: {
      icon: "⚠️",
      color: "from-yellow-400 to-orange-500",
      glow: "shadow-yellow-500/20",
    },
    success: {
      icon: "🎯",
      color: "from-green-400 to-emerald-500",
      glow: "shadow-green-500/20",
    },
    focus: {
      icon: "🎯",
      color: "from-purple-400 to-pink-500",
      glow: "shadow-purple-500/20",
    },
  };

  const current = config[type] || config.info;

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
        className={`absolute inset-0 bg-gradient-to-r ${current.color} opacity-10 blur-xl`}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3 text-silver-400">
          <h3 className="text-[10px] uppercase font-mono font-black tracking-widest">
            {title}
          </h3>

          <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{current.icon}</span>
        </div>

        {/* Message */}
        <p className="text-white text-xs leading-relaxed font-sub">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
