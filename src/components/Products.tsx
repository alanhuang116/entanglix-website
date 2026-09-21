"use client";

import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import { AirVisual, FloodVisual, GraphLegend, GraphVisual, Window } from "./ProductVisuals";

type Product = {
  id: string;
  accent: string;
  glow: string;
  category: string;
  name: string;
  tagline: string;
  body: string;
  points: string[];
  stats: { v: string; k: string }[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string; external?: boolean };
  badge?: string;
  windowTitle: string;
  windowBadge: string;
  visual: ReactNode;
  chips: { text: string; sub: string; pos: string; z: number }[];
};

const products: Product[] = [
  {
    id: "research-architect",
    accent: "var(--research)",
    glow: "rgba(139,123,255,0.55)",
    category: "AI research copilot · SaaS",
    name: "Research Architect",
    tagline: "Design research, not just run it.",
    body: "The hardest part of research is rarely the analysis — it is deciding what to ask. Research Architect turns a question into an interactive influence graph you can argue with: a shared reasoning space where researchers and AI frame hypotheses together.",
    points: [
      "Map key factors, mechanisms and relationships",
      "Integrate literature and expert knowledge",
      "Evaluate research scope against real data coverage",
      "Develop grounded, testable hypotheses — with evidence and uncertainty visible",
    ],
    stats: [
      { v: "Tri-projection", k: "System → graph → scope → data" },
      { v: "Human-in-the-loop", k: "Researchers correct the AI, not the reverse" },
    ],
    primary: { label: "Open the app", href: "https://app.researcharchitect.ai/" },
    secondary: { label: "researcharchitect.ai", href: "https://researcharchitect.ai/", external: true },
    windowTitle: "Research Architect — influence graph",
    windowBadge: "Co-reasoning",
    visual: (
      <>
        <GraphVisual />
        <GraphLegend />
      </>
    ),
    chips: [
      { text: "Edge importance", sub: "necessary · driving · modifying", pos: "-left-3 sm:-left-8 top-[18%]", z: 70 },
      { text: "Left out, on record", sub: "rejected alternatives are kept", pos: "-right-3 sm:-right-8 bottom-[20%]", z: 100 },
    ],
  },
  {
    id: "floodvuln",
    accent: "var(--flood)",
    glow: "rgba(45,212,191,0.5)",
    category: "Climate risk intelligence · Banks & insurers",
    name: "FloodVuln Global",
    tagline: "Hazard models tell you where the water goes. We tell you what it does.",
    body: "A vendor-neutral vulnerability layer that converts flood depth into a full probability distribution of physical damage — specific to building archetype, geography and the local evidence you can actually produce. Bring depths from any hazard vendor; the vulnerability layer is the product.",
    points: [
      "Underwriting, pricing, accumulation, model validation and claims triage on one versioned engine",
      "Global-to-local calibration, from a global prior down to a carrier's own portfolio history",
      "Aleatory and epistemic uncertainty reported apart — insurance-grade",
      "API and portfolio batch delivery with reproducible model versions",
    ],
    stats: [
      { v: "1.86M", k: "flood claims behind the fit" },
      { v: "4,483", k: "archetype × region units calibrated" },
      { v: "270", k: "published curve points harmonized" },
    ],
    primary: { label: "Explore FloodVuln", href: "https://claude.ai/code/artifact/c6c2864e-28fc-4c15-ac57-f6cb2e50c93f" },
    secondary: { label: "Request a pilot", href: "#contact" },
    windowTitle: "FloodVuln Engine — single risk",
    windowBadge: "Live model",
    visual: <FloodVisual />,
    chips: [
      { text: "POST /v1/vulnerability", sub: "damage distribution · confidence", pos: "-right-3 sm:-right-8 top-[14%]", z: 90 },
    ],
  },
  {
    id: "gh-pm25",
    accent: "var(--air)",
    glow: "rgba(255,179,64,0.45)",
    category: "Environmental data service · Public sector",
    name: "GH-PM25 Observatory",
    tagline: "Daily 1-km fine particulate matter for Ghana.",
    body: "A national air-quality surface where ground monitors are sparse. We fuse satellite, reanalysis, land-use and population data with the monitor network to estimate PM2.5 for every square kilometre, every day — with honest uncertainty and direct comparison to health standards.",
    points: [
      "Population-weighted exposure and exceedance against WHO and Ghana EPA limits",
      "90% prediction intervals on every estimate",
      "Low-cost sensor calibration and monitor-network assimilation",
      "Validated leave-city-cluster-out, so it holds where no monitor exists",
    ],
    stats: [
      { v: "1 km", k: "daily national grid" },
      { v: "10", k: "open data sources fused" },
      { v: "455 × 650", k: "cells, coast to Sahel" },
    ],
    primary: { label: "Open the Observatory", href: "https://alanhuang116.github.io/ghana-pm25/" },
    secondary: { label: "Bring it to your country", href: "#contact" },
    badge: "In collaboration with UNDP",
    windowTitle: "GH-PM25 Observatory — national surface",
    windowBadge: "Daily",
    visual: <AirVisual />,
    chips: [
      { text: "Harmattan season", sub: "Saharan dust, Dec – Feb", pos: "-left-3 sm:-left-10 top-[16%]", z: 90 },
    ],
  },
];

function Arrow() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function ProductBlock({ p, flip }: { p: Product; flip: boolean }) {
  const ext = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});
  return (
    <Reveal>
      <article id={p.id} className="slab relative overflow-hidden rounded-[36px] sm:rounded-[44px]" style={{ ["--accent" as string]: p.accent }}>
        {/* accent light spilling in from the visual side */}
        <div
          aria-hidden
          className={`aurora w-[620px] h-[620px] top-1/2 -translate-y-1/2 opacity-30 ${flip ? "-left-40" : "-right-40"}`}
          style={{ background: p.accent }}
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />

        <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-8 items-center p-7 sm:p-12 lg:p-16">
          <div className={`min-w-0 ${flip ? "lg:order-2 lg:pl-8" : "lg:pr-8"}`}>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="eyebrow" style={{ color: p.accent }}>{p.category}</span>
              {p.badge && (
                <span className="chip-3d px-3 py-1 rounded-full text-[11px] font-medium text-white/90">{p.badge}</span>
              )}
            </div>
            <h3 className="headline text-[clamp(34px,4.4vw,56px)] text-white">{p.name}</h3>
            <p className="mt-3 text-[clamp(19px,1.9vw,24px)] leading-snug tracking-[-0.02em] font-medium text-white/80">{p.tagline}</p>
            <p className="mt-6 text-[16px] leading-[1.65] text-ink-2">{p.body}</p>

            <ul className="mt-7 space-y-3">
              {p.points.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-snug text-white/85">
                  <span className="mt-[3px] flex-shrink-0 w-[18px] h-[18px] rounded-full grid place-items-center" style={{ background: `color-mix(in srgb, ${p.accent} 18%, transparent)`, color: p.accent }}>
                    <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" /></svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>

            <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-5 border-t border-white/[0.08] pt-7">
              {p.stats.map((s) => (
                <div key={s.k} className="max-w-[220px]">
                  <dt className="text-[22px] font-semibold tracking-[-0.03em] text-white whitespace-nowrap">{s.v}</dt>
                  <dd className="text-[12.5px] text-ink-3 mt-0.5 leading-snug">{s.k}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a href={p.primary.href} {...ext(p.primary.href)} className="btn btn-accent">{p.primary.label}<Arrow /></a>
              <a href={p.secondary.href} {...ext(p.secondary.href)} className="btn btn-ghost">
                {p.secondary.label}
                {p.secondary.external ? <Arrow /> : <span aria-hidden>›</span>}
              </a>
            </div>
          </div>

          <Tilt className={`min-w-0 ${flip ? "lg:order-1" : ""}`} max={6}>
            <div style={{ transformStyle: "preserve-3d" }} className="relative">
              <Window title={p.windowTitle} glow={p.glow} badge={p.windowBadge}>{p.visual}</Window>
              {p.chips.map((c) => (
                <div key={c.text} className={`chip-3d hidden sm:block absolute ${c.pos} rounded-2xl px-4 py-2.5 pointer-events-none`} style={{ transform: `translateZ(${c.z}px)` }}>
                  <span className="block text-[12.5px] font-semibold text-white tracking-tight">{c.text}</span>
                  <span className="block text-[10.5px] text-ink-2 mt-0.5">{c.sub}</span>
                </div>
              ))}
            </div>
          </Tilt>
        </div>
      </article>
    </Reveal>
  );
}

export default function Products() {
  return (
    <section id="products" className="relative py-24 sm:py-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 px-2">
          <span className="eyebrow text-ink-3">Products</span>
          <h2 className="headline mt-5 text-[clamp(36px,5.6vw,72px)] text-silver">Three products. One way of thinking.</h2>
          <p className="mt-6 text-[clamp(17px,1.6vw,20px)] leading-relaxed text-ink-2">
            Each one takes messy real-world evidence, reasons over it with AI, and hands back an answer with its uncertainty attached.
          </p>
        </Reveal>

        <div className="space-y-6 sm:space-y-8">
          {products.map((p, i) => (
            <ProductBlock key={p.id} p={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
