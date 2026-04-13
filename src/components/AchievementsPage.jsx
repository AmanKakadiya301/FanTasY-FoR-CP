import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import Achievements from './Achievements.jsx';

export default function AchievementsPage({ solved, levels, streak }) {
  const solvedCount = Object.keys(solved).length;

  // Calculate difficulty stats for milestones
  const difficultyStats = useMemo(() => {
    const stats = { easy: 0, medium: 0, hard: 0 };
    levels.forEach(l => l.weeks.forEach(w => w.topics.forEach(t => {
      if (!t.problems) return;
      t.problems.forEach(p => {
        if (solved[p.id]) {
          const d = (p.difficulty || 'medium').toLowerCase();
          if (stats[d] !== undefined) stats[d]++;
        }
      });
    })));
    return stats;
  }, [solved, levels]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <div className="py-4">
        <h1 className="text-3xl font-black font-display tracking-widest text-white uppercase">
          Achievements Hub <span className="text-neon-purple drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]">🏆</span>
        </h1>
        <p className="text-[10px] uppercase font-mono tracking-[0.4em] font-bold text-gray-500 mt-1">
           Your Neural Milestones & Evolution Badges
        </p>
      </div>

      {/* Main Grid */}
      <Achievements 
        totalSolved={solvedCount}
        streak={streak?.count || 0}
        mediumSolved={difficultyStats.medium}
        hardSolved={difficultyStats.hard}
      />

      {/* Rarity Legend / Collection Summary */}
      <div className="glass-card p-8 rounded-3xl border border-white/[0.08] bg-obsidian/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Achievement Tiers</h2>
            <p className="text-silver-500 text-sm font-sub leading-relaxed mb-6">
               Milestones are categorized by neural complexity. Higher rarity badges feature intensive energy glows and localized particle effects.
            </p>
            
            <div className="space-y-3">
               <LegendItem rarity="Common" color="text-gray-400" bg="bg-white/5" desc="Standard developmental milestones" />
               <LegendItem rarity="Rare" color="text-neon-cyan" bg="bg-neon-cyan/10" desc="Consistency & difficulty graduation" />
               <LegendItem rarity="Epic" color="text-neon-purple" bg="bg-neon-purple/10" desc="Volume peaks & hard breakthroughs" />
               <LegendItem rarity="Legendary" color="text-yellow-400" bg="bg-yellow-400/10" desc="Elite-level system mastery" />
            </div>
          </div>

          <div className="hidden md:flex justify-center">
             <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-spin-slow rotate-45" />
                <div className="absolute inset-4 rounded-full border border-neon-cyan/20 animate-spin-slow" style={{ animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🏅</div>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LegendItem({ rarity, color, bg, desc }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`w-2.5 h-2.5 rounded-full ${bg.replace('10', '40')} shadow-[0_0_8px_currentColor] ${color}`} />
      <div className="flex-1">
         <span className={`text-[10px] font-black font-mono uppercase tracking-widest ${color}`}>{rarity}</span>
         <span className="text-[10px] text-gray-600 block">{desc}</span>
      </div>
    </div>
  );
}
