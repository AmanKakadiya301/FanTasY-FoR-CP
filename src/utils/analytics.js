import { useMemo } from 'react';

// Generates 30-day activity data for the Heatmap component
export function generateHeatmapData(solvedActivity = {}) {
  const days = [];
  // Use timestamps from solved map to count per day
  const activityMap = {};
  
  Object.values(solvedActivity).forEach(timestamp => {
    if (typeof timestamp === 'string') {
      const day = timestamp.split('T')[0];
      activityMap[day] = (activityMap[day] || 0) + 1;
    }
  });

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split("T")[0];

    days.push({
      date: key,
      count: activityMap[key] || 0,
    });
  }

  return days;
}

// Calculates progress percentage for each main topic area
export function calculateSkillProgress(solved, levels) {
  if (!levels) return [];
  
  const skillMap = {};

  levels.forEach(level => {
    level.weeks.forEach(week => {
      week.topics.forEach(topic => {
        const skillName = topic.title; // Using topic name as skill
        if (!skillMap[skillName]) {
          skillMap[skillName] = { total: 0, solved: 0 };
        }
        
        if (topic.problems) {
          topic.problems.forEach(prob => {
            skillMap[skillName].total++;
            if (solved[prob.id]) {
              skillMap[skillName].solved++;
            }
          });
        }
      });
    });
  });

  return Object.entries(skillMap)
    .map(([name, stats]) => ({
      name,
      progress: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0
    }))
    .filter(s => s.progress > 0) // Only show active skills
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5); // Top 5 skills
}

// Returns a list of the most recently solved problems
export function getRecentActivity(solved, levels) {
  const allProblems = {};
  if (levels) {
    levels.forEach(l => {
      l.weeks.forEach(w => {
        w.topics.forEach(t => {
          if (t.problems) {
            t.problems.forEach(p => {
              allProblems[p.id] = { name: p.title, difficulty: p.difficulty || 'Medium' };
            });
          }
        });
      });
    });
  }

  return Object.entries(solved)
    .filter(([id, ts]) => typeof ts === 'string') // Only items with timestamps
    .sort((a, b) => new Date(b[1]) - new Date(a[1]))
    .slice(0, 10)
    .map(([id, ts]) => ({
      id,
      name: allProblems[id]?.name || "Unknown Problem",
      difficulty: allProblems[id]?.difficulty || "Medium",
      timestamp: ts
    }));
}

// Support for Weekly Stats (existing logic)
export function getSolvedInRange(solved, levels, days = 7, offsetDays = 0) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days + offsetDays));
  const end = new Date(now);
  end.setDate(now.getDate() - offsetDays);
  
  const stats = { total: 0, easy: 0, medium: 0, hard: 0 };
  
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
    if (typeof timestamp !== 'string') return;
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
