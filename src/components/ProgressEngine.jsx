import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getRankTier } from '../utils/xp.js';

import ProgressBar from "./ProgressEngine/ProgressBar.jsx";
import StatsCards from "./ProgressEngine/StatsCards.jsx";
import RankTier from "./ProgressEngine/RankTier.jsx";
import InsightCard from "./ProgressEngine/InsightCard.jsx";
import GoalCard from "./ProgressEngine/GoalCard.jsx";
import MomentumIndicator from "./ProgressEngine/MomentumIndicator.jsx";
import StatCard from "./ProgressEngine/StatCard.jsx"; // Keeping this for individual use if needed

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
  const overall = totalProblems === 0 ? 0 : Math.round((solvedCount / totalProblems) * 100);
  
  const rankTier = useMemo(() => getRankTier(levelInfo?.xp || 0), [levelInfo?.xp]);

  // Momentum Logic (Exact match to specification)
  const momentum = useMemo(() => {
    const lastDate = streak?.lastDate;
    if (!lastDate) return 'low';
    const now = new Date();
    const last = new Date(lastDate);
    const diff = (now - last) / (1000 * 60 * 60 * 24);

    if (diff <= 1) return "high";
    if (diff <= 3) return "medium";
    return "low";
  }, [streak]);

  // Insights Logic (Exact match to specification)
  const insights = useMemo(() => {
    const list = [];
    if (diffStats.easy.s > diffStats.medium.s * 2 && diffStats.medium.t > 0) {
      list.push({
        type: "focus",
        message: "Your easy-clear rate is high. Systems recommend transitioning to Medium targets."
      });
    }
    if (diffStats.hard.s === 0 && diffStats.medium.s > 5) {
      list.push({
        type: "warning",
        message: "Zero Hard problems solved. Neural sync requires high-density challenges. Pick a Hard target."
      });
    }
    if (streak.count >= 3) {
      list.push({
        type: "success",
        message: "Momentum peak achieved. Your 3+ day streak is optimizing progress speed."
      });
    }
    if (list.length === 0) {
      list.push({
        type: "info",
        message: "Neural sync stable. Maintain current solving frequency for consistent growth."
      });
    }
    return list.slice(0, 2); // Show top 2 insights
  }, [diffStats, streak]);

  // Goal Logic (Next Milestone)
  const goalInfo = useMemo(() => {
    if (solvedCount < 10) return { title: "Solve 10 Problems", current: solvedCount, target: 10, reward: 50 };
    if (solvedCount < 25) return { title: "Solve 25 Problems", current: solvedCount, target: 25, reward: 100 };
    if (solvedCount < 50) return { title: "Solve 50 Problems", current: solvedCount, target: 50, reward: 200 };
    return { title: "Centurion Goal", current: solvedCount % 100, target: 100, reward: 500 };
  }, [solvedCount]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-12 p-1 sm:p-2"
    >
      {/* Header Row */}
      <div className="flex items-center justify-between glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-cyan to-neon-purple shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black font-display tracking-widest text-white uppercase flex items-center gap-3">
            Progress Engine <span className="animate-bounce">🚀</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase font-mono tracking-[0.3em] mt-1">
            Tracking your competitive journey
          </p>
        </div>

        <div className="text-right glass-card px-4 py-2 border border-white/5 rounded-xl">
          <div className="text-[9px] uppercase font-mono font-black text-gray-500 tracking-widest">
            Sync Level
          </div>
          <div className="text-2xl font-black font-display text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            {overall}%
          </div>
        </div>
      </div>

      {/* Progress Bar Module */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.08] bg-obsidian/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <ProgressBar 
          easyCount={diffStats.easy.s} easyTotal={diffStats.easy.t}
          mediumCount={diffStats.medium.s} mediumTotal={diffStats.medium.t}
          hardCount={diffStats.hard.s} hardTotal={diffStats.hard.t}
        />
      </div>

      {/* Stats Cards Module */}
      <StatsCards 
        easySolved={diffStats.easy.s} easyTotal={diffStats.easy.t}
        mediumSolved={diffStats.medium.s} mediumTotal={diffStats.medium.t}
        hardSolved={diffStats.hard.s} hardTotal={diffStats.hard.t}
      />

      {/* Grid Controls Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RankTier
          tier={rankTier}
          xp={levelInfo?.xp || 0}
          nextXp={rankTier?.nextTier?.minXP}
        />

        <MomentumIndicator
          momentum={momentum}
          streak={streak.count || 0}
        />

        <GoalCard
          title="Current Goal"
          description={goalInfo.title}
          reward={`+${goalInfo.reward} XP`}
          progress={Math.round((goalInfo.current / goalInfo.target) * 100)}
        />
      </div>

      {/* Neural Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type}
            message={insight.message}
          />
        ))}
      </div>
    </motion.div>
  );
}
