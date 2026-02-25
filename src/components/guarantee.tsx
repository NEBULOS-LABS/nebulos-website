"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Shield, Code2, KeyRound, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ─── Animated Counter (rAF, cubic ease-out) ─────────────────────── */

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
      const eased = 1 - Math.pow(1 - t, 3);
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

/* ─── Data ────────────────────────────────────────────────────────── */

const guarantees = [
  {
    icon: Shield,
    title: "Sprint-Back Promise",
    description:
      "Review working software every 14 days. If a sprint misses the mark, you pay nothing for it — no questions, no process, no fine print.",
    gradient: "from-[#9900ff] to-[#ff00ff]",
    glowColor: "#9900ff",
  },
  {
    icon: Code2,
    title: "Lifetime Code Warranty",
    description:
      "Found a bug six months post-launch? Two years? We fix it. Free. Forever. Your codebase stays bulletproof for life.",
    gradient: "from-[#00eeff] to-[#9900ff]",
    glowColor: "#00eeff",
  },
  {
    icon: KeyRound,
    title: "Your Code From Day One",
    description:
      "Every line, every asset, every commit — 100% yours from the first push. No lock-in, no licensing games, no strings.",
    gradient: "from-[#ff00ff] to-[#00eeff]",
    glowColor: "#ff00ff",
  },
];

const stats = [
  { value: 120, suffix: "+", label: "Projects Delivered" },
  { value: 2, suffix: "", label: "Refunds in History" },
  { value: 98, suffix: "%", label: "Sprint Approval" },
];

/* ─── Component ───────────────────────────────────────────────────── */

export default function Guarantee() {
  const sectionRef = useRef<HTMLElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);
  const overlineRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);
  const orbRef1 = useRef<HTMLDivElement>(null);
  const orbRef2 = useRef<HTMLDivElement>(null);

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimelines = useRef<(gsap.core.Timeline | null)[]>([]);
  const ctaXTo = useRef<gsap.QuickToFunc | null>(null);
  const ctaYTo = useRef<gsap.QuickToFunc | null>(null);
  const ctaTextXTo = useRef<gsap.QuickToFunc | null>(null);
  const ctaTextYTo = useRef<gsap.QuickToFunc | null>(null);

  const [statsActive, setStatsActive] = useState(false);

  /* ── GSAP master setup ────────────────────────────────────────── */
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const mm = gsap.matchMedia();

      /* ── Background orb parallax ─────────────────────────────── */
      if (orbRef1.current) {
        gsap.to(orbRef1.current, {
          y: -160,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
      if (orbRef2.current) {
        gsap.to(orbRef2.current, {
          y: -120,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      /* ── Entrance timeline (plays once) ──────────────────────── */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      if (separatorRef.current) {
        entranceTl.fromTo(
          separatorRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power2.out" },
          0
        );
      }

      if (overlineRef.current) {
        entranceTl.fromTo(
          overlineRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0.15
        );
      }

      /* Heading reveal — always fade-up (works on both desktop + mobile) */
      if (headingRef.current) {
        entranceTl.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          0.25
        );
      }

      if (subtitleRef.current) {
        entranceTl.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0.55
        );
      }

      /* ── Stats counter trigger ───────────────────────────────── */
      if (statsRef.current) {
        entranceTl.fromTo(
          statsRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          0.7
        );

        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => setStatsActive(true),
        });
      }

      /* ── CTA entrance ────────────────────────────────────────── */
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* ── Per-card scroll-driven entrance (scrub) ─────────────── */
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (context) => {
          const { isDesktop } = context.conditions!;

          cardRefs.current.forEach((card, i) => {
            if (!card) return;

            const accentBar = card.querySelector<HTMLElement>(
              "[data-g-accent]"
            );
            const iconWrap = card.querySelector<HTMLElement>("[data-g-icon]");
            const decoIcon = card.querySelector<HTMLElement>(
              "[data-g-deco-icon]"
            );

            if (isDesktop) {
              /* Desktop: scrub with blur + x + scale */
              gsap.fromTo(
                card,
                { x: 70, opacity: 0, scale: 0.97, filter: "blur(6px)" },
                {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  force3D: true,
                  scrollTrigger: {
                    trigger: card,
                    start: "top 88%",
                    end: "top 45%",
                    scrub: 0.6,
                  },
                }
              );

              /* Accent bar scaleY grow */
              if (accentBar) {
                gsap.fromTo(
                  accentBar,
                  { scaleY: 0, transformOrigin: "top" },
                  {
                    scaleY: 1,
                    scrollTrigger: {
                      trigger: card,
                      start: "top 70%",
                      end: "top 35%",
                      scrub: 0.6,
                    },
                  }
                );
              }
            } else {
              /* Mobile: simple fade + y (no blur for perf) */
              gsap.fromTo(
                card,
                { y: 40, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    toggleActions: "play none none none",
                  },
                }
              );

              if (accentBar) {
                gsap.fromTo(
                  accentBar,
                  { scaleY: 0, transformOrigin: "top" },
                  {
                    scaleY: 1,
                    duration: 0.5,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                      trigger: card,
                      start: "top 80%",
                      toggleActions: "play none none none",
                    },
                  }
                );
              }
            }

            /* Icon entrance pop (both desktop + mobile) */
            if (iconWrap) {
              gsap.fromTo(
                iconWrap,
                { scale: 0.6, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  ease: "back.out(1.4)",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 65%",
                    toggleActions: "play none none none",
                  },
                }
              );
            }

            /* ── Hover timeline (paused, play/reverse) ─────────── */
            const htl = gsap.timeline({
              paused: true,
              defaults: { ease: "power2.out" },
            });

            htl.to(
              card,
              {
                y: -8,
                boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                duration: 0.35,
              },
              0
            );

            if (accentBar) {
              htl.to(
                accentBar,
                { width: 3, opacity: 1, duration: 0.3 },
                0
              );
            }

            if (iconWrap) {
              htl.to(iconWrap, { scale: 1.08, duration: 0.3 }, 0.05);
            }

            if (decoIcon) {
              htl.to(
                decoIcon,
                { opacity: 0.08, rotate: 8, duration: 0.4 },
                0.05
              );
            }

            const glowOrb = card.querySelector<HTMLElement>("[data-g-glow]");
            if (glowOrb) {
              htl.to(glowOrb, { opacity: 0.25, scale: 1.2, duration: 0.4 }, 0);
            }

            const stepNum = card.querySelector<HTMLElement>(
              "[data-g-step]"
            );
            if (stepNum) {
              htl.to(stepNum, { opacity: 0.4, duration: 0.3 }, 0);
            }

            hoverTimelines.current[i] = htl;
          });
        }
      );

      /* ── Magnetic CTA (desktop only) ─────────────────────────── */
      mm.add("(min-width: 1024px)", () => {
        if (ctaBtnRef.current) {
          ctaXTo.current = gsap.quickTo(ctaBtnRef.current, "x", {
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
          ctaYTo.current = gsap.quickTo(ctaBtnRef.current, "y", {
            duration: 0.5,
            ease: "elastic.out(1, 0.3)",
          });
        }
        if (ctaTextRef.current) {
          ctaTextXTo.current = gsap.quickTo(ctaTextRef.current, "x", {
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
          ctaTextYTo.current = gsap.quickTo(ctaTextRef.current, "y", {
            duration: 0.6,
            ease: "elastic.out(1, 0.3)",
          });
        }
      });
    },
    { scope: sectionRef }
  );

  /* ── Card hover handlers ──────────────────────────────────────── */
  const handleCardEnter = useCallback((i: number) => {
    hoverTimelines.current[i]?.play();
  }, []);

  const handleCardLeave = useCallback((i: number) => {
    hoverTimelines.current[i]?.reverse();
  }, []);

  /* ── Magnetic CTA handlers ────────────────────────────────────── */
  const handleCtaMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!ctaBtnRef.current || !ctaXTo.current) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } =
        ctaBtnRef.current.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      ctaXTo.current(x * 0.2);
      ctaYTo.current!(y * 0.2);
      ctaTextXTo.current?.(x * 0.08);
      ctaTextYTo.current?.(y * 0.08);
    },
    []
  );

  const handleCtaLeave = useCallback(() => {
    ctaXTo.current?.(0);
    ctaYTo.current?.(0);
    ctaTextXTo.current?.(0);
    ctaTextYTo.current?.(0);
  }, []);

  const handleCtaEnter = useCallback(() => {
    if (!ctaBtnRef.current) return;
    gsap.to(ctaBtnRef.current, {
      boxShadow: "0 0 35px rgba(153,0,255,0.5)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  const handleCtaHoverEnd = useCallback(() => {
    if (!ctaBtnRef.current) return;
    gsap.to(ctaBtnRef.current, {
      boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  /* ── Render ───────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      id="guarantee"
      className="relative bg-black overflow-hidden py-24 lg:py-36"
    >
      {/* ── Background ─────────────────────────────────────────── */}
      <div
        ref={separatorRef}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent origin-center"
        style={{ transform: "scaleX(0)" }}
      />

      <div
        ref={orbRef1}
        className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-[#9900ff]/10 blur-[150px] rounded-full pointer-events-none"
      />
      <div
        ref={orbRef2}
        className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-[#00eeff]/10 blur-[120px] rounded-full pointer-events-none"
      />

      {/* ── Content ────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Overline */}
        <div ref={overlineRef} className="mb-6 lg:mb-8" style={{ opacity: 0 }}>
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-gray-400 uppercase">
            Our Guarantee
          </span>
        </div>

        {/* ── Asymmetric Grid ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* ── Left Column (sticky on desktop) ────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-[20vh]">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.1] mb-6"
              style={{ opacity: 0 }}
            >
              You Don&apos;t Pay{" "}
              <br className="hidden sm:block" />
              Unless We{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#ff00ff]">
                Deliver.
              </span>
            </h2>

            <p
              ref={subtitleRef}
              className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md"
              style={{ opacity: 0 }}
            >
              Every sprint is approval-gated. If the work doesn&apos;t meet
              your standards, the invoice disappears. That&apos;s not a
              slogan&nbsp;— it&apos;s how we&apos;ve operated across{" "}
              <span className="text-white font-medium">
                120+ engagements
              </span>
              .
            </p>

            {/* Stats */}
            <div
              ref={statsRef}
              className="grid grid-cols-3 gap-4 lg:gap-6 mb-10"
              style={{ opacity: 0 }}
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl sm:text-4xl font-bold gradient-text">
                    <Counter
                      value={s.value}
                      suffix={s.suffix}
                      active={statsActive}
                    />
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-500 mt-1.5 tracking-wide uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA — lives in left column (sticky = always visible) */}
            <div ref={ctaRef} className="hidden lg:block" style={{ opacity: 0 }}>
              <a
                ref={ctaBtnRef}
                href="#contact"
                className="btn-primary-lg inline-block will-change-transform"
                onMouseMove={handleCtaMove}
                onMouseEnter={handleCtaEnter}
                onMouseLeave={() => {
                  handleCtaLeave();
                  handleCtaHoverEnd();
                }}
              >
                <span
                  ref={ctaTextRef}
                  className="relative z-10 inline-flex items-center gap-2 will-change-transform"
                >
                  Start Risk-Free
                  <ArrowRight className="w-5 h-5" />
                </span>
              </a>
              <p className="text-[13px] text-gray-500 mt-3 tracking-wide">
                No contracts. Cancel anytime.
              </p>
            </div>
          </div>

          {/* ── Right Column — Scroll-driven Cards ─────────── */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {guarantees.map((g, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="g-card-idle"
                style={{
                  opacity: 0,
                  animationDelay: `${i * 1.7}s`,
                }}
                onMouseEnter={() => handleCardEnter(i)}
                onMouseLeave={() => handleCardLeave(i)}
              >
                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-sm cursor-default">
                  {/* Left accent bar */}
                  <div
                    data-g-accent
                    className={`absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b ${g.gradient} opacity-50 g-accent-shimmer`}
                    style={{ transformOrigin: "top", transform: "scaleY(0)" }}
                  />

                  {/* Step number */}
                  <div
                    data-g-step
                    className="absolute top-5 right-5 text-xs font-mono text-white/[0.12] tracking-widest select-none"
                  >
                    0{i + 1}
                  </div>

                  <div className="flex items-start gap-5 p-6 sm:p-7 lg:p-8">
                    {/* Icon container */}
                    <div
                      data-g-icon
                      className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${g.gradient} p-px`}
                    >
                      <div className="w-full h-full rounded-[11px] bg-[#0a0a0a] flex items-center justify-center">
                        <g.icon className="w-6 h-6 text-white/80" />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0 pr-8">
                      <h3 className="text-lg font-semibold text-white mb-2 tracking-tight">
                        {g.title}
                      </h3>
                      <p className="text-[15px] text-gray-400 leading-relaxed">
                        {g.description}
                      </p>
                    </div>

                    {/* Decorative large icon */}
                    <div className="hidden md:flex flex-shrink-0 w-16 lg:w-20 items-center justify-center self-center">
                      <g.icon
                        data-g-deco-icon
                        className="w-12 h-12 lg:w-14 lg:h-14 text-white/[0.03]"
                        strokeWidth={1}
                      />
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    data-g-glow
                    className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-0 pointer-events-none"
                    style={{ background: g.glowColor }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile CTA (below cards, not in sticky column) ── */}
        <div className="lg:hidden text-center mt-14">
          <a href="#contact" className="btn-primary-lg inline-block">
            <span className="relative z-10 inline-flex items-center gap-2">
              Start Risk-Free
              <ArrowRight className="w-5 h-5" />
            </span>
          </a>
          <p className="text-[13px] text-gray-500 mt-3 tracking-wide">
            No contracts. Cancel anytime.
          </p>
        </div>
      </div>

      {/* ── Idle animation styles ──────────────────────────────── */}
      <style jsx>{`
        .g-card-idle {
          animation: g-float 5s ease-in-out infinite;
        }
        @keyframes g-float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .g-accent-shimmer {
          background-size: 100% 200%;
          animation: g-shimmer 3.5s ease-in-out infinite;
        }
        @keyframes g-shimmer {
          0%,
          100% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 0% 100%;
          }
        }
        @media (max-width: 1023px) {
          .g-card-idle {
            animation-duration: 6s;
          }
          @keyframes g-float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2px);
            }
          }
        }
      `}</style>
    </section>
  );
}
