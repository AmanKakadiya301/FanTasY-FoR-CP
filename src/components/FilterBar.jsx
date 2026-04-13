export default function FilterBar({ filter, setFilter, difficultyFilter, setDifficultyFilter }) {
  const statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'solved', label: 'Solved' },
    { key: 'unsolved', label: 'Unsolved' },
    { key: 'bookmarked', label: 'Saved' },
  ];

  const difficultyFilters = [
    { key: 'all', label: 'All' },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-fade-in w-full">
      {/* Status */}
      <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all duration-300
              ${filter === f.key
                ? 'bg-white/[0.08] text-white shadow-sm'
                : 'text-silver-600 hover:text-silver-300 hover:bg-white/[0.03]'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/[0.06]" />

      {/* Difficulty */}
      <div className="flex items-center gap-0.5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
        {difficultyFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setDifficultyFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all duration-300
              ${difficultyFilter === f.key
                ? f.key === 'easy' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : f.key === 'medium' ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20'
                  : f.key === 'hard' ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/[0.08] text-white'
                : 'text-silver-600 hover:text-silver-300 hover:bg-white/[0.03]'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
