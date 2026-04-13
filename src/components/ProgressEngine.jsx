import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTier, getNextTierXp } from '../utils/xp';

import ProgressBar from "./ProgressEngine/ProgressBar";
import StatsCards from "./ProgressEngine/StatsCards";
import RankTier from "./ProgressEngine/RankTier";
import InsightCard from "./ProgressEngine/InsightCard";
import GoalCard from "./ProgressEngine/GoalCard";
import MomentumIndicator from "./ProgressEngine/MomentumIndicator";

export default function ProgressEngine({
  solved = {},
  levels = [],
  streak = { count: 0 },
  todaySolved = 0,
  dailyGoal = 3,
  levelInfo = {}
}) {
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

  const totalXp = levelInfo?.xp || 0;
  const tier = getTier(totalXp);
  const nextXp = getNextTierXp(totalXp);

  function getMomentum(lastSolvedDate) {
    if (!lastSolvedDate) return "low";
    const today = new Date();
    const last = new Date(lastSolvedDate);
    const diff = (today - last) / (1000 * 60 * 60 * 24);

    if (diff <= 1) return "high";
    if (diff <= 3) return "medium";
    return "low";
  }

  function generateInsights() {
    const list = [];
    if (diffStats.easy.s > diffStats.medium.s * 2 && diffStats.medium.t > 0) {
      list.push({
        type: "focus",
        message: "You're solving many Easy problems. Try Medium targets next for faster XP sync."
      });
    }
    if (diffStats.hard.s === 0 && diffStats.medium.s > 5) {
      list.push({
        type: "warning",
        message: "Neural sync upgrade required: Try solving your first Hard problem."
      });
    }
    if (streak.count >= 3) {
      list.push({
        type: "success",
        message: "Momentum detected: Your 3-day streak is building a strong neural baseline."
      });
    }
    if (list.length === 0) {
      list.push({
        type: "info",
        message: "Sync stable. Your progress is following a steady growth trajectory."
      });
    }
    return list.slice(0, 2);
  }

  const insights = generateInsights();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 mb-12"
    >
      {/* Header Module */}
      <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-neon-cyan to-neon-purple shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
        <div>
          <h1 className="text-2xl font-black font-display tracking-widest text-white uppercase flex items-center gap-3">
            Progress Engine <span className="text-xl group-hover:animate-bounce">🚀</span>
          </h1>
          <p className="text-gray-500 text-[10px] uppercase font-mono tracking-[0.3em] mt-1 font-bold">
            Track your neural synthesis journey
          </p>
        </div>

        <div className="text-right glass-card px-5 py-2.5 border border-white/5 rounded-2xl bg-black/40 shadow-xl group-hover:border-neon-cyan/30 transition-all duration-500">
          <div className="text-[9px] uppercase font-mono font-black text-gray-500 tracking-widest mb-1">
            Completion Sync
          </div>
          <div className="text-3xl font-black font-display text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
            {overall}%
          </div>
        </div>
      </div>

      {/* Progress Spine Module */}
      <div className="glass-card p-6 rounded-3xl border border-white/[0.08] bg-obsidian/40 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <ProgressBar
          easySolved={diffStats.easy.s}
          easyTotal={diffStats.easy.t}
          mediumSolved={diffStats.medium.s}
          mediumTotal={diffStats.medium.t}
          hardSolved={diffStats.hard.s}
          hardTotal={diffStats.hard.t}
        />
      </div>

      {/* Stats Heartbeat Module */}
      <StatsCards
        easySolved={diffStats.easy.s}
        easyTotal={diffStats.easy.t}
        mediumSolved={diffStats.medium.s}
        mediumTotal={diffStats.medium.t}
        hardSolved={diffStats.hard.s}
        hardTotal={diffStats.hard.t}
      />

      {/* Grid Control Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RankTier
          tier={tier}
          xp={totalXp}
          nextXp={nextXp}
        />

        <MomentumIndicator
          momentum={getMomentum(streak.lastDate)}
          streak={streak.count}
        />

        <GoalCard
          title="Current Goal"
          description={solvedCount < 10 ? "Solve 10 Problems" : "Solve 25 Problems"}
          reward={solvedCount < 10 ? "+50 XP" : "+100 XP"}
          progress={Math.round(((solvedCount < 10 ? solvedCount : solvedCount % 25) / (solvedCount < 10 ? 10 : 25)) * 100)}
        />
      </div>

      {/* Neural Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            type={insight.type}
            message={insight.message}
            title="Neural Insight"
          />
        ))}
      </div>
    </motion.div>
  );
}
