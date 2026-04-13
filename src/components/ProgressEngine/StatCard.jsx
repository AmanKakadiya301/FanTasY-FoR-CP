import React from 'react';
import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function CountUp({ value }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(display, value, {
      duration: 1,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value]);

  return <>{display}</>;
}

export default function StatCard({ label, value, subValue, icon, color = 'cyan', glow = true }) {
  const colorMap = {
    cyan: 'text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-[0_0_20px_rgba(34,211,238,0.05)]',
    purple: 'text-neon-purple border-neon-purple/20 bg-neon-purple/5 shadow-[0_0_20px_rgba(124,58,237,0.05)]',
    pink: 'text-neon-pink border-neon-pink/20 bg-neon-pink/5 shadow-[0_0_20px_rgba(236,72,153,0.05)]',
    yellow: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5 shadow-[0_0_20px_rgba(250,204,21,0.05)]',
  };

  const glowMap = {
    cyan: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]',
    purple: 'shadow-[0_0_15px_rgba(124,58,237,0.3)]',
    pink: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    yellow: 'shadow-[0_0_15px_rgba(250,204,21,0.3)]',
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-4 rounded-xl border backdrop-blur-md flex flex-col items-center justify-center min-w-[120px] transition-all duration-300 ${colorMap[color]}`}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className={`text-2xl font-black font-display tracking-tighter ${glow ? glowMap[color] : ''}`}>
          <CountUp value={value} />
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] font-mono opacity-60 mb-1">{label}</span>
      {subValue && <span className="text-[9px] font-mono opacity-40">{subValue}</span>}
    </motion.div>
  );
}
