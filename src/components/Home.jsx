import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import ProgressEngine from './ProgressEngine.jsx';
import InsightCard from './ProgressEngine/InsightCard.jsx';
import { generateWeeklyReport } from '../utils/analytics.js';

export default function Home({ solved, levels, streak, todaySolved, dailyGoal, levelInfo }) {
  const solvedCount = Object.keys(solved).length;
  
  // Calculate top insight locally or pass from analytics
  const weeklyData = useMemo(() => generateWeeklyReport(solved, levels), [solved, levels]);
  
  // Quick stats extraction
  const diffStats = useMemo(() => {
    const stats = { easy: 0, medium: 0, hard: 0 };
    levels.forEach(l => l.weeks.forEach(w => w.topics.forEach(t => {
      if (!t.problems) return;
      t.problems.forEach(p => { if (solved[p.id]) {
        const d = (p.difficulty || 'medium').toLowerCase();
        if (stats[d] !== undefined) stats[d]++;
      }});
    })));
    return stats;
  }, [solved, levels]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10 pb-20"
    >
      {/* Hero Section: Progress Engine */}
      <section>
        <ProgressEngine 
          solved={solved}
          levels={levels}
          streak={streak}
          todaySolved={todaySolved}
          dailyGoal={dailyGoal}
          levelInfo={levelInfo}
        />
      </section>

      {/* Overview Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Stats Card */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan" />
          <h2 className="text-[10px] uppercase font-mono font-black tracking-widest text-gray-500 mb-6">
            Neural Baseline Summary
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <QuickStat label="Total Nodes" value={solvedCount} icon="⚡" />
            <QuickStat label="Solved Today" value={todaySolved} icon="🎯" />
            <QuickStat label="Active Streak" value={streak.count} icon="🔥" />
            <QuickStat label="Neural XP" value={levelInfo?.xp || 0} icon="🧠" />
          </div>
        </div>

        {/* Priority Insight */}
        <div className="glass-card p-1 rounded-2xl border border-white/5">
           <InsightCard 
             type="focus"
             title="Neural Recommendation"
             message={solvedCount < 10 ? "Systems warming up. Initiate primary targets in the roadmap." : "Maintain momentum. Solve 2 problems to secure the daily baseline."}
           />
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-16 h-16 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mb-4 animate-pulse">
           <span className="text-2xl">🗺️</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Roadmap Synchronized</h3>
        <p className="text-silver-500 text-sm max-w-xs mx-auto mb-6">
           Your learning path is optimized. Head to the Roadmap to begin your next session.
        </p>
      </div>
    </motion.div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm opacity-60">{icon}</span>
        <span className="text-[9px] uppercase font-mono font-bold text-gray-500 tracking-tighter">{label}</span>
      </div>
      <div className="text-xl font-black font-display text-white">{value}</div>
    </div>
  );
}
