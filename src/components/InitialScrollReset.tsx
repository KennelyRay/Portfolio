"use client";

import { useEffect } from "react";

export function InitialScrollReset() {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    const resetScroll = () => {
      window.scrollTo(0, 0);
    };

    resetScroll();
    const frameId = window.requestAnimationFrame(resetScroll);
    const timeoutId = window.setTimeout(resetScroll, 120);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return null;
}
