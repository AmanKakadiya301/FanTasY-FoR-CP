import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import ProgressEngine from "./ProgressEngine";
import Heatmap from "./Analytics/Heatmap";
import WeeklyReport from "./WeeklyReport";
import { generateHeatmapData, calculateSkillProgress, generateWeeklyReport } from "../utils/analytics";

export default function ProgressDashboard({
  solved = {},
  levels = [],
  streak = { count: 0 },
  todaySolved = 0,
  dailyGoal = 3,
  levelInfo = {},
}) {
  const solvedCount = Object.keys(solved).length;
  
  // Calculate analytics data
  const heatmapData = useMemo(() => generateHeatmapData(solved), [solved]);
  const skillData = useMemo(() => calculateSkillProgress(solved, levels), [solved, levels]);
  const weeklyData = useMemo(() => generateWeeklyReport(solved, levels), [solved, levels]);

  // Mock activity data for the graph (using last 7 days from heatmap for now)
  const activityData = useMemo(() => {
    return heatmapData.slice(-7).map(d => ({
      date: d.date.split('-').slice(1).join('/'),
      solved: d.count
    }));
  }, [heatmapData]);

  // Derived Stats
  const difficultyStats = useMemo(() => {
    const stats = { easy: 0, medium: 0, hard: 0 };
    levels.forEach(l => l.weeks.forEach(w => w.topics.forEach(t => {
      if (t.problems) t.problems.forEach(p => {
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
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-baseline md:items-center gap-4 py-4">
        <div>
          <h1 className="text-3xl font-black font-display tracking-widest text-white uppercase">
            Analytics Cockpit <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">📊</span>
          </h1>
          <p className="text-[10px] uppercase font-mono tracking-[0.4em] font-bold text-gray-500 mt-1">
             System Performance & Mastery deep-dive
          </p>
        </div>
        
        <div className="flex gap-3">
           <div className="px-4 py-1.5 glass bg-black/40 border border-white/5 rounded-full flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-mono font-black text-gray-400 tracking-widest">LIVE SYNC</span>
           </div>
        </div>
      </div>

      {/* Hero Engine */}
      <ProgressEngine 
        solved={solved}
        levels={levels}
        streak={streak}
        todaySolved={todaySolved}
        dailyGoal={dailyGoal}
        levelInfo={levelInfo}
      />

      {/* Intelligence Row: Graph + Skill Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Performance Graph */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black font-display tracking-widest text-white uppercase">
              Throughput Variance
            </h2>
            <span className="text-[9px] font-mono text-gray-500 uppercase">Last 7 Solar Cycles</span>
          </div>

          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#444" 
                  fontSize={10} 
                  fontFamily="monospace"
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  fontFamily="monospace"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#05070f', border: '1px solid #222', borderRadius: '8px', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#22D3EE' }}
                />
                <Line
                  type="monotone"
                  dataKey="solved"
                  stroke="#22D3EE"
                  strokeWidth={3}
                  dot={{ fill: '#05070f', stroke: '#22D3EE', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#22D3EE', shadow: '0 0 10px #22D3EE' }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Analysis */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden">
          <h2 className="text-sm font-black font-display tracking-widest text-white uppercase mb-8">
            Neural Skill Distribution
          </h2>

          <div className="space-y-6">
            {skillData.map((skill, index) => (
              <div key={index} className="group">
                <div className="flex justify-between text-[10px] font-mono font-bold tracking-widest uppercase mb-2">
                  <span className="text-gray-400 group-hover:text-neon-cyan transition-colors">{skill.name}</span>
                  <span className="text-white">{skill.progress}% SYNCED</span>
                </div>

                <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.progress}%` }}
                    transition={{ duration: 1.2, delay: index * 0.1 }}
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Visualization: Heatmap */}
      <Heatmap data={heatmapData} />

      {/* Secondary Intelligence: Weekly Reflection */}
      <WeeklyReport 
        weeklySolved={weeklyData.current.total}
        prevWeeklySolved={weeklyData.prev.total}
        easySolved={weeklyData.current.easy}
        mediumSolved={weeklyData.current.medium}
        hardSolved={weeklyData.current.hard}
        streak={streak.count || 0}
      />
    </motion.div>
  );
}
