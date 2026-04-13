import React from 'react';
import { motion } from 'framer-motion';

export default function LevelSystem({ xp = 0 }) {
  const levels = [
    { name: "Beginner", xp: 0, icon: "🌱", color: "#94A3B8" },
    { name: "Explorer", xp: 100, icon: "🚀", color: "#22D3EE" },
    { name: "Solver", xp: 300, icon: "⚡", color: "#FACC15" },
    { name: "Advanced", xp: 700, icon: "🧠", color: "#A78BFA" },
    { name: "Expert", xp: 1200, icon: "💎", color: "#FB7185" },
    { name: "Master", xp: 2000, icon: "👑", color: "#F59E0B" },
  ];

  const getLevel = () => {
    let current = levels[0];
    for (let level of levels) {
      if (xp >= level.xp) {
        current = level;
      }
    }
    return current;
  };

  const getNextLevel = () => {
    for (let level of levels) {
      if (xp < level.xp) {
        return level;
      }
    }
    return null;
  };

  const current = getLevel();
  const next = getNextLevel();

  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden group h-full"
    >
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-5 blur-3xl transition-opacity duration-700 pointer-events-none"
        style={{ backgroundColor: current.color }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div>
          <h2 className="text-sm font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
            Skill Evolution <span className="text-lg">🎮</span>
          </h2>
          <p className="text-[9px] uppercase font-mono tracking-wider text-gray-500 mt-0.5">
             RPG Experience Tracker
          </p>
        </div>

        <motion.span 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        >
          {current.icon}
        </motion.span>
      </div>

      {/* Level Info */}
      <div className="mb-6 relative z-10">
        <div className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest mb-1">
          Current Synthesis Level
        </div>
        <div 
          className="text-3xl font-black font-display tracking-tighter"
          style={{ color: current.color, textShadow: `0 0 20px ${current.color}44` }}
        >
          {current.name}
        </h2>
      </div>

      {/* Progress Section */}
      <div className="relative z-10 space-y-3">
        <div className="flex justify-between items-baseline text-[10px] font-mono font-bold tracking-widest text-white/60">
          <span>{xp} XP ACCUMULATED</span>
          {next && <span className="text-gray-500">NEXT: {next.name}</span>}
        </div>

        <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            style={{ backgroundColor: current.color, boxShadow: `0 0 15px ${current.color}` }}
          />
        </div>

        {next && (
          <div className="text-[10px] text-gray-600 font-mono text-center tracking-tighter uppercase">
            Syncing {next.name} sequence... <span className="text-white/80">{Math.round(next.xp - xp)} XP REQUIRED</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
