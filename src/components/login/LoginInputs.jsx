import React from 'react';
import { motion } from 'framer-motion';

export default function LoginInputs({ email, setEmail, password, setPassword, isLoading }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="flex flex-col gap-4 mb-6 relative z-20"
    >
      {/* Email */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neon-cyan/40 group-focus-within:text-neon-cyan/80 transition-colors duration-300 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <input 
          type="email" 
          placeholder="Network ID (Email)" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(34,211,238,0.4)] font-mono"
        />
      </div>

      {/* Password */}
      <div className="relative group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neon-purple/40 group-focus-within:text-neon-purple/80 transition-colors duration-300 pointer-events-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <input 
          type="password" 
          placeholder="Security Passcode" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white text-sm placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-neon-purple/70 focus:bg-white/15 focus:shadow-[0_0_20px_rgba(124,58,237,0.3)] font-mono"
        />
      </div>
    </motion.div>
  );
}
