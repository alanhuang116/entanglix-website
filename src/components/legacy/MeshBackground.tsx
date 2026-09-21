"use client";

import { useEffect, useRef } from "react";

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let mouseX = -9999;
    let mouseY = -9999;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMouse);

    // Dense blob field — each blob reacts to mouse proximity
    const blobs = [
      { cx: 0.08, cy: 0.15, rx: 500, ry: 450, color: [6, 182, 212],  alpha: 0.20, speed: 0.00025, phase: 0 },
      { cx: 0.35, cy: 0.08, rx: 480, ry: 420, color: [14, 165, 233], alpha: 0.16, speed: 0.00030, phase: 0.7 },
      { cx: 0.65, cy: 0.12, rx: 520, ry: 460, color: [99, 102, 241], alpha: 0.18, speed: 0.00020, phase: 1.3 },
      { cx: 0.90, cy: 0.20, rx: 460, ry: 400, color: [139, 92, 246], alpha: 0.15, speed: 0.00035, phase: 2.0 },
      { cx: 0.15, cy: 0.45, rx: 540, ry: 480, color: [59, 130, 246], alpha: 0.18, speed: 0.00022, phase: 2.7 },
      { cx: 0.50, cy: 0.40, rx: 500, ry: 440, color: [6, 182, 212],  alpha: 0.14, speed: 0.00028, phase: 3.3 },
      { cx: 0.80, cy: 0.50, rx: 480, ry: 420, color: [168, 85, 247], alpha: 0.16, speed: 0.00032, phase: 4.0 },
      { cx: 0.05, cy: 0.75, rx: 520, ry: 460, color: [14, 165, 233], alpha: 0.17, speed: 0.00026, phase: 4.6 },
      { cx: 0.40, cy: 0.70, rx: 500, ry: 450, color: [139, 92, 246], alpha: 0.15, speed: 0.00030, phase: 5.2 },
      { cx: 0.70, cy: 0.78, rx: 480, ry: 430, color: [6, 182, 212],  alpha: 0.18, speed: 0.00024, phase: 5.8 },
      { cx: 0.95, cy: 0.85, rx: 460, ry: 400, color: [59, 130, 246], alpha: 0.14, speed: 0.00034, phase: 0.4 },
      { cx: 0.25, cy: 0.92, rx: 500, ry: 440, color: [99, 102, 241], alpha: 0.16, speed: 0.00020, phase: 1.0 },
    ];

    const draw = (t: number) => {
      ctx.fillStyle = "#060e1f";
      ctx.fillRect(0, 0, w, h);

      for (const b of blobs) {
        // base position with drift
        let bx = w * b.cx + Math.sin(t * b.speed + b.phase) * w * 0.15;
        let by = h * b.cy + Math.cos(t * b.speed * 0.7 + b.phase + 1) * h * 0.12;

        // mouse attraction — blobs gently drift toward cursor
        const dx = mouseX - bx;
        const dy = mouseY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const attractRadius = 600;
        if (dist < attractRadius) {
          const strength = (1 - dist / attractRadius) * 80;
          bx += (dx / dist) * strength;
          by += (dy / dist) * strength;
        }

        const sx = b.rx + Math.sin(t * b.speed * 1.1 + b.phase) * 80;
        const sy = b.ry + Math.cos(t * b.speed * 0.8 + b.phase + 2) * 60;

        // boost alpha when mouse is near
        let alpha = b.alpha;
        if (dist < attractRadius) {
          alpha += (1 - dist / attractRadius) * 0.10;
        }

        const r = Math.max(sx, sy);
        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, r);
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${alpha})`);
        grad.addColorStop(0.4, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},${alpha * 0.45})`);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.ellipse(bx, by, sx, sy, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // grid
      ctx.strokeStyle = "rgba(6,182,212,0.035)";
      ctx.lineWidth = 0.5;
      const gs = 48;
      for (let gx = 0; gx < w; gx += gs) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke(); }
      for (let gy = 0; gy < h; gy += gs) { ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: 0 }} />;
}
