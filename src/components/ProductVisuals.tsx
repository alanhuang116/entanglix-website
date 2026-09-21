"use client";

import { useId, useState, type ReactNode } from "react";

/* ───────────────────────── Window chrome ───────────────────────── */

export function Window({
  title,
  glow,
  badge,
  children,
  className = "",
}: {
  title: string;
  glow: string;
  badge?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`window rounded-[22px] overflow-hidden ${className}`} style={{ ["--glow" as string]: glow }}>
      <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.07] bg-white/[0.02]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] text-ink-2 font-medium tracking-tight truncate">{title}</span>
        {badge && (
          <span className="ml-auto hidden sm:flex flex-shrink-0 items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-ink-3">
            <span className="w-1.5 h-1.5 rounded-full breathe" style={{ background: glow }} />
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ───────────────────── Research Architect — influence graph ───────────────────── */

const nodes = [
  { id: "q", x: 84, y: 170, label: "Urban heat", kind: "root" },
  { id: "a", x: 214, y: 78, label: "Tree canopy", kind: "factor" },
  { id: "b", x: 214, y: 262, label: "Impervious surface", kind: "factor" },
  { id: "c", x: 344, y: 170, label: "Night-time temp.", kind: "factor" },
  { id: "d", x: 452, y: 86, label: "Heat illness", kind: "outcome" },
  { id: "e", x: 360, y: 292, label: "Income", kind: "modifier" },
  { id: "f", x: 458, y: 236, label: "AC access", kind: "modifier" },
] as const;

const edges: { from: string; to: string; kind: "driving" | "necessary" | "modifying" }[] = [
  { from: "q", to: "a", kind: "necessary" },
  { from: "q", to: "b", kind: "necessary" },
  { from: "a", to: "c", kind: "driving" },
  { from: "b", to: "c", kind: "driving" },
  { from: "c", to: "d", kind: "driving" },
  { from: "e", to: "f", kind: "modifying" },
  { from: "f", to: "d", kind: "modifying" },
  { from: "e", to: "c", kind: "modifying" },
];

function nodeW(label: string) {
  return label.length * 6.1 + 26;
}

export function GraphVisual() {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  return (
    <svg viewBox="0 0 540 340" className="w-full h-auto block" role="img" aria-label="An influence graph linking factors, mechanisms and outcomes">
      <defs>
        <linearGradient id="ra-edge" x1="0" x2="1">
          <stop offset="0" stopColor="#6d8bff" />
          <stop offset="1" stopColor="#b78bff" />
        </linearGradient>
        <radialGradient id="ra-bg" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#8b7bff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8b7bff" stopOpacity="0" />
        </radialGradient>
        <pattern id="ra-dots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.07)" />
        </pattern>
      </defs>
      <rect width="540" height="340" fill="url(#ra-dots)" />
      <rect width="540" height="340" fill="url(#ra-bg)" />

      {edges.map((e, i) => {
        const a = byId[e.from];
        const b = byId[e.to];
        const mx = (a.x + b.x) / 2;
        const d = `M${a.x},${a.y} C${mx},${a.y} ${mx},${b.y} ${b.x},${b.y}`;
        const driving = e.kind === "driving";
        return (
          <g key={i} fill="none" strokeLinecap="round">
            <path
              d={d}
              stroke={driving ? "url(#ra-edge)" : "rgba(255,255,255,0.22)"}
              strokeWidth={driving ? 2.4 : 1.3}
              strokeDasharray={e.kind === "modifying" ? "5 6" : undefined}
              opacity={driving ? 0.9 : 1}
            />
            {driving && <path d={d} stroke="#fff" strokeWidth={2.4} className="edge-flow" opacity={0.9} />}
          </g>
        );
      })}

      {nodes.map((n) => {
        const w = nodeW(n.label);
        const root = n.kind === "root";
        const outcome = n.kind === "outcome";
        return (
          <g key={n.id} transform={`translate(${n.x - w / 2},${n.y - 15})`}>
            <rect
              width={w}
              height={30}
              rx={15}
              fill={root ? "#8b7bff" : outcome ? "#1d1838" : "#16161b"}
              stroke={root ? "#b9aeff" : outcome ? "#8b7bff" : "rgba(255,255,255,0.18)"}
              strokeWidth={1}
            />
            <text
              x={w / 2}
              y={19.5}
              textAnchor="middle"
              fontSize={11.5}
              fontWeight={root ? 600 : 500}
              fill={root ? "#0b0820" : n.kind === "modifier" ? "#a1a1a6" : "#f5f5f7"}
              style={{ letterSpacing: "-0.01em" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function GraphLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3 border-t border-white/[0.07] text-[11px] text-ink-2">
      <span className="flex items-center gap-2"><i className="w-5 h-[2.5px] rounded bg-gradient-to-r from-[#6d8bff] to-[#b78bff]" />Driving</span>
      <span className="flex items-center gap-2"><i className="w-5 h-px bg-white/40" />Necessary</span>
      <span className="flex items-center gap-2"><i className="w-5 border-t border-dashed border-white/40" />Modifying</span>
      <span className="ml-auto font-mono text-[10px] text-ink-3 hidden sm:block">system → graph → scope → data</span>
    </div>
  );
}

/* ───────────────────── FloodVuln Global — damage distribution ───────────────────── */

export function FloodVisual({ interactive = true }: { interactive?: boolean }) {
  const [cm, setCm] = useState(55);
  // the visual is mounted twice (hero + product section); ids must not collide
  const bandId = `fv-band-${useId().replace(/:/g, "")}`;
  const depth = cm / 100;
  const mean = 0.583 * (1 - Math.exp(-depth / 1.45));
  const p10 = Math.max(0, mean * 0.18);
  const p90 = Math.min(1, mean * 2.6 + 0.01);
  const tail = 1 / (1 + Math.exp(-(mean - 0.47) * 7.9));

  const X0 = 56;
  const XW = 420;
  const base = 232;
  const peak = Math.round(X0 + Math.max(0.06, mean * 0.8) * XW);
  const top = Math.round(64 + mean * 60);
  const curve = `M${X0},${base} C${peak - 70},${base} ${peak - 46},${top} ${peak},${top} C${peak + 80},${top} ${peak + 120},${base - 8} ${X0 + XW},${base - 3}`;
  const area = `${curve} L${X0 + XW},${base} L${X0},${base} Z`;
  const waterY = 330 - Math.min(1, depth / 3) * 70;

  return (
    <div>
      <svg viewBox="0 0 540 340" className="w-full h-auto block" role="img" aria-label="Probability distribution of flood damage ratio at the chosen depth">
        <defs>
          <linearGradient id="fv-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.5" />
            <stop offset="1" stopColor="#2dd4bf" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="fv-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2dd4bf" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0b5b6b" stopOpacity="0.05" />
          </linearGradient>
          <clipPath id={bandId}>
            <rect x={X0 + p10 * XW} y="0" width={(p90 - p10) * XW} height="340" />
          </clipPath>
        </defs>

        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line x1={X0 + t * XW} y1="40" x2={X0 + t * XW} y2={base} stroke="rgba(255,255,255,0.06)" />
            <text x={X0 + t * XW} y={base + 18} textAnchor="middle" fontSize="10" fill="#6e6e73" fontFamily="var(--font-geist-mono)">
              {t.toFixed(2)}
            </text>
          </g>
        ))}
        <line x1={X0 - 16} y1={base} x2={X0 + XW + 16} y2={base} stroke="rgba(255,255,255,0.18)" />

        {/* density */}
        <path d={area} fill="rgba(45,212,191,0.07)" style={{ transition: "d .35s ease" }} />
        <path d={area} fill="url(#fv-fill)" clipPath={`url(#${bandId})`} style={{ transition: "d .35s ease" }} />
        <path d={curve} fill="none" stroke="#2dd4bf" strokeWidth="2.4" strokeLinecap="round" style={{ transition: "d .35s ease" }} />

        {/* point masses at 0 and 1 */}
        <rect x={X0 - 12} y={base - (1 - mean) * 70} width="6" height={(1 - mean) * 70} rx="2" fill="#6e6e73" />
        <rect x={X0 + XW + 6} y={base - tail * 60 - 3} width="6" height={tail * 60 + 3} rx="2" fill="#f87171" />

        {/* mean */}
        <line x1={X0 + mean * XW} y1="46" x2={X0 + mean * XW} y2={base} stroke="#ffb340" strokeWidth="1.5" strokeDasharray="3 4" />
        <text x={X0 + mean * XW + 6} y="54" fontSize="10" fill="#ffb340" fontFamily="var(--font-geist-mono)">mean</text>

        {/* rising water */}
        <g style={{ transform: `translateY(${waterY - 300}px)`, transition: "transform .5s cubic-bezier(.2,.8,.2,1)" }}>
          <g className="wave">
            <path d="M0,300 q45,-12 90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 V420 H0Z" fill="url(#fv-water)" />
          </g>
          <g className="wave-slow" opacity="0.6">
            <path d="M0,306 q45,10 90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0 t90,0" fill="none" stroke="#2dd4bf" strokeWidth="1.2" />
          </g>
        </g>
      </svg>

      {interactive && (
        <div className="flex items-center gap-4 px-5 pt-1 pb-3">
          <label htmlFor="fv-depth" className="text-[10px] font-mono uppercase tracking-widest text-ink-3">Depth</label>
          <input
            id="fv-depth"
            type="range"
            min={0}
            max={300}
            value={cm}
            onChange={(e) => setCm(Number(e.target.value))}
            className="range"
            aria-label="Inundation depth above the first finished floor, in centimetres"
          />
          <span className="font-mono text-[13px] text-white tabular-nums w-16 whitespace-nowrap text-right">{depth.toFixed(2)} m</span>
        </div>
      )}

      <div className="grid grid-cols-4 border-t border-white/[0.07]">
        {[
          { k: "Mean DR", v: mean.toFixed(3), c: "text-[#2dd4bf]" },
          { k: "P10 – P90", v: `${p10.toFixed(2).slice(1)}–${p90 >= 1 ? "1.0" : p90.toFixed(2).slice(1)}`, c: "text-white" },
          { k: "P(DR > 50%)", v: `${(tail * 100).toFixed(1)}%`, c: "text-[#f87171]" },
          { k: "Grade", v: "G3", c: "text-[#ffb340]" },
        ].map((r) => (
          <div key={r.k} className="px-4 py-3 border-r border-white/[0.07] last:border-r-0">
            <span className="block text-[9px] font-mono uppercase tracking-widest text-ink-3 mb-1">{r.k}</span>
            <span className={`block text-[15px] sm:text-lg font-semibold tracking-tight tabular-nums ${r.c}`}>{r.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────── GH-PM25 Observatory — 1-km surface ───────────────────── */

const GHANA =
  "M24,6 L70,3 L79,9 L77,30 L83,52 L81,70 L88,86 L93,99 L72,112 L50,124 L31,129 L14,122 L18,101 L10,80 L14,52 L12,30 L18,14 Z";

const STOPS = [
  [24, 58, 110],
  [38, 140, 160],
  [250, 204, 80],
  [255, 140, 50],
  [225, 60, 60],
];

function ramp(t: number) {
  const s = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(s);
  const f = s - i;
  const c = STOPS[i].map((v, k) => Math.round(v + (STOPS[i + 1][k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const CITIES = [
  { name: "Tamale", x: 47, y: 38, w: 0.55 },
  { name: "Kumasi", x: 40, y: 93, w: 0.8 },
  { name: "Accra", x: 66, y: 111, w: 1 },
];

// Integer hash + rational fall-off only: identical on server and client, no hydration drift.
const CELLS = (() => {
  const out: { x: number; y: number; c: string }[] = [];
  const S = 4;
  for (let y = 0; y < 132; y += S)
    for (let x = 8; x < 96; x += S) {
      const noise = (((x * 73856093) ^ (y * 19349663)) >>> 0) % 100;
      let v = 0.5 - (y / 132) * 0.36 + noise / 900; // Saharan dust gradient, north → south
      for (const c of CITIES) {
        const d2 = (x - c.x) * (x - c.x) + (y - c.y) * (y - c.y);
        v += (c.w * 0.5) / (1 + d2 / 26);
      }
      out.push({ x, y, c: ramp(v) });
    }
  return out;
})();

const SEASON = [0.92, 0.8, 0.5, 0.34, 0.26, 0.2, 0.18, 0.18, 0.22, 0.3, 0.5, 0.86];

export function AirVisual() {
  return (
    <div className="grid grid-cols-[1.05fr_1fr]">
      <div className="relative border-r border-white/[0.07]">
        <svg viewBox="0 0 104 134" className="w-full h-auto block" role="img" aria-label="Modelled PM2.5 surface over Ghana at one-kilometre resolution">
          <defs>
            <clipPath id="gh-clip"><path d={GHANA} /></clipPath>
            <filter id="gh-soft"><feGaussianBlur stdDeviation="0.9" /></filter>
          </defs>
          <g clipPath="url(#gh-clip)">
            <g filter="url(#gh-soft)">
              {CELLS.map((c) => (
                <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width="4.1" height="4.1" fill={c.c} />
              ))}
            </g>
            <g stroke="rgba(0,0,0,0.28)" strokeWidth="0.2">
              {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} x1={8 + i * 4} y1="0" x2={8 + i * 4} y2="134" />)}
              {Array.from({ length: 33 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 4} x2="104" y2={i * 4} />)}
            </g>
          </g>
          <path d={GHANA} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" strokeLinejoin="round" />
          {CITIES.map((c) => (
            <g key={c.name}>
              <circle cx={c.x} cy={c.y} r="2.6" fill="none" stroke="#fff" strokeWidth="0.4" className="breathe" />
              <circle cx={c.x} cy={c.y} r="1" fill="#fff" />
              <text x={c.x + 3.4} y={c.y + 1.3} fontSize="4" fontWeight="600" fill="#fff" style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.6)", strokeWidth: 0.8 }}>
                {c.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex flex-col justify-between p-4 sm:p-5 gap-4 min-w-0">
        <div>
          <span className="block text-[9px] font-mono tracking-widest text-ink-3 mb-2">PM2.5 · µg/m³</span>
          <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1].map(ramp).join(",")})` }} />
          <div className="relative h-7 text-[9px] font-mono text-ink-2">
            <span className="absolute left-[18%] top-1 -translate-x-1/2 flex flex-col items-center"><i className="w-px h-1.5 bg-white/50" />WHO 15</span>
            <span className="absolute left-[46%] top-1 -translate-x-1/2 flex flex-col items-center"><i className="w-px h-1.5 bg-white/50" />EPA 35</span>
          </div>
        </div>

        <div>
          <span className="block text-[9px] font-mono uppercase tracking-widest text-ink-3 mb-2">Seasonal cycle</span>
          <div className="flex items-end gap-[3px] h-14">
            {SEASON.map((v, i) => (
              <span key={i} className="flex-1 rounded-t-[2px]" style={{ height: `${v * 100}%`, background: ramp(v * 0.95), opacity: 0.9 }} />
            ))}
          </div>
          <div className="flex justify-between text-[8.5px] font-mono text-ink-3 mt-1"><span>J</span><span>A</span><span>J</span><span>O</span><span>D</span></div>
          <span className="block text-[10px] text-ink-2 mt-1.5">Harmattan peak, Dec – Feb</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["Daily", "1 km", "90% PI"].map((t) => (
            <span key={t} className="px-2 py-1 rounded-md text-[10px] font-medium text-[#ffcf85] bg-[#ffb340]/10 border border-[#ffb340]/25">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
