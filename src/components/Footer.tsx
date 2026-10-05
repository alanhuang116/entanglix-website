import Logo from "./Logo";

const cols = [
  {
    h: "Products",
    links: [
      { label: "Research Architect", href: "https://researcharchitect.ai/" },
      { label: "FloodVuln Global", href: "https://claude.ai/code/artifact/c6c2864e-28fc-4c15-ac57-f6cb2e50c93f" },
      { label: "WildfireVuln", href: "https://alanhuang116.github.io/wildfirevuln/" },
      { label: "HurricaneVuln", href: "https://alanhuang116.github.io/hurricanevuln/" },
      { label: "GH-PM25 Observatory", href: "https://alanhuang116.github.io/ghana-pm25/" },
    ],
  },
  {
    h: "Platform",
    links: [
      { label: "The stack", href: "#platform" },
      { label: "Agent collection", href: "#agents" },
      { label: "Data services", href: "#data" },
    ],
  },
  {
    h: "Company",
    links: [
      { label: "About", href: "#company" },
      { label: "Contact", href: "#contact" },
      { label: "info@entanglix.tech", href: "mailto:info@entanglix.tech" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050506]">
      <div className="max-w-[1180px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          <div className="col-span-2 md:col-span-1">
            <a href="#" aria-label="Entanglix — home"><Logo /></a>
            <p className="mt-5 text-[13.5px] leading-relaxed text-ink-3 max-w-[32ch]">
              Data-driven SaaS, data services and AI agents for research, climate risk and the environment.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.h}>
              <h4 className="text-[12px] font-semibold text-white/90 mb-4">{c.h}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-[13px] text-ink-3 hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-2 justify-between text-[12px] text-ink-3">
          <p>&copy; {new Date().getFullYear()} Entanglix Tech. All rights reserved.</p>
          <p>Atlanta, Georgia, USA</p>
        </div>
      </div>
    </footer>
  );
}
