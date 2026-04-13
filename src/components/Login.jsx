import { useState } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase.js';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields.");
    
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Email auth failed:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("An account already exists with that email.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please disable your Ad-Blocker/Shields for this site.");
      } else {
        setError(err.message || "Failed to authenticate.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login failed:", err);
      // Ignore user-closed-popup errors, otherwise surface them
      if (err.code !== 'auth/popup-closed-by-user') {
        if (err.code === 'auth/network-request-failed') {
          setError("Network error. Your Ad-Blocker or Brave Shields is blocking Google Sign-In. Disable it for this site, or use Email/Password above.");
        } else {
          setError(err.message || "Failed to authenticate.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 glass-card mirror-effect rounded-2xl p-8 shadow-2xl border border-gold-500/10 relative overflow-hidden">
        {/* Subtle top glare */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #b8941f, #d4af37)', boxShadow: '0 8px 30px rgba(212,175,55,0.2)' }}>
            <span className="text-3xl sparkle-icon">✨</span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-widest gold-text mb-2">
            FanTasY FoR CP
          </h1>
          <p className="text-silver-500 text-sm tracking-wide">
            Your Competitive Programming Roadmap
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center leading-relaxed">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 mb-6">
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-silver-200 text-sm focus:outline-none focus:border-gold-500/50 transition-colors placeholder:text-silver-600"
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-silver-200 text-sm focus:outline-none focus:border-gold-500/50 transition-colors placeholder:text-silver-600"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#0c0c0e] hover:bg-transparent transition-colors rounded-xl px-6 py-3 flex items-center justify-center w-full">
              <span className="text-gold-500 group-hover:text-obsidian font-bold tracking-wide text-sm transition-colors">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </span>
            </div>
          </button>
        </form>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-xs text-silver-600 font-medium tracking-wider uppercase">or</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:hover:scale-100"
        >
          {/* Button border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative bg-[#0c0c0e] rounded-xl px-6 py-4 flex items-center justify-center gap-3 w-full">
            {isLoading ? (
              <div className="w-5 h-5 rounded-full border-2 border-gold-500/30 border-t-gold-500 animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-silver-200 font-semibold tracking-wide text-sm">
                  Continue with Google
                </span>
              </>
            )}
          </div>
        </button>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-gold-500/80 hover:text-gold-500 transition-colors border-b border-transparent hover:border-gold-500/50 pb-0.5"
          >
            {isSignUp ? "Already have an account? Sign In" : "Need an account? Create one"}
          </button>
        </div>

        <p className="text-center text-silver-600/50 text-[10px] mt-6 uppercase tracking-widest">
          Cloud Save Engine Operational
        </p>
      </div>
    </div>
  );
}
