"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import Reveal from "./Reveal";

type FormStatus = "idle" | "sending" | "success" | "error";

const field =
  "w-full px-4 h-12 bg-white/[0.04] border border-white/[0.1] rounded-[14px] text-white text-[15px] placeholder-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] focus:outline-none focus:border-[#4f7cff]/70 focus:ring-4 focus:ring-[#4f7cff]/15 transition-all disabled:opacity-50";
const label = "block text-[12.5px] font-medium text-ink-2 mb-2";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/xiao.huang@entanglix.tech", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = await res.json();

      if (json.success === "true" || json.success === true) {
        setStatus("success");
        form.reset();
      } else {
        setErrorMsg(json.message || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <section id="contact" className="relative py-28 sm:py-40 overflow-hidden">
      <div className="aurora animate-drift w-[700px] h-[700px] -bottom-72 left-1/2 -translate-x-[90%] bg-[#22d3ee]/15" aria-hidden />
      <div className="aurora animate-drift-slow w-[700px] h-[700px] -bottom-72 left-1/2 translate-x-[0%] bg-[#8b5cf6]/20" aria-hidden />

      <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <Reveal className="px-2 lg:pt-10">
            <span className="eyebrow text-ink-3">Contact</span>
            <h2 className="headline mt-5 text-[clamp(40px,5.6vw,72px)]">
              <span className="text-silver">Let&apos;s put your data</span>{" "}
              <span className="text-brand">to work.</span>
            </h2>
            <p className="mt-6 text-[clamp(17px,1.6vw,20px)] leading-relaxed text-ink-2 max-w-[46ch]">
              Request a demo, start a pilot, or tell us about a problem none of our products solves yet.
            </p>

            <dl className="mt-12 space-y-6">
              {[
                { k: "Email", v: "info@entanglix.tech", href: "mailto:info@entanglix.tech" },
                { k: "Web", v: "entanglix.tech", href: "https://entanglix.tech" },
                { k: "Based in", v: "Atlanta, Georgia, USA", href: null },
              ].map((item) => (
                <div key={item.k} className="flex items-baseline gap-6 border-t border-white/[0.08] pt-5">
                  <dt className="w-20 text-[12px] font-mono uppercase tracking-widest text-ink-3">{item.k}</dt>
                  <dd className="text-[17px] text-white tracking-[-0.01em]">
                    {item.href ? <a href={item.href} className="hover:text-[#7da2ff] transition-colors">{item.v}</a> : item.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-[32px] p-6 sm:p-9 min-h-[560px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.4 }}
                    className="text-center py-8 w-full"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                      className="w-20 h-20 mx-auto mb-7 rounded-full bg-gradient-to-b from-[#34d399] to-[#059669] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_20px_40px_-12px_#10b981] flex items-center justify-center"
                    >
                      <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    </motion.div>
                    <h3 className="text-[28px] font-semibold tracking-[-0.03em] text-white mb-3">Message sent.</h3>
                    <p className="text-ink-2 mb-8 max-w-sm mx-auto">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setStatus("idle")} className="btn btn-ghost">Send another message</button>
                  </motion.div>
                )}

                {status !== "success" && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="w-full"
                  >
                    {/* Formsubmit config */}
                    <input type="hidden" name="_subject" value="New message from Entanglix.tech" />
                    <input type="hidden" name="_template" value="table" />
                    <input type="hidden" name="_captcha" value="false" />
                    {/* Honeypot */}
                    <input type="text" name="_honey" className="hidden" style={{ display: "none" }} />

                    <div className="space-y-5">
                      <AnimatePresence>
                        {status === "error" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            role="alert"
                            className="rounded-[14px] bg-red-500/10 border border-red-500/25 px-4 py-3"
                          >
                            <p className="text-red-300 text-sm font-medium">Failed to send</p>
                            <p className="text-red-300/70 text-xs mt-0.5">{errorMsg}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className={label}>Name</label>
                          <input type="text" id="name" name="name" required placeholder="Your name" disabled={sending} className={field} />
                        </div>
                        <div>
                          <label htmlFor="email" className={label}>Work email</label>
                          <input type="email" id="email" name="email" required placeholder="you@company.com" disabled={sending} className={field} />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="organization" className={label}>Organization</label>
                          <input type="text" id="organization" name="organization" placeholder="Company or institution" disabled={sending} className={field} />
                        </div>
                        <div>
                          <label htmlFor="interest" className={label}>Interested in</label>
                          <select id="interest" name="interest" defaultValue="General enquiry" disabled={sending} className={`${field} appearance-none [&>option]:text-black`}>
                            <option>General enquiry</option>
                            <option>Research Architect</option>
                            <option>FloodVuln Global</option>
                            <option>GH-PM25 Observatory</option>
                            <option>Custom data service or agent</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className={label}>Message</label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          placeholder="Tell us what you are trying to decide…"
                          disabled={sending}
                          className={`${field} !h-auto py-3.5 resize-none`}
                        />
                      </div>

                      <button type="submit" disabled={sending} className="btn btn-primary w-full !h-[52px] !text-[16px] disabled:opacity-70 disabled:hover:transform-none">
                        {sending ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          "Send message"
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
