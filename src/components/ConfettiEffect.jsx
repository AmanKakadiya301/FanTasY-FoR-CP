import { useEffect } from 'react';

export default function ConfettiEffect({ trigger }) {
  useEffect(() => {
    if (!trigger) return;

    async function fire() {
      try {
        const confetti = (await import('canvas-confetti')).default;
        const duration = 2500;
        const end = Date.now() + duration;
        const colors = ['#d4af37', '#f5d76e', '#b8941f', '#ffffff', '#a1a1aa'];

        (function frame() {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors,
            shapes: ['circle'],
            scalar: 0.8,
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors,
            shapes: ['circle'],
            scalar: 0.8,
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      } catch (e) {
        console.log('Confetti unavailable');
      }
    }

    fire();
  }, [trigger]);

  return null;
}
