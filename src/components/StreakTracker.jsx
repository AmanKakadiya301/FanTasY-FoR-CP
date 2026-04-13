export default function StreakTracker({ streak, dailyGoal, todaySolved, setDailyGoal }) {
  const goalProgress = dailyGoal > 0 ? Math.min(Math.round((todaySolved / dailyGoal) * 100), 100) : 0;
  const goalMet = todaySolved >= dailyGoal;

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-in-up">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display text-[11px] font-semibold text-silver-500 uppercase tracking-[0.2em]">Daily Quest</h3>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: streak.count > 0
                ? 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))'
                : 'rgba(255,255,255,0.03)',
              border: streak.count > 0
                ? '1px solid rgba(212,175,55,0.2)'
                : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {streak.count > 0 ? '🔥' : '❄️'}
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold font-display ${streak.count > 0 ? 'gold-text' : 'text-silver-600'}`}>
              {streak.count}
            </div>
            <div className="text-[9px] text-silver-700 uppercase tracking-[0.2em] font-mono">Streak</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-silver-500">
            Today: <span className="text-white font-semibold font-mono">{todaySolved}</span>
            <span className="text-silver-700"> / {dailyGoal}</span>
          </span>
          {goalMet && (
            <span className="text-xs font-display tracking-wider gold-text font-semibold">
              ✦ COMPLETE
            </span>
          )}
        </div>

        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${goalProgress}%`,
              background: goalMet
                ? 'linear-gradient(90deg, #b8941f, #d4af37, #f5d76e)'
                : 'linear-gradient(90deg, #52525b, #a1a1aa)',
              boxShadow: goalMet ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
            }}
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] text-silver-700 tracking-wider uppercase font-medium">Goal:</span>
          {[3, 5, 8, 10].map(g => (
            <button
              key={g}
              onClick={() => setDailyGoal(g)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-medium transition-all duration-300
                ${dailyGoal === g
                  ? 'bg-gold-500/15 text-gold-500 border border-gold-500/25'
                  : 'bg-white/[0.02] text-silver-600 border border-transparent hover:bg-white/[0.04] hover:text-silver-400'
                }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
