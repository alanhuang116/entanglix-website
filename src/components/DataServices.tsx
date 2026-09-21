"use client";

import Reveal from "./Reveal";
import Tilt from "./Tilt";

const modes = [
  { h: "APIs", p: "Versioned endpoints that return distributions, confidence and provenance — not a bare number." },
  { h: "Data products", p: "Analysis-ready gridded surfaces and portfolio batches, refreshed on a schedule you can rely on." },
  { h: "Hosted apps", p: "Browser-based SaaS workspaces and observatories. Nothing to install, nothing to maintain." },
  { h: "Custom builds", p: "New geographies, new hazards, new agents — delivered on the same stack, with the same rigour." },
];

const K = ({ children }: { children: string }) => <span className="text-[#7c8aa5]">{children}</span>;
const N = ({ children }: { children: string }) => <span className="text-[#5eead4]">{children}</span>;
const S = ({ children }: { children: string }) => <span className="text-[#fbbf77]">{children}</span>;

export default function DataServices() {
  return (
    <section id="data" className="relative py-28 sm:py-40">
      <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          <div className="px-2 min-w-0">
            <Reveal>
              <span className="eyebrow text-ink-3">Data services</span>
              <h2 className="headline mt-5 text-[clamp(36px,5vw,64px)] text-silver">Delivered the way your team already works.</h2>
              <p className="mt-6 text-[clamp(17px,1.6vw,20px)] leading-relaxed text-ink-2 max-w-[54ch]">
                Subscribe to an app, pull from an API, or have us stand up a data service for your region and your risk.
              </p>
            </Reveal>

            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {modes.map((m, i) => (
                <Reveal key={m.h} delay={i * 0.06}>
                  <div className="border-t border-white/[0.12] pt-5">
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-white">{m.h}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{m.p}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1} className="min-w-0">
            <Tilt max={6}>
              <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                <div className="window rounded-[22px] overflow-hidden" style={{ ["--glow" as string]: "rgba(34,211,238,0.35)" }}>
                  <div className="flex items-center gap-2 px-4 h-10 border-b border-white/[0.07] bg-white/[0.02]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    <span className="ml-3 font-mono text-[11px] text-ink-2"><span className="text-[#5eead4]">POST</span> /v1/vulnerability</span>
                    <span className="ml-auto font-mono text-[10px] text-[#28c840]">200 OK</span>
                  </div>
                  <pre className="p-5 sm:p-6 font-mono text-[11.5px] sm:text-[12.5px] leading-[1.9] text-[#cfd6e4] overflow-x-auto">
{"{\n"}  <K>&quot;archetype&quot;</K>: <S>&quot;US.RES.SF.WOOD.1STORY.SLAB&quot;</S>,{"\n"}  <K>&quot;depth_m&quot;</K>: <N>0.55</N>,{"\n"}  <K>&quot;damage_ratio&quot;</K>: {"{"}{"\n"}    <K>&quot;mean&quot;</K>: <N>0.184</N>,{"\n"}    <K>&quot;p10&quot;</K>: <N>0.03</N>,  <K>&quot;p90&quot;</K>: <N>0.49</N>,{"\n"}    <K>&quot;p_exceed_50&quot;</K>: <N>0.094</N>{"\n"}  {"}"},{"\n"}  <K>&quot;calibration_level&quot;</K>: <S>&quot;G3&quot;</S>,{"\n"}  <K>&quot;in_domain&quot;</K>: <N>true</N>,{"\n"}  <K>&quot;model_version&quot;</K>: <S>&quot;1.0.0&quot;</S>{"\n"}{"}"}
                  </pre>
                </div>
                <div className="chip-3d floaty hidden sm:block absolute sm:-right-8 -bottom-7 rounded-2xl px-4 py-3 pointer-events-none" style={{ transform: "translateZ(90px)" }}>
                  <span className="block text-[12.5px] font-semibold text-white">Pin the version.</span>
                  <span className="block text-[10.5px] text-ink-2 mt-0.5">The result reproduces next year.</span>
                </div>
              </div>
            </Tilt>
            <p className="mt-10 text-center text-[11.5px] text-ink-3">Illustrative response from the FloodVuln engine.</p>
          </Reveal>
        </div>

        {/* numbers */}
        <Reveal className="mt-24 sm:mt-32">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-[30px] overflow-hidden bg-white/[0.08] border border-white/[0.08]">
            {[
              { v: "1.86M", k: "insurance claims modelled" },
              { v: "1 km", k: "daily national air-quality grid" },
              { v: "4,483", k: "locally calibrated risk units" },
              { v: "10+", k: "open data sources fused" },
            ].map((s) => (
              <div key={s.k} className="bg-[#0a0a0c] px-6 py-10 sm:py-12 text-center">
                <dt className="display text-[clamp(34px,4.6vw,60px)] text-brand">{s.v}</dt>
                <dd className="mt-3 text-[13.5px] text-ink-2">{s.k}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
