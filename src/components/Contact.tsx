"use client";

import { Section } from "./Section";
import { Mail, ArrowUpRight, Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EMAIL, socialLinks } from "@/lib/site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <Section id="contact" className="bg-transparent">
      <div className="space-y-8 sm:space-y-12">
        <div className="space-y-4 sm:text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
            Get In Touch
          </p>
          <h2 className="text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            CONTACT <span className="text-[var(--color-brand-blue)]">ME</span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-gray-400 sm:mx-auto sm:text-lg">
            Open to collaborations, freelance work, and developer opportunities.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                  Primary Contact
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Let&apos;s Build Something Thoughtful
                </h3>
                <p className="max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
                  Best way to reach me is through email for project inquiries,
                  collaboration, or opportunities.
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--color-brand-blue)]/30 bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]">
                <Mail className="h-5 w-5" />
              </div>
            </div>

            {/* Phones get the two actions as full-height buttons side by side;
                larger screens keep the address and actions on one row. */}
            <div className="mt-7 space-y-4 sm:mt-8 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:space-y-0">
              <a
                href={`mailto:${EMAIL}`}
                className="block truncate text-lg font-semibold text-white transition-colors hover:text-[var(--color-brand-blue)] sm:text-xl"
              >
                {EMAIL}
              </a>

              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2.5 sm:flex sm:shrink-0 sm:items-center">
                <motion.a
                  href={`mailto:${EMAIL}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-brand-blue)] px-5 text-xs font-bold uppercase tracking-[0.18em] text-black sm:order-2 sm:h-11"
                >
                  Send Email
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </motion.a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-300 transition-colors hover:border-[var(--color-brand-blue)]/40 hover:text-white active:bg-white/10 sm:order-1 sm:h-11"
                  aria-label={copied ? "Email copied" : "Copy email address"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-[var(--color-brand-blue)]" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
                <span role="status" className="sr-only">
                  {copied ? "Email address copied to clipboard" : ""}
                </span>
              </div>
            </div>
          </motion.div>

          {/* On phones the links sit directly in the page (no card around
              the cards); from sm up they get their own panel. */}
          <div className="sm:rounded-[2rem] sm:border sm:border-white/10 sm:bg-white/[0.03] sm:p-8">
            <div className="mb-4 space-y-2 sm:mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">
                Socials
              </p>
              <p className="text-sm leading-relaxed text-gray-400">
                Connect through the platforms below.
              </p>
            </div>

            <div className="space-y-3">
              {socialLinks.map((item) => {
                const SocialIcon = item.Icon;

                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 6 }}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-[var(--color-brand-blue)]/35 hover:bg-[var(--color-brand-blue)]/5 active:bg-[var(--color-brand-blue)]/10 sm:bg-black/20 sm:py-4"
                    aria-label={item.label}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[var(--color-brand-blue)]">
                        <SocialIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-400">{item.value}</p>
                      </div>
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-gray-500" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
