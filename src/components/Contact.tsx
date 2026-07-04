"use client";

import { Section } from "./Section";
import { Mail, Github, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const socialLinks = [
  {
    Icon: Github,
    href: "https://github.com/KennelyRay",
    label: "GitHub",
    value: "@KennelyRay",
  },
  {
    Icon: Linkedin,
    href: "https://www.linkedin.com/in/kennely-ray-bucang-b432a710b/",
    label: "LinkedIn",
    value: "Kennely Ray Bucang",
  },
  {
    Icon: Instagram,
    href: "http://instagram.com/kennn.dev/",
    label: "Instagram",
    value: "@kennn.dev",
  },
];

export function Contact() {
  return (
    <Section id="contact" className="bg-transparent">
      <div className="space-y-12">
        <div className="space-y-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)]">
            Get In Touch
          </p>
          <h2 className="text-4xl font-bold tracking-tight uppercase sm:text-6xl">
            CONTACT <span className="text-[var(--color-brand-blue)]">ME</span>
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
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

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="mailto:krbucang@gmail.com"
                className="text-lg font-semibold text-white transition-colors hover:text-[var(--color-brand-blue)] sm:text-xl"
              >
                krbucang@gmail.com
              </a>

              <motion.a
                href="mailto:krbucang@gmail.com"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-brand-blue)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-black transition-transform duration-300"
              >
                Send Email
                <ArrowUpRight className="h-3.5 w-3.5" />
              </motion.a>
            </div>
          </motion.div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-6 space-y-2">
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
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition-colors hover:border-[var(--color-brand-blue)]/35 hover:bg-[var(--color-brand-blue)]/5"
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
