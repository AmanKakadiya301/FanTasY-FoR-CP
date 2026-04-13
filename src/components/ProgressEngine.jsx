import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRankTier } from '../utils/xp.js';

import ProgressBar from './ProgressEngine/ProgressBar.jsx';
import StatCard from './ProgressEngine/StatCard.jsx';
import TierBadge from './ProgressEngine/TierBadge.jsx';
import GoalCard from './ProgressEngine/GoalCard.jsx';
import MomentumIndicator from './ProgressEngine/MomentumIndicator.jsx';

export default function ProgressEngine({ solved, levels, streak, todaySolved, dailyGoal, levelInfo }) {
  const solvedCount = Object.keys(solved).length;
  
  // Calculate Difficulty Stats
  const diffStats = useMemo(() => {
    const stats = { easy: {s:0, t:0}, medium: {s:0, t:0}, hard: {s:0, t:0} };
    if (levels) {
      levels.forEach(level => {
        level.weeks.forEach(week => {
          week.topics.forEach(topic => {
            if(!topic.problems) return;
            topic.problems.forEach(prob => {
              const d = (prob.difficulty || 'medium').toLowerCase();
              if (stats[d]) {
                stats[d].t++;
                if (solved[prob.id]) stats[d].s++;
              }
            });
          });
        });
      });
    }
    return stats;
  }, [levels, solved]);

  const totalProblems = diffStats.easy.t + diffStats.medium.t + diffStats.hard.t;
  const progressPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
  
  const rankTier = useMemo(() => getRankTier(levelInfo?.xp || 0), [levelInfo?.xp]);

  // Momentum Logic
  const momentum = useMemo(() => {
    if (todaySolved > 0) return 'high';
    const lastDate = streak?.lastDate;
    if (!lastDate) return 'low';
    const now = new Date();
    const last = new Date(lastDate);
    const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays <= 2) return 'medium';
    return 'low';
  }, [todaySolved, streak]);

  // Goal Logic (Dynamic)
  const goalInfo = useMemo(() => {
    if (solvedCount < 10) return { title: "Complete Initial Training", current: solvedCount, target: 10, reward: 50 };
    if (solvedCount < 25) return { title: "Reach Novice Status", current: solvedCount, target: 25, reward: 100 };
    if (solvedCount < 50) return { title: "Neural Synchronization", current: solvedCount, target: 50, reward: 200 };
    return { title: "Grandmaster Quest", current: solvedCount % 100, target: 100, reward: 500 };
  }, [solvedCount]);

  // Insight Message
  const insight = useMemo(() => {
    if (progressPct === 0) return "Neuro-link established. Awaiting first input.";
    if (progressPct < 10) return "Initial synchronization in progress. Stay consistent.";
    if (progressPct < 30) return "Momentum building. Advanced modules unlocking soon.";
    if (progressPct < 60) return "Internalizing core patterns. You're becoming a specialist.";
    return "Neural synthesis nearly complete. Final mastery within reach.";
  }, [progressPct]);

  return (
    <section id="dashboard-top" className="mb-8 p-4 sm:p-6 lg:p-8 glass-card rounded-3xl relative overflow-hidden border border-white/[0.08] bg-obsidian/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Background FX */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl animate-pulse">🧠</span>
              <h2 className="font-display text-xl sm:text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple uppercase">
                Neural Progress
              </h2>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl font-black font-display text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
              >
                {progressPct}%
              </motion.span>
              <span className="text-xs tracking-[0.3em] font-mono uppercase text-neon-cyan/60 animate-pulse">Sync Active</span>
            </div>
            <ProgressBar 
              easyCount={diffStats.easy.s} easyTotal={diffStats.easy.t}
              mediumCount={diffStats.medium.s} mediumTotal={diffStats.medium.t}
              hardCount={diffStats.hard.s} hardTotal={diffStats.hard.t}
            />
            <p className="mt-4 text-[11px] font-mono text-silver-500 tracking-wider">
              <span className="text-neon-cyan font-bold">INFO:</span> {insight}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <TierBadge tier={rankTier} />
            <MomentumIndicator momentum={momentum} />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            label="Neural XP" 
            value={levelInfo?.xp || 0} 
            subValue={`Title: ${levelInfo?.title}`} 
            icon="⚡" 
            color="purple" 
          />
          <StatCard 
            label="Day Streak" 
            value={streak.count || 0} 
            subValue={`Goal: ${todaySolved}/${dailyGoal} today`} 
            icon="🔥" 
            color="pink" 
          />
          <StatCard 
            label="Total Solved" 
            value={solvedCount} 
            subValue={`Remaining: ${totalProblems - solvedCount}`} 
            icon="🎯" 
            color="cyan" 
          />
          <GoalCard 
            goal={goalInfo.title} 
            progress={goalInfo.current} 
            total={goalInfo.target} 
            reward={goalInfo.reward} 
          />
        </div>
      </div>
    </section>
  );
}
