"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 lg:px-10 xl:px-12",
        className,
      )}
    >
      <div className="mx-auto w-full max-w-[1440px]">
        {children}
      </div>
    </motion.section>
  );
}
