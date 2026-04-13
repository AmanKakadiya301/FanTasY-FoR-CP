import { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  sidebarOpen, 
  setSidebarOpen 
}) {
  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <header
      className="sticky top-0 z-20 w-full px-3 sm:px-4 lg:px-6 py-3 flex items-center gap-3 transition-all"
      style={{
        background: 'rgba(11,11,15,0.95)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Hamburger — mobile only */}
      <button 
        className="lg:hidden p-2 -ml-1 rounded-lg text-silver-400 hover:text-white hover:bg-white/[0.05] flex-shrink-0"
        onClick={() => setSidebarOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Search — fills available space */}
      <div className="flex-1 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-600 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search patterns or problems..."
          className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/[0.08] rounded-xl text-sm text-silver-200 placeholder-silver-700 focus:outline-none focus:border-gold-500/40 focus:bg-white/[0.04] transition-all duration-300 font-body tracking-wide"
          id="search-input"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-600 hover:text-white transition-colors p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300"
          title="Sign Out"
          id="logout-btn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-silver-500 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
