"use client";

import { motion, useMotionValue, useAnimationFrame, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const projects = [
  {
    tag: "Flagship Product",
    title: "ResearchArchitect",
    subtitle: "Autonomous Research with Human-in-the-Loop",
    description:
      "A generative-AI platform that automates the full research lifecycle — literature discovery, hypothesis generation, data analysis, and manuscript drafting — with human researchers in control at every decision point.",
    highlights: ["LLM-powered literature review", "Automated experiment design", "Human-in-the-loop validation", "Multi-agent parallel tasks", "Research knowledge graphs"],
    accent: "purple",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
  },
  {
    tag: "Core Research",
    title: "Quantum-Informed Algorithms",
    subtitle: "Bridging Quantum Computing & Geospatial AI",
    description:
      "Quantum-computing paradigms — superposition, entanglement, interference — brought into classical ML pipelines for geospatial optimization, spatial regression, and network analysis that resist conventional methods.",
    highlights: ["Quantum spatial regression", "Hybrid quantum-classical optimization", "Quantum feature maps", "Combinatorial spatial speedups", "GIS stack integration"],
    accent: "cyan",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
  {
    tag: "Urban Intelligence",
    title: "Advanced Urban Informatics",
    subtitle: "Big Mobility Data, Smart Sensors & Computer Vision",
    description:
      "Fusing massive mobility datasets, IoT smart-sensor networks, and state-of-the-art computer vision to decode the pulse of cities — pedestrian flows, traffic dynamics, environmental health, and infrastructure assessment.",
    highlights: ["Billion-scale GPS analytics", "Smart sensor dashboards", "Street-level computer vision", "Deep-learning flow models", "Wearable exposure mapping"],
    accent: "blue",
    icon: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z",
  },
  {
    tag: "Career & Education",
    title: "AI for Career Consulting",
    subtitle: "Guiding the Next Generation of AI Talent",
    description:
      "AI-powered career consulting for students navigating academic pathways and industry transitions. Personalized career route mapping, skill-gap analysis, and labor-market intelligence for AI-related roles.",
    highlights: ["Career pathway mapping", "AI skill-gap analysis", "Job market intelligence", "Grad program matching", "Professional mentorship network"],
    accent: "emerald",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  },
  {
    tag: "Social Impact",
    title: "GenAI for African Education",
    subtitle: "Bridging the Educational Equity Gap with AI",
    description:
      "Empowering teachers and students across Africa to rapidly produce high-quality teaching materials using generative AI, addressing systemic educational inequity and expanding access to world-class learning resources.",
    highlights: ["AI content in local languages", "K-12 & higher-ed curriculum tools", "Train-the-trainer programs", "Offline-capable tools", "Institutional partnerships"],
    accent: "amber",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418",
  },
];

const palette: Record<string, { border: string; bg: string; bgSolid: string; gradient: string; text: string; dot: string }> = {
  purple:  { border: "border-purple-500/30",  bg: "bg-purple-500/15",  bgSolid: "#1a0a2e", gradient: "from-purple-500/30 to-purple-600/10",  text: "text-purple-400",  dot: "bg-purple-500" },
  cyan:    { border: "border-cyan-500/30",    bg: "bg-cyan-500/15",    bgSolid: "#0a1a2e", gradient: "from-cyan-500/30 to-cyan-600/10",     text: "text-cyan-400",    dot: "bg-cyan-500" },
  blue:    { border: "border-blue-500/30",    bg: "bg-blue-500/15",    bgSolid: "#0a102e", gradient: "from-blue-500/30 to-blue-600/10",     text: "text-blue-400",    dot: "bg-blue-500" },
  emerald: { border: "border-emerald-500/30", bg: "bg-emerald-500/15", bgSolid: "#0a1e1a", gradient: "from-emerald-500/30 to-emerald-600/10", text: "text-emerald-400", dot: "bg-emerald-500" },
  amber:   { border: "border-amber-500/30",   bg: "bg-amber-500/15",   bgSolid: "#1e1a0a", gradient: "from-amber-500/30 to-amber-600/10",   text: "text-amber-400",   dot: "bg-amber-500" },
};

const CARD_W = 560;
const GAP = 32;
const STEP = CARD_W + GAP;
const N = projects.length;
const TRACK_W = N * STEP;      // total width of one copy (for seamless wrap)
const SCROLL_SPEED = 60;        // px/second — continuous drift

function Card({ project, isActive, onClick }: {
  project: typeof projects[0];
  isActive: boolean;
  onClick: () => void;
}) {
  const p = palette[project.accent];
  return (
    <motion.div
      onClick={onClick}
      animate={{ scale: isActive ? 1.02 : 0.92, opacity: isActive ? 1 : 0.5 }}
      transition={{ type: "spring", stiffness: 140, damping: 22 }}
      className="flex-shrink-0 cursor-pointer"
      style={{ width: CARD_W, height: 420 }}
    >
      <div
        className={`rounded-2xl border-2 overflow-hidden h-full flex flex-col transition-[border-color,box-shadow] duration-300 ${
          isActive ? `${p.border} shadow-2xl shadow-black/50` : "border-white/[0.08]"
        }`}
        style={{ background: p.bgSolid }}
      >
        <div className={`h-1.5 bg-gradient-to-r ${p.gradient} flex-shrink-0`} />
        <div className="p-8 flex flex-col flex-1">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-7 h-7 ${p.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={project.icon} />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${p.text} ${p.bg} border ${p.border} mb-2`}>
                {project.tag}
              </span>
              <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              <p className={`text-sm ${p.text} font-medium mt-0.5`}>{project.subtitle}</p>
            </div>
          </div>
          <p className="text-gray-300 text-[15px] leading-relaxed mb-6 flex-1">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.highlights.map((h) => (
              <span key={h} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${p.bg} ${p.text} border ${p.border}`}>
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const [containerW, setContainerW] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [jumping, setJumping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const lastT = useRef<number>(0);

  // measure viewport width
  useEffect(() => {
    const update = () => setContainerW(containerRef.current?.offsetWidth || 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Continuous, gradual scroll. The track drifts left by SCROLL_SPEED px/s.
  // When paused or jumping, drift halts.
  useAnimationFrame((t) => {
    if (lastT.current === 0) lastT.current = t;
    const dt = (t - lastT.current) / 1000;
    lastT.current = t;

    if (paused || jumping || !containerW) return;

    const cur = x.get();
    let next = cur - SCROLL_SPEED * dt;
    // wrap into a continuous loop of length TRACK_W
    if (next <= -TRACK_W) next += TRACK_W;
    x.set(next);

    // figure out which card is closest to center
    // center card index = round(-(x - center)/STEP)
    const centerOff = containerW / 2 - CARD_W / 2;
    const idx = Math.round(((centerOff - next) / STEP) % N + N) % N;
    if (idx !== activeIdx) setActiveIdx(idx);
  });

  // click dot/card → smoothly animate to that card centered
  const selectCard = (i: number) => {
    if (!containerW) return;
    setJumping(true);
    setActiveIdx(i);
    const centerOff = containerW / 2 - CARD_W / 2;
    // find nearest target X that places card i at center (given current wrap)
    const cur = x.get();
    const targetInFirstCopy = centerOff - i * STEP;
    // find the multiple of TRACK_W that makes the shortest path
    let target = targetInFirstCopy;
    while (target > cur + TRACK_W / 2) target -= TRACK_W;
    while (target < cur - TRACK_W / 2) target += TRACK_W;

    animate(x, target, {
      type: "spring",
      stiffness: 120,
      damping: 24,
      onComplete: () => {
        setJumping(false);
        // briefly pause auto scroll after user interaction
        setPaused(true);
        setTimeout(() => setPaused(false), 3000);
      },
    });
  };

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 px-6"
        >
          <span className="inline-block px-3 py-1 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium tracking-wider uppercase mb-6 backdrop-blur-sm bg-white/[0.02]">
            Featured Work
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Our{" "}
            <span className="bg-[linear-gradient(135deg,#06b6d4,#818cf8,#a855f7)] bg-clip-text text-transparent">
              Flagship Projects
            </span>
          </h2>
        </motion.div>

        {/* carousel viewport */}
        <div
          ref={containerRef}
          className="overflow-hidden"
          style={{ maskImage: "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div className="flex" style={{ x, gap: GAP }}>
            {/* two copies for seamless looping */}
            {[...projects, ...projects].map((project, i) => {
              const idx = i % N;
              return (
                <Card
                  key={i}
                  project={project}
                  isActive={idx === activeIdx}
                  onClick={() => selectCard(idx)}
                />
              );
            })}
          </motion.div>
        </div>

        {/* nav controls */}
        <div className="flex items-center justify-center gap-6 mt-8 px-6">
          <button
            onClick={() => selectCard((activeIdx - 1 + N) % N)}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/40 transition-all"
            aria-label="Previous project"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            {projects.map((proj, i) => {
              const p = palette[proj.accent];
              const isActive = i === activeIdx;
              return (
                <button
                  key={i}
                  onClick={() => selectCard(i)}
                  aria-label={`Select ${proj.title}`}
                  title={proj.title}
                  className="group relative p-1"
                >
                  <div
                    className={`rounded-full transition-all duration-300 ${p.dot} ${
                      isActive ? "w-8 h-3 shadow-lg" : "w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:scale-125"
                    }`}
                  />
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-[10px] bg-gray-900/95 border border-white/10 rounded text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-md">
                    {proj.title}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => selectCard((activeIdx + 1) % N)}
            className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/40 transition-all"
            aria-label="Next project"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
