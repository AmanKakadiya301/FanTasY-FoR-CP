export default function XPDisplay({ levelInfo }) {
  if (!levelInfo) return null;

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-in-up">
      <div className="flex items-center gap-4 mb-5">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03))',
            border: '1px solid rgba(212,175,55,0.15)',
          }}
        >
          {levelInfo.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-display text-base font-semibold tracking-wider text-white">
            Level {levelInfo.level}
          </h3>
          <p className="text-sm font-display tracking-widest gold-text font-medium">{levelInfo.title}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold font-display gold-text-shimmer">
            {levelInfo.xp}
          </div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-silver-600 font-mono mt-0.5">Total XP</div>
        </div>
      </div>

      {levelInfo.nextLevel && (
        <div>
          <div className="flex justify-between text-[11px] mb-2">
            <span className="text-silver-600 tracking-wide">
              Next: <span className="font-display text-silver-400 tracking-wider">{levelInfo.nextLevel.title}</span>
            </span>
            <span className="text-silver-600 font-mono">
              {levelInfo.xpInLevel}/{levelInfo.xpNeeded}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${levelInfo.progress}%`,
                background: 'linear-gradient(90deg, #92710c, #d4af37, #f5d76e)',
                boxShadow: '0 0 10px rgba(212,175,55,0.3)',
              }}
            />
          </div>
        </div>
      )}

      {!levelInfo.nextLevel && (
        <div className="text-center py-2">
          <span className="text-sm font-display tracking-wider gold-text">✦ Maximum Level Achieved ✦</span>
        </div>
      )}
    </div>
  );
}
