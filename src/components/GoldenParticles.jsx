import { useEffect, useRef } from 'react';

/**
 * Golden sparkling particle background — renders subtle floating golden particles
 * on a canvas behind all content. Performance-optimized with requestAnimationFrame.
 */
export default function GoldenParticles() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const PARTICLE_COUNT = 40;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        opacityDir: Math.random() > 0.5 ? 1 : -1,
        glowSize: Math.random() * 8 + 4,
      });
    }
    particlesRef.current = particles;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Pulse opacity
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.5) { p.opacity = 0.5; p.opacityDir = -1; }
        if (p.opacity < 0.05) { p.opacity = 0.05; p.opacityDir = 1; }

        // Outer glow
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
        grd.addColorStop(0, `rgba(212, 175, 55, ${p.opacity * 0.6})`);
        grd.addColorStop(0.4, `rgba(212, 175, 55, ${p.opacity * 0.2})`);
        grd.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(253, 245, 230, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
