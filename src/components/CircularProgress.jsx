export default function CircularProgress({ percentage, size = 180, strokeWidth = 8, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth={strokeWidth}
          />
          {/* Track marks */}
          {[...Array(40)].map((_, i) => {
            const angle = (i / 40) * 360;
            const rad = (angle * Math.PI) / 180;
            const x1 = size / 2 + (radius - 3) * Math.cos(rad);
            const y1 = size / 2 + (radius - 3) * Math.sin(rad);
            const x2 = size / 2 + (radius + 3) * Math.cos(rad);
            const y2 = size / 2 + (radius + 3) * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.03)"
                strokeWidth={0.5}
              />
            );
          })}
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="url(#circleGoldGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-[1500ms] ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.3))',
            }}
          />
          <defs>
            <linearGradient id="circleGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92710c" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#f5d76e" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold font-display gold-text tracking-wider">
            {percentage}%
          </span>
          {label && <span className="text-[11px] text-silver-600 mt-1 tracking-widest uppercase">{label}</span>}
        </div>
      </div>
    </div>
  );
}
