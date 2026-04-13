export default function ProgressBar({ percentage, height = 6, showLabel = true, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-neon-cyan/50 tracking-widest uppercase font-mono">Progress</span>
          <span className="text-[11px] font-mono font-semibold text-silver-200 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{percentage}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{ height, background: 'rgba(255,255,255,0.05)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${percentage}%`,
            background: percentage === 100
              ? 'linear-gradient(90deg, #7C3AED, #22D3EE)'
              : 'linear-gradient(90deg, #7C3AED, #3B82F6)',
            boxShadow: percentage > 0
              ? percentage === 100
                ? '0 0 15px rgba(34,211,238,0.6)'
                : '0 0 10px rgba(59,130,246,0.4)'
              : 'none',
          }}
        >
          {percentage > 0 && percentage < 100 && (
            <div
              className="absolute right-0 top-0 bottom-0 w-8 blur-[4px] bg-white opacity-40 rounded-full"
            />
          )}
        </div>
      </div>
    </div>
  );
}
