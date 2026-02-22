"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

const STYLE_ID = "bento3-animations";

const flows = [
  {
    id: "01",
    variant: "orbit",
    meta: "SaaS & Web Apps",
    title: "Full-Stack Platforms",
    description:
      "Robust backend architecture paired with conversion-focused UX. We build scalable platforms using modern frameworks like React, Next.js, and Node, ensuring high performance.",
    statLabel: "Target Availability",
    statValue: "99.99%",
    image: "/images/Computer_screen_cool_image.png",
  },
  {
    id: "02",
    variant: "loop",
    meta: "Enterprise",
    title: "Custom Integrations",
    description:
      "Embedded systems and complex APIs that connect your business. We design secure, high-throughput architectures to handle enterprise-grade workloads.",
    statLabel: "System Uptime",
    statValue: "24/7/365",
    image: "/images/Cool_phone_image.png",
  },
  {
    id: "03",
    variant: "wave",
    meta: "AI & ML",
    title: "Intelligent Systems",
    description:
      "Integrate predictive, adaptive algorithms into your product. From OpenAI/GPT integration to complex data pipelines and custom LLM fine-tuning.",
    statLabel: "Data Processed",
    statValue: "100M+ Points",
    image: "/images/nebula_cloud_image_header_or_hero.png",
  },
  {
    id: "04",
    variant: "spark",
    meta: "DevOps",
    title: "Scalable Infrastructure",
    description:
      "Cloud architecture that scales with your business and optimizes for cost. Expert implementation across AWS, GCP, and Azure utilizing Kubernetes and Terraform.",
    statLabel: "Deployment Speed",
    statValue: "10x Faster",
    image: "/images/scissors_cutting_ribbons_cool_image.png",
  },
];

const metrics = [
  { label: "Active Deployments", value: "250+" },
  { label: "Client Satisfaction", value: "99%" },
  { label: "Lines of Code Managed", value: "10M+" },
];

const palettes = {
  dark: {
    surface: "bg-black text-gray-300",
    heading: "text-white font-bold",
    muted: "text-gray-400 font-light",
    capsule: "bg-[#9900ff]/10 border-[#9900ff]/30 text-[#00eeff]",
    card: "bg-black/60 backdrop-blur-sm",
    cardBorder: "border-white/10 hover:border-[#ff00ff]/50",
    metric: "bg-black/40 border-[#00eeff]/20 text-gray-300",
    headingAccent: "bg-gradient-to-r from-[#9900ff] to-[#00eeff]",
    toggleSurface: "bg-white/5",
    toggle: "border-white/10 text-white",
    button: "border-[#ff00ff]/50 text-white hover:border-[#00eeff] hover:bg-white/5",
    gridColor: "rgba(255, 255, 255, 0.03)",
    overlay: "transparent",
    focusGlow: "rgba(153, 0, 255, 0.15)",
    iconStroke: "#00eeff",
    iconTrail: "rgba(255, 0, 255, 0.4)",
  },
  light: {
    // Nebulos is a dark-theme native site, mapping light to dark to force the aesthetic
    surface: "bg-black text-gray-300",
    heading: "text-white font-bold",
    muted: "text-gray-400 font-light",
    capsule: "bg-[#9900ff]/10 border-[#9900ff]/30 text-[#00eeff]",
    card: "bg-black/60 backdrop-blur-sm",
    cardBorder: "border-white/10 hover:border-[#ff00ff]/50",
    metric: "bg-black/40 border-[#00eeff]/20 text-gray-300",
    headingAccent: "bg-gradient-to-r from-[#9900ff] to-[#00eeff]",
    toggleSurface: "bg-white/5",
    toggle: "border-white/10 text-white",
    button: "border-[#ff00ff]/50 text-white hover:border-[#00eeff] hover:bg-white/5",
    gridColor: "rgba(255, 255, 255, 0.03)",
    overlay: "transparent",
    focusGlow: "rgba(153, 0, 255, 0.15)",
    iconStroke: "#00eeff",
    iconTrail: "rgba(255, 0, 255, 0.4)",
  },
};

const getRootTheme = () => {
  if (typeof document === "undefined") {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  }

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.dataset?.theme === "dark" || root.getAttribute("data-theme") === "dark") return "dark";
  if (root.classList.contains("light")) return "light";
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return "light";
};

export function Bento3Section() {
  const [theme, setTheme] = useState(() => getRootTheme());
  const [introReady, setIntroReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes bento3-card-in {
        0% { opacity: 0; transform: translate3d(0, 28px, 0) scale(0.97); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes bento3-flare {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes bento3-dash {
        0% { transform: translateX(-25%); opacity: 0; }
        30% { opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translateX(25%); opacity: 0; }
      }
      @keyframes bento3-wave {
        0% { transform: translateX(-45%); }
        100% { transform: translateX(45%); }
      }
      @keyframes bento3-pulse {
        0% { transform: scale(0.8); opacity: 0.6; }
        70% { opacity: 0.05; }
        100% { transform: scale(1.35); opacity: 0; }
      }
      .bento3-root {
        padding-inline: 0;
        min-height: min(100vh, 960px);
      }
      .bento3-section {
        gap: clamp(3rem, 6vw, 5rem);
        padding-inline: clamp(1.25rem, 5vw, 3.75rem);
        width: min(100%, 72rem);
      }
      .bento3-grid {
        gap: clamp(1.25rem, 4vw, 2.5rem);
      }
      .bento3-metrics {
        gap: clamp(1rem, 3vw, 1.5rem);
        padding: clamp(1.25rem, 4vw, 2.5rem);
      }
      .bento3-footer {
        gap: clamp(1.15rem, 3.5vw, 2.4rem);
      }
      .bento3-hero-pill {
        flex-wrap: wrap;
      }
      .bento3-hero-pill span:last-child {
        flex-shrink: 0;
      }
      .bento3-card {
        opacity: 0;
        transform: translate3d(0, 32px, 0);
        filter: blur(14px);
        transition: border-color 400ms ease, background 400ms ease, padding 300ms ease;
        padding: clamp(1.2rem, 3vw, 2.4rem);
        border-radius: clamp(1.5rem, 4vw, 28px);
      }
      .bento3-card[data-visible="true"] {
        animation: bento3-card-in 760ms cubic-bezier(0.22, 0.68, 0, 1) forwards;
        animation-delay: var(--bento3-delay, 0ms);
      }
      .bento3-icon {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: clamp(2.75rem, 6vw, 3.25rem);
        width: clamp(2.75rem, 6vw, 3.25rem);
        border-radius: 9999px;
        overflow: hidden;
        isolation: isolate;
      }
      .bento3-icon::before,
      .bento3-icon::after {
        content: "";
        position: absolute;
        inset: 4px;
        border-radius: inherit;
        border: 1px solid var(--bento3-icon-trail);
        opacity: 0.45;
      }

      @media (max-width: 1024px) {
        .bento3-section {
          gap: clamp(2.5rem, 6vw, 4rem);
          padding-inline: clamp(1.1rem, 6vw, 3rem);
        }
        .bento3-metrics {
          border-radius: 24px;
        }
      }
      @media (max-width: 768px) {
        .bento3-root {
          min-height: auto;
        }
        .bento3-section {
          gap: clamp(2rem, 7vw, 3.5rem);
          padding-inline: clamp(1rem, 8vw, 2.25rem);
          padding-block: clamp(3rem, 10vw, 4rem);
        }
        .bento3-card {
          padding: clamp(1rem, 5vw, 1.6rem);
          border-radius: 22px;
        }
        .bento3-grid {
          gap: clamp(1rem, 6vw, 2rem);
        }
        .bento3-metrics {
          padding: clamp(1rem, 6vw, 1.8rem);
          gap: clamp(0.75rem, 4vw, 1.25rem);
        }
        .bento3-footer {
          gap: clamp(1rem, 6vw, 1.75rem);
        }
      }
      @media (max-width: 640px) {
        .bento3-section {
          gap: clamp(1.75rem, 8vw, 3rem);
        }
        .bento3-hero-pill {
          justify-content: center;
          text-align: center;
        }
        .bento3-hero-pill span:last-child {
          width: 100%;
          text-align: center;
        }
        .bento3-card {
          padding: clamp(0.85rem, 6vw, 1.4rem);
        }
        .bento3-icon {
          height: clamp(2.25rem, 8vw, 2.75rem);
          width: clamp(2.25rem, 8vw, 2.75rem);
        }
        .bento3-metrics div {
          padding-block: clamp(1rem, 6vw, 1.5rem);
        }
      }
      
      .bento3-icon::after {
        inset: 10px;
        opacity: 0.2;
      }
      .bento3-icon[data-variant="orbit"] span {
        position: absolute;
        height: 140%;
        width: 3px;
        background: linear-gradient(180deg, transparent, var(--bento3-icon-stroke) 55%, transparent);
        transform-origin: center;
        animation: bento3-flare 8s linear infinite;
      }
      .bento3-icon[data-variant="relay"] span {
        position: absolute;
        inset: 18px;
        border-top: 1px solid var(--bento3-icon-stroke);
        border-bottom: 1px solid var(--bento3-icon-stroke);
        transform: skewX(-15deg);
      }
      .bento3-icon[data-variant="relay"] span::before,
      .bento3-icon[data-variant="relay"] span::after {
        content: "";
        position: absolute;
        height: 1px;
        width: 120%;
        left: -10%;
        background: linear-gradient(90deg, transparent, var(--bento3-icon-stroke), transparent);
        animation: bento3-dash 2.6s ease-in-out infinite;
      }
      .bento3-icon[data-variant="relay"] span::after {
        top: 70%;
        animation-delay: 0.9s;
      }
      .bento3-icon[data-variant="wave"] span {
        position: absolute;
        inset: 12px;
        border-radius: 999px;
        overflow: hidden;
      }
      .bento3-icon[data-variant="wave"] span::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, transparent 5%, var(--bento3-icon-stroke) 50%, transparent 95%);
        transform: translateX(-45%);
        animation: bento3-wave 2.8s ease-in-out infinite alternate;
      }
      .bento3-icon[data-variant="spark"] span {
        position: absolute;
        inset: 0;
      }
      .bento3-icon[data-variant="spark"] span::before,
      .bento3-icon[data-variant="spark"] span::after {
        content: "";
        position: absolute;
        inset: 12px;
        border-radius: 9999px;
        border: 1px solid var(--bento3-icon-stroke);
        opacity: 0.28;
        animation: bento3-pulse 2.8s ease-out infinite;
      }
      .bento3-icon[data-variant="spark"] span::after {
        animation-delay: 0.9s;
      }
      .bento3-icon[data-variant="loop"] span {
        position: absolute;
        inset: 12px;
      }
      .bento3-icon[data-variant="loop"] span::before,
      .bento3-icon[data-variant="loop"] span::after {
        content: "";
        position: absolute;
        height: 1px;
        width: 100%;
        top: 50%;
        left: 0;
        background: linear-gradient(90deg, transparent, var(--bento3-icon-stroke), transparent);
      }
      .bento3-icon[data-variant="loop"] span::before {
        transform: rotate(90deg);
      }
      .bento3-icon[data-variant="loop"] span::after {
        opacity: 0.4;
        transform: rotate(0deg);
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIntroReady(true);
      setVisible(true);
      return;
    }
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    const syncTheme = () => {
      const next = getRootTheme();
      setTheme((prev) => (prev === next ? prev : next));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "bento-theme") syncTheme();
    };

    const media =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const handleMedia = () => syncTheme();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }
    media?.addEventListener("change", handleMedia);

    return () => {
      observer.disconnect();
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
      media?.removeEventListener("change", handleMedia);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") return;
    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const palette = useMemo(() => palettes[theme as keyof typeof palettes], [theme]);

  const containerStyle = useMemo(
    () => ({
      "--bento3-grid-color": palette.gridColor,
      "--bento3-focus-glow": palette.focusGlow,
      "--bento3-icon-stroke": palette.iconStroke,
      "--bento3-icon-trail": palette.iconTrail,
    } as React.CSSProperties),
    [palette.gridColor, palette.focusGlow, palette.iconStroke, palette.iconTrail]
  );

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const next = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    try {
      window.localStorage?.setItem("bento-theme", next);
    } catch (_err) {
      /* ignore */
    }
    setTheme(next);
  };

  return (
    <div
      className={`bento3-root relative w-full overflow-hidden transition-colors duration-700 ${palette.surface} py-16`}
      style={containerStyle}
      id="services"
    >
      {/* Visual Separator Transition Between Sections */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9900ff]/60 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00eeff]/80 to-transparent shadow-[0_0_25px_rgba(0,238,255,1)]" />

      {/* Dynamic Nebulos Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#9900ff]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#00eeff]/10 blur-[120px] rounded-full pointer-events-none" />

      <div
        className="absolute inset-0 -z-20 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--bento3-grid-color) 1px, transparent 1px),
            linear-gradient(to bottom, var(--bento3-grid-color) 1px, transparent 1px)
          `,
          backgroundSize: "22px 22px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{ background: palette.overlay }} />

      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        ref={sectionRef}
        className={`bento3-section relative z-10 mx-auto flex max-w-6xl flex-col gap-12 pt-16 md:gap-16 ${
          introReady && visible ? "" : "opacity-0"
        }`}
      >
        <motion.div
          variants={fadeIn("up", 0.1)}
          className={`bento3-hero-pill mx-auto flex w-full max-w-xl items-center justify-between gap-4 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.5em] transition-all duration-700 ${
            introReady ? "opacity-100 translate-y-0" : "translate-y-5 opacity-0"
          } ${palette.capsule}`}
        >
          <span className="relative flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00eeff] shadow-[0_0_10px_rgba(0,238,255,0.5)] animate-pulse" />
            Core Capabilities
          </span>
          <span className="font-medium text-[#ff00ff]">What We Build</span>
        </motion.div>

        <motion.header 
          variants={fadeIn("up", 0.2)}
          className="flex flex-col gap-10 md:items-center md:text-center text-left"
        >
          <div className="space-y-5 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-5xl font-semibold text-white tracking-tighter mb-6 leading-tight">
              End-to-end development across platforms, technologies, and industries.
            </h2>
            <p className={`max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed ${palette.muted}`}>
              From world-class enterprise systems to custom automated workflows.
              We build secure, scalable, intelligent software that moves markets.
            </p>
          </div>
        </motion.header>

        <div className="bento3-grid grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:gap-8">
          {flows.map((flow, index) => (
            <FlowCard key={flow.id} flow={flow} palette={palette} index={index} visible={visible} />
          ))}
        </div>

        <div className={`bento3-metrics grid grid-cols-1 gap-4 rounded-[28px] border p-6 sm:grid-cols-2 md:grid-cols-3 ${palette.cardBorder} ${palette.card}`}>
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`rounded-[22px] border px-5 py-6 text-xs uppercase tracking-[0.22em] text-center sm:text-sm sm:tracking-[0.25em] ${palette.metric}`}
            >
              <span className="block text-[10px] opacity-60 sm:text-[11px]">{metric.label}</span>
              <span className="mt-2 block text-base font-semibold tracking-[0.08em] sm:text-lg sm:tracking-[0.12em]">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <footer className="bento3-footer flex flex-col gap-5 border-t border-dashed border-white/10 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <div className={`flex flex-col gap-2 ${palette.muted}`}>
            <span className="text-xs uppercase tracking-[0.35em] text-[#00eeff]">Need something custom?</span>
            <span className="text-base font-medium text-white">We specialize in data engineering and enterprise integrations. Tell us about your challenge.</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="relative inline-flex items-center px-8 py-3 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105"
            >
              Start a Conversation
            </a>
          </div>
        </footer>
      </motion.section>
    </div>
  );
}

function FlowCard({ flow, palette, index, visible }: { flow: any, palette: any, index: number, visible: boolean }) {
  const cardRef = useRef<HTMLElement>(null);

  const setGlow = (event: React.MouseEvent) => {
    const target = cardRef.current;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--bento3-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--bento3-y", `${event.clientY - rect.top}px`);
  };

  const clearGlow = () => {
    const target = cardRef.current;
    if (!target) return;
    target.style.removeProperty("--bento3-x");
    target.style.removeProperty("--bento3-y");
  };

  return (
    <motion.article
      variants={fadeIn("up", 0.1)}
      ref={cardRef}
      className={`bento3-card group relative overflow-hidden rounded-[28px] border ${palette.cardBorder} ${palette.card} p-5 md:p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(153,0,255,0.15)] hover:border-[#9900ff]/60`}
      data-visible={visible}
      style={{ "--bento3-delay": `${index * 90}ms` } as React.CSSProperties}
      onMouseMove={setGlow}
      onMouseLeave={clearGlow}
    >
      <div className="relative z-10 flex flex-col gap-4">
        {flow.image && (
          <div className="relative w-full h-36 md:h-48 rounded-[20px] overflow-hidden border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
            <Image 
              src={flow.image} 
              alt={flow.title} 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            
            {/* Overlay Icon in Image */}
            <div className="absolute top-4 left-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity">
              <AnimatedIcon variant={flow.variant} />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start pt-2">
          <div className="flex flex-col gap-4 lg:flex-1">
            <span className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.4em] transition-colors group-hover:border-[#00eeff]/50 ${palette.cardBorder} ${palette.muted}`}>
              {flow.meta}
            </span>
            <h3 className={`text-xl font-semibold leading-tight sm:text-2xl ${palette.heading}`}>{flow.title}</h3>
            <p className={`text-sm leading-relaxed sm:text-base ${palette.muted}`}>{flow.description}</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-8 flex flex-col gap-3 text-[0.65rem] uppercase tracking-[0.25em] opacity-70 sm:text-xs sm:tracking-[0.35em] sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-white/5">
        <span className="text-center sm:text-left">{flow.statLabel}</span>
        <span className="text-center font-semibold text-[#00eeff] sm:text-right group-hover:text-[#ff00ff] transition-colors">{flow.statValue}</span>
      </div>
      
      {/* Interactive Hover Light Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(250px circle at var(--bento3-x, 50%) var(--bento3-y, 50%), var(--bento3-focus-glow), transparent 68%)`,
        }}
      />
    </motion.article>
  );
}

function AnimatedIcon({ variant }: { variant: string }) {
  return (
    <span className="bento3-icon" data-variant={variant}>
      <span />
    </span>
  );
}

export default Bento3Section;
