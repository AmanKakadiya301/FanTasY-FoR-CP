import { useState, useEffect } from 'react';

export function useFantasyData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('./data/roadmap.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const totalProblems = data && data.levels
    ? data.levels.reduce((sum, level) => 
        sum + level.weeks.reduce((wSum, week) => 
          wSum + week.topics.reduce((tSum, topic) => 
            tSum + (topic.problems ? topic.problems.length : 0), 0), 0), 0)
    : 0;

  return { data, loading, error, totalProblems };
}
