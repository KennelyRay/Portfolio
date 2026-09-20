"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { hasLoaded, onLoaded } from "@/lib/loading-signal";
import { projectCount } from "./Works";

const EASE = [0.16, 1, 0.3, 1] as const;

const stage: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

// The headline is the focal point, so it gets the one expensive gesture:
// each line rides up from behind its own clipping mask.
const maskedLine: Variants = {
  hidden: { y: "118%" },
  visible: { y: "0%", transition: { duration: 1.05, ease: EASE } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const NAME = "KENNELY RAY";

const MAGNET_SPRING = { stiffness: 220, damping: 16, mass: 0.45 } as const;

/**
 * CTA that leans toward the cursor while it is nearby. The pull is the reward
 * for approaching the one action the hero is asking for; it settles back to
 * centre on exit, on blur, and whenever the visitor prefers reduced motion.
 */
function MagneticCta({
  href,
  children,
  tone,
}: {
  href: string;
  children: ReactNode;
  tone: "solid" | "ghost";
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNET_SPRING);
  const springY = useSpring(y, MAGNET_SPRING);

  const pull = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.26);
    y.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.34);
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      variants={rise}
      onMouseMove={pull}
      onMouseLeave={release}
      onBlur={release}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      className={[
        "group relative inline-flex items-center justify-center rounded-full px-7 py-4 text-center text-sm font-bold tracking-wide transition-colors duration-300 sm:px-9 sm:text-base",
        tone === "solid"
          ? "bg-[var(--color-brand-blue)] text-black hover:bg-white"
          : "border border-white/20 text-white hover:border-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue)]",
      ].join(" ")}
    >
      {children}
    </motion.a>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Hold the reveal until the boot screen lifts, with a timed fallback so the
  // hero still appears if the loader is ever removed or fails to finish.
  const [revealed, setRevealed] = useState(() => hasLoaded());

  useEffect(() => {
    const unsubscribe = onLoaded(() => setRevealed(true));
    const fallback = window.setTimeout(() => setRevealed(true), 4500);

    return () => {
      unsubscribe();
      window.clearTimeout(fallback);
    };
  }, []);

  // Layered parallax: the hero recedes as you leave it, handing off to Works.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.955]);
  const railY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Scroll speed reads as deformation, the way a car leans under load. Capped
  // small so it registers as weight rather than a broken transform.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, {
    stiffness: 320,
    damping: 46,
    mass: 0.4,
  });
  const skew = useTransform(smoothVelocity, [-2400, 2400], [2.2, -2.2], {
    clamp: true,
  });

  const animateState = revealed ? "visible" : "hidden";

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[100svh] scroll-mt-24 items-center px-4 pb-32 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-10 xl:px-12"
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity, scale: contentScale }
        }
        className="mx-auto w-full max-w-[1440px] origin-top"
      >
        <motion.div
          variants={stage}
          initial="hidden"
          animate={animateState}
          className="flex w-full max-w-5xl flex-col items-start gap-6 text-left sm:gap-9"
        >
          <motion.p
            variants={fade}
            aria-label={NAME}
            className="flex font-mono text-xs font-bold uppercase tracking-[0.35em] text-[var(--color-brand-blue)] sm:text-sm"
          >
            {NAME.split("").map((character, index) => (
              <motion.span
                key={`${character}-${index}`}
                aria-hidden="true"
                initial={{ opacity: 0, y: -8 }}
                animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + index * 0.035,
                  ease: EASE,
                }}
                className={character === " " ? "w-[0.35em]" : undefined}
              >
                {character === " " ? " " : character}
              </motion.span>
            ))}
          </motion.p>

          <motion.h1
            style={reduceMotion ? undefined : { skewY: skew }}
            className="text-[2.6rem] font-bold uppercase leading-[0.92] tracking-tighter text-white sm:text-7xl xl:text-8xl"
          >
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={maskedLine} className="block">
                I build
              </motion.span>
            </span>
            {/* Staircase indent: the two lines read as one gesture, not a stack. */}
            <span className="block overflow-hidden pb-[0.06em] sm:ml-14 xl:ml-24">
              <motion.span
                variants={maskedLine}
                className="block text-[var(--color-brand-blue)]"
              >
                web experiences.
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-2xl"
          >
            I&apos;m Kennely Ray, a full stack web developer. I build both sides
            of the product: the internal systems a company runs on, and the
            customer facing platforms its users touch.
          </motion.p>

          <motion.div
            variants={rise}
            className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <MagneticCta href="#works" tone="solid">
              See all {projectCount} projects
            </MagneticCta>
            <MagneticCta href="#contact" tone="ghost">
              Start a project
            </MagneticCta>
          </motion.div>
        </motion.div>

        {/* Telemetry readout: the boot screen's mono voice, carrying real work
            rather than adjectives. */}
        <motion.div
          style={reduceMotion ? undefined : { y: railY }}
          variants={fade}
          initial="hidden"
          animate={animateState}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-8 max-w-3xl border-t border-white/10 pt-5 sm:mt-16"
        >
          <p className="font-mono text-[11px] leading-relaxed tracking-[0.18em] text-gray-400 sm:text-xs">
            <span className="text-[var(--color-brand-blue)]">RECENT BUILDS</span>
            {" / "}
            HR AND ATTENDANCE / GOVERNMENT CASHFLOW / HARDWARE E-COMMERCE /
            FLIGHT AND CAR RENTAL BOOKING
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
