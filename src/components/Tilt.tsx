"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

/** Mouse-driven 3D tilt with a moving specular glare. Children may use translateZ for depth. */
export default function Tilt({
  children,
  className = "",
  max = 7,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(0, { stiffness: 120, damping: 18 });
  const ry = useSpring(0, { stiffness: 120, damping: 18 });
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });
  const gx = useMotionTemplate`${px}%`;
  const gy = useMotionTemplate`${py}%`;
  const glareBg = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(255,255,255,0.10), transparent 60%)`;

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    px.set(x * 100);
    py.set(y * 100);
    ry.set((x - 0.5) * 2 * max);
    rx.set(-(y - 0.5) * 2 * max);
    glareOpacity.set(1);
  }
  function onLeave() {
    rx.set(0);
    ry.set(0);
    glareOpacity.set(0);
  }

  return (
    <div className={className} style={{ perspective: 1400 }} onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="relative h-full" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: glareOpacity, transform: "translateZ(1px)" }}
          />
        )}
      </motion.div>
    </div>
  );
}
