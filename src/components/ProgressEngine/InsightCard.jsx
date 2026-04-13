import React from 'react';
import { motion } from 'framer-motion';

export default function InsightCard({ type, message }) {
  const configs = {
    focus: {
      icon: "🎯",
      title: "Tactical Focus",
      color: "text-neon-cyan",
      bg: "bg-neon-cyan/5",
      border: "border-neon-cyan/20",
      glow: "shadow-[0_0_15px_rgba(34,211,238,0.1)]"
    },
    warning: {
      icon: "⚠️",
      title: "Action Required",
      color: "text-neon-pink",
      bg: "bg-neon-pink/5",
      border: "border-neon-pink/20",
      glow: "shadow-[0_0_15px_rgba(236,72,153,0.1)]"
    },
    success: {
      icon: "🔥",
      title: "System Optimized",
      color: "text-green-400",
      bg: "bg-green-400/5",
      border: "border-green-400/20",
      glow: "shadow-[0_0_15px_rgba(74,222,128,0.1)]"
    },
    info: {
      icon: "🧠",
      title: "Neural Sync",
      color: "text-neon-purple",
      bg: "bg-neon-purple/5",
      border: "border-neon-purple/20",
      glow: "shadow-[0_0_15px_rgba(124,58,237,0.1)]"
    }
  };

  const config = configs[type] || configs.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01, x: 5 }}
      className={`p-4 rounded-xl border ${config.bg} ${config.border} ${config.glow} flex items-start gap-4 transition-all duration-300`}
    >
      <div className="text-2xl mt-1">{config.icon}</div>
      <div className="flex-1">
        <h4 className={`text-[10px] uppercase tracking-[0.2em] font-mono font-black ${config.color} mb-1.5`}>
          {config.title}
        </h4>
        <p className="text-xs text-silver-300 font-sub leading-relaxed">
          {message}
        </p>
      </div>
    </motion.div>
  );
}
