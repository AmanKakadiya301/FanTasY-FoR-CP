import React, { useState, useEffect, Suspense } from 'react';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth, googleProvider } from '../../firebase.js';
import { motion, useReducedMotion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';

import LoginCard from './LoginCard.jsx';
import LoginHeader from './LoginHeader.jsx';
import LoginInputs from './LoginInputs.jsx';
import LoginButton from './LoginButton.jsx';

// Lazy load the heavy Three.js background
const ThreeBackground = React.lazy(() => import('./ThreeBackground.jsx'));

// Error boundary to prevent Three.js crashes from killing the login UI
class ThreeErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err) { console.warn('Three.js background failed:', err); }
  render() { return this.state.hasError ? null : this.props.children; }
}

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [perfMode, setPerfMode] = useState('high');
  const reducedMotion = useReducedMotion();
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const checkPerf = () => {
      const w = window.innerWidth;
      if (w < 768) setPerfMode('low');
      else if (w < 1200) setPerfMode('medium');
      else setPerfMode('high');
    };
    checkPerf();
    window.addEventListener('resize', checkPerf);

    // Delay canvas mount to let the login card render first, preventing blank screens
    const t = setTimeout(() => setCanvasReady(true), 200);

    return () => {
      window.removeEventListener('resize', checkPerf);
      clearTimeout(t);
    };
  }, []);

  const handleEmailAuth = async (e) => {
    if (e) e.preventDefault();
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
      if (err.code !== 'auth/popup-closed-by-user') {
        if (err.code === 'auth/network-request-failed') {
          setError("Network error. Your Ad-Blocker or Brave Shields is blocking Google Sign-In.");
        } else {
          setError(err.message || "Failed to authenticate.");
        }
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-obsidian overflow-hidden selection:bg-neon-purple/30">
      
      {/* Three.js Background — deferred mount + error boundary */}
      {canvasReady && (
        <ThreeErrorBoundary>
          <div className="absolute inset-0 pointer-events-none z-0">
            <Suspense fallback={null}>
              <Canvas
                gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
                dpr={[1, 1.5]}
                camera={{ position: [0, 0.5, 5], fov: 60 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              >
                <ThreeBackground perfMode={perfMode} reducedMotion={reducedMotion} />
              </Canvas>
            </Suspense>
          </div>
        </ThreeErrorBoundary>
      )}

      {/* 2D Fallback Ambient Glow — always visible */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-neon-purple/15 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-neon-pink/8 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Login Card — always renders with z-10 */}
      <LoginCard>
        <LoginHeader />

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-3 rounded-xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink shadow-[0_0_15px_rgba(236,72,153,0.3)] text-xs text-center leading-relaxed font-mono"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleEmailAuth} className="relative z-20">
          <LoginInputs 
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            isLoading={isLoading}
          />
          
          <LoginButton 
            isLoading={isLoading}
            isSignUp={isSignUp}
            onEmailSubmit={handleEmailAuth}
            onGoogleLogin={handleGoogleLogin}
          />
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-5 text-center border-t border-white/5 pt-4 relative z-20"
        >
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs font-mono text-neon-cyan/70 hover:text-white group transition-all duration-300"
          >
            {isSignUp ? (
              <span><span className="text-neon-pink group-hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">&gt; ABORT SEQUENCE: </span>RETURN</span>
            ) : (
              <span><span className="text-neon-cyan group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">&gt; INITIATE: </span>NEW USER REGISTRATION</span>
            )}
          </button>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center text-silver-600/30 text-[9px] mt-3 font-mono uppercase tracking-[0.4em] relative z-20"
        >
          Cloud Interface V3.0 Active
        </motion.p>
      </LoginCard>
    </div>
  );
}
