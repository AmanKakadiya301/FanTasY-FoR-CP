import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase.js';

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 group
        ${active 
          ? 'bg-white/[0.05] text-white shadow-[inset_0_0_15px_rgba(34,211,238,0.1)] border border-white/5' 
          : 'text-silver-400 hover:text-white hover:bg-white/[0.02] hover:translate-x-1'}`}
    >
      <span className={`text-base flex-shrink-0 w-6 text-center transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'grayscale group-hover:grayscale-0'}`}>
        {icon}
      </span>
      <span className={`text-[13px] font-sub font-bold tracking-wide ${active ? 'text-white' : 'text-silver-400 font-medium'}`}>
        {label}
      </span>
      {active && (
        <div className="ml-auto w-1 h-4 rounded-full bg-neon-cyan shadow-[0_0_8px_#22D3EE]" />
      )}
    </button>
  );
}

export default function Sidebar({ levels, solved, sidebarOpen, setSidebarOpen, activeTopic, setActiveTopic, user, currentView, setView }) {
  const [expandedLevels, setExpandedLevels] = useState({});

  useEffect(() => {
    if (window.innerWidth < 1024 && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  function getWeekProgress(week) {
    let total = 0;
    let done = 0;
    if (week.topics) {
      week.topics.forEach(topic => {
        if (topic.problems) {
          total += topic.problems.length;
          done += topic.problems.filter(p => solved[p.id]).length;
        }
      });
    }
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }

  function toggleLevel(levelNum) {
    setExpandedLevels(prev => ({ ...prev, [levelNum]: !prev[levelNum] }));
  }

  function scrollToSection(safeId) {
    if (setActiveTopic) setActiveTopic(safeId);
    
    // safeId is formatting logic from Roadmap.jsx
    const el = document.getElementById(safeId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }

  const handleLogout = async () => {
    sessionStorage.setItem('localLoggedOut', 'true');
    await signOut(auth);
    window.location.reload();
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Runner';
  const displayEmail = user?.email || '';
  const avatarUrl = user?.photoURL;

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 bottom-0 h-screen w-[260px] z-[100] transition-transform duration-300 ease-out flex flex-col custom-scrollbar border-r border-white/5
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{
          background: 'rgba(5, 7, 15, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex flex-col pt-6 pb-2 px-5 sticky top-0 z-10" style={{ background: 'linear-gradient(180deg, rgba(5,7,15,1), rgba(5,7,15,0.9) 70%, transparent)' }}>
          <div className="flex items-center justify-between w-full">
            <h1 className="font-display text-lg font-bold tracking-widest neon-text">
              FANTASY
            </h1>
            <button 
              className="p-1.5 lg:hidden text-silver-600 hover:text-white hover:text-shadow-[0_0_8px_#ffffff] transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 flex flex-col py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          {/* Primary Navigation */}
          <NavButton 
            active={currentView === 'home'} 
            onClick={() => { setView('home'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="🏠"
            label="Home Hub"
          />
          <NavButton 
            active={currentView === 'roadmap'} 
            onClick={() => { setView('roadmap'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="🗺"
            label="Problem Roadmap"
          />
          <NavButton 
            active={currentView === 'analytics'} 
            onClick={() => { setView('analytics'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="📊"
            label="Analytics Cockpit"
          />
          <NavButton 
            active={currentView === 'missions'} 
            onClick={() => { setView('missions'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="🎯"
            label="Daily Missions"
          />
          <NavButton 
            active={currentView === 'achievements'} 
            onClick={() => { setView('achievements'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="🏆"
            label="Neural Trophies"
          />
          <NavButton 
            active={currentView === 'profile'} 
            onClick={() => { setView('profile'); if (window.innerWidth < 1024) setSidebarOpen(false); }}
            icon="👤"
            label="User Profile"
          />

          <div className="h-px bg-white/5 my-6 mx-3" />

          {/* Roadmap Sections */}
          <div className="px-3 mb-2">
             <span className="text-[9px] font-mono font-black text-gray-500 uppercase tracking-[0.3em]">Sector Mapping</span>
          </div>

          {levels && levels.map((level) => {
            const isExpanded = expandedLevels[level.level] !== false; // Default expanded
            return (
              <div key={level.level} className="mb-2">
                <button
                  onClick={() => toggleLevel(level.level)}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all hover:bg-white/[0.05]"
                >
                  <span className="text-[11px] uppercase tracking-widest text-neon-cyan/70 font-bold font-display">
                    {level.title}
                  </span>
                  <span className={`text-neon-cyan/50 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-neon-cyan' : ''}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {level.weeks.map((week) => {
                      const { done, total, pct } = getWeekProgress(week);
                      // ID to scroll to: we can use the first topic's safeId if topics exist
                      let targetId = null;
                      if (week.topics && week.topics.length > 0) {
                         targetId = `level${level.level}_week${week.week}_${week.topics[0].title.replace(/[^a-zA-Z0-9]/g, '_')}`;
                      }

                      return (
                        <button
                          key={week.week}
                          onClick={() => targetId && scrollToSection(targetId)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group hover:translate-x-1
                             ${activeTopic && activeTopic.startsWith(`level${level.level}_week${week.week}`) 
                                ? 'nav-active bg-white/[0.05] text-white shadow-[inset_0_0_20px_rgba(34,211,238,0.1)]' 
                                : 'text-silver-400 hover:text-silver-200 hover:bg-white/[0.03]'}`}
                        >
                          <div className="flex-1 min-w-0 text-left">
                            <div className={`text-[12px] font-sub font-medium tracking-wide truncate ${pct === 100 ? 'text-neon-cyan' : ''}`}>
                              {week.title || `Week ${week.week}`}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700 relative"
                                  style={{
                                    width: `${pct}%`,
                                    background: pct === 100
                                      ? 'linear-gradient(90deg, #22D3EE, #7C3AED)'
                                      : 'linear-gradient(90deg, rgba(34,211,238,0.4), rgba(124,58,237,0.4))',
                                  }}
                                >
                                  {pct > 0 && <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]" />}
                                </div>
                              </div>
                              <span className="text-[9px] text-silver-600 font-mono tabular-nums">{done}/{total}</span>
                            </div>
                          </div>
                          {pct === 100 && total > 0 && (
                            <span className="text-[10px] drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">⚡</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sticky bottom-0 z-10 px-3 pb-4 pt-3" style={{ background: 'linear-gradient(0deg, #05070f 80%, transparent)' }}>
          <div className="border-t border-white/[0.06] pt-3 px-2">
            <div className="flex items-center gap-3 hover:-translate-y-0.5 transition-transform">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt={displayName} 
                  className="w-8 h-8 rounded-full border border-neon-cyan/30 flex-shrink-0 object-cover shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-silver-200 truncate">{displayName}</div>
                {displayEmail && (
                  <div className="text-[10px] text-silver-600 truncate">{displayEmail}</div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-silver-600 hover:text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_10px_rgba(236,72,153,0.3)] transition-all duration-300 flex-shrink-0 group"
                title="Sign Out"
                id="sidebar-logout"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
