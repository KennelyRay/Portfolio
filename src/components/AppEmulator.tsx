"use client";

import { useEffect, useRef } from "react";
import { Smartphone } from "lucide-react";
import type { Project } from "@/lib/projects";

/**
 * A mobile app streamed from an Appetize emulator. Unlike LivePreview this
 * frame is interactive, because the app does nothing until someone taps it.
 * The frame takes the device's proportions so Appetize's own white page never
 * shows around the phone, and nothing streams until the visitor presses play
 * (autoplay=false in the link), so browsing past the card costs no minutes.
 */
export function AppEmulator({
  url,
  title,
  onEngage,
}: {
  // The project's Appetize embed link, with scale=auto so the device fits.
  url: string;
  title: string;
  // Fires once the visitor clicks into the emulator, so the carousel can stop
  // auto-advancing and tearing down their session.
  onEngage?: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Clicks inside a cross-origin frame never reach this page, but focusing
    // the frame blurs the window, and activeElement then points at it.
    const onBlur = () => {
      if (document.activeElement === frameRef.current) {
        onEngage?.();
      }
    };

    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
  }, [onEngage]);

  return (
    <div className="absolute inset-0 flex justify-center bg-[#05101b] py-4">
      <iframe
        ref={frameRef}
        src={url}
        title={`${title} live demo`}
        loading="lazy"
        allow="clipboard-write"
        // Pixel 7 frame proportions, as Appetize draws it; the rounding clips
        // the white page peeking past the device's corners.
        className="aspect-[378/800] h-full rounded-[1.5rem] border-0"
      />
    </div>
  );
}

/**
 * Stand-in for an emulator that isn't run inline: on phones, where a phone
 * inside a card is too small to use, and wherever embedding is switched off.
 * The card's project link opens the emulator full screen.
 */
export function EmulatorPoster() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_45%,rgba(0,168,255,0.14),transparent_65%)] px-6 text-center">
      <Smartphone className="h-12 w-12 text-[var(--color-brand-blue)]/70" />
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-gray-300">
        Runs in an Android emulator
      </p>
      <p className="max-w-[16rem] text-xs leading-relaxed text-gray-400">
        Open the project to try it full screen.
      </p>
    </div>
  );
}

export function DemoLogin({ login }: { login: NonNullable<Project["demoLogin"]> }) {
  return (
    <p className="text-xs leading-relaxed text-gray-400">
      Demo login:{" "}
      <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-gray-200">
        {login.email}
      </code>{" "}
      /{" "}
      <code className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-gray-200">
        {login.password}
      </code>
    </p>
  );
}
