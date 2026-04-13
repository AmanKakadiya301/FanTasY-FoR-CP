const XP_VALUES = {
  easy: 10,
  medium: 25,
  hard: 50,
};

const LEVELS = [
  { level: 1, title: 'Beginner', minXP: 0, icon: '🌱' },
  { level: 2, title: 'Explorer', minXP: 100, icon: '🗺️' },
  { level: 3, title: 'Knight', minXP: 300, icon: '⚔️' },
  { level: 4, title: 'Wizard', minXP: 700, icon: '🔮' },
  { level: 5, title: 'Master', minXP: 1500, icon: '👑' },
];

const RANK_TIERS = [
  { id: 'bronze', label: 'Bronze', minXP: 0, icon: '🥉', color: '#CD7F32' },
  { id: 'silver', label: 'Silver', minXP: 100, icon: '🥈', color: '#C0C0C0' },
  { id: 'gold', label: 'Gold', minXP: 300, icon: '🥇', color: '#FFD700' },
  { id: 'platinum', label: 'Platinum', minXP: 700, icon: '💎', color: '#E5E4E2' },
];

export function getXPForDifficulty(difficulty) {
  return XP_VALUES[difficulty] || XP_VALUES.medium;
}

export function calculateTotalXP(solvedProblems, allLevels, streak = 0) {
  let totalXP = 0;
  let solvedCount = 0;
  
  if (!allLevels) return totalXP;

  // 1. Solve XP
  for (const level of allLevels) {
    for (const week of level.weeks) {
      for (const topic of week.topics) {
        if (!topic.problems) continue;
        for (const problem of topic.problems) {
          if (solvedProblems[problem.id]) {
            totalXP += getXPForDifficulty(problem.difficulty);
            solvedCount++;
          }
        }
      }
    }
  }

  // 2. Streak Bonus: +5 XP per day streak
  totalXP += (streak * 5);

  // 3. Milestone Bonuses
  if (solvedCount >= 50) totalXP += 200;
  else if (solvedCount >= 25) totalXP += 100;
  else if (solvedCount >= 10) totalXP += 50;

  return totalXP;
}

export function getRankTier(xp) {
  let currentTier = RANK_TIERS[0];
  for (const tier of RANK_TIERS) {
    if (xp >= tier.minXP) {
      currentTier = tier;
    }
  }
  
  const currentIndex = RANK_TIERS.indexOf(currentTier);
  const nextTier = RANK_TIERS[currentIndex + 1] || null;
  const progress = nextTier ? Math.min((xp - currentTier.minXP) / (nextTier.minXP - currentTier.minXP) * 100, 100) : 100;

  return { ...currentTier, nextTier, progress };
}

export function getLevelInfo(xp) {
  let currentLevel = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXP) {
      currentLevel = level;
    }
  }

  const currentIndex = LEVELS.indexOf(currentLevel);
  const nextLevel = LEVELS[currentIndex + 1] || null;

  const xpInLevel = xp - currentLevel.minXP;
  const xpNeeded = nextLevel ? nextLevel.minXP - currentLevel.minXP : 0;
  const progress = nextLevel ? Math.min((xpInLevel / xpNeeded) * 100, 100) : 100;

  return {
    ...currentLevel,
    xp,
    xpInLevel,
    xpNeeded,
    progress,
    nextLevel,
  };
}

export { LEVELS, XP_VALUES, RANK_TIERS };
