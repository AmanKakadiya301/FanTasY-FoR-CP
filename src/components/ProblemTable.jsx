import { useState, useRef } from 'react';
import { getXPForDifficulty } from '../utils/xp.js';

export default function ProblemTable({
  problems,
  solved,
  bookmarks,
  notes,
  toggleSolved,
  toggleBookmark,
  openNoteModal,
}) {
  const [xpFloats, setXpFloats] = useState([]);
  const tableRef = useRef(null);

  function handleToggle(problem) {
    const key = problem.id;
    const nowSolved = toggleSolved(key);
    if (nowSolved) {
      const xp = getXPForDifficulty(problem.difficulty);
      const id = Date.now();
      setXpFloats(prev => [...prev, { id, xp }]);
      setTimeout(() => {
        setXpFloats(prev => prev.filter(f => f.id !== id));
      }, 1300);
    }
  }

  function getDifficultyBadge(difficulty) {
    const diff = (difficulty || 'medium').toLowerCase();
    
    let baseColor = 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
    if (diff === 'easy') baseColor = 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_10px_rgba(34,211,238,0.2)]';
    if (diff === 'hard') baseColor = 'text-neon-pink border-neon-pink/30 bg-neon-pink/10 shadow-[0_0_10px_rgba(236,72,153,0.2)]';

    return (
      <span className={`px-2 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] font-mono ${baseColor}`}>
        {diff}
      </span>
    );
  }

  return (
    <div ref={tableRef} className="relative w-full">
      {/* XP Float */}
      {xpFloats.map(f => (
        <div key={f.id} className="xp-float" style={{ right: '24px', top: '16px' }}>
          +{f.xp} XP
        </div>
      ))}

      <div className="w-full">
        {/* Table header — desktop only */}
        <div className="hidden md:block pb-2 border-b border-white/[0.04]">
          <div className="grid grid-cols-[40px_40px_1fr_80px_90px] items-center px-3 lg:px-4 w-full">
            <span className="text-left text-[9px] font-bold text-neon-cyan/60 uppercase tracking-[0.15em]">✓</span>
            <span className="text-left text-[9px] font-bold text-neon-cyan/60 uppercase tracking-[0.15em]">#</span>
            <span className="text-left text-[9px] font-bold text-neon-cyan/60 uppercase tracking-[0.15em]">Problem</span>
            <span className="text-left text-[9px] font-bold text-neon-cyan/60 uppercase tracking-[0.15em]">Level</span>
            <span className="text-right text-[9px] font-bold text-neon-cyan/60 uppercase tracking-[0.15em]">Actions</span>
          </div>
        </div>

        {/* Rows */}
        <div className="flex flex-col">
          {problems.map((problem, idx) => {
            const key = problem.id;
            const isSolved = !!solved[key];
            const isBookmarked = !!bookmarks[key];
            const hasNote = !!notes[key];

            return (
              <div
                key={idx}
                className={`problem-row border-b border-white/[0.02] transition-colors duration-300 w-full hover:bg-neon-cyan/5
                  ${isSolved ? 'bg-neon-cyan/[0.03]' : ''}`}
              >
                {/* Desktop row */}
                <div className="hidden md:grid grid-cols-[40px_40px_1fr_80px_90px] items-center py-3 px-3 lg:px-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSolved}
                      onChange={() => handleToggle(problem)}
                      className="custom-checkbox"
                      id={`check-${idx}`}
                    />
                  </div>
                  <div className="flex items-center">
                    <span className="text-[10px] text-silver-600 font-mono">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex items-center pr-4 overflow-hidden">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[13px] leading-snug font-medium tracking-wide transition-all duration-300 truncate w-full hover:translate-x-1 block
                        ${isSolved ? 'text-silver-600 line-through decoration-neon-cyan/40 opacity-60' : 'text-silver-200 hover:text-neon-cyan hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'}`}
                    >
                      {problem.title}
                    </a>
                  </div>
                  <div className="flex items-center">
                    {getDifficultyBadge(problem.difficulty)}
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => toggleBookmark(key)}
                      className={`p-1.5 rounded-lg transition-all duration-300
                        ${isBookmarked ? 'text-neon-pink drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-silver-600 hover:text-neon-pink/70 hover:bg-neon-pink/10'} `}
                      title="Bookmark"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openNoteModal(key)}
                      className={`p-1.5 rounded-lg transition-all duration-300
                        ${hasNote ? 'text-neon-purple drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : 'text-silver-600 hover:text-neon-purple hover:bg-neon-purple/10'} `}
                      title={hasNote ? 'Edit note' : 'Add note'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Mobile row */}
                <div className="md:hidden flex items-center gap-2.5 py-3 px-3">
                  <input
                    type="checkbox"
                    checked={isSolved}
                    onChange={() => handleToggle(problem)}
                    className="custom-checkbox flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-[12px] leading-snug font-medium tracking-wide transition-all duration-300 block truncate
                        ${isSolved ? 'text-silver-600 line-through decoration-neon-cyan/40 opacity-60' : 'text-silver-200 hover:text-neon-cyan'}`}
                    >
                      {problem.title}
                    </a>
                    <div className="flex items-center gap-2 mt-1">
                      {getDifficultyBadge(problem.difficulty)}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button
                      onClick={() => toggleBookmark(key)}
                      className={`p-1 rounded-lg ${isBookmarked ? 'text-neon-pink drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]' : 'text-silver-600'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openNoteModal(key)}
                      className={`p-1 rounded-lg ${hasNote ? 'text-neon-purple drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : 'text-silver-600'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {problems.length === 0 && (
        <div className="text-center py-12 text-silver-600">
          <p className="text-2xl mb-2 opacity-50 text-neon-cyan animate-pulse">404</p>
          <p className="text-sm font-medium tracking-widest uppercase font-mono">No targets match current filters</p>
        </div>
      )}
    </div>
  );
}
