import React, { useState, useMemo, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase.js';
import { motion, AnimatePresence } from 'framer-motion';

import { useFantasyData } from './hooks/useFantasyData.js';
import { useProgress } from './hooks/useProgress.js';
import { calculateTotalXP, getLevelInfo } from './utils/xp.js';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Roadmap from './components/Roadmap.jsx';
import NoteModal from './components/NoteModal.jsx';
import Login from './components/login/index.jsx';
import NeonParticles from './components/NeonParticles.jsx';
import NeonGlowBackground from './components/NeonGlowBackground.jsx';
import LogoImg from './assets/branding/logo.png';
import FantasyTextImg from './assets/branding/fantasy-text.png';

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
      if (sessionStorage.getItem('localLoggedOut') === 'true') {
        setUser(null);
      } else {
        setUser({ uid: 'local_guest', email: 'guest@localhost', displayName: 'Local Admin' });
      }
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
      <div className="min-h-screen flex items-center justify-center bg-obsidian relative overflow-hidden text-white">
        <NeonGlowBackground />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-center z-10 flex flex-col items-center justify-center"
        >
          <motion.img 
            src={LogoImg} 
            alt="FanTasY" 
            className="w-16 h-16 mb-4 drop-shadow-[0_0_20px_rgba(124,58,237,0.5)]"
            style={{ filter: 'brightness(1.2)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />

          <p className="text-neon-cyan text-[10px] tracking-widest uppercase opacity-60 animate-pulse">Initializing Cybernetics...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian text-white relative">
        <NeonGlowBackground />
        <div className="text-center glass rounded-2xl p-10 max-w-sm animate-fade-in z-10 border border-red-500/20">
          <div className="text-4xl mb-4 text-neon-pink opacity-80">⚠</div>
          <h2 className="font-display text-lg font-bold text-white tracking-widest mb-2">Systems Warning</h2>
          <p className="text-silver-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-xs font-bold tracking-widest text-white transition-all bg-neon-pink/20 border border-neon-pink/50 hover:bg-neon-pink hover:shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          >
            REBOOT
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen w-full bg-obsidian text-silver-200 relative overflow-x-hidden selection:bg-neon-purple/30">
      <NeonGlowBackground />
      <NeonParticles />

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

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key="main-app"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full lg:pl-[260px] min-h-screen relative z-[1]"
        >
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
        </motion.div>
      </AnimatePresence>

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
