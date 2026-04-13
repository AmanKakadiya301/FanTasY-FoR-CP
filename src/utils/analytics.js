import { useMemo } from 'react';

export function getSolvedInRange(solved, levels, days = 7, offsetDays = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days + offsetDays));
  
  const end = new Date(now);
  end.setDate(now.getDate() - offsetDays);
  
  const stats = { total: 0, easy: 0, medium: 0, hard: 0 };
  
  // Create a map for quick difficulty lookup
  const difficultyMap = {};
  levels.forEach(level => {
    level.weeks.forEach(week => {
      week.topics.forEach(topic => {
        if (!topic.problems) return;
        topic.problems.forEach(prob => {
          difficultyMap[prob.id] = (prob.difficulty || 'medium').toLowerCase();
        });
      });
    });
  });

  Object.entries(solved).forEach(([id, timestamp]) => {
    // If timestamp is true (old data), count it as "old" (not in recent range)
    if (timestamp === true) return;
    
    const solveDate = new Date(timestamp);
    if (solveDate >= start && solveDate <= end) {
      stats.total++;
      const diff = difficultyMap[id] || 'medium';
      if (stats[diff] !== undefined) stats[diff]++;
    }
  });

  return stats;
}

export function generateWeeklyReport(solved, levels) {
  const currentWeek = getSolvedInRange(solved, levels, 7, 0);
  const prevWeek = getSolvedInRange(solved, levels, 7, 7);
  
  const improvement = currentWeek.total - prevWeek.total;

  return {
    current: currentWeek,
    prev: prevWeek,
    improvement
  };
}
