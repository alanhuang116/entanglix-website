"use client";

import { useId, useState, type ReactNode } from "react";
import { HU, WF } from "@/lib/hazardData";
import {
  HURRICANE_CALIBRATED_MS,
  MS_PER_MPH,
  WILDFIRE_TAU,
  Z80,
  hurricaneFragility,
  saffirSimpson,
  wildfireAtFire,
  wildfireEta,
  wildfireNewFire,
  type HurricaneBuilding,
  type WildfireHome,
} from "@/lib/hazardModels";

/* ───────────────────────── shared bits ───────────────────────── */

const X0 = 56;
const XW = 440;
const TOP = 46;
const BASE = 232;
const yOf = (p: number) => BASE - p * (BASE - TOP);
const r1 = (v: number) => Math.round(v * 10) / 10;
const MONO = "var(--font-geist-mono)";

function pct(p: number) {
  if (p < 0.001) return "<0.1%";
  if (p < 0.1) return `${(p * 100).toFixed(1)}%`;
  if (p > 0.999) return ">99.9%";
  return `${Math.round(p * 100)}%`;
}

function linePath(pts: [number, number][]) {
  return pts.map(([x, y], i) => `${i ? "L" : "M"}${r1(x)},${r1(y)}`).join(" ");
}

function YGrid() {
  return (
    <>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={X0} y1={yOf(t)} x2={X0 + XW} y2={yOf(t)} stroke={t === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"} />
          <text x={X0 - 8} y={yOf(t) + 3.5} textAnchor="end" fontSize="10" fill="#6e6e73" fontFamily={MONO}>
            {t * 100}
            {t === 1 ? "%" : ""}
          </text>
        </g>
      ))}
    </>
  );
}

function Toggle({ on, onClick, children, accent }: { on: boolean; onClick: () => void; children: ReactNode; accent: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="h-7 px-2.5 rounded-full text-[11px] font-medium tracking-tight border transition-all duration-200 active:scale-95"
      style={
        on
          ? { color: "#07080c", background: accent, borderColor: accent, boxShadow: `0 6px 16px -6px ${accent}` }
          : { color: "#c7c7cc", background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.12)" }
      }
    >
      {children}
    </button>
  );
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="inline-flex p-0.5 rounded-full bg-white/[0.05] border border-white/[0.1]">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`h-6 px-2.5 rounded-full text-[11px] font-medium tracking-tight transition-all duration-200 ${
            value === o.id ? "bg-white/[0.16] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" : "text-ink-2 hover:text-white"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** `ks` is the label used at phone width, where the full one would not fit. */
function Readouts({ cells }: { cells: { k: string; ks: string; v: string; color: string }[] }) {
  return (
    <div className="grid grid-cols-4 border-t border-white/[0.07]">
      {cells.map((c) => (
        <div key={c.k} className="px-2.5 sm:px-4 py-3 border-r border-white/[0.07] last:border-r-0 min-w-0">
          <span className="block text-[9px] font-mono uppercase tracking-wide sm:tracking-widest text-ink-3 mb-1 whitespace-nowrap">
            <span className="sm:hidden">{c.ks}</span>
            <span className="hidden sm:inline">{c.k}</span>
          </span>
          <span className="block text-[14px] sm:text-lg font-semibold tracking-tight tabular-nums whitespace-nowrap" style={{ color: c.color }}>
            {c.v}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ───────────────────── WildfireVuln — P(destroyed) across fires ───────────────────── */

const EMBER = "#ff6a3d";
const U_MAX = 3.3;
const xOfU = (u: number) => X0 + ((u + U_MAX) / (2 * U_MAX)) * XW;
const U_MILD = -Z80 * WILDFIRE_TAU;
const U_SEVERE = Z80 * WILDFIRE_TAU;

// fire effects estimated by the model for three well-known fires
const KNOWN_FIRES = ["Eaton 2025", "Palisades 2025", "Camp 2018"].map((name, i) => ({
  name,
  u: WF.fires.find((f) => f.event === name)?.u ?? 0,
  row: i % 2,
}));

type Spacing = "Scattered" | "Suburban" | "Dense";
const SPACINGS: { id: Spacing; label: string }[] = [
  { id: "Scattered", label: "Scattered" },
  { id: "Suburban", label: "Suburban" },
  { id: "Dense", label: "Dense" },
];

// rational approximation of the normal CDF (Abramowitz & Stegun 26.2.17)
function normCdf(z: number) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  x: 30 + ((i * 97) % 480),
  delay: ((i * 37) % 50) / 10,
  dur: 2.6 + ((i * 13) % 20) / 10,
  dx: ((i * 29) % 40) - 20,
  r: 1 + ((i * 7) % 3) * 0.5,
}));

/** `interactive={false}` drops the controls, for the compact preview in the hero. */
export function WildfireVisual({ interactive = true }: { interactive?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const [slider, setSlider] = useState(30);
  const [spacing, setSpacing] = useState<Spacing>("Suburban");
  const [post2008, setPost2008] = useState(false);
  const [eaves, setEaves] = useState(false);
  const [vents, setVents] = useState(false);
  const [woodRoof, setWoodRoof] = useState(false);

  const sp = WF.presets.find((p) => p.name === spacing)!;
  const baseline: WildfireHome = { struct: "sfr_1", era: "pre1990", roof: "asphalt", eaves: "open", vents: "coarse", n30: sp.n30, n100: sp.n100, nn_m: sp.nn_m };
  const home: WildfireHome = {
    ...baseline,
    era: post2008 ? "post2008" : "pre1990",
    eaves: eaves ? "enclosed" : "open",
    vents: vents ? "fine" : "coarse",
    roof: woodRoof ? "wood" : "asphalt",
  };

  const eta = wildfireEta(home);
  const eta0 = wildfireEta(baseline);
  const u = (slider / 100) * U_MAX;
  const pHere = wildfireAtFire(eta, u);
  const pNew = wildfireNewFire(eta);
  const delta = Math.round((pNew - wildfireNewFire(eta0)) * 100);
  const severity = normCdf(u / WILDFIRE_TAU);

  const us = Array.from({ length: 61 }, (_, i) => -U_MAX + (i / 60) * 2 * U_MAX);
  const curve = linePath(us.map((v) => [xOfU(v), yOf(wildfireAtFire(eta, v))]));
  const curve0 = linePath(us.map((v) => [xOfU(v), yOf(wildfireAtFire(eta0, v))]));
  const area = `${curve} L${X0 + XW},${BASE} L${X0},${BASE} Z`;
  const mx = r1(xOfU(u));
  const my = r1(yOf(pHere));

  return (
    <div>
      <svg viewBox="0 0 540 322" className="w-full h-auto block" role="img" aria-label="Probability that a home is destroyed, across fires from mild to severe, for the selected home and a baseline home">
        <defs>
          <linearGradient id={`wf-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={EMBER} stopOpacity="0.5" />
            <stop offset="1" stopColor={EMBER} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`wf-line-${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#ffb340" />
            <stop offset="1" stopColor="#ff3d3d" />
          </linearGradient>
          <radialGradient id={`wf-glow-${uid}`} cx="50%" cy="100%" r="75%">
            <stop offset="0" stopColor="#ff4d1f" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff4d1f" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`wf-band-${uid}`}>
            <rect x={xOfU(U_MILD)} y="0" width={xOfU(U_SEVERE) - xOfU(U_MILD)} height="322" />
          </clipPath>
        </defs>

        <YGrid />

        {/* fires the model has seen */}
        {KNOWN_FIRES.map((f) => (
          <g key={f.name}>
            <line x1={xOfU(f.u)} y1={TOP - 4} x2={xOfU(f.u)} y2={BASE} stroke="rgba(255,255,255,0.14)" strokeDasharray="2 4" />
            <text x={xOfU(f.u)} y={f.row ? 22 : 35} textAnchor="middle" fontSize="9" fill="#a1a1a6" fontFamily={MONO}>
              {f.name}
            </text>
          </g>
        ))}

        {/* x labels */}
        {[
          { u: U_MILD, t: "mild · P10" },
          { u: 0, t: "typical fire" },
          { u: U_SEVERE, t: "severe · P90" },
        ].map((l) => (
          <text key={l.t} x={xOfU(l.u)} y={BASE + 17} textAnchor="middle" fontSize="10" fill="#6e6e73" fontFamily={MONO}>
            {l.t}
          </text>
        ))}

        {/* embers: more of them, and brighter, as the fire gets worse */}
        <rect x="0" y="232" width="540" height="90" fill={`url(#wf-glow-${uid})`} opacity={0.1 + severity * 0.5} style={{ transition: "opacity .4s" }} />
        <g opacity={0.25 + severity * 0.75} style={{ transition: "opacity .4s" }}>
          {EMBERS.map((e, i) => (
            <circle
              key={i}
              cx={e.x}
              cy="316"
              r={e.r}
              fill={i % 3 ? "#ffb340" : "#ff6a3d"}
              className="ember"
              style={{ animationDelay: `${e.delay}s`, animationDuration: `${e.dur}s`, ["--dx" as string]: `${e.dx}px` }}
            />
          ))}
        </g>

        {/* curves */}
        <path d={area} fill="rgba(255,106,61,0.06)" style={{ transition: "d .35s ease" }} />
        <path d={area} fill={`url(#wf-fill-${uid})`} clipPath={`url(#wf-band-${uid})`} style={{ transition: "d .35s ease" }} />
        <path d={curve0} fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="1.4" strokeDasharray="4 5" style={{ transition: "d .35s ease" }} />
        <path d={curve} fill="none" stroke={`url(#wf-line-${uid})`} strokeWidth="2.6" strokeLinecap="round" style={{ transition: "d .35s ease" }} />

        {/* selected fire */}
        <line x1={mx} y1={TOP - 4} x2={mx} y2={BASE} stroke="#fff" strokeWidth="1" opacity="0.55" />
        <circle cx={mx} cy={my} r="9" fill={EMBER} opacity="0.25" className="breathe" />
        <circle cx={mx} cy={my} r="4.5" fill="#fff" stroke={EMBER} strokeWidth="2.5" />
      </svg>

      {interactive && (
      <div className="px-4 sm:px-5 pb-3 space-y-3">
        <div className="flex items-center gap-4">
          <label htmlFor={`wf-fire-${uid}`} className="text-[10px] font-mono uppercase tracking-widest text-ink-3">Fire</label>
          <input
            id={`wf-fire-${uid}`}
            type="range"
            min={-100}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="range"
            aria-label="Fire severity, from mild to severe"
            aria-valuetext={`${Math.round(severity * 100)}th percentile fire`}
          />
          <span className="font-mono text-[13px] text-white tabular-nums w-10 text-right whitespace-nowrap">P{Math.round(severity * 100)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Toggle on={post2008} onClick={() => setPost2008(!post2008)} accent={EMBER}>Built 2008+</Toggle>
          <Toggle on={eaves} onClick={() => setEaves(!eaves)} accent={EMBER}>Enclosed eaves</Toggle>
          <Toggle on={vents} onClick={() => setVents(!vents)} accent={EMBER}>Vent mesh ≤ ⅛″</Toggle>
          <Toggle on={woodRoof} onClick={() => setWoodRoof(!woodRoof)} accent="#f87171">Wood shake roof</Toggle>
          <span className="ml-auto"><Segmented value={spacing} options={SPACINGS} onChange={setSpacing} label="Spacing to neighbouring structures" /></span>
        </div>
      </div>
      )}

      <Readouts
        cells={[
          { k: "This fire", ks: "This fire", v: pct(pHere), color: EMBER },
          { k: "New fire", ks: "New fire", v: pct(pNew), color: "#fff" },
          { k: "Mild – severe", ks: "Range", v: `${Math.round(wildfireAtFire(eta, U_MILD) * 100)}–${Math.round(wildfireAtFire(eta, U_SEVERE) * 100)}%`, color: "#fff" },
          { k: "vs. baseline", ks: "vs. base", v: delta === 0 ? "—" : `${delta > 0 ? "+" : "−"}${Math.abs(delta)} pts`, color: delta < 0 ? "#34d399" : delta > 0 ? "#f87171" : "#6e6e73" },
        ]}
      />
    </div>
  );
}

/* ───────────────────── HurricaneVuln — fragility against wind ───────────────────── */

const SKY = "#5aa9ff";
const ROSE = "#fb7185";
const MPH_MIN = 100;
const MPH_MAX = 180;
const xOfMph = (m: number) => X0 + ((m - MPH_MIN) / (MPH_MAX - MPH_MIN)) * XW;
// Saffir–Simpson lower bounds in mph, for the bands behind the curves
const CATS = [
  { n: 2, from: 96 },
  { n: 3, from: 111 },
  { n: 4, from: 130 },
  { n: 5, from: 157 },
];
const CAL_MPH = HURRICANE_CALIBRATED_MS.map((v) => v / MS_PER_MPH);

type Construction = "wood" | "masonry" | "steel" | "manufactured";
const CONSTRUCTIONS: { id: Construction; label: string }[] = [
  { id: "wood", label: "Wood" },
  { id: "masonry", label: "Masonry" },
  { id: "steel", label: "Steel" },
  { id: "manufactured", label: "Manufactured" },
];

// one 540-wide field of streaks, drawn twice so the leftward loop is seamless
const STREAKS = [0, 540].flatMap((shift) =>
  Array.from({ length: 10 }, (_, i) => ({
    x: shift + ((i * 173) % 540),
    y: 262 + ((i * 11) % 9) * 6,
    len: 26 + ((i * 19) % 5) * 12,
    o: 0.25 + ((i * 7) % 5) * 0.12,
  })),
);

export function HurricaneVisual({ interactive = true }: { interactive?: boolean }) {
  const uid = useId().replace(/:/g, "");
  const [mph, setMph] = useState(145);
  const [construction, setConstruction] = useState<Construction>("wood");
  const [fbc2010, setFbc2010] = useState(false);

  const building: Omit<HurricaneBuilding, "wind_ms"> = {
    construction,
    use: "single_family",
    storeys: "1",
    era: fbc2010 ? "2010_2018" : "1970_1993",
    quality: "average",
    foundation: "slab",
    log_area: HU.any.design.mean.log_area,
    low_ground: 0,
    coastal_v: 0,
  };
  const at = (m: number) => hurricaneFragility({ ...building, wind_ms: m * MS_PER_MPH });

  const ms = Array.from({ length: 61 }, (_, i) => MPH_MIN + (i / 60) * (MPH_MAX - MPH_MIN));
  const rows = ms.map((m) => ({ m, ...at(m) }));
  const anyPath = linePath(rows.map((r) => [xOfMph(r.m), yOf(r.any)]));
  const desPath = linePath(rows.map((r) => [xOfMph(r.m), yOf(r.des)]));
  const ribbon = `${linePath(rows.map((r) => [xOfMph(r.m), yOf(r.hi)]))} ${[...rows].reverse().map((r) => `L${r1(xOfMph(r.m))},${r1(yOf(r.lo))}`).join(" ")} Z`;

  const here = at(mph);
  const cat = saffirSimpson(mph * MS_PER_MPH);
  const mx = r1(xOfMph(mph));
  const t = (mph - MPH_MIN) / (MPH_MAX - MPH_MIN);
  const outside = mph < CAL_MPH[0] || mph > CAL_MPH[1];

  return (
    <div>
      <svg viewBox="0 0 540 322" className="w-full h-auto block" role="img" aria-label="Probability that a building is damaged or destroyed as peak wind increases">
        <defs>
          <linearGradient id={`hu-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={SKY} stopOpacity="0.28" />
            <stop offset="1" stopColor={SKY} stopOpacity="0.04" />
          </linearGradient>
          <pattern id={`hu-hatch-${uid}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.09)" strokeWidth="1.5" />
          </pattern>
          <clipPath id={`hu-plot-${uid}`}>
            <rect x={X0} y={TOP - 6} width={XW} height={BASE - TOP + 6} />
          </clipPath>
        </defs>

        {/* Saffir–Simpson bands */}
        {CATS.map((c, i) => {
          const from = Math.max(c.from, MPH_MIN);
          const to = Math.min(CATS[i + 1]?.from ?? MPH_MAX, MPH_MAX);
          return (
            <g key={c.n}>
              {i % 2 === 1 && <rect x={xOfMph(from)} y={TOP - 6} width={xOfMph(to) - xOfMph(from)} height={BASE - TOP + 6} fill="rgba(255,255,255,0.025)" />}
              <text x={(xOfMph(from) + xOfMph(to)) / 2} y="32" textAnchor="middle" fontSize="9" fill="#6e6e73" fontFamily={MONO} letterSpacing="0.1em">
                CAT {c.n}
              </text>
            </g>
          );
        })}

        <YGrid />
        {[100, 120, 140, 160, 180].map((m) => (
          <text key={m} x={xOfMph(m)} y={BASE + 17} textAnchor="middle" fontSize="10" fill="#6e6e73" fontFamily={MONO}>
            {m}
            {m === 180 ? " mph" : ""}
          </text>
        ))}

        {/* wind streaks: faster and denser as the wind picks up */}
        <g opacity={0.25 + t * 0.75} style={{ transition: "opacity .4s" }}>
          <g className="streak" style={{ animationDuration: `${r1(3.2 - t * 2.4)}s` }}>
            {STREAKS.map((s, i) => (
              <line key={i} x1={s.x} y1={s.y} x2={s.x + s.len} y2={s.y} stroke={SKY} strokeWidth="1.4" strokeLinecap="round" opacity={s.o} />
            ))}
          </g>
        </g>

        <g clipPath={`url(#hu-plot-${uid})`}>
          {/* 80% range across counties */}
          <path d={ribbon} fill={`url(#hu-fill-${uid})`} style={{ transition: "d .35s ease" }} />
          <path d={anyPath} fill="none" stroke={SKY} strokeWidth="2.6" strokeLinecap="round" style={{ transition: "d .35s ease" }} />
          <path d={desPath} fill="none" stroke={ROSE} strokeWidth="2.2" strokeLinecap="round" style={{ transition: "d .35s ease" }} />
          {/* outside the winds the model was calibrated on */}
          <rect x={X0} y={TOP - 6} width={xOfMph(CAL_MPH[0]) - X0} height={BASE - TOP + 6} fill={`url(#hu-hatch-${uid})`} />
          <rect x={xOfMph(CAL_MPH[1])} y={TOP - 6} width={X0 + XW - xOfMph(CAL_MPH[1])} height={BASE - TOP + 6} fill={`url(#hu-hatch-${uid})`} />
        </g>

        {/* calibrated range */}
        <line x1={xOfMph(CAL_MPH[0])} y1={BASE} x2={xOfMph(CAL_MPH[1])} y2={BASE} stroke={SKY} strokeWidth="2.5" strokeLinecap="round" />
        <text x={(xOfMph(CAL_MPH[0]) + xOfMph(CAL_MPH[1])) / 2} y={TOP + 8} textAnchor="middle" fontSize="9" fill="#6e6e73" fontFamily={MONO}>
          calibrated range
        </text>

        {/* selected wind */}
        <line x1={mx} y1={TOP - 6} x2={mx} y2={BASE} stroke="#fff" strokeWidth="1" opacity="0.55" />
        <circle cx={mx} cy={r1(yOf(here.any))} r="9" fill={SKY} opacity="0.25" className="breathe" />
        <circle cx={mx} cy={r1(yOf(here.any))} r="4.5" fill="#fff" stroke={SKY} strokeWidth="2.5" />
        <circle cx={mx} cy={r1(yOf(here.des))} r="3.5" fill="#fff" stroke={ROSE} strokeWidth="2.2" />
      </svg>

      {interactive && (
      <div className="px-4 sm:px-5 pb-3 space-y-3">
        <div className="flex items-center gap-4">
          <label htmlFor={`hu-wind-${uid}`} className="text-[10px] font-mono uppercase tracking-widest text-ink-3">Wind</label>
          <input
            id={`hu-wind-${uid}`}
            type="range"
            min={MPH_MIN}
            max={MPH_MAX}
            value={mph}
            onChange={(e) => setMph(Number(e.target.value))}
            className="range"
            aria-label="Peak sustained wind at the building, in miles per hour"
          />
          <span className="font-mono text-[13px] text-white tabular-nums w-[68px] text-right whitespace-nowrap">{mph} mph</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Segmented value={construction} options={CONSTRUCTIONS} onChange={setConstruction} label="Construction type" />
          <Toggle on={fbc2010} onClick={() => setFbc2010(!fbc2010)} accent={SKY}>Built 2010–18 · FBC 2010</Toggle>
          <span className="ml-auto flex items-center gap-3 text-[10px] text-ink-2">
            <span className="flex items-center gap-1.5"><i className="w-3.5 h-[2.5px] rounded" style={{ background: SKY }} />damaged</span>
            <span className="flex items-center gap-1.5"><i className="w-3.5 h-[2.5px] rounded" style={{ background: ROSE }} />destroyed</span>
          </span>
        </div>
      </div>
      )}

      <Readouts
        cells={[
          { k: "P(damaged)", ks: "Damaged", v: pct(here.any), color: SKY },
          { k: "P(destroyed)", ks: "Destroyed", v: pct(here.des), color: ROSE },
          { k: "80% range", ks: "80% range", v: `${Math.round(here.lo * 100)}–${Math.round(here.hi * 100)}%`, color: "#fff" },
          { k: outside ? "Extrapolated" : "Category", ks: outside ? "Extrap." : "Category", v: cat > 0 ? `Cat ${cat}` : "TS", color: outside ? "#6e6e73" : "#ffb340" },
        ]}
      />
    </div>
  );
}
