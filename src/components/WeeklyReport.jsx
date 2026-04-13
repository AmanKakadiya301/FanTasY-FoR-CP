import React from 'react';
import { motion } from 'framer-motion';

export default function WeeklyReport({
  weeklySolved = 0,
  prevWeeklySolved = 0,
  easySolved = 0,
  mediumSolved = 0,
  hardSolved = 0,
  streak = 0,
}) {
  const improvement = weeklySolved - prevWeeklySolved;

  const improvementText =
    improvement > 0
      ? `+${improvement} targets compared to previous cycle`
      : improvement < 0
      ? `${improvement} targets compared to previous cycle`
      : "Synchronization stable with previous cycle";

  const getInsight = () => {
    if (weeklySolved >= 15) return "Exceptional neural activity. Your solving frequency is in the top bracket.";
    if (weeklySolved >= 10) return "Strong consistency cycle. Pattern recognition is optimizing.";
    if (weeklySolved >= 5) return "Solid baseline established. Focus on difficulty graduation next.";
    if (weeklySolved >= 1) return "Cycle initiated. Neural paths are warming up.";
    return "Neutral status. Initiate solving sequence to begin the cycle.";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 sm:p-8 glass-card rounded-[2rem] border border-white/[0.08] bg-obsidian/40 relative overflow-hidden mb-12 shadow-[0_0_50px_rgba(0,0,0,0.3)]"
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-cyan/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h2 className="text-2xl font-black font-display tracking-widest text-white uppercase flex items-center gap-3">
             Weekly Analytics <span className="text-xl">📊</span>
          </h2>
          <p className="text-[10px] uppercase font-mono tracking-[0.3em] font-bold text-gray-500 mt-1">
             System Performance: Last 7 Solar Cycles
          </p>
        </div>

        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full">
          <span className="text-[10px] font-mono font-black text-neon-cyan tracking-widest uppercase">
             Status: Synced
          </span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Nodes" value={weeklySolved} icon="⚡" color="neon-cyan" />
        <StatCard label="Easy Clear" value={easySolved} icon="🟢" color="green-400" />
        <StatCard label="Medium Clear" value={mediumSolved} icon="🟡" color="yellow-400" />
        <StatCard label="Hard Clear" value={hardSolved} icon="🔴" color="neon-pink" />
      </div>

      {/* Footer Details */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Growth Variance:
            </div>
            <div className={`text-xs font-black font-mono px-3 py-1 rounded border
              ${improvement >= 0 ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-neon-pink border-neon-pink/20 bg-neon-pink/5'}
            `}>
              {improvementText}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
               Active Pulse:
            </div>
            <div className="text-xs font-black font-mono text-white">
               {streak} DAY STREAK
            </div>
          </div>
        </div>

        {/* Insight Box */}
        <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-2xl p-5 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan/50" />
          <div className="flex items-start gap-4">
            <div className="text-xl group-hover:scale-110 transition-transform">🧠</div>
            <div>
              <div className="text-[9px] font-mono font-black text-neon-cyan uppercase tracking-widest mb-1">
                  Neural Observatory Insight
              </div>
              <p className="text-xs text-silver-300 font-sub leading-relaxed">
                {getInsight()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300 group">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-[0.2em]">
          {label}
        </span>
        <span className="text-lg opacity-80 group-hover:scale-125 transition-transform duration-500">
           {icon}
        </span>
      </div>
      <div className={`text-2xl font-black font-display tracking-tight text-white`}>
        {value}
      </div>
    </div>
  );
}
