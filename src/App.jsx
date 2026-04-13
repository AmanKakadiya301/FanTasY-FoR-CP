import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';

import { useFantasyData } from './hooks/useFantasyData.js';
import { useProgress } from './hooks/useProgress.js';
import { calculateTotalXP, getLevelInfo } from './utils/xp.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Roadmap from './components/Roadmap.jsx';
import NoteModal from './components/NoteModal.jsx';
import Login from './components/Login.jsx';
import GoldenParticles from './components/GoldenParticles.jsx';

export default function App() {
  const { data, loading, error, totalProblems } = useFantasyData();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [noteModal, setNoteModal] = useState({ open: false, key: '' });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);

  // Authentication State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Auth Changes
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser({ uid: 'local_guest', email: 'guest@localhost', displayName: 'Local Admin' });
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Pass user to useProgress so it can fetch specifically for this user
  const {
    solved, bookmarks, notes, streak, dailyGoal, todaySolved, solvedCount,
    toggleSolved, toggleBookmark, saveNote, setDailyGoal, loadingDb
  } = useProgress(user);


  const levelInfo = useMemo(() => {
    if (!data) return null;
    const xp = calculateTotalXP(solved, data.levels);
    return getLevelInfo(xp);
  }, [solved, data]);

  if (authLoading || loading || (user && loadingDb)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="text-center animate-fade-in mirror-effect p-12 glass-card rounded-2xl border border-white/[0.05]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #b8941f, #d4af37)', boxShadow: '0 8px 30px rgba(212,175,55,0.2)' }}>
            <span className="text-3xl sparkle-icon">✨</span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.4em] gold-text mb-3">
            FANTASY
          </h1>
          <p className="text-silver-600 text-[10px] tracking-[0.3em] uppercase opacity-80">Loading manuscript...</p>
          <div className="mt-8 w-40 h-[2px] mx-auto rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="h-full rounded-full animate-shimmer" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)', backgroundSize: '200% 100%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="text-center glass-card mirror-effect rounded-2xl p-10 max-w-sm animate-fade-in">
          <div className="text-4xl mb-4 opacity-40 text-silver-600">◇</div>
          <h2 className="font-display text-lg font-bold text-white tracking-wider mb-2">Quest Failed</h2>
          <p className="text-silver-500 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold tracking-[0.2em] text-obsidian transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #b8941f, #d4af37)', boxShadow: '0 4px 15px rgba(212,175,55,0.3)' }}
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex min-h-screen w-full bg-obsidian text-silver-200">
      {/* Golden particle background */}
      <GoldenParticles />

      {/* Fixed Sidebar */}
      <Sidebar
        levels={data.levels}
        solved={solved}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTopic={activeTopic}
        setActiveTopic={setActiveTopic}
        user={user}
      />

      {/* Main Content — ml-0 mobile, ml-[260px] desktop. Full remaining width, no gaps */}
      <div className="w-full lg:pl-[260px] min-h-screen relative z-[1]">
        <div className="h-screen overflow-y-auto custom-scrollbar scroll-smooth flex flex-col">
          <Header
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="w-full flex-1 px-3 sm:px-4 lg:px-6 py-4 lg:py-6">
            <Roadmap
              levels={data.levels}
              totalProblems={totalProblems}
              solvedCount={solvedCount}
              solved={solved}
              bookmarks={bookmarks}
              notes={notes}
              streak={streak}
              dailyGoal={dailyGoal}
              todaySolved={todaySolved}
              setDailyGoal={setDailyGoal}
              levelInfo={levelInfo}
              toggleSolved={toggleSolved}
              toggleBookmark={toggleBookmark}
              saveNote={saveNote}
              searchQuery={searchQuery}
              openNoteModal={(key) => setNoteModal({ open: true, key })}
              activeTopic={activeTopic}
              setActiveTopic={setActiveTopic}
            />
          </main>
        </div>
      </div>

      <NoteModal
        isOpen={noteModal.open}
        onClose={() => setNoteModal({ open: false, key: '' })}
        problemKey={noteModal.key}
        note={notes[noteModal.key] || ''}
        onSave={saveNote}
      />
    </div>
  );
}
