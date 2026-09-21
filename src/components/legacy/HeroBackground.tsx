"use client";

import { useEffect, useRef } from "react";

/**
 * High-tech animated hero background:
 *   • perspective 3D grid floor
 *   • pulsing neural network of nodes & edges
 *   • flowing data packets along connections
 *   • concentric wave pulses from the centre
 */
export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, animId = 0, mouseX = 0, mouseY = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mouseX = w / 2;
      mouseY = h / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMouse);

    // ─── neural network nodes ───
    type Node = { x: number; y: number; ox: number; oy: number; r: number; phase: number; };
    const nodes: Node[] = [];
    const N = 28;
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const radius = 150 + Math.random() * 220;
      nodes.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        ox: Math.cos(angle) * radius,
        oy: Math.sin(angle) * radius,
        r: 2 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    // connections (only nearby pairs)
    const edges: { a: number; b: number; dist: number }[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].ox - nodes[j].ox;
        const dy = nodes[i].oy - nodes[j].oy;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) edges.push({ a: i, b: j, dist: d });
      }
    }

    // data packets flowing along edges
    type Packet = { edgeIdx: number; t: number; speed: number };
    const packets: Packet[] = [];
    for (let i = 0; i < 20; i++) {
      packets.push({
        edgeIdx: Math.floor(Math.random() * edges.length),
        t: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
      });
    }

    // ─── draw helpers ───
    const drawGrid = (time: number) => {
      const cx = w / 2;
      const horizon = h * 0.55;
      const numLines = 22;
      const depth = 1400;

      ctx.strokeStyle = "rgba(6,182,212,0.15)";
      ctx.lineWidth = 1;

      // horizontal lines (z-axis in perspective)
      for (let i = 0; i < numLines; i++) {
        const offset = (time * 0.00015 * depth + i * (depth / numLines)) % depth;
        const perspective = 1 / (1 + offset / 200);
        const y = horizon + offset * 0.4;
        if (y > h) continue;

        const alpha = Math.min(1, (h - y) / 300) * 0.35;
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        ctx.beginPath();
        const width = w * (1 - perspective) + w;
        ctx.moveTo(cx - width / 2, y);
        ctx.lineTo(cx + width / 2, y);
        ctx.stroke();
      }

      // vertical lines converging to vanishing point
      ctx.strokeStyle = "rgba(6,182,212,0.18)";
      const numVert = 20;
      for (let i = 0; i <= numVert; i++) {
        const x = (i / numVert) * w;
        const alpha = 1 - Math.abs(x - cx) / (w / 2);
        ctx.strokeStyle = `rgba(6,182,212,${alpha * 0.25})`;
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(cx, horizon);
        ctx.stroke();
      }
    };

    const drawNetwork = (time: number) => {
      const cx = w / 2;
      const cy = h * 0.42;

      // gentle mouse influence
      const mx = (mouseX - cx) * 0.03;
      const my = (mouseY - cy) * 0.03;

      // rotate network slowly
      const rot = time * 0.00008;
      const cos = Math.cos(rot), sin = Math.sin(rot);

      // node positions for this frame
      const pos = nodes.map((n, i) => {
        const breath = Math.sin(time * 0.0008 + n.phase) * 12;
        const x = n.ox + Math.sin(time * 0.0004 + i) * 20;
        const y = n.oy + Math.cos(time * 0.0004 + i) * 20;
        const rx = x * cos - y * sin + breath;
        const ry = x * sin + y * cos + breath;
        return { x: cx + rx + mx, y: cy + ry + my, r: n.r };
      });

      // edges
      for (const e of edges) {
        const a = pos[e.a], b = pos[e.b];
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        const pulse = 0.4 + 0.3 * Math.sin(time * 0.001 + e.a);
        grad.addColorStop(0, `rgba(6,182,212,${pulse * 0.3})`);
        grad.addColorStop(0.5, `rgba(139,92,246,${pulse * 0.4})`);
        grad.addColorStop(1, `rgba(99,102,241,${pulse * 0.3})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // data packets
      for (const p of packets) {
        p.t += p.speed;
        if (p.t > 1) {
          p.t = 0;
          p.edgeIdx = Math.floor(Math.random() * edges.length);
        }
        const e = edges[p.edgeIdx];
        const a = pos[e.a], b = pos[e.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;

        // glow
        const glow = ctx.createRadialGradient(x, y, 0, x, y, 12);
        glow.addColorStop(0, "rgba(103,232,249,1)");
        glow.addColorStop(0.4, "rgba(103,232,249,0.4)");
        glow.addColorStop(1, "rgba(103,232,249,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255,255,255,0.95)";
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes
      for (let i = 0; i < pos.length; i++) {
        const n = pos[i];
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 16);
        glow.addColorStop(0, "rgba(6,182,212,0.7)");
        glow.addColorStop(0.5, "rgba(6,182,212,0.15)");
        glow.addColorStop(1, "rgba(6,182,212,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(186,230,253,0.95)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const drawPulses = (time: number) => {
      const cx = w / 2;
      const cy = h * 0.42;
      const numPulses = 3;
      for (let i = 0; i < numPulses; i++) {
        const period = 4000;
        const offset = (i * period / numPulses);
        const t = ((time + offset) % period) / period;
        const radius = t * 600;
        const alpha = (1 - t) * 0.15;
        ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    const drawFloatingParticles = (time: number) => {
      const count = 40;
      for (let i = 0; i < count; i++) {
        const speed = 0.02 + (i % 5) * 0.01;
        const x = ((i * 73 + time * speed) % w);
        const y = ((i * 131 + time * speed * 0.6) % h);
        const size = 0.8 + (i % 3) * 0.3;
        const alpha = 0.3 + 0.3 * Math.sin(time * 0.002 + i);
        ctx.fillStyle = `rgba(186,230,253,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = (time: number) => {
      // gradient background
      const g = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.8);
      g.addColorStop(0, "#0a1a3a");
      g.addColorStop(0.5, "#060e1f");
      g.addColorStop(1, "#030812");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      drawGrid(time);
      drawPulses(time);
      drawFloatingParticles(time);
      drawNetwork(time);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
