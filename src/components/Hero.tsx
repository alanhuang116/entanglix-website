"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type MouseEvent } from "react";
import { AirVisual, FloodVisual, GraphLegend, GraphVisual, Window } from "./ProductVisuals";

const ease = [0.2, 0.8, 0.2, 1] as const;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
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

  function onMove(e: MouseEvent<HTMLElement>) {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative overflow-hidden pt-[124px] sm:pt-[140px] pb-16 sm:pb-24">
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

      {/* ── 3D stage ── */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.7, ease }}
        className="relative z-10 mt-12 sm:mt-14 px-4"
        style={{ perspective: 1800 }}
      >
        <motion.div
          style={{ rotateX, rotateY, scale: stageScale, y: stageY, transformStyle: "preserve-3d" }}
          className="relative mx-auto max-w-[1120px] aspect-[16/12] sm:aspect-[16/8.4]"
        >
          {/* left — FloodVuln */}
          <div
            className="hidden sm:block absolute left-0 top-[12%] w-[40%] pointer-events-none"
            style={{ transform: "translateZ(-140px) rotateY(24deg)", transformStyle: "preserve-3d" }}
          >
            <Window title="FloodVuln Global — single risk" glow="rgba(45,212,191,0.45)" badge="Live model">
              <FloodVisual interactive={false} />
            </Window>
          </div>

          {/* right — GH-PM25 */}
          <div
            className="hidden sm:block absolute right-0 top-[10%] w-[40%] pointer-events-none"
            style={{ transform: "translateZ(-140px) rotateY(-24deg)", transformStyle: "preserve-3d" }}
          >
            <Window title="GH-PM25 Observatory" glow="rgba(255,179,64,0.4)" badge="Daily">
              <AirVisual />
            </Window>
          </div>

          {/* centre — Research Architect */}
          <div className="absolute left-1/2 top-0 w-[94%] sm:w-[54%]" style={{ transform: "translateX(-50%) translateZ(60px)", transformStyle: "preserve-3d" }}>
            <Window title="Research Architect — influence graph" glow="rgba(139,123,255,0.6)" badge="Co-reasoning">
              <GraphVisual />
              <GraphLegend />
            </Window>

            {/* floating chips, lifted off the glass */}
            <div className="chip-3d floaty hidden sm:block absolute sm:-left-16 bottom-[22%] rounded-2xl px-4 py-3" style={{ transform: "translateZ(90px)" }}>
              <span className="block text-[9px] font-mono uppercase tracking-widest text-ink-3">Data coverage</span>
              <span className="flex items-center gap-2 mt-1.5">
                <span className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden"><i className="block h-full w-[72%] rounded-full bg-gradient-to-r from-[#6d8bff] to-[#b78bff]" /></span>
                <span className="text-[13px] font-semibold text-white tabular-nums">5 / 7</span>
              </span>
            </div>
            <div className="chip-3d floaty-2 hidden sm:block absolute sm:-right-24 -top-[7%] rounded-2xl px-4 py-3 max-w-[210px]" style={{ transform: "translateZ(120px)" }}>
              <span className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-[#b9aeff]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8b7bff] breathe" />Hypothesis H1
              </span>
              <span className="block mt-1.5 text-[12.5px] leading-snug text-white/90">Canopy loss raises night-time temperature — testable with current data.</span>
            </div>
          </div>

          {/* contact shadow */}
          <div aria-hidden className="absolute left-[12%] right-[12%] -bottom-[6%] h-24 rounded-[50%] bg-black blur-3xl" style={{ transform: "translateZ(-200px)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
