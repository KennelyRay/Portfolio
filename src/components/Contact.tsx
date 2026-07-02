"use client";

import { Section } from "./Section";
import { Mail, Github, Linkedin, Instagram } from "lucide-react";
import { motion } from "framer-motion";

export function Contact() {
  return (
    <Section id="contact" className="bg-transparent">
      <div className="text-center space-y-12">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight uppercase">
          CONTACT <span className="text-[var(--color-brand-blue)]">ME</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Ready to start your next project or just want to say hi? 
          Drop me an email or connect on social media.
        </p>
        
        <motion.a
          href="mailto:krbucang@gmail.com"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:bg-[var(--color-brand-blue)] hover:text-white transition-colors duration-300"
        >
          <Mail className="w-6 h-6" />
          krbucang@gmail.com
        </motion.a>
        
        <div className="flex items-center justify-center gap-6 mt-12">
          {[
            { Icon: Github, href: "https://github.com/KennelyRay", label: "GitHub" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/kennely-ray-bucang-b432a710b/", label: "LinkedIn" },
            { Icon: Instagram, href: "http://instagram.com/kennn.dev/", label: "Instagram" },
          ].map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: "var(--color-brand-blue)" }}
              className="p-4 bg-[#111] rounded-full text-gray-400 hover:text-[var(--color-brand-blue)] transition-colors"
              aria-label={item.label}
            >
              <item.Icon className="w-6 h-6" />
            </motion.a>
          ))}
        </div>
      </div>
    </Section>
  );
}
