import React from 'react';
import { motion } from 'framer-motion';
import LevelSystem from './Analytics/LevelSystem.jsx';
import RankTier from './ProgressEngine/RankTier.jsx';
import Heatmap from './Analytics/Heatmap.jsx';
import Achievements from './Achievements.jsx';
import { getTier } from '../utils/xp.js';

export default function UserProfile({ 
  user = {}, 
  levelInfo = {}, 
  solvedCount = 0, 
  streak = { count: 0 }, 
  heatmapData = [],
  solved = {},
  levels = [] 
}) {
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const avatarUrl = user?.photoURL;
  const xp = levelInfo?.xp || 0;
  
  // Calculate difficulty stats
  const difficultyStats = React.useMemo(() => {
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

  const rankTier = getTier(xp);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-20"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 py-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-neon-purple to-neon-cyan opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700" />
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName} 
              className="w-32 h-32 rounded-full border-2 border-white/10 p-1 bg-black/40 relative z-10 transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-4xl font-black text-white border-2 border-white/20 relative z-10 transition-transform duration-500 group-hover:scale-105 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-obsidian border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono font-black text-neon-cyan relative z-20 shadow-xl">
             ID: {user?.uid?.slice(0, 8).toUpperCase()}
          </div>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black font-display text-white tracking-widest uppercase mb-2">
            {displayName}
          </h1>
          <p className="text-silver-500 text-[10px] uppercase font-mono tracking-[0.4em] mb-6">
            Neural Command Center | Level {levelInfo?.level || 1}
          </p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
             <ProfileTag icon="🎯" label={`${solvedCount} Targets Cleared`} />
             <ProfileTag icon="⚡" label={`${xp} Neural XP`} />
             <ProfileTag icon="🔥" label={`${streak.count} Cycle Streak`} />
          </div>
        </div>
      </div>

      {/* Evolution Row: Level + Rank */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LevelSystem xp={xp} />
        <RankTier 
          tier={{ label: rankTier, icon: getTierIcon(rankTier), color: getTierColor(rankTier) }} 
          xp={xp} 
          nextXp={getNextTierXp(xp)} 
        />
      </div>

      {/* Difficulty Mastery */}
      <div className="glass-card p-8 rounded-3xl border border-white/[0.08] bg-obsidian/40 relative overflow-hidden">
        <h2 className="text-sm font-black font-display tracking-widest text-white uppercase mb-8">
          Difficulty Breakdown
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <MasteryBar label="Easy" value={difficultyStats.easy} color="green-400" total={94} />
           <MasteryBar label="Medium" value={difficultyStats.medium} color="yellow-400" total={125} />
           <MasteryBar label="Hard" value={difficultyStats.hard} color="neon-pink" total={107} />
        </div>
      </div>

      {/* Activity Pulse */}
      <Heatmap data={heatmapData} />

      {/* Collection Preview */}
      <Achievements 
        totalSolved={solvedCount} 
        streak={streak.count} 
        mediumSolved={difficultyStats.medium} 
        hardSolved={difficultyStats.hard} 
      />
    </motion.div>
  );
}

function ProfileTag({ icon, label }) {
  return (
    <div className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[10px] font-mono font-bold text-silver-400 flex items-center gap-2 hover:border-white/20 transition-all">
       <span>{icon}</span>
       <span className="uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
  );
}

function MasteryBar({ label, value, color, total }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div>
       <div className="flex justify-between items-baseline mb-3">
          <span className="text-[10px] uppercase font-mono font-black text-gray-500 tracking-widest">{label}</span>
          <span className="text-white font-bold font-mono text-xs">{value} / {total}</span>
       </div>
       <div className="h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.5 }}
            className="h-full shadow-[0_0_10px_currentColor]" 
            style={{ backgroundColor: color, color: color }}
          />
       </div>
    </div>
  );
}

function getTierIcon(tier) {
  const icons = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎', Diamond: '👑' };
  return icons[tier] || '🥉';
}

function getTierColor(tier) {
  const colors = { Bronze: '#D97706', Silver: '#94A3B8', Gold: '#FACC15', Platinum: '#22D3EE', Diamond: '#A78BFA' };
  return colors[tier] || '#D97706';
}

function getNextTierXp(xp) {
  if (xp < 150) return 150;
  if (xp < 400) return 400;
  if (xp < 800) return 800;
  if (xp < 1500) return 1500;
  return 2000;
}
