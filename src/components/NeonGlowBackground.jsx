import React from 'react';
import { motion } from 'framer-motion';

export default function NeonGlowBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-screen filter blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #7C3AED, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full mix-blend-screen filter blur-[150px] opacity-20"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent 70%)' }}
      />
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[60%] w-[400px] h-[400px] rounded-full mix-blend-screen filter blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(circle, #EC4899, transparent 70%)' }}
      />
    </div>
  );
}
