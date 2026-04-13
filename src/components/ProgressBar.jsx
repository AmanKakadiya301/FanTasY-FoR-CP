export default function ProgressBar({ percentage, height = 6, showLabel = true, className = '' }) {
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-silver-600 tracking-wider uppercase font-medium">Progress</span>
          <span className="text-[11px] font-mono font-semibold text-silver-400">{percentage}%</span>
        </div>
      )}
      <div
        className="w-full rounded-full overflow-hidden relative"
        style={{ height, background: 'rgba(255,255,255,0.03)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: `${percentage}%`,
            background: percentage === 100
              ? 'linear-gradient(90deg, #b8941f, #d4af37, #f5d76e)'
              : 'linear-gradient(90deg, #52525b, #a1a1aa)',
            boxShadow: percentage > 0
              ? percentage === 100
                ? '0 0 12px rgba(212,175,55,0.4)'
                : '0 0 8px rgba(161,161,170,0.2)'
              : 'none',
          }}
        >
          {percentage > 0 && percentage < 100 && (
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s linear infinite',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
