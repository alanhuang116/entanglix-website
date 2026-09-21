"use client";

import { motion } from "framer-motion";

/**
 * Complex animated tech illustration for the About section.
 *   • Rotating concentric rings with tick marks
 *   • Hexagonal core with internal circuit patterns
 *   • Orbital data nodes with connecting lines
 *   • Radar sweep animation
 *   • Floating tech labels
 */
export default function AboutVisual() {
  return (
    <div className="relative mx-auto w-[380px] h-[380px] md:w-[420px] md:h-[420px]">
      {/* outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-indigo-500/15 to-purple-500/20 blur-3xl" />

      {/* Main SVG illustration */}
      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.15))" }}
      >
        <defs>
          <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sweep" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* ──── outermost ring with tick marks (rotates slowly) ──── */}
        <g style={{ transformOrigin: "200px 200px" }}>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "200px 200px" }}
          >
            <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="2 8" />
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2;
              const r1 = 185;
              const r2 = i % 5 === 0 ? 170 : 178;
              const x1 = 200 + Math.cos(angle) * r1;
              const y1 = 200 + Math.sin(angle) * r1;
              const x2 = 200 + Math.cos(angle) * r2;
              const y2 = 200 + Math.sin(angle) * r2;
              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={i % 5 === 0 ? "rgba(6,182,212,0.5)" : "rgba(6,182,212,0.2)"}
                  strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
                />
              );
            })}
          </motion.g>
        </g>

        {/* ──── middle ring (rotates opposite direction) ──── */}
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="url(#purpleGrad)" strokeWidth="1.5" strokeDasharray="40 300" />
          {/* connector dots at cardinal positions */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            const cx = 200 + Math.cos(rad) * 150;
            const cy = 200 + Math.sin(rad) * 150;
            return <circle key={deg} cx={cx} cy={cy} r="4" fill="#a855f7" opacity="0.8" />;
          })}
        </motion.g>

        {/* ──── inner ring with data nodes (rotates) ──── */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <circle cx="200" cy="200" r="115" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x = 200 + Math.cos(angle) * 115;
            const y = 200 + Math.sin(angle) * 115;
            return (
              <g key={i}>
                {/* node glow */}
                <circle cx={x} cy={y} r="8" fill="url(#coreGlow)" />
                {/* node */}
                <circle cx={x} cy={y} r="3" fill="#67e8f9" />
                {/* connection to center */}
                <line x1={x} y1={y} x2="200" y2="200" stroke="rgba(6,182,212,0.1)" strokeWidth="0.5" strokeDasharray="2 4" />
              </g>
            );
          })}
        </motion.g>

        {/* ──── radar sweep ──── */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "200px 200px" }}
        >
          <path
            d="M 200 200 L 380 200 A 180 180 0 0 0 320 75 Z"
            fill="url(#sweep)"
            opacity="0.25"
          />
        </motion.g>

        {/* ──── hexagonal core ──── */}
        <g>
          {/* outer hex (pulses) */}
          <motion.polygon
            points="200,130 260,165 260,235 200,270 140,235 140,165"
            fill="none"
            stroke="url(#cyanGrad)"
            strokeWidth="2"
            animate={{ scale: [1, 1.04, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "200px 200px" }}
          />
          {/* inner hex */}
          <polygon
            points="200,150 240,175 240,225 200,250 160,225 160,175"
            fill="rgba(6,182,212,0.05)"
            stroke="rgba(6,182,212,0.4)"
            strokeWidth="1"
          />
          {/* circuit lines inside hex */}
          <line x1="200" y1="150" x2="200" y2="175" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
          <line x1="200" y1="225" x2="200" y2="250" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
          <line x1="160" y1="200" x2="185" y2="200" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
          <line x1="215" y1="200" x2="240" y2="200" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
          <circle cx="200" cy="175" r="2" fill="#67e8f9" />
          <circle cx="200" cy="225" r="2" fill="#67e8f9" />
          <circle cx="160" cy="200" r="2" fill="#67e8f9" />
          <circle cx="240" cy="200" r="2" fill="#67e8f9" />

          {/* central core with pulsing glow */}
          <motion.circle
            cx="200" cy="200" r="22"
            fill="url(#coreGlow)"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "200px 200px" }}
          />
          <circle cx="200" cy="200" r="15" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="6" fill="#67e8f9" />
        </g>

        {/* ──── data packets flowing along rings ──── */}
        {[0, 0.25, 0.5, 0.75].map((offset, i) => (
          <motion.circle
            key={i}
            cx="200" cy="85"
            r="2.5"
            fill="#ffffff"
            style={{ filter: "drop-shadow(0 0 4px #67e8f9)", transformOrigin: "200px 200px" }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}

        {/* ──── scan lines ──── */}
        <motion.rect
          x="0" y="0" width="400" height="1.5"
          fill="rgba(6,182,212,0.4)"
          animate={{ y: [0, 400, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* ──── corner brackets ──── */}
        <g stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" fill="none">
          <polyline points="20,40 20,20 40,20" />
          <polyline points="360,20 380,20 380,40" />
          <polyline points="20,360 20,380 40,380" />
          <polyline points="360,380 380,380 380,360" />
        </g>

        {/* ──── code-style labels ──── */}
        <text x="30" y="55" fill="rgba(6,182,212,0.5)" fontSize="8" fontFamily="monospace">
          [SYS_ONLINE]
        </text>
        <text x="312" y="55" fill="rgba(139,92,246,0.5)" fontSize="8" fontFamily="monospace">
          v2.6.1
        </text>
        <text x="30" y="375" fill="rgba(6,182,212,0.5)" fontSize="8" fontFamily="monospace">
          entanglix.ai
        </text>
        <text x="320" y="375" fill="rgba(139,92,246,0.5)" fontSize="8" fontFamily="monospace">
          ENABLED
        </text>
      </svg>

      {/* floating tech labels */}
      {[
        { label: "GeoAI",    pos: "top",    color: "cyan" },
        { label: "Quantum",  pos: "right",  color: "purple" },
        { label: "LLM",      pos: "bottom", color: "blue" },
        { label: "GenAI",    pos: "left",   color: "indigo" },
      ].map((tag, i) => {
        const positions = {
          top:    "top-2 left-1/2 -translate-x-1/2",
          right:  "right-2 top-1/2 -translate-y-1/2",
          bottom: "bottom-2 left-1/2 -translate-x-1/2",
          left:   "left-2 top-1/2 -translate-y-1/2",
        } as const;
        const colors = {
          cyan:   "border-cyan-500/30 text-cyan-300 bg-cyan-500/10",
          purple: "border-purple-500/30 text-purple-300 bg-purple-500/10",
          blue:   "border-blue-500/30 text-blue-300 bg-blue-500/10",
          indigo: "border-indigo-500/30 text-indigo-300 bg-indigo-500/10",
        } as const;

        return (
          <motion.div
            key={tag.label}
            animate={{ y: [0, i % 2 === 0 ? -6 : 6, 0] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute px-2.5 py-1 rounded-lg border backdrop-blur-md text-[11px] font-medium ${colors[tag.color as keyof typeof colors]} ${positions[tag.pos as keyof typeof positions]}`}
          >
            {tag.label}
          </motion.div>
        );
      })}
    </div>
  );
}
