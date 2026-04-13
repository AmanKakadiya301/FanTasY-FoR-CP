import React from 'react';
import { motion } from 'framer-motion';
import DailyMission from './Analytics/DailyMission.jsx';

export default function MissionsPage({ todaySolved, dailyGoal, diffStatsToday = { easy: 0, medium: 0, hard: 0 } }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <div className="py-4">
        <h1 className="text-3xl font-black font-display tracking-widest text-white uppercase">
          Missions Command <span className="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">🎯</span>
        </h1>
        <p className="text-[10px] uppercase font-mono tracking-[0.4em] font-bold text-gray-500 mt-1">
           Daily Objectives & Neural Synthesis Quests
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Daily Mission Module */}
        <div className="lg:col-span-2">
          <DailyMission 
            easyToday={diffStatsToday.easy} 
            mediumToday={diffStatsToday.medium} 
            hardToday={diffStatsToday.hard} 
          />
        </div>

        {/* Tactical Info / Reset Timer */}
        <div className="space-y-6">
           <div className="glass-card p-6 rounded-2xl border border-white/5 bg-obsidian/40 relative overflow-hidden h-full">
              <h3 className="text-[10px] uppercase font-mono font-black tracking-widest text-gray-400 mb-6">
                 Operational Briefing
              </h3>
              
              <div className="space-y-6">
                 <BriefingItem 
                    label="Current Sector" 
                    value="NEURAL_SYNC_ALPHA" 
                    desc="Sector objectives reset every 24 hours based on system clock."
                 />
                 <BriefingItem 
                    label="XP Bonus" 
                    value="+65 XP TOTAL" 
                    desc="Maximum daily yield from tactical missions."
                 />
                 <BriefingItem 
                    label="Status" 
                    value="OPTIMIZED" 
                    desc="Neural pathways confirmed for current targets."
                 />
              </div>

              {/* Reset Logic Mock UI */}
              <div className="mt-10 pt-6 border-t border-white/5">
                 <div className="text-[9px] font-mono text-gray-600 mb-2 uppercase italic">Mission Reset Imminent:</div>
                 <div className="flex gap-2">
                    <TimeBlock unit="H" value="18" />
                    <TimeBlock unit="M" value="42" />
                    <TimeBlock unit="S" value="15" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Seasonal / Weekly Mission (Mock for now) */}
      <div className="glass-card p-10 rounded-[2.5rem] border border-white/[0.08] bg-obsidian/40 relative overflow-hidden group">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-neon-purple/5 to-transparent blur-3xl pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 rounded-full bg-black/40 border border-neon-purple/30 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(124,58,237,0.2)]">
               🛡️
            </div>
            <div className="text-center md:text-left">
               <span className="text-[10px] font-mono font-black text-neon-purple uppercase tracking-[0.3em]">Special Operation</span>
               <h2 className="text-2xl font-black font-display text-white mt-2 mb-3">Weekly Neural Siege</h2>
               <p className="text-silver-500 text-sm max-w-lg mb-6 leading-relaxed">
                  Solve 10 Medium problems in a single week to earn the <span className="text-neon-cyan">"Siege Master"</span> limited edition badge and +500 XP.
               </p>
               <div className="text-[10px] font-mono text-gray-600 uppercase">Commencing in 3 Cycles...</div>
            </div>
         </div>
      </div>
    </motion.div>
  );
}

function BriefingItem({ label, value, desc }) {
  return (
    <div className="group">
       <div className="text-[9px] font-mono font-bold text-gray-500 mb-1">{label}</div>
       <div className="text-sm font-black text-white mb-1 group-hover:text-neon-cyan transition-colors">{value}</div>
       <div className="text-[9px] text-gray-600 font-sub leading-tight">{desc}</div>
    </div>
  );
}

function TimeBlock({ unit, value }) {
  return (
    <div className="flex-1 px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-center">
       <div className="text-lg font-black font-display text-white mb-0">{value}</div>
       <div className="text-[8px] font-mono text-gray-600 uppercase">{unit}</div>
    </div>
  );
}
