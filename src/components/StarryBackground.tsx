import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  alphaChange: number;
  parallaxFactor: number; // For advanced depth effect
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  alpha: number;
  life: number;
  maxLife: number;
}

const NUM_STARS = 280; // More stars for better parallax layers
const SHOOTING_INTERVAL = 3000;

const StarryBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastShooting = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Advanced Star Generation with Parallax Layers
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => {
      const radius = Math.random() * 1.5 + 0.2;
      // Stars that are "closer" (larger) move more with the mouse
      const parallaxFactor = radius * 12; 
      
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius,
        alpha: Math.random() * 0.7 + 0.3,
        alphaChange: (Math.random() * 0.005 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
        parallaxFactor,
      };
    });

    const shootingStars: ShootingStar[] = [];

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep obsidian space gradient
      const grad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.8
      );
      grad.addColorStop(0, "#080c1d");
      grad.addColorStop(0.5, "#04050d");
      grad.addColorStop(1, "#010205");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Advanced Nebula Bloom (Dynamic based on mouse)
      const nebulaConfs = [
        { rx: 0.2, ry: 0.35, r: 450, color: "rgba(94, 234, 212, 0.015)" },
        { rx: 0.8, ry: 0.45, r: 400, color: "rgba(139, 92, 246, 0.02)" },
        { rx: 0.5, ry: 0.75, r: 350, color: "rgba(30, 64, 175, 0.025)" },
      ];
      
      const mouseOffsetX = (mouseRef.current.x / window.innerWidth - 0.5) * 40;
      const mouseOffsetY = (mouseRef.current.y / window.innerHeight - 0.5) * 40;

      nebulaConfs.forEach((nb) => {
        const cx = canvas.width * nb.rx + mouseOffsetX * 0.5;
        const cy = canvas.height * nb.ry + mouseOffsetY * 0.5;
        const ng = ctx.createRadialGradient(cx, cy, 0, cx, cy, nb.r);
        ng.addColorStop(0, nb.color);
        ng.addColorStop(1, "transparent");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw Parallax Stars
      for (const s of stars) {
        s.alpha += s.alphaChange;
        if (s.alpha > 0.95 || s.alpha < 0.2) s.alphaChange *= -1;

        // Apply parallax offset based on distance from screen center and mouse
        const offsetX = (mouseRef.current.x / window.innerWidth - 0.5) * s.parallaxFactor;
        const offsetY = (mouseRef.current.y / window.innerHeight - 0.5) * s.parallaxFactor;

        ctx.beginPath();
        ctx.arc(s.x + offsetX, s.y + offsetY, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();

        // Subtle glint for large stars
        if (s.radius > 1.2 && s.alpha > 0.7) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.3})`;
            ctx.lineWidth = 0.4;
            ctx.moveTo(s.x + offsetX - s.radius * 2, s.y + offsetY);
            ctx.lineTo(s.x + offsetX + s.radius * 2, s.y + offsetY);
            ctx.moveTo(s.x + offsetX, s.y + offsetY - s.radius * 2);
            ctx.lineTo(s.x + offsetX, s.y + offsetY + s.radius * 2);
            ctx.stroke();
        }
      }

      // Shooting stars
      if (now - lastShooting > SHOOTING_INTERVAL) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.4,
          vx: (8 + Math.random() * 6) * (Math.random() > 0.5 ? 1 : -1),
          vy: 6 + Math.random() * 5,
          length: 80 + Math.random() * 120,
          alpha: 1,
          life: 0,
          maxLife: 45 + Math.random() * 20
        });
        lastShooting = now;
      }

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.life++;
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.alpha = 1 - ss.life / ss.maxLife;
        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }

        const angle = Math.atan2(ss.vy, ss.vx);
        const tx = ss.x - Math.cos(angle) * ss.length;
        const ty = ss.y - Math.sin(angle) * ss.length;

        const sGrad = ctx.createLinearGradient(tx, ty, ss.x, ss.y);
        sGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
        sGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);
        
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = sGrad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default StarryBackground;
