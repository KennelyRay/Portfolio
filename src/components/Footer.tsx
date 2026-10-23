"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Check, Copy, Heart } from "lucide-react";
import { EMAIL as email } from "@/lib/site";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "Works", href: "#works" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const [copied, setCopied] = useState(false);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <footer className="w-full border-t border-gray-800 bg-[#050505]">
      <div className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-10 xl:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
            <motion.a
              href="#home"
              whileHover={{ y: -2 }}
              className="inline-flex items-center gap-2 text-2xl font-black tracking-tighter text-white transition-colors duration-300 hover:text-[var(--color-brand-blue)]"
              aria-label="Back to home"
            >
              KR<span className="text-[var(--color-brand-blue)]">.</span>
            </motion.a>

            <p className="max-w-md text-sm font-medium leading-relaxed text-gray-500">
              Building digital experiences with clean interfaces, thoughtful
              motion, and a focus on clarity.
            </p>

            {/* Below xl the bottom tab bar already lists every section. */}
            <div className="hidden flex-wrap items-center justify-start gap-2 xl:flex">
              {quickLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full border border-gray-800 bg-[#0b0b0b] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400 transition-colors duration-300 hover:border-[var(--color-brand-blue)]/40 hover:text-white"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row lg:flex-col">
            <motion.button
              onClick={handleCopyEmail}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-800 bg-[#0b0b0b] h-12 px-4 text-[11px] sm:h-auto sm:py-3 font-semibold uppercase tracking-[0.22em] text-gray-300 transition-colors duration-300 hover:border-[var(--color-brand-blue)]/40 hover:text-white"
              aria-label={copied ? "Email copied" : "Copy email address"}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-[var(--color-brand-blue)]" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Email Copied" : "Copy Email"}
            </motion.button>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -2, backgroundColor: "var(--color-brand-blue)", color: "#050505" }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-800 bg-[#111] h-12 px-4 text-[11px] sm:h-auto sm:py-3 font-semibold uppercase tracking-[0.22em] text-gray-300"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Back To Top
            </motion.button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800/50 pt-8 text-center text-xs font-semibold uppercase tracking-widest text-gray-600 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} KENNELY RAY. ALL RIGHTS RESERVED.</p>
          <motion.p
            whileHover={{ color: "#9ca3af" }}
            className="flex items-center gap-1.5"
          >
            Designed & Built With{" "}
            <Heart className="h-3.5 w-3.5 fill-[var(--color-brand-blue)] text-[var(--color-brand-blue)]" />
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
