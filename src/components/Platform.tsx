"use client";

import Reveal from "./Reveal";

const layers = [
  {
    n: "03",
    name: "Agents",
    color: "#8b5cf6",
    text: "Specialised AI agents that frame questions, challenge assumptions and explain results — with a human in the loop wherever judgement matters.",
  },
  {
    n: "02",
    name: "Models",
    color: "#4f7cff",
    text: "Hierarchical, calibrated, uncertainty-aware models. Every prediction carries its confidence and reproduces from a pinned version.",
  },
  {
    n: "01",
    name: "Data",
    color: "#22d3ee",
    text: "Satellite, reanalysis, claims, sensors, literature and expert knowledge — harmonized into one evidence layer with full provenance.",
  },
];

export default function Platform() {
  return (
    <section id="platform" className="relative bg-[#f5f5f7] text-[#1d1d1f] rounded-[36px] sm:rounded-[56px] mx-2 sm:mx-4 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 py-24 sm:py-36">
        <Reveal className="max-w-3xl">
          <span className="eyebrow text-[#86868b]">Platform</span>
          <h2 className="headline mt-5 text-[clamp(36px,5.6vw,72px)]">
            One stack under everything.{" "}
            <span className="text-[#86868b]">Data at the base, agents on top.</span>
          </h2>
        </Reveal>

        <div className="mt-16 sm:mt-24 grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">
          {/* isometric stack */}
          <Reveal>
            <div className="iso-wrap relative h-[380px] sm:h-[480px] grid place-items-center" style={{ perspective: 2000 }}>
              <div className="iso relative w-[220px] h-[220px] sm:w-[290px] sm:h-[290px] -translate-y-6">
                {/* ground shadow */}
                <div className="absolute inset-0 rounded-[36px] bg-black/30 blur-2xl" style={{ transform: "translateZ(-60px) scale(0.92)" }} />
                {[...layers].reverse().map((l, i) => (
                  <div
                    key={l.name}
                    className="iso-layer"
                    style={{
                      ["--i" as string]: i,
                      background: `linear-gradient(135deg, color-mix(in srgb, ${l.color} 92%, #fff) 0%, color-mix(in srgb, ${l.color} 70%, #000) 100%)`,
                      boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,0.45), inset 0 2px 0 rgba(255,255,255,0.7), -14px 14px 0 -2px color-mix(in srgb, ${l.color} 55%, #000), -30px 30px 50px -10px color-mix(in srgb, ${l.color} 60%, transparent)`,
                      opacity: 0.96,
                    }}
                  >
                    <div
                      className="absolute inset-4 rounded-[24px] opacity-50"
                      style={{
                        backgroundImage:
                          i === 0
                            ? "radial-gradient(rgba(255,255,255,0.9) 1.4px, transparent 1.6px)"
                            : i === 1
                            ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
                            : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0 5px, transparent 6px), radial-gradient(circle at 70% 40%, rgba(255,255,255,0.9) 0 5px, transparent 6px), radial-gradient(circle at 50% 72%, rgba(255,255,255,0.9) 0 5px, transparent 6px)",
                        backgroundSize: i === 0 ? "16px 16px" : i === 1 ? "28px 28px" : "100% 100%",
                      }}
                    />
                    <span className="absolute left-6 bottom-5 text-white text-[15px] sm:text-[19px] font-semibold tracking-tight">{l.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="space-y-3">
            {layers.map((l, i) => (
              <Reveal key={l.name} delay={i * 0.1}>
                <div className="group flex gap-6 rounded-[28px] p-6 sm:p-7 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_20px_40px_-24px_rgba(0,0,0,0.18)] border border-black/[0.04] transition-transform duration-500 hover:-translate-y-1">
                  <span className="font-mono text-[13px] pt-1" style={{ color: l.color }}>{l.n}</span>
                  <div>
                    <h3 className="text-[22px] font-semibold tracking-[-0.025em]">{l.name}</h3>
                    <p className="mt-2 text-[15.5px] leading-relaxed text-[#515154]">{l.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* principles */}
        <div className="mt-20 sm:mt-28 grid sm:grid-cols-3 gap-px bg-black/[0.08] rounded-[28px] overflow-hidden border border-black/[0.06]">
          {[
            { h: "Uncertainty is a feature.", p: "We report what the model knows and what it does not — separately. No silent extrapolation." },
            { h: "Evidence you can audit.", p: "Sources, versions, rejected alternatives and expert priors are recorded, not remembered." },
            { h: "Humans stay essential.", p: "Agents propose; people correct assumptions, add domain knowledge and choose the direction." },
          ].map((c, i) => (
            <Reveal key={c.h} delay={i * 0.08} className="bg-[#f5f5f7] p-8 sm:p-10">
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">{c.h}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#6e6e73]">{c.p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
