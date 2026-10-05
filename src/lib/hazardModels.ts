// Client-side mirrors of the WildfireVuln and HurricaneVuln prediction engines.
// Same formulas as the portals (wildfirevuln/model.py, hurricanevuln/fragility.py);
// scripts/check-hazard-parity.mjs checks them against the portals' own parity cases.
import { GH, HU, WF } from "./hazardData";

export const Z80 = 1.2815516;
export const sig = (z: number) => 1 / (1 + Math.exp(-z));

/** Average a logistic over a normal random effect (Gauss–Hermite), optionally shifted by `um`. */
function pInt(e: number, v: number, um = 0) {
  if (v <= 0) return sig(e + um);
  const s = Math.sqrt(2 * v);
  let p = 0;
  for (let i = 0; i < GH.x.length; i++) p += GH.w[i] * sig(e + um + s * GH.x[i]);
  return p / Math.sqrt(Math.PI);
}

type Levels = Record<string, string[]>;
type Freq = Record<string, Record<string, number>>;

/** One-hot for graded levels; "unknown" takes the level's frequency so it carries no information. */
function catTerms(cats: string[], levels: Levels, freq: Freq, x: Record<string, unknown>) {
  const v: number[] = [];
  for (const c of cats) for (const lv of levels[c]) v.push(x[c] === "unknown" ? freq[c][lv] : x[c] === lv ? 1 : 0);
  return v;
}

/** Levels that are not evidence-supported collapse to the reference: no credit, no surcharge. */
function graded<T extends Record<string, unknown>>(x: T, spec: Levels, refs: Record<string, string>): T {
  const o: Record<string, unknown> = { ...x };
  for (const f in refs) {
    const ok = new Set([...(spec[f] ?? []), refs[f], "unknown"]);
    if (!ok.has(o[f] as string)) o[f] = refs[f];
  }
  return o as T;
}

/* ───────────────────────── WildfireVuln ───────────────────────── */

export type WildfireHome = {
  struct: string;
  era: string;
  roof: string;
  eaves: string;
  vents: string;
  /** structures within 30 m / 100 m, and metres to the nearest one */
  n30: number;
  n100: number;
  nn_m: number;
};

export const WILDFIRE_TAU = Math.sqrt(WF.tau2);

/** Linear predictor for P(destroyed | fire reaches the neighbourhood), before the fire effect. */
export function wildfireEta(h0: WildfireHome) {
  const D = WF.design;
  const h = graded(h0, WF.spec as Levels, D.ref as Record<string, string>);
  const a = Math.log1p(h.n30);
  const b = Math.log1p(h.n100);
  const c = Math.log(h.nn_m + 1);
  const t: Record<string, number> = {
    log_n30: a, log_n100: b, log_nn: c,
    log_n30_sq: a * a, log_n100_sq: b * b, log_nn_sq: c * c,
    isolated: h.n30 === 0 ? 1 : 0, n30_x_n100: a * b,
  };
  const mean = D.mean as Record<string, number>;
  const sd = D.sd as Record<string, number>;
  const x = catTerms(D.cats, D.levels as Levels, D.freq as Freq, h);
  for (const k of D.num) x.push((t[k] - mean[k]) / sd[k]);

  let e = WF.mu;
  let j = 0;
  for (; j < x.length; j++) e += x[j] * WF.beta[j];
  // commercial buildings get their own feature effects on top of the shared ones
  const com = D.com_struct.includes(h.struct);
  for (const i of D.feat_idx) {
    if (com) e += x[i] * WF.beta[j];
    j++;
  }
  return e;
}

/** P(destroyed) in a fire of known severity `u` (logit scale; 0 is a typical fire). */
export const wildfireAtFire = (eta: number, u: number) => sig(eta + u);
/** P(destroyed) for a fire not yet seen: averaged over the fire-to-fire spread. */
export const wildfireNewFire = (eta: number) => pInt(eta, WF.tau2);

/* ───────────────────────── HurricaneVuln ───────────────────────── */

export type HurricaneBuilding = {
  construction: string;
  use: string;
  storeys: string;
  era: string;
  quality: string;
  foundation: string;
  wind_ms: number;
  log_area: number;
  low_ground: number;
  coastal_v: number;
};

type FragModel = typeof HU.any;

function fragEta(M: FragModel, x: HurricaneBuilding) {
  const D = M.design;
  const mean = D.mean as Record<string, number>;
  const sd = D.sd as Record<string, number>;
  const v = catTerms(D.cats, D.levels as Levels, D.freq as Freq, x);
  const lw = Math.log(Math.max(x.wind_ms, 5) / D.v_ref);
  const num: Record<string, number> = { log_wind: lw, log_wind_sq: lw * lw };
  for (const k of D.num) v.push((num[k] - mean[k]) / sd[k]);
  for (const k of D.extra) v.push(((x as unknown as Record<string, number>)[k] - mean[k]) / sd[k]);
  let e = M.mu;
  for (let j = 0; j < v.length; j++) e += v[j] * M.beta[j];
  return e;
}

/** Fragility at a given wind: P(any damage), P(destroyed), and the 80% range across counties. */
export function hurricaneFragility(x0: HurricaneBuilding) {
  const g = graded(x0, HU.spec as Levels, HU.any.design.refs as Record<string, string>);
  const ea = fragEta(HU.any, g);
  const ed = fragEta(HU.des, g);
  const pa = pInt(ea, HU.any.tau2);
  const sa = Math.sqrt(HU.any.tau2);
  return { any: pa, des: pa * pInt(ed, HU.des.tau2), lo: sig(ea - Z80 * sa), hi: sig(ea + Z80 * sa) };
}

/** Wind range the fragility model was calibrated on (mean ± 2 sd of log wind), m/s. */
export const HURRICANE_CALIBRATED_MS = (() => {
  const { mean, sd, v_ref } = HU.any.design;
  return [v_ref * Math.exp(mean.log_wind - 2 * sd.log_wind), v_ref * Math.exp(mean.log_wind + 2 * sd.log_wind)] as const;
})();

export const MS_PER_MPH = 0.44704;
const MS_PER_KT = 0.514444;
/** Saffir–Simpson category from sustained wind; 0 is tropical storm, -1 below. */
export function saffirSimpson(wind_ms: number) {
  const kt = wind_ms / MS_PER_KT;
  return kt >= 137 ? 5 : kt >= 113 ? 4 : kt >= 96 ? 3 : kt >= 83 ? 2 : kt >= 64 ? 1 : kt >= 34 ? 0 : -1;
}
