const STORAGE_KEY = 'fantasy_dsa_progress';

function getStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read localStorage:', e);
  }
  return {
    solved: {},
    bookmarks: {},
    notes: {},
    dailyGoal: 5,
    streak: { count: 0, lastDate: null },
  };
}

function setStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to write localStorage:', e);
  }
}

export function getSolved() {
  return getStorage().solved || {};
}

export function setSolved(key, value) {
  const data = getStorage();
  if (value) {
    data.solved[key] = true;
  } else {
    delete data.solved[key];
  }
  setStorage(data);
  return data.solved;
}

export function getBookmarks() {
  return getStorage().bookmarks || {};
}

export function toggleBookmark(key) {
  const data = getStorage();
  if (data.bookmarks[key]) {
    delete data.bookmarks[key];
  } else {
    data.bookmarks[key] = true;
  }
  setStorage(data);
  return data.bookmarks;
}

export function getNotes() {
  return getStorage().notes || {};
}

export function setNote(key, note) {
  const data = getStorage();
  if (note && note.trim()) {
    data.notes[key] = note.trim();
  } else {
    delete data.notes[key];
  }
  setStorage(data);
  return data.notes;
}

export function getDailyGoal() {
  return getStorage().dailyGoal || 5;
}

export function setDailyGoal(goal) {
  const data = getStorage();
  data.dailyGoal = goal;
  setStorage(data);
}

export function getStreak() {
  return getStorage().streak || { count: 0, lastDate: null };
}

export function updateStreak() {
  const data = getStorage();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (data.streak.lastDate === today) {
    return data.streak;
  }

  if (data.streak.lastDate === yesterday) {
    data.streak.count += 1;
  } else if (data.streak.lastDate !== today) {
    data.streak.count = 1;
  }
  data.streak.lastDate = today;
  setStorage(data);
  return data.streak;
}

export function getTodaySolvedCount() {
  const data = getStorage();
  const today = new Date().toISOString().split('T')[0];
  return data.todaySolved?.[today] || 0;
}

export function incrementTodaySolved() {
  const data = getStorage();
  const today = new Date().toISOString().split('T')[0];
  if (!data.todaySolved) data.todaySolved = {};
  data.todaySolved[today] = (data.todaySolved[today] || 0) + 1;
  setStorage(data);
  return data.todaySolved[today];
}

export function decrementTodaySolved() {
  const data = getStorage();
  const today = new Date().toISOString().split('T')[0];
  if (!data.todaySolved) data.todaySolved = {};
  data.todaySolved[today] = Math.max(0, (data.todaySolved[today] || 0) - 1);
  setStorage(data);
  return data.todaySolved[today];
}
