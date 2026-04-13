import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * localStorage-first progress hook with Firestore cloud sync.
 * 
 * Data is ALWAYS saved to localStorage immediately (guaranteed to work).
 * Then we TRY to sync to Firestore. If Firestore fails (rules, network),
 * localStorage still has the data and it loads on refresh.
 * 
 * When user logs in on a new device, Firestore data is pulled down
 * and merged with any local data.
 */

const STORAGE_KEY = 'fantasy_progress';

// ─── localStorage helpers ───
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[Fantasy] localStorage write failed:', e);
  }
}

function buildState(data) {
  return {
    solved: data?.solved || {},
    bookmarks: data?.bookmarks || {},
    notes: data?.notes || {},
    streak: data?.streak || { count: 0, lastDate: null },
    dailyGoal: data?.dailyGoal || 3,
    todaySolved: data?.todaySolved || 0,
  };
}

// Merge two states — union of solved keys, prefer non-empty values
function mergeStates(local, cloud) {
  const merged = { ...buildState(cloud) };
  const loc = buildState(local);
  
  // Merge solved: union of both
  merged.solved = { ...loc.solved, ...merged.solved };
  // Keep only truthy entries
  for (const k of Object.keys(merged.solved)) {
    if (!merged.solved[k]) delete merged.solved[k];
  }
  
  merged.bookmarks = { ...loc.bookmarks, ...merged.bookmarks };
  for (const k of Object.keys(merged.bookmarks)) {
    if (!merged.bookmarks[k]) delete merged.bookmarks[k];
  }
  
  merged.notes = { ...loc.notes, ...merged.notes };
  
  // Use higher values for scalars
  merged.todaySolved = Math.max(loc.todaySolved, merged.todaySolved);
  merged.dailyGoal = merged.dailyGoal || loc.dailyGoal;
  
  // Use the streak with higher count
  if (loc.streak.count > merged.streak.count) {
    merged.streak = loc.streak;
  }
  
  return merged;
}


export function useProgress(user) {
  // Initialize from localStorage immediately (no loading flash)
  const initial = buildState(loadLocal());
  
  const [solved, setSolvedState] = useState(initial.solved);
  const [bookmarks, setBookmarksState] = useState(initial.bookmarks);
  const [notes, setNotesState] = useState(initial.notes);
  const [streak, setStreakState] = useState(initial.streak);
  const [dailyGoal, setDailyGoalState] = useState(initial.dailyGoal);
  const [todaySolved, setTodaySolvedState] = useState(initial.todaySolved);
  const [loadingDb, setLoadingDb] = useState(true);

  // Apply a full state object to all state hooks + save to localStorage
  const applyState = useCallback((data) => {
    const s = buildState(data);
    setSolvedState(s.solved);
    setBookmarksState(s.bookmarks);
    setNotesState(s.notes);
    setStreakState(s.streak);
    setDailyGoalState(s.dailyGoal);
    setTodaySolvedState(s.todaySolved);
    saveLocal(s);
  }, []);

  // Try to sync to Firestore (fire-and-forget, errors are logged not thrown)
  const syncToCloud = useCallback(async (data) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });
      console.log('[Fantasy] ☁️ Cloud sync OK');
    } catch (err) {
      console.warn('[Fantasy] ☁️ Cloud sync failed (data safe in localStorage):', err.code || err.message);
    }
  }, [user]);

  // On login: try to pull cloud data and merge with local
  useEffect(() => {
    if (!user) {
      // Not logged in — just use localStorage
      const local = buildState(loadLocal());
      setSolvedState(local.solved);
      setBookmarksState(local.bookmarks);
      setNotesState(local.notes);
      setStreakState(local.streak);
      setDailyGoalState(local.dailyGoal);
      setTodaySolvedState(local.todaySolved);
      setLoadingDb(false);
      return;
    }

    console.log('[Fantasy] User logged in:', user.uid);
    let cancelled = false;

    (async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const snap = await getDoc(docRef);
        
        if (cancelled) return;
        
        const local = buildState(loadLocal());
        
        if (snap.exists()) {
          const cloud = snap.data();
          console.log('[Fantasy] Cloud data found, solved:', Object.keys(cloud.solved || {}).length);
          
          // Merge cloud + local (union of progress)
          const merged = mergeStates(local, cloud);
          applyState(merged);
          
          // Push merged state back to cloud
          syncToCloud(merged);
        } else {
          console.log('[Fantasy] No cloud data, using localStorage');
          // No cloud data — upload local state
          applyState(local);
          syncToCloud(local);
        }
      } catch (err) {
        console.warn('[Fantasy] Cloud fetch failed, using localStorage:', err.code || err.message);
        // Firestore unavailable — just use localStorage
        const local = buildState(loadLocal());
        applyState(local);
      }
      
      if (!cancelled) setLoadingDb(false);
    })();

    return () => { cancelled = true; };
  }, [user, applyState, syncToCloud]);


  // ─── Save helper: updates state + localStorage + tries cloud sync ───
  const saveAll = useCallback((updates) => {
    const current = buildState(loadLocal());
    const next = { ...current, ...updates };
    saveLocal(next);
    syncToCloud(next);
  }, [syncToCloud]);


  const toggleSolved = useCallback((key) => {
    const wasSolved = !!solved[key];
    const newSolvedValue = !wasSolved;
    
    // Update solved map
    const newSolved = { ...solved };
    if (newSolvedValue) {
      newSolved[key] = true;
    } else {
      delete newSolved[key];
    }
    setSolvedState(newSolved);

    // Update streak + todaySolved
    const today = new Date().toISOString().split('T')[0];
    let newTodaySolved = todaySolved;
    let newStreak = { ...streak };

    if (newSolvedValue) {
      newTodaySolved = todaySolved + 1;
      if (streak.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        newStreak = {
          count: streak.lastDate === yesterday ? streak.count + 1 : 1,
          lastDate: today
        };
      }
    } else {
      newTodaySolved = Math.max(0, todaySolved - 1);
    }

    setTodaySolvedState(newTodaySolved);
    setStreakState(newStreak);
    
    // Save to localStorage + cloud
    saveAll({
      solved: newSolved,
      streak: newStreak,
      todaySolved: newTodaySolved
    });
    
    return newSolvedValue;
  }, [solved, streak, todaySolved, saveAll]);

  const toggleBookmark = useCallback((key) => {
    const wasBookmarked = !!bookmarks[key];
    const newBookmarks = { ...bookmarks };
    if (wasBookmarked) {
      delete newBookmarks[key];
    } else {
      newBookmarks[key] = true;
    }
    
    setBookmarksState(newBookmarks);
    saveAll({ bookmarks: newBookmarks });
  }, [bookmarks, saveAll]);

  const saveNote = useCallback((key, note) => {
    const newNotes = { ...notes };
    if (note && note.trim()) {
      newNotes[key] = note.trim();
    } else {
      delete newNotes[key];
    }
    
    setNotesState(newNotes);
    saveAll({ notes: newNotes });
  }, [notes, saveAll]);

  const setDailyGoal = useCallback((goal) => {
    setDailyGoalState(goal);
    saveAll({ dailyGoal: goal });
  }, [saveAll]);

  const solvedCount = Object.keys(solved).filter(k => solved[k]).length;

  return {
    solved,
    bookmarks,
    notes,
    streak,
    dailyGoal,
    todaySolved,
    solvedCount,
    toggleSolved,
    toggleBookmark,
    saveNote,
    setDailyGoal,
    loadingDb
  };
}
