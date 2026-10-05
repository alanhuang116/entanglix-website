"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { HurricaneVisual, WildfireVisual } from "./HazardVisuals";
import { AirVisual, FloodVisual, GraphLegend, GraphVisual, Window } from "./ProductVisuals";

const ease = [0.2, 0.8, 0.2, 1] as const;

/* ───────────────────────── carousel content ───────────────────────── */

function Chip({ pos, z, title, sub }: { pos: string; z: number; title: string; sub: string }) {
  return (
    <div className={`chip-3d absolute ${pos} rounded-2xl px-4 py-2.5`} style={{ transform: `translateZ(${z}px)` }}>
      <span className="block text-[12.5px] font-semibold text-white tracking-tight whitespace-nowrap">{title}</span>
      <span className="block text-[10.5px] text-ink-2 mt-0.5 whitespace-nowrap">{sub}</span>
    </div>
  );
}

type Panel = { id: string; name: string; accent: string; title: string; glow: string; badge: string; visual: ReactNode; chips: ReactNode };

// same order as the product sections below
const panels: Panel[] = [
  {
    id: "research-architect",
    name: "Research Architect",
    accent: "var(--research)",
    title: "Research Architect — influence graph",
    glow: "rgba(139,123,255,0.6)",
    badge: "Co-reasoning",
    visual: (
      <>
        <GraphVisual />
        <GraphLegend />
      </>
    ),
    chips: (
      <>
        <div className="chip-3d floaty absolute -left-16 bottom-[22%] rounded-2xl px-4 py-3" style={{ transform: "translateZ(90px)" }}>
          <span className="block text-[9px] font-mono uppercase tracking-widest text-ink-3">Data coverage</span>
          <span className="flex items-center gap-2 mt-1.5">
            <span className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden"><i className="block h-full w-[72%] rounded-full bg-gradient-to-r from-[#6d8bff] to-[#b78bff]" /></span>
            <span className="text-[13px] font-semibold text-white tabular-nums">5 / 7</span>
          </span>
        </div>
        <div className="chip-3d floaty-2 absolute -right-24 -top-[7%] rounded-2xl px-4 py-3 max-w-[210px]" style={{ transform: "translateZ(120px)" }}>
          <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#b9aeff]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8b7bff] breathe" />Hypothesis H1
          </span>
          <span className="block mt-1.5 text-[12.5px] leading-snug text-white/90">Canopy loss raises night-time temperature — testable with current data.</span>
        </div>
      </>
    ),
  },
  {
    id: "floodvuln",
    name: "FloodVuln",
    accent: "var(--flood)",
    title: "FloodVuln Global — single risk",
    glow: "rgba(45,212,191,0.5)",
    badge: "Live model",
    visual: <FloodVisual interactive={false} />,
    chips: <Chip pos="-right-20 top-[12%]" z={110} title="POST /v1/vulnerability" sub="damage distribution · confidence" />,
  },
  {
    id: "wildfirevuln",
    name: "WildfireVuln",
    accent: "var(--wildfire)",
    title: "WildfireVuln — single home",
    glow: "rgba(255,106,61,0.5)",
    badge: "Live model",
    visual: <WildfireVisual interactive={false} />,
    chips: <Chip pos="-left-20 top-[20%]" z={110} title="8 of 21 credits supported" sub="graded on post-fire evidence" />,
  },
  {
    id: "hurricanevuln",
    name: "HurricaneVuln",
    accent: "var(--hurricane)",
    title: "HurricaneVuln — fragility",
    glow: "rgba(90,169,255,0.5)",
    badge: "Live model",
    visual: <HurricaneVisual interactive={false} />,
    chips: <Chip pos="-left-20 top-[24%]" z={110} title="Tested on unseen map tiles" sub="damage AUC 0.71, spatial hold-out" />,
  },
  {
    id: "gh-pm25",
    name: "GH-PM25",
    accent: "var(--air)",
    title: "GH-PM25 Observatory — national surface",
    glow: "rgba(255,179,64,0.45)",
    badge: "Daily",
    visual: <AirVisual />,
    chips: <Chip pos="-right-20 bottom-[18%]" z={110} title="In collaboration with UNDP" sub="daily 1-km PM2.5 for Ghana" />,
  },
];

const N = panels.length;
const DWELL_MS = 4600;

/** Signed distance of a panel from the front, wrapped into [-N/2, N/2). */
const wrapOffset = (v: number) => ((((v + N / 2) % N) + N) % N) - N / 2;

// Cover-flow layout, keyed by distance from the front. A panel fades out at ±2.5,
// which is exactly where it wraps to the other side, so the loop has no visible seam.
const STOPS = [-2.5, -2, -1, 0, 1, 2, 2.5];
const X = ["-130%", "-118%", "-60%", "0%", "60%", "118%", "130%"];
const Z = [-460, -380, -170, 70, -170, -380, -460];
const ROT = [38, 34, 26, 0, -26, -34, -38];
const FADE = [0, 0.55, 1, 1, 1, 0.55, 0];

function StagePanel({ panel, index, rotation, isFront, onPick }: { panel: Panel; index: number; rotation: MotionValue<number>; isFront: boolean; onPick: () => void }) {
  const off = useTransform(rotation, (r) => wrapOffset(index - r));
  const x = useTransform(off, STOPS, X);
  const z = useTransform(off, STOPS, Z);
  const rotateY = useTransform(off, STOPS, ROT);
  const opacity = useTransform(off, STOPS, FADE);
  const shade = useTransform(off, [-1, 0, 1], [0.45, 0, 0.45]);
  const chipOpacity = useTransform(off, [-0.45, 0, 0.45], [0, 1, 0]);

  return (
    <motion.div
      onClick={onPick}
      aria-hidden={!isFront}
      className="absolute left-1/2 top-1/2 w-[94%] sm:w-[50%] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={{ x, z, rotateY, opacity, transformStyle: "preserve-3d" }}
    >
      <div className="relative pointer-events-none">
        <Window title={panel.title} glow={panel.glow} badge={panel.badge}>{panel.visual}</Window>
        <motion.div aria-hidden className="absolute inset-0 rounded-[22px] bg-black" style={{ opacity: shade }} />
      </div>
      <motion.div aria-hidden className="hidden sm:block absolute inset-0 pointer-events-none" style={{ opacity: chipOpacity, transformStyle: "preserve-3d" }}>
        {panel.chips}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── hero ───────────────────────── */

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // The stage starts tipped back and "stands up" as you scroll, then the mouse adds parallax on top.
  const scrollTilt = useTransform(scrollYProgress, [0, 0.55], [26, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 0.55], [0.94, 1.04]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 16 });
  const rotateX = useTransform([scrollTilt, my], ([s, m]: number[]) => s - m * 5);
  const rotateY = useTransform(mx, (v) => v * 9);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);

  // `turn` counts panels brought to the front and never wraps, so the carousel always
  // travels the short way round; `rotation` eases towards it.
  const [turn, setTurn] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rotation = useMotionValue(0);
  const inView = useInView(stageRef, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const front = ((turn % N) + N) % N;

  useEffect(() => {
    const controls = animate(rotation, turn, { type: "spring", stiffness: 70, damping: 18, mass: 1 });
    return () => controls.stop();
  }, [turn, rotation]);

  const pick = (i: number) => setTurn((t) => t + wrapOffset(i - t));

  function onMove(e: MouseEvent<HTMLElement>) {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative overflow-hidden pt-[124px] sm:pt-[140px] pb-14 sm:pb-20">
      {/* ambient light */}
      <div className="absolute inset-0 grid-floor" aria-hidden />
      <div className="aurora animate-drift w-[720px] h-[720px] -top-64 left-1/2 -translate-x-[85%] bg-[#22d3ee]/20" aria-hidden />
      <div className="aurora animate-drift-slow w-[760px] h-[760px] -top-40 left-1/2 translate-x-[5%] bg-[#8b5cf6]/25" aria-hidden />

      <motion.div style={{ opacity: textOpacity, y: textY }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.a
          href="#products"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="chip-3d inline-flex items-center gap-2.5 h-9 pl-3 pr-4 mb-7 rounded-full text-[13px] text-white/85 hover:text-white transition-colors"
        >
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase text-black bg-gradient-to-r from-[#22d3ee] to-[#8b5cf6]">New</span>
          Research Architect is live
          <span aria-hidden className="text-white/40">→</span>
        </motion.a>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: 0.25, ease }}
          className="display text-[clamp(44px,7.4vw,92px)]"
        >
          <span className="text-silver">Data in.</span>{" "}
          <span className="text-brand">Decisions out.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.45, ease }}
          className="mt-6 mx-auto max-w-[660px] text-[clamp(17px,1.7vw,21px)] leading-[1.5] text-ink-2 tracking-[-0.015em]"
        >
          Entanglix builds data-driven SaaS products and a growing collection of AI agents — turning
          research questions, climate risk and environmental data into answers you can defend.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a href="#products" className="btn btn-primary w-full sm:w-auto">Explore the products</a>
          <a href="#contact" className="btn btn-ghost w-full sm:w-auto">Request a demo <span aria-hidden>›</span></a>
        </motion.div>
      </motion.div>

      {/* ── 3D carousel of every product ── */}
      <motion.div
        ref={stageRef}
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.7, ease }}
        className="relative z-10 mt-12 sm:mt-14 px-4 select-none"
        style={{ perspective: 1800 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="group"
        aria-roledescription="carousel"
        aria-label="Product previews"
      >
        <motion.div
          style={{ rotateX, rotateY, scale: stageScale, y: stageY, transformStyle: "preserve-3d" }}
          className="relative mx-auto max-w-[1120px] aspect-[16/14] sm:aspect-[16/7.6]"
        >
          {panels.map((p, i) => (
            <StagePanel
              key={p.id}
              panel={p}
              index={i}
              rotation={rotation}
              isFront={i === front}
              // the front panel leads to its section; any other panel comes forward
              onPick={() => (i === front ? document.getElementById(p.id)?.scrollIntoView({ behavior: "smooth", block: "start" }) : pick(i))}
            />
          ))}

          {/* contact shadow */}
          <div aria-hidden className="absolute left-[12%] right-[12%] -bottom-[4%] h-24 rounded-[50%] bg-black blur-3xl" style={{ transform: "translateZ(-480px)" }} />
        </motion.div>
      </motion.div>

      {/* selector: the bar under the active product is also the auto-advance timer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.1, ease }}
        className="relative z-20 mt-8 sm:mt-10 flex justify-center px-4"
      >
        <div className="chip-3d inline-flex items-center gap-0.5 p-1 rounded-full max-w-full">
          {panels.map((p, i) => {
            const active = i === front;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={active}
                aria-label={`Show ${p.name}`}
                className={`relative h-8 rounded-full flex items-center gap-2 text-[12.5px] font-medium tracking-tight transition-colors duration-300 overflow-hidden ${
                  active ? "px-3.5 text-white bg-white/[0.1]" : "px-2.5 sm:px-3.5 text-ink-2 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform duration-300" style={{ background: p.accent, transform: active ? "scale(1.4)" : "scale(1)" }} />
                <span className={active ? "whitespace-nowrap" : "hidden sm:inline whitespace-nowrap"}>{p.name}</span>
                {active && !reduceMotion && (
                  <span
                    key={turn}
                    aria-hidden
                    className="dwell absolute left-0 bottom-0 h-[2px] rounded-full"
                    style={{ background: p.accent, animationDuration: `${DWELL_MS}ms`, animationPlayState: hovered || !inView ? "paused" : "running" }}
                    onAnimationEnd={() => setTurn((t) => t + 1)}
                  />
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
