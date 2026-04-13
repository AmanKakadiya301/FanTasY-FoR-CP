import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';

function CountUp({ end }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(0, end, {
      duration: 1.5,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [end]);

  return <>{display}</>;
}

export default function StatsCards({
  easySolved = 0,
  easyTotal = 0,
  mediumSolved = 0,
  mediumTotal = 0,
  hardSolved = 0,
  hardTotal = 0,
}) {
  const totalSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = easyTotal + mediumTotal + hardTotal;
  const remaining = totalProblems - totalSolved;

  const stats = [
    {
      label: "Easy",
      value: `${easySolved}/${easyTotal}`,
      raw: easySolved,
      color: "from-green-400 to-emerald-500",
      icon: "🟢",
    },
    {
      label: "Medium",
      value: `${mediumSolved}/${mediumTotal}`,
      raw: mediumSolved,
      color: "from-yellow-400 to-orange-500",
      icon: "🟡",
    },
    {
      label: "Hard",
      value: `${hardSolved}/${hardTotal}`,
      raw: hardSolved,
      color: "from-red-400 to-pink-500",
      icon: "🔴",
    },
    {
      label: "Solved",
      value: totalSolved,
      raw: totalSolved,
      color: "from-blue-400 to-cyan-500",
      icon: "⚡",
    },
    {
      label: "Remaining",
      value: remaining,
      raw: remaining,
      color: "from-purple-400 to-indigo-500",
      icon: "🎯",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative overflow-hidden rounded-2xl 
          bg-white/5 backdrop-blur-2xl 
          border border-white/5 
          p-4 shadow-lg group hover:border-white/20 transition-all duration-300"
        >
          {/* Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-mono font-black tracking-[0.2em] text-gray-500 group-hover:text-gray-300 transition-colors">
                {stat.label}
              </span>

              <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {stat.icon}
              </span>
            </div>

            <div className="text-white text-lg font-black font-display tracking-tight flex items-baseline gap-1">
              {typeof stat.value === 'string' ? (
                stat.value
              ) : (
                <CountUp end={stat.value} />
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
