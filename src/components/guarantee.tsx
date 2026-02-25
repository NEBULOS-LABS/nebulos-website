"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";
import { Shield, Code2, KeyRound, ArrowRight } from "lucide-react";

/* ─── Animated Counter ───────────────────────────────────────────── */

function Counter({
  value,
  suffix = "",
  active,
}: {
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const animated = useRef(false);

  useEffect(() => {
    if (!active || animated.current) return;
    animated.current = true;

    const start = performance.now();
    const duration = 2200;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out
      setDisplay(Math.floor(eased * value));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <>
      {display}
      {suffix}
    </>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */

const guarantees = [
  {
    icon: Shield,
    title: "Sprint-Back Promise",
    description:
      "Review working software every 14 days. If a sprint misses the mark, you pay nothing for it — no questions, no process, no fine print.",
    gradient: "from-[#9900ff] to-[#ff00ff]",
    glow: "#9900ff",
  },
  {
    icon: Code2,
    title: "Lifetime Code Warranty",
    description:
      "Found a bug six months post-launch? Two years? We fix it. Free. Forever. Your codebase stays bulletproof for life.",
    gradient: "from-[#00eeff] to-[#9900ff]",
    glow: "#00eeff",
  },
  {
    icon: KeyRound,
    title: "Your Code From Day One",
    description:
      "Every line, every asset, every commit — 100% yours from the first push. No lock-in, no licensing games, no strings.",
    gradient: "from-[#ff00ff] to-[#00eeff]",
    glow: "#ff00ff",
  },
];

const stats = [
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 2, suffix: "", label: "Refunds in History" },
  { value: 98, suffix: "%", label: "Sprint Approval" },
];

/* Card cascade offsets (desktop only) */
const offsets = ["lg:ml-0", "lg:ml-8", "lg:ml-16"];

/* ─── Component ──────────────────────────────────────────────────── */

export default function Guarantee() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.6 });

  /* Background parallax */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={sectionRef}
      id="guarantee"
      className="relative bg-black overflow-hidden py-20 lg:py-32"
    >
      {/* ── Background ───────────────────────────────────────────── */}
      <motion.div
        variants={{
          hidden: { scaleX: 0 },
          show: {
            scaleX: 1,
            transition: { duration: 1.2, ease: "easeOut" },
          },
        }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"
      />

      <motion.div
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#9900ff]/10 blur-[150px] rounded-full pointer-events-none"
        style={{ y: orbY1 }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-[#00eeff]/10 blur-[120px] rounded-full pointer-events-none"
        style={{ y: orbY2 }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.08, 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
        >
          {/* ── Overline ─────────────────────────────────────────── */}
          <motion.div variants={fadeIn("up", 0)} className="mb-6 lg:mb-8">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-gray-400 uppercase">
              Our Guarantee
            </span>
          </motion.div>

          {/* ── Grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* ── Left column ────────────────────────────────────── */}
            <div className="lg:col-span-5">
              <motion.h2
                variants={fadeIn("up", 0.08)}
                className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] mb-6"
              >
                You Don&apos;t Pay{" "}
                <br className="hidden sm:block" />
                Unless We{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#ff00ff]">
                  Deliver.
                </span>
              </motion.h2>

              <motion.p
                variants={fadeIn("up", 0.16)}
                className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md"
              >
                Every sprint is approval-gated. If the work doesn&apos;t meet
                your standards, the invoice disappears. That&apos;s not a
                slogan&nbsp;— it&apos;s how we&apos;ve operated across{" "}
                <span className="text-white font-medium">
                  120+ engagements
                </span>
                .
              </motion.p>

              {/* Stats */}
              <motion.div
                ref={statsRef}
                variants={fadeIn("up", 0.24)}
                className="grid grid-cols-3 gap-4 lg:gap-6"
              >
                {stats.map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl sm:text-4xl font-bold gradient-text">
                      <Counter
                        value={s.value}
                        suffix={s.suffix}
                        active={statsInView}
                      />
                    </div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mt-1.5 tracking-wide uppercase">
                      {s.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right column — Cards ───────────────────────────── */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {guarantees.map((g, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: 40,
                      filter: "blur(8px)",
                    },
                    show: {
                      opacity: 1,
                      x: 0,
                      filter: "blur(0px)",
                      transition: {
                        type: "tween",
                        duration: 0.7,
                        delay: 0.2 + i * 0.12,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                    },
                  }}
                  className={offsets[i]}
                >
                  <motion.div
                    whileHover={{
                      y: -6,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      },
                    }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-sm cursor-default transition-colors duration-300 hover:border-white/[0.15] hover:bg-white/[0.04]"
                  >
                    {/* Left accent bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${g.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
                    />

                    {/* Step number */}
                    <div className="absolute top-5 right-5 text-[10px] font-mono text-white/[0.12] tracking-widest select-none">
                      0{i + 1}
                    </div>

                    <div className="flex items-start gap-4 p-5 sm:p-6 lg:p-7">
                      {/* Icon container */}
                      <div
                        className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${g.gradient} p-px`}
                      >
                        <div className="w-full h-full rounded-[11px] bg-[#0a0a0a] flex items-center justify-center">
                          <g.icon className="w-5 h-5 text-white/80" />
                        </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0 pr-6">
                        <h3 className="text-[17px] font-semibold text-white mb-1.5 tracking-tight">
                          {g.title}
                        </h3>
                        <p className="text-[15px] text-gray-400 leading-relaxed">
                          {g.description}
                        </p>
                      </div>

                      {/* Decorative large icon (visual weight) */}
                      <div className="hidden md:flex flex-shrink-0 w-16 lg:w-20 items-center justify-center self-center">
                        <g.icon
                          className="w-12 h-12 lg:w-14 lg:h-14 text-white/[0.03] group-hover:text-white/[0.07] transition-colors duration-500"
                          strokeWidth={1}
                        />
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div
                      className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                      style={{ background: g.glow }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── CTA ──────────────────────────────────────────────── */}
          <motion.div
            variants={fadeIn("up", 0.5)}
            className="text-center mt-16 lg:mt-20"
          >
            <a href="#contact" className="btn-primary-lg inline-block">
              <span className="relative z-10 inline-flex items-center gap-2">
                Start Risk-Free
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
