"use client";

import { motion } from "framer-motion";

const services = [
  {
    title: "Autonomous Research Platforms",
    description:
      "We build GenAI systems that automate the full research lifecycle — literature review, hypothesis generation, data analysis, and manuscript drafting — with human-in-the-loop oversight at every stage.",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z",
    features: ["LLM-powered literature synthesis", "Multi-agent research pipelines", "Human-in-the-loop validation", "Knowledge graph generation"],
    border: "border-purple-500/20",
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    solid: "#1a0a2e",
    gradient: "from-purple-500/30 to-purple-600/5",
  },
  {
    title: "Quantum-Informed Computing",
    description:
      "We develop quantum-informed algorithms that bring quantum paradigms into classical ML pipelines for geospatial optimization, spatial regression, and combinatorial problems.",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    features: ["Quantum spatial regression", "Hybrid quantum-classical optimization", "Quantum feature maps", "GIS stack integration"],
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    solid: "#0a1a2e",
    gradient: "from-cyan-500/30 to-cyan-600/5",
  },
  {
    title: "Urban Informatics & Smart Cities",
    description:
      "We fuse massive mobility datasets, IoT sensor networks, and computer vision to decode the pulse of cities — pedestrian flows, traffic, environmental health, and infrastructure assessment.",
    icon: "M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z",
    features: ["Billion-scale mobility analytics", "Real-time sensor dashboards", "Street-level computer vision", "Wearable exposure mapping"],
    border: "border-blue-500/20",
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    solid: "#0a102e",
    gradient: "from-blue-500/30 to-blue-600/5",
  },
  {
    title: "AI Career Consulting & Education",
    description:
      "AI-powered career consulting for students navigating academic and industry pathways. Personalized career route mapping, AI skill-gap analysis, and labor-market intelligence.",
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    features: ["Career pathway mapping", "AI skill-gap analysis", "Job market forecasting", "Grad program matching"],
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    solid: "#0a1e1a",
    gradient: "from-emerald-500/30 to-emerald-600/5",
  },
  {
    title: "GenAI for African Education",
    description:
      "Empowering teachers and students across Africa to produce high-quality teaching materials using generative AI, addressing educational inequity and expanding access to learning resources.",
    icon: "M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418",
    features: ["AI content in local languages", "Curriculum-aligned K-12 tools", "Train-the-trainer programs", "Offline-capable solutions"],
    border: "border-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
    solid: "#1e1a0a",
    gradient: "from-amber-500/30 to-amber-600/5",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-32 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-medium tracking-wider uppercase mb-6 backdrop-blur-sm bg-white/[0.02]">
            What We Do
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Our{" "}
            <span className="bg-[linear-gradient(135deg,#06b6d4,#818cf8)] bg-clip-text text-transparent">
              Core Services
            </span>
          </h2>
        </motion.div>

        {/* top row: 3 cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-5">
          {services.slice(0, 3).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div
                className={`h-full rounded-2xl border ${s.border} overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1`}
                style={{ background: s.solid }}
              >
                <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
                <div className="p-6">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                    <svg className={`w-5.5 h-5.5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.description}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className={`w-3.5 h-3.5 ${s.text} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* bottom row: 2 cards centered */}
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {services.slice(3).map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="group"
            >
              <div
                className={`h-full rounded-2xl border ${s.border} overflow-hidden hover:shadow-2xl hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1`}
                style={{ background: s.solid }}
              >
                <div className={`h-1 bg-gradient-to-r ${s.gradient}`} />
                <div className="p-6">
                  <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                    <svg className={`w-5.5 h-5.5 ${s.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.description}</p>
                  <ul className="space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg className={`w-3.5 h-3.5 ${s.text} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
