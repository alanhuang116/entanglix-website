"use client";

import Reveal from "./Reveal";
import Tilt from "./Tilt";

const agents = [
  {
    name: "Hypothesis Architect",
    role: "Frames the question",
    text: "Turns a research question into an influence graph, then proposes hypotheses the graph and the data can actually support.",
    product: "Research Architect",
    color: "var(--research)",
    icon: "M12 3v3m0 12v3M3 12h3m12 0h3M7.5 7.5l2 2m5 5 2 2m0-9-2 2m-5 5-2 2M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    span: "lg:col-span-2",
  },
  {
    name: "Literature Scout",
    role: "Grounds every edge",
    text: "Finds what the literature supports, what it contests, and where it is silent.",
    product: "Research Architect",
    color: "var(--research)",
    icon: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15ZM4 20.5A2.5 2.5 0 0 0 6.5 23H20M8 8h8M8 12h5",
    span: "",
  },
  {
    name: "Coverage Auditor",
    role: "Checks scope against data",
    text: "Tells you what your study can detect, what your data can measure — and what got left out.",
    product: "Research Architect",
    color: "var(--research)",
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    span: "",
  },
  {
    name: "Vulnerability Engine",
    role: "Prices physical damage",
    text: "Converts flood depth into a calibrated damage distribution for any archetype and region, and flags out-of-domain requests instead of guessing.",
    product: "FloodVuln Global",
    color: "var(--flood)",
    icon: "M3 15c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.2-2 4.5-2 2.3 2 4.5 2M3 19.5c2.2 0 2.2-2 4.5-2s2.3 2 4.5 2 2.2-2 4.5-2 2.3 2 4.5 2M6.5 10V4h11v6",
    span: "lg:col-span-2",
  },
  {
    name: "Local Calibrator",
    role: "Learns from ten observations",
    text: "Updates global priors with sparse local claims and structured expert evidence — by exactly as much as it should.",
    product: "FloodVuln Global",
    color: "var(--flood)",
    icon: "M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75",
    span: "",
  },
  {
    name: "Exposure Mapper",
    role: "Fills the gaps between monitors",
    text: "Fuses satellite, reanalysis and ground sensors into a daily 1-km pollution surface with prediction intervals.",
    product: "GH-PM25 Observatory",
    color: "var(--air)",
    icon: "M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z",
    span: "",
  },
];

export default function Agents() {
  return (
    <section id="agents" className="relative py-28 sm:py-40 overflow-hidden">
      <div className="aurora animate-drift-slow w-[800px] h-[800px] top-20 left-1/2 -translate-x-1/2 bg-[#4f7cff]/10" aria-hidden />
      <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 px-2">
          <span className="eyebrow text-ink-3">Agent collection</span>
          <h2 className="headline mt-5 text-[clamp(36px,5.6vw,72px)] text-silver">Agents that know what they don&apos;t know.</h2>
          <p className="mt-6 text-[clamp(17px,1.6vw,20px)] leading-relaxed text-ink-2">
            AI agents should not propose blindly, grow overconfident on incomplete evidence, or abandon good ideas too early.
            Ours are specialised, grounded in data, and built to be corrected.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {agents.map((a, i) => (
            <Reveal key={a.name} delay={(i % 4) * 0.06} className={`h-full ${a.span}`}>
              <Tilt max={5} className="h-full">
                <div className="slab relative h-full min-h-[250px] rounded-[30px] p-7 overflow-hidden flex flex-col">
                  <div aria-hidden className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-25" style={{ background: a.color }} />
                  <div
                    className="relative w-12 h-12 rounded-[15px] grid place-items-center mb-auto"
                    style={{
                      background: `linear-gradient(180deg, color-mix(in srgb, ${a.color} 85%, #fff), color-mix(in srgb, ${a.color} 75%, #000))`,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 24px -8px ${a.color}`,
                    }}
                  >
                    <svg className="w-6 h-6 text-[#07080c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                    </svg>
                  </div>
                  <div className="relative mt-10">
                    <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: a.color }}>{a.role}</span>
                    <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.025em] text-white">{a.name}</h3>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2 max-w-[46ch]">{a.text}</p>
                    <span className="inline-block mt-5 text-[11.5px] text-ink-3">Runs inside {a.product}</span>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
