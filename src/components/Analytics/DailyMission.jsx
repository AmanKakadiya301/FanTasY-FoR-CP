import React from 'react';
import { motion } from 'framer-motion';

export default function DailyMission({
  easyToday = 0,
  mediumToday = 0,
  hardToday = 0,
}) {
  const missions = [
    {
      title: "Tactical Sweep (Easy)",
      description: "Solve 1 Easy problem",
      current: easyToday,
      target: 1,
      reward: "+10 XP",
      icon: "🟢",
    },
    {
      title: "Med-Density Sync",
      description: "Solve 1 Medium problem",
      current: mediumToday,
      target: 1,
      reward: "+25 XP",
      icon: "🟡",
    },
    {
      title: "Daily Neural Peak",
      description: "Solve 2 problems total",
      current: easyToday + mediumToday + hardToday,
      target: 2,
      reward: "+30 XP",
      icon: "⚡",
    },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-sm font-black font-display tracking-widest text-white uppercase flex items-center gap-2">
            Daily Missions <span className="text-lg">🎯</span>
          </h2>
          <p className="text-[9px] uppercase font-mono tracking-wider text-gray-500 mt-0.5">
             Sector Cleanup Objectives
          </p>
        </div>
        <div className="text-[10px] font-mono text-neon-cyan animate-pulse">SYSTEM ACTIVE</div>
      </div>

      <div className="space-y-4">
        {missions.map((mission, index) => {
          const progress = Math.min((mission.current / mission.target) * 100, 100);
          const completed = mission.current >= mission.target;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-xl p-4 border transition-all duration-300 group
              ${completed ? "bg-green-500/10 border-green-500/30" : "bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl filter group-hover:scale-110 transition-transform">{mission.icon}</span>
                  <div>
                    <h4 className="text-xs font-black font-display tracking-wide text-white mb-0.5 uppercase">
                      {mission.title}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-mono uppercase tracking-tighter">
                       {mission.description}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-black font-mono border rounded px-1.5 py-0.5 uppercase tracking-tighter
                   ${completed ? 'border-green-400/50 text-green-400' : 'border-neon-cyan/50 text-neon-cyan'}
                `}>
                  {mission.reward}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${completed ? 'from-green-400 to-emerald-600 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'from-neon-cyan to-neon-purple shadow-[0_0_10px_rgba(34,211,238,0.3)]'}`}
                />
              </div>

              <div className="flex justify-between mt-2 text-[9px] font-mono font-bold tracking-widest text-gray-500 uppercase">
                <span>{mission.current} / {mission.target} INITIALIZED</span>
                {completed && (
                  <span className="text-green-400 flex items-center gap-1">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    SYNCED
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
