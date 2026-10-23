"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// reducedMotion="user" makes every Motion animation honour the OS "reduce
// motion" setting: transforms are skipped, opacity fades still play.
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
