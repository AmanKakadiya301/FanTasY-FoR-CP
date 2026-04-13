import { useState, useMemo } from 'react';
import ProblemTable from './ProblemTable.jsx';
import ConfettiEffect from './ConfettiEffect.jsx';
import FilterBar from './FilterBar.jsx';

function TopicAccordion({
  topic,
  levelNum,
  weekNum,
  solved,
  bookmarks,
  notes,
  toggleSolved,
  toggleBookmark,
  openNoteModal,
  searchQuery,
  activeTopic,
  setActiveTopic
}) {
  const [userExpanded, setUserExpanded] = useState(false);
  const [filter, setFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const safeId = `level${levelNum}_week${weekNum}_${topic.title.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const isTargeted = activeTopic === safeId;

  const expanded = searchQuery ? true : (isTargeted || userExpanded);

  const handleToggle = () => {
    if (isTargeted) setActiveTopic(null);
    setUserExpanded(!expanded);
  };

  const totalProblems = topic.problems ? topic.problems.length : 0;
  const solvedProblems = topic.problems ? topic.problems.filter(
    p => solved[p.id]
  ).length : 0;
  const progressPct = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;
  const isComplete = progressPct === 100 && totalProblems > 0;

  const filteredProblems = useMemo(() => {
    if (!topic.problems) return [];
    let result = topic.problems;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (filter === 'solved') {
      result = result.filter(p => solved[p.id]);
    } else if (filter === 'unsolved') {
      result = result.filter(p => !solved[p.id]);
    } else if (filter === 'bookmarked') {
      result = result.filter(p => bookmarks[p.id]);
    }
    if (difficultyFilter !== 'all') {
      result = result.filter(p => (p.difficulty.toLowerCase() || 'medium') === difficultyFilter);
    }
    return result;
  }, [topic, solved, bookmarks, filter, difficultyFilter, searchQuery]);

  if (searchQuery && filteredProblems.length === 0) return null;

  return (
    <div id={safeId} className="mb-3">
      <ConfettiEffect trigger={isComplete && expanded ? safeId : null} />
      
      <button 
        onClick={handleToggle}
        className={`w-full text-left glass hover:bg-white/[0.05] rounded-xl transition-all duration-300 relative overflow-hidden group border ${isComplete ? 'border-neon-cyan/50 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/[0.05]'}`}
      >
        {isComplete && (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/[0.1] to-transparent pointer-events-none" />
        )}
        <div className="p-3 sm:p-4 flex items-center gap-3">
          <div className="text-silver-600 group-hover:text-neon-cyan transition-all duration-300 flex-shrink-0" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h2 className="font-display text-sm sm:text-base font-bold tracking-wider text-white flex items-center gap-2 flex-shrink-0 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all">
              {topic.title}
              {isComplete && <span className="text-xs drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">✨</span>}
            </h2>
            
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progressPct}%`,
                    background: isComplete ? 'linear-gradient(90deg, #22D3EE, #7C3AED)' : 'linear-gradient(90deg, #3B82F6, #EC4899)',
                  }}
                />
              </div>
              <span className={`text-xs font-mono whitespace-nowrap ${isComplete ? 'text-neon-cyan font-bold drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-silver-500'}`}>
                {solvedProblems}/{totalProblems}
              </span>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="mt-1 border border-white/[0.04] bg-[#08080b] rounded-xl overflow-hidden animate-fade-in">
          <div className="p-2 sm:p-3 border-b border-white/[0.04] bg-black/30 flex flex-wrap items-center justify-between gap-2">
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={setDifficultyFilter}
            />
          </div>
          <ProblemTable
            problems={filteredProblems}
            solved={solved}
            bookmarks={bookmarks}
            notes={notes}
            toggleSolved={toggleSolved}
            toggleBookmark={toggleBookmark}
            openNoteModal={openNoteModal}
          />
        </div>
      )}
    </div>
  );
}

export default function Roadmap({
  levels,
  totalProblems,
  solvedCount,
  solved,
  bookmarks,
  notes,
  streak,
  dailyGoal,
  todaySolved,
  setDailyGoal,
  levelInfo,
  toggleSolved,
  toggleBookmark,
  saveNote,
  searchQuery,
  openNoteModal,
  activeTopic,
  setActiveTopic
}) {
  return (
    <div className="w-full">
      <section className="w-full pb-20 space-y-8">
        {levels && levels.map(level => (
          <div key={`level_${level.level}`} className="mb-8 relative">
            <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-neon-purple to-transparent opacity-30 hidden sm:block" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-cyan uppercase tracking-[0.3em] mb-6 mt-8 pl-0 sm:pl-2 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {level.title}
            </h1>
            
            {level.weeks.map(week => (
              <div key={`week_${week.week}`} className="ml-0 sm:ml-6 mb-6 relative">
                <div className="absolute -left-6 top-8 bottom-0 w-[1px] bg-white/10 hidden sm:block" />
                <h3 className="text-lg font-bold text-silver-200 mb-4 flex items-center gap-3">
                  <span className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/40 rounded-lg text-neon-purple text-xs tracking-widest font-mono shadow-[0_0_10px_rgba(124,58,237,0.2)]">WEEK {week.week}</span>
                  <span className="tracking-wide">{week.title}</span>
                </h3>
                
                <div className="space-y-4">
                  {week.topics.map((topic, i) => (
                    <TopicAccordion
                      key={topic.title + i}
                      topic={topic}
                      levelNum={level.level}
                      weekNum={week.week}
                      solved={solved}
                      bookmarks={bookmarks}
                      notes={notes}
                      toggleSolved={toggleSolved}
                      toggleBookmark={toggleBookmark}
                      openNoteModal={openNoteModal}
                      searchQuery={searchQuery}
                      activeTopic={activeTopic}
                      setActiveTopic={setActiveTopic}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        {(!levels || levels.length === 0) && (
          <div className="text-center py-20 text-silver-600">
            <p className="text-sm tracking-wide font-mono uppercase">! System Data Missing !</p>
          </div>
        )}
      </section>
    </div>
  );
}
