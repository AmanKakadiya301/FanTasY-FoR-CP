const XP_VALUES = {
  easy: 5,
  medium: 10,
  hard: 20,
};

const LEVELS = [
  { level: 1, title: 'Beginner', minXP: 0 },
  { level: 2, title: 'Explorer', minXP: 50 },
  { level: 3, title: 'Knight', minXP: 150 },
  { level: 4, title: 'Wizard', minXP: 300 },
  { level: 5, title: 'Master', minXP: 500 },
];

export function getXPForDifficulty(difficulty) {
  return XP_VALUES[difficulty] || XP_VALUES.medium;
}

export function calculateTotalXP(solvedProblems, allLevels) {
  let totalXP = 0;
  if (!allLevels) return totalXP;
  for (const level of allLevels) {
    for (const week of level.weeks) {
      for (const topic of week.topics) {
        if (!topic.problems) continue;
        for (const problem of topic.problems) {
          if (solvedProblems[problem.id]) {
            totalXP += getXPForDifficulty(problem.difficulty);
          }
        }
      }
    }
  }
  return totalXP;
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

export { LEVELS, XP_VALUES };
