import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

function CameraMotion({ disableMotion }) {
  useFrame((state) => {
    if (disableMotion) return;
    const t = state.clock.getElapsedTime();
    state.camera.position.z = 5 + Math.sin(t * 0.3) * 0.2;
    state.camera.position.y = 0.5 + Math.sin(t * 0.5) * 0.1;
    state.camera.position.x = Math.sin(t * 0.2) * 0.1;
  });
  return null;
}

function CyberGrid({ disableAnimation }) {
  const gridRef = useRef();
  
  useFrame((state) => {
    if (disableAnimation || !gridRef.current) return;
    // Scroll texture/grid to simulate moving forward
    gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
  });

  return (
    <group position={[0, -2, 0]} ref={gridRef}>
      <gridHelper args={[40, 40, '#7C3AED', '#3B82F6']} position={[0, 0, -10]} />
    </group>
  );
}

export default function ThreeBackground({ perfMode, reducedMotion }) {
  // perfMode: 'high', 'medium', 'low'
  const isLow = perfMode === 'low';
  const isMedium = perfMode === 'medium';
  
  const particleCount = isLow ? 40 : (isMedium ? 120 : 200);

  return (
    <>
      {!isLow && <fog attach="fog" args={['#05070f', 5, 20]} />}
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1.5} color="#22D3EE" />
      <pointLight position={[5, 0, 5]} intensity={2} color="#7C3AED" distance={20} />
      <pointLight position={[-5, 0, 5]} intensity={2} color="#22D3EE" distance={20} />
      <pointLight position={[0, -5, 5]} intensity={2} color="#EC4899" distance={20} />

      <CameraMotion disableMotion={reducedMotion} />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sparkles 
          count={particleCount} 
          scale={15} 
          size={isLow ? 2 : 4} 
          speed={0.4} 
          opacity={0.8} 
          color="#22D3EE"
        />
        {!isLow && (
          <Sparkles 
            count={particleCount / 2} 
            scale={15} 
            size={isLow ? 1 : 2} 
            speed={0.2} 
            opacity={0.6} 
            color="#EC4899"
          />
        )}
      </Float>

      {!isLow && <Stars radius={100} depth={50} count={isMedium ? 1000 : 3000} factor={4} saturation={0} fade speed={1} />}
      
      {!isLow && <CyberGrid disableAnimation={reducedMotion} />}

      {!isLow && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={isMedium ? 0.8 : 1.5} mipmapBlur />
        </EffectComposer>
      )}
    </>
  );
}
