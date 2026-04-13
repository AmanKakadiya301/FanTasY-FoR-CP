import React from 'react';
import { motion } from 'framer-motion';

export default function Achievements({
  totalSolved = 0,
  streak = 0,
  mediumSolved = 0,
  hardSolved = 0,
}) {
  const achievements = [
    {
      title: "First Problem",
      description: "Solve your first problem",
      icon: "🌱",
      unlocked: totalSolved >= 1,
      rarity: 'common'
    },
    {
      title: "Getting Started",
      description: "Solve 10 problems",
      icon: "🚀",
      unlocked: totalSolved >= 10,
      rarity: 'rare'
    },
    {
      title: "Consistency Builder",
      description: "3 Day Streak",
      icon: "🔥",
      unlocked: streak >= 3,
      rarity: 'rare'
    },
    {
      title: "Serious Solver",
      description: "Solve 25 problems",
      icon: "⚡",
      unlocked: totalSolved >= 25,
      rarity: 'epic'
    },
    {
      title: "Medium Challenger",
      description: "Solve 5 Medium problems",
      icon: "🧠",
      unlocked: mediumSolved >= 5,
      rarity: 'epic'
    },
    {
      title: "Hard Breakthrough",
      description: "Solve first Hard problem",
      icon: "💎",
      unlocked: hardSolved >= 1,
      rarity: 'epic'
    },
    {
      title: "50 Club",
      description: "Solve 50 problems",
      icon: "🏆",
      unlocked: totalSolved >= 50,
      rarity: 'legendary'
    },
    {
      title: "100 Master",
      description: "Solve 100 problems",
      icon: "👑",
      unlocked: totalSolved >= 100,
      rarity: 'legendary'
    },
  ];

  const rarityConfig = {
    common: { border: 'border-white/5', glow: 'shadow-white/5', label: 'Common' },
    rare: { border: 'border-neon-cyan/20', glow: 'shadow-neon-cyan/10', label: 'Rare' },
    epic: { border: 'border-neon-purple/30', glow: 'shadow-neon-purple/20', label: 'Epic' },
    legendary: { border: 'border-yellow-400/40', glow: 'shadow-yellow-400/30', label: 'Legendary' }
  };

  return (
    <section className="mt-8 mb-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-black font-display tracking-widest text-white uppercase">
          Neural Achievements 🏆
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => {
          const config = rarityConfig[achievement.rarity];
          const isUnlocked = achievement.unlocked;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={isUnlocked ? { y: -5, scale: 1.02 } : {}}
              className={`relative overflow-hidden rounded-2xl border backdrop-blur-3xl p-5 transition-all duration-500 group
                ${isUnlocked ? `bg-white/5 ${config.border} ${config.glow}` : 'bg-white/[0.02] border-white/5 opacity-40 blur-[0.5px] grayscale'}
              `}
            >
              {/* Background Glow */}
              {isUnlocked && (
                <div className={`absolute -inset-1 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700
                  ${achievement.rarity === 'legendary' ? 'bg-yellow-400' : achievement.rarity === 'epic' ? 'bg-neon-purple' : 'bg-neon-cyan'}
                `} />
              )}

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-3xl filter transition-transform duration-500 ${isUnlocked ? 'group-hover:scale-125' : ''}`}>
                    {achievement.icon}
                  </span>
                  {isUnlocked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`text-[9px] font-mono font-black border rounded px-1.5 py-0.5 uppercase tracking-tighter
                        ${achievement.rarity === 'legendary' ? 'border-yellow-400/50 text-yellow-400' : achievement.rarity === 'epic' ? 'border-neon-purple/50 text-neon-purple' : 'border-neon-cyan/50 text-neon-cyan'}
                      `}
                    >
                      {achievement.rarity}
                    </motion.span>
                  )}
                </div>

                <h3 className={`text-sm font-black font-display tracking-wide mb-1 ${isUnlocked ? 'text-white' : 'text-silver-600'}`}>
                  {achievement.title}
                </h3>
                <p className={`text-[10px] leading-relaxed font-sub ${isUnlocked ? 'text-silver-400' : 'text-silver-700'}`}>
                  {achievement.description}
                </p>

                {isUnlocked && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-green-400 font-mono font-bold tracking-[0.2em] flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      UNLOCKED
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
