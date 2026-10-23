"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Opacity and translate only. The reveal used to animate filter: blur() and
// scale on the whole section, which forced every frame to re-rasterise a
// viewport-sized layer (live iframes included) and was the main scroll hitch.
export function Section({ children, className, id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -16% 0px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "scroll-mt-24 flex min-h-[auto] items-center justify-center px-4 py-12 sm:min-h-screen sm:py-20 sm:px-6 lg:px-10 xl:px-12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1440px]">{children}</div>
    </motion.section>
  );
}
