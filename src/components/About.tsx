"use client";

import Reveal from "./Reveal";

const sectors = [
  { h: "Banks & lenders", p: "Climate-risk views on collateral and portfolios." },
  { h: "Insurers & reinsurers", p: "Vulnerability, pricing and model validation." },
  { h: "Development agencies", p: "National environmental data where monitoring is sparse." },
  { h: "Research institutions", p: "Human–AI collaboration for study design." },
];

export default function About() {
  return (
    <section id="company" className="relative py-28 sm:py-40 border-t border-white/[0.06]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <span className="eyebrow text-ink-3">Company</span>
          <p className="headline mt-8 text-[clamp(28px,4.2vw,54px)] max-w-[22ch] sm:max-w-none text-white">
            Entanglix is named for quantum entanglement — two things that cannot be described apart.{" "}
            <span className="text-ink-3">For us, those are data and intelligence. We build software where neither works without the other.</span>
          </p>
        </Reveal>

        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {sectors.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.06}>
              <div className="border-t border-white/[0.12] pt-5">
                <span className="text-[11px] font-mono text-ink-3">0{i + 1}</span>
                <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-white">{s.h}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
