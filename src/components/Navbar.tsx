"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const navLinks = [
  { href: "#products", label: "Products" },
  { href: "#platform", label: "Platform" },
  { href: "#agents", label: "Agents" },
  { href: "#data", label: "Data Services" },
  { href: "#company", label: "Company" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto max-w-[1080px] rounded-[22px] transition-all duration-500 ${
          scrolled || mobileOpen
            ? "bg-[#161618]/75 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_-20px_rgba(0,0,0,0.9)]"
            : "bg-transparent border border-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-[54px] pl-5 pr-2.5">
          <a href="#" aria-label="Entanglix — home"><Logo /></a>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-[13px] text-white/70 hover:text-white transition-colors duration-200 tracking-[-0.01em]">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <a href="#contact" className="hidden md:inline-flex btn btn-primary !h-9 !px-4 !text-[13px]">Talk to us</a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden flex flex-col gap-[5px] p-3" aria-label="Toggle menu" aria-expanded={mobileOpen}>
              <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-[1.5px] bg-white transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 flex flex-col">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="py-3 text-[17px] font-medium text-white/85 border-b border-white/[0.07]">
                    {link.label}
                  </a>
                ))}
                <a href="#contact" onClick={() => setMobileOpen(false)} className="btn btn-primary mt-5">Talk to us</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
