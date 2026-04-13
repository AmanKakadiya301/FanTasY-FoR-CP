import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function NeonParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const colors = ['#22D3EE', '#7C3AED', '#EC4899']; // Cyan, Purple, Pink
      const size = Math.random() * 4 + 2; // 2px to 6px
      return {
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10, // 10s to 20s
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [-10, -50, -10],
            x: [-10, 20, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
