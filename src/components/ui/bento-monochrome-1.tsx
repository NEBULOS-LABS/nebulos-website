"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { staggerContainer } from "@/lib/animations";
import { Layers, Code2, Brain, Server } from "lucide-react";
import AccretionBackground from "@/components/accretion-bg";
import { usePointerParallax } from "@/hooks/use-pointer-parallax";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────── Data ─────────────────────────── */

interface ServicePanel {
  id: string;
  title: string;
  meta: string;
  outcome: string;
  deliverables: string[];
  statLabel: string;
  statValue: string;
  heightPct: number;
  accent: string;
  iconName: string;
  tags: string[];
  visualType: "nodeGraph" | "wave" | "equalizer" | "orbit";
  image: string;
}

const SERVICES: ServicePanel[] = [
  {
    id: "01",
    title: "Product & UX Engineering",
    meta: "Design → Code",
    outcome: "Interfaces that convert visitors into customers",
    deliverables: [
      "Design systems & component libraries",
      "Responsive SPA / SSR applications",
      "Micro-interaction & motion design",
    ],
    statLabel: "Conversion Lift",
    statValue: "+34%",
    heightPct: 85,
    accent: "#00eeff",
    iconName: "Layers",
    tags: ["React", "Next.js", "Figma", "Framer Motion"],
    visualType: "nodeGraph",
    image: "/images/Computer_screen_cool_image.png",
  },
  {
    id: "02",
    title: "Full-Stack Development",
    meta: "Enterprise",
    outcome: "Robust systems that scale from day one",
    deliverables: [
      "API architecture & microservices",
      "Real-time data pipelines",
      "Auth, payments & integrations",
    ],
    statLabel: "System Uptime",
    statValue: "99.99%",
    heightPct: 100,
    accent: "#ff00ff",
    iconName: "Code2",
    tags: ["Node.js", "GraphQL", "PostgreSQL", "Redis"],
    visualType: "wave",
    image: "/images/Cool_phone_image.png",
  },
  {
    id: "03",
    title: "AI & Automation",
    meta: "Intelligence",
    outcome: "Workflows that think, adapt, and improve",
    deliverables: [
      "LLM integration & fine-tuning",
      "RAG pipelines & vector search",
      "Automated decision engines",
    ],
    statLabel: "Efficiency Gain",
    statValue: "10x",
    heightPct: 90,
    accent: "#9900ff",
    iconName: "Brain",
    tags: ["GPT-4", "LangChain", "Pinecone", "Python"],
    visualType: "equalizer",
    image: "/images/nebula_cloud_image_header_or_hero.png",
  },
  {
    id: "04",
    title: "DevOps & Scale",
    meta: "Infrastructure",
    outcome: "Deploy fearlessly at any scale",
    deliverables: [
      "CI/CD & GitOps pipelines",
      "Container orchestration",
      "Observability & cost optimization",
    ],
    statLabel: "Deploy Speed",
    statValue: "10x Faster",
    heightPct: 80,
    accent: "#00eeff",
    iconName: "Server",
    tags: ["AWS", "Kubernetes", "Terraform", "Docker"],
    visualType: "orbit",
    image: "/images/scissors_cutting_ribbons_cool_image.png",
  },
];

const METRICS = [
  { label: "Active Deployments", value: "250+" },
  { label: "Client Satisfaction", value: "99%" },
  { label: "Lines Shipped", value: "10M+" },
];

const iconMap: Record<string, typeof Layers> = { Layers, Code2, Brain, Server };
const RAIL_LABELS = ["Product & UX", "Full-Stack", "AI & Auto", "DevOps"];

/* ─────────────── Keyframes ─────────────── */

const STYLE_ID = "svc-scroll-kf";
const KEYFRAME_CSS = [
  "@keyframes nodeGraphPulse{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.4);opacity:1}}",
  "@keyframes waveDash{0%{stroke-dashoffset:0}100%{stroke-dashoffset:-240}}",
  "@keyframes eqBounce{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}",
  "@keyframes orbitSpin{0%{transform:rotate(0deg) translateX(14px) rotate(0deg)}100%{transform:rotate(360deg) translateX(14px) rotate(-360deg)}}",
  "@keyframes mobileReveal{0%{opacity:0;transform:translateY(10px)}100%{opacity:1;transform:translateY(0)}}",
  ".svc-panel:focus-visible{outline:2px solid #00eeff;outline-offset:2px;border-radius:20px}",
  "@keyframes progressGlow{0%,100%{box-shadow:0 0 8px rgba(0,238,255,0.2)}50%{box-shadow:0 0 20px rgba(0,238,255,0.4),0 0 6px rgba(255,0,255,0.15)}}",
].join("\n");

/* ─────────────── Micro-Animated Visuals (Memoized) ─────────────── */

const NodeGraphVisual = React.memo(function NodeGraphVisual() {
  const pts = [
    { cx: 20, cy: 12 }, { cx: 36, cy: 8 }, { cx: 44, cy: 24 },
    { cx: 36, cy: 40 }, { cx: 20, cy: 36 }, { cx: 12, cy: 24 },
  ];
  return (
    <svg viewBox="0 0 56 48" className="w-full h-full" fill="none">
      {pts.map((p, i) => {
        const n = pts[(i + 1) % pts.length];
        return <line key={`l-${i}`} x1={p.cx} y1={p.cy} x2={n.cx} y2={n.cy} stroke="rgba(0,238,255,0.2)" strokeWidth="1" />;
      })}
      <line x1={20} y1={12} x2={44} y2={24} stroke="rgba(0,238,255,0.12)" strokeWidth="0.5" />
      <line x1={36} y1={8} x2={20} y2={36} stroke="rgba(0,238,255,0.12)" strokeWidth="0.5" />
      {pts.map((p, i) => (
        <circle key={`n-${i}`} cx={p.cx} cy={p.cy} r="2.5" fill="#00eeff"
          style={{ animation: "nodeGraphPulse 2.5s ease-in-out infinite", animationDelay: `${i * 0.4}s` }} />
      ))}
    </svg>
  );
});

const WaveVisual = React.memo(function WaveVisual() {
  return (
    <svg viewBox="0 0 60 32" className="w-full h-full" fill="none">
      <path d="M0 16 Q7.5 4, 15 16 T30 16 T45 16 T60 16" stroke="#ff00ff" strokeWidth="1.5"
        strokeDasharray="120" strokeDashoffset="0" style={{ animation: "waveDash 3s linear infinite" }} />
      <path d="M0 20 Q7.5 8, 15 20 T30 20 T45 20 T60 20" stroke="rgba(255,0,255,0.3)" strokeWidth="1"
        strokeDasharray="120" strokeDashoffset="60" style={{ animation: "waveDash 3s linear infinite", animationDelay: "0.5s" }} />
    </svg>
  );
});

const EqualizerVisual = React.memo(function EqualizerVisual() {
  const bars = [
    { delay: "0s", dur: "1.2s" }, { delay: "0.2s", dur: "0.9s" },
    { delay: "0.1s", dur: "1.5s" }, { delay: "0.3s", dur: "1.1s" }, { delay: "0.15s", dur: "1.4s" },
  ];
  return (
    <svg viewBox="0 0 42 32" className="w-full h-full" fill="none">
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff00ff" /><stop offset="100%" stopColor="#9900ff" />
        </linearGradient>
      </defs>
      {bars.map((b, i) => (
        <rect key={i} x={3 + i * 8} width="4" rx="2" y="4" height="24" fill="url(#eqGrad)"
          style={{ animation: `eqBounce ${b.dur} ease-in-out infinite`, animationDelay: b.delay, transformOrigin: `${5 + i * 8}px 28px` }} />
      ))}
    </svg>
  );
});

const OrbitVisual = React.memo(function OrbitVisual() {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full" fill="none">
      <circle cx="24" cy="24" r="14" stroke="rgba(0,238,255,0.15)" strokeWidth="0.5" />
      <circle cx="24" cy="24" r="3" fill="#00eeff" opacity="0.8" />
      <circle cx="24" cy="24" r="5" fill="rgba(0,238,255,0.15)" />
      {[0, 120, 240].map((deg, i) => (
        <circle key={i} cx="24" cy="10" r="1.8" fill="#00eeff"
          style={{ animation: "orbitSpin 4s linear infinite", animationDelay: `${(deg / 360) * 4}s`, transformOrigin: "24px 24px" }} />
      ))}
    </svg>
  );
});

const visualComponents: Record<ServicePanel["visualType"], React.FC> = {
  nodeGraph: NodeGraphVisual, wave: WaveVisual, equalizer: EqualizerVisual, orbit: OrbitVisual,
};

/* ─────────────── Scroll Rail (Far-Left Premium) ─────────────── */

function ScrollRail({
  activeIndex,
  total,
  railFillRef,
  onCheckpointClick,
}: {
  activeIndex: number;
  total: number;
  railFillRef: React.RefObject<HTMLDivElement>;
  onCheckpointClick: (index: number) => void;
}) {

  return (
      <div
        className="relative flex flex-col items-center"
        style={{
          height: `${total * 64 + (total - 1) * 20}px`,
          width: 48,
        }}
        role="navigation"
        aria-label="Service progress"
      >
        {/* Track line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Gradient fill line — height driven by ScrollTrigger via ref */}
        <div
          ref={railFillRef}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] rounded-full"
          style={{
            height: "0%",
            background: "linear-gradient(to bottom, #00eeff, #ff00ff, #9900ff)",
            boxShadow: "0 0 10px rgba(0,238,255,0.3), 0 0 4px rgba(255,0,255,0.15)",
          }}
        />

        {/* Numbered checkpoints */}
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === activeIndex;
          const isPast = activeIndex >= 0 && i < activeIndex;
          const accent = SERVICES[i].accent;
          const topPx = i * (64 + 20);

          return (
            <button
              key={i}
              onClick={() => onCheckpointClick(i)}
              aria-label={`Jump to ${SERVICES[i].title}`}
              aria-current={isActive ? "step" : undefined}
              className="group absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center rounded-lg transition-all duration-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00eeff]"
              style={{
                top: topPx,
                width: 36,
                height: 36,
                cursor: "pointer",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: isActive
                  ? `${accent}20`
                  : isPast
                    ? `${accent}10`
                    : "rgba(255,255,255,0.03)",
                border: `1px solid ${
                  isActive ? `${accent}60` : isPast ? `${accent}30` : "rgba(255,255,255,0.08)"
                }`,
                boxShadow: isActive
                  ? `0 0 16px ${accent}40, 0 0 4px ${accent}20`
                  : "none",
                animation: isActive ? "progressGlow 2s ease-in-out infinite" : "none",
                transition: "all 500ms cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <span
                className="text-[11px] font-mono font-bold tracking-wider"
                style={{
                  color: isActive ? accent : isPast ? `${accent}80` : "rgba(255,255,255,0.25)",
                  transition: "color 500ms ease",
                }}
              >
                {SERVICES[i].id}
              </span>
              {/* Tooltip label — directional slide-in on hover/focus */}
              <span
                aria-hidden="true"
                className="absolute left-full ml-3 whitespace-nowrap pointer-events-none rounded-md px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                style={{
                  background: "rgba(15,15,20,0.85)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${isActive ? `${accent}30` : "rgba(255,255,255,0.08)"}`,
                  color: isActive ? accent : isPast ? `${accent}90` : "rgba(255,255,255,0.5)",
                  boxShadow: isActive ? `0 0 12px ${accent}15` : "none",
                  transition: "opacity 200ms cubic-bezier(0.16, 1, 0.3, 1), transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 500ms ease, color 500ms ease",
                }}
              >
                {RAIL_LABELS[i]}
              </span>
            </button>
          );
        })}

        {/* Active indicator arm — horizontal line from rail to content */}
        {activeIndex >= 0 && (
          <div
            className="absolute z-0"
            style={{
              top: activeIndex * (64 + 20) + 18,
              left: 42,
              width: "clamp(20px, 3vw, 60px)",
              height: 1,
              background: `linear-gradient(to right, ${SERVICES[activeIndex].accent}60, transparent)`,
              transition: "top 700ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          />
        )}
      </div>
  );
}

/* ─────────────── StackCard ─────────────── */

function StackCard({
  service,
  isActive,
  isPast,
  index,
  totalCards,
  isMobile,
  isExpanded,
  onTap,
  reducedMotion,
}: {
  service: ServicePanel;
  isActive: boolean;
  isPast: boolean;
  index: number;
  totalCards: number;
  isMobile: boolean;
  isExpanded: boolean;
  onTap: () => void;
  reducedMotion: boolean;
}) {
  const expanded = isMobile ? isExpanded : isActive;
  const compressed = !isMobile && isPast;
  const IconComp = iconMap[service.iconName];
  const VisualComp = visualComponents[service.visualType];

  const cardRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLParagraphElement>(null);
  const deliverablesRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const revealTl = useRef<gsap.core.Timeline | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const compressedOverlayRef = useRef<HTMLDivElement>(null);
  const desktopContentRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const specularRef = useRef<HTMLDivElement>(null);

  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

  /* GSAP reveal timeline (desktop) */
  useGSAP(
    () => {
      if (isMobile || reducedMotion) return;
      const oc = outcomeRef.current;
      const dl = deliverablesRef.current;
      const sc = showcaseRef.current;
      const tg = tagsRef.current;
      const st = statRef.current;

      const wm = watermarkRef.current;

      if (oc) gsap.set(oc, { opacity: 0, y: 14 });
      if (dl) gsap.set(dl, { opacity: 0, y: 12 });
      if (sc) gsap.set(sc, { opacity: 0, scale: 0.92, y: 10 });
      if (tg) gsap.set(tg, { opacity: 0, y: 10 });
      if (st) gsap.set(st, { opacity: 0, y: 8 });
      if (wm) gsap.set(wm, { scale: 0.8, opacity: 0 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (oc) tl.to(oc, { opacity: 1, y: 0, duration: 0.5 }, 0);
      if (dl) tl.to(dl, { opacity: 1, y: 0, duration: 0.45 }, 0.08);
      if (tg) tl.to(tg, { opacity: 1, y: 0, duration: 0.4 }, 0.18);
      if (sc) tl.to(sc, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.3)" }, 0.26);
      if (st) tl.to(st, { opacity: 1, y: 0, duration: 0.4 }, 0.32);
      if (wm) tl.to(wm, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, 0.2);

      revealTl.current = tl;
      return () => { tl.kill(); };
    },
    { scope: cardRef, dependencies: [isMobile, reducedMotion] }
  );

  /* Play/reverse on active change */
  useEffect(() => {
    if (isMobile || !revealTl.current || reducedMotion) return;
    if (isActive) revealTl.current.play();
    else revealTl.current.reverse();
  }, [isActive, isMobile, reducedMotion]);

  /* Desktop morph now driven by scroll-scrub from parent (Bento3Section).
     Initial overlay hide is via Tailwind classes (opacity-0 invisible) so
     React re-renders don't override GSAP's inline style changes. */

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isMobile) onTap();
      }
    },
    [isMobile, onTap]
  );

  /* Card pointer parallax — perspective tilt + specular highlight */
  useEffect(() => {
    if (isMobile || reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      if (compressed || !expanded) return;
      const rect = card.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      // Perspective tilt: rotateY follows X, rotateX follows -Y (natural tilt)
      card.style.transform = `perspective(1200px) rotateY(${nx * 1.2}deg) rotateX(${-ny * 0.8}deg) translateZ(16px)`;

      // Specular highlight position
      card.style.setProperty("--spec-x", `${50 + nx * 20}%`);
      card.style.setProperty("--spec-y", `${50 + ny * 20}%`);
      card.style.setProperty("--spec-opacity", "0.12");
    };

    const onLeave = () => {
      if (compressed) return;
      card.style.transform = "";
      card.style.setProperty("--spec-opacity", "0");
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [isMobile, reducedMotion, expanded, compressed]);

  return (
    <div
      ref={cardRef}
      role={isMobile ? "button" : "article"}
      tabIndex={isMobile ? 0 : undefined}
      aria-expanded={isMobile ? expanded : undefined}
      aria-label={service.title}
      className="svc-panel relative overflow-hidden outline-none"
      onClick={isMobile ? onTap : undefined}
      onKeyDown={isMobile ? handleKeyDown : undefined}
      onMouseEnter={!isMobile && !compressed ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobile && !compressed ? () => setIsHovered(false) : undefined}
      style={{
        height: isMobile ? "auto" : undefined,
        minHeight: isMobile ? undefined : "clamp(285px, 32vh, 390px)",
        borderRadius: compressed ? 16 : (isMobile ? 20 : 24),
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "linear-gradient(145deg, rgba(25,25,30,0.3), rgba(15,15,20,0.45))",
        border: `1px solid ${compressed ? `${service.accent}30` : (expanded ? `${service.accent}50` : "rgba(255,255,255,0.06)")}`,
        transform: (!isMobile && !compressed && isHovered && !expanded) ? "translateY(-4px)" : "translateY(0)",
        boxShadow: compressed
          ? "none"
          : expanded
            ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 48px ${service.accent}18, 0 0 80px ${service.accent}08`
            : isHovered
              ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)`
              : "inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: `${expanded ? '' : 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), '}border-color 500ms ease, border-radius 500ms ease, box-shadow 400ms ease`,
        willChange: expanded ? "transform" : "auto",
      }}
    >
      {/* Specular highlight — tracks pointer, visible only when active */}
      {!isMobile && (
        <div
          ref={specularRef}
          className="absolute inset-0 z-[30] pointer-events-none rounded-[inherit]"
          style={{
            background: `radial-gradient(ellipse at var(--spec-x, 50%) var(--spec-y, 50%), rgba(255,255,255,var(--spec-opacity, 0)) 0%, transparent 60%)`,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {/* ═══ WALLPAPER LAYER ═══ */}
      <div className="absolute inset-0 z-0">
        <Image
          src={service.image}
          alt=""
          fill
          className="object-cover"
          style={{
            filter: expanded ? "blur(0px)" : "blur(8px)",
            transition: `filter 700ms ${EASE}`,
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(8,8,12,0.82) 0%, rgba(8,8,12,0.91) 40%, rgba(8,8,12,0.97) 100%)",
            opacity: expanded ? 0.72 : 1,
            transition: `opacity 700ms ${EASE}`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 50% 20%, ${service.accent}12 0%, transparent 60%)` }}
        />
      </div>

      {/* ═══ COMPRESSED OVERLAY (desktop, scrolled past) ═══ */}
      {!isMobile && (
        <div
          ref={compressedOverlayRef}
          data-compressed-overlay
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 opacity-0 invisible"
          style={{
            height: 72,
            background: "linear-gradient(145deg, rgba(20,20,25,0.95), rgba(12,12,17,0.98))",
            borderRadius: "inherit",
          }}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold tracking-wider" style={{ color: `${service.accent}80` }}>
              {service.id}
            </span>
            <h3 className="text-sm font-medium text-white/50 truncate max-w-[200px]">
              {service.title}
            </h3>
          </div>
          {IconComp && (
            <div className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <IconComp size={14} className="text-white/30" />
            </div>
          )}
        </div>
      )}

      {/* ═══ MOBILE: COLLAPSED BAR ═══ */}
      {isMobile && !isExpanded && (
        <div className="relative z-10 flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono tracking-wider" style={{ color: service.accent }}>
              {service.id}
            </span>
            <h3 className="text-base font-semibold text-white">{service.title}</h3>
          </div>
          {IconComp && (
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <IconComp size={14} className="text-white/50" />
            </div>
          )}
        </div>
      )}

      {/* ═══ MOBILE: EXPANDED ═══ */}
      {isMobile && isExpanded && (
        <div className="relative z-10 flex flex-col gap-3 p-5" style={{ animation: "mobileReveal 0.3s ease-out" }}>
          {IconComp && (
            <div
              className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${service.accent}1a`, border: `1px solid ${service.accent}4d`, transform: "rotate(12deg)" }}
            >
              <IconComp size={14} style={{ color: service.accent }} />
            </div>
          )}
          <span className="text-[10px] uppercase tracking-[0.4em] font-mono" style={{ color: service.accent }}>
            {service.meta}
          </span>
          <h3 className="text-xl font-semibold text-white leading-tight">{service.title}</h3>
          <p className="text-sm leading-relaxed text-gray-300 font-light italic">{service.outcome}</p>
          <ul className="space-y-1.5 text-sm text-gray-400">
            {service.deliverables.map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: service.accent }} />
                {d}
              </li>
            ))}
          </ul>
          <div
            className="self-start"
            style={{
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "12px 16px",
              boxShadow: `0 4px 20px ${service.accent}12, inset 0 1px 0 rgba(255,255,255,0.06)`,
            }}
          >
            <div style={{ width: 72, height: 48 }}><VisualComp /></div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[10px] tracking-wider"
                style={{ background: `${service.accent}12`, border: `1px solid ${service.accent}30`, color: service.accent }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: `${service.accent}15` }}>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">{service.statLabel}</span>
            <span className="text-sm font-semibold" style={{ color: service.accent }}>{service.statValue}</span>
          </div>
        </div>
      )}

      {/* ═══ DESKTOP CONTENT ═══ */}
      {!isMobile && (
        <div ref={desktopContentRef} data-desktop-content className="relative z-10 flex flex-col h-full" style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
          {/* Icon badge — top right */}
          {IconComp && (
            <div
              className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: expanded ? `${service.accent}15` : "rgba(255,255,255,0.04)",
                border: `1px solid ${expanded ? `${service.accent}40` : "rgba(255,255,255,0.08)"}`,
                transform: expanded
                  ? "rotate(12deg)"
                  : (isHovered ? "rotate(6deg)" : "rotate(0deg)"),
                transition: `all 400ms ${EASE}`,
              }}
            >
              <IconComp
                size={18}
                style={{ color: expanded ? service.accent : "rgba(255,255,255,0.4)", transition: "color 400ms ease" }}
              />
            </div>
          )}

          {/* Always-visible header */}
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[11px] font-mono tracking-wider" style={{ color: service.accent }}>
              {service.id}
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/25">
              {service.meta}
            </span>
          </div>
          <h3
            className="text-2xl lg:text-3xl font-semibold text-white leading-tight"
            style={{
              transform: expanded ? "scale(1.04)" : "scale(1)",
              transformOrigin: "left center",
              transition: `transform 600ms ${EASE}`,
            }}
          >
            {service.title}
          </h3>

          {/* Reveal content — hidden by GSAP in collapsed state */}
          <p
            ref={outcomeRef}
            className="text-[13px] lg:text-sm text-gray-300/80 font-light italic leading-relaxed mt-3"
          >
            {service.outcome}
          </p>

          <div ref={deliverablesRef} className="mt-3 space-y-1.5">
            {service.deliverables.map((d) => (
              <p key={d} className="text-[12px] text-gray-400/70 flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: service.accent }} />
                {d}
              </p>
            ))}
          </div>

          <div ref={tagsRef} className="flex flex-wrap gap-1.5 mt-4">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[10px] tracking-wider"
                style={{ background: `${service.accent}12`, border: `1px solid ${service.accent}30`, color: service.accent }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Bottom row: visual showcase + stat */}
          <div className="flex items-end justify-between mt-auto pt-4">
            <div
              ref={showcaseRef}
              style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "12px 16px",
                boxShadow: `0 4px 20px ${service.accent}12`,
              }}
            >
              <div style={{ width: 72, height: 48 }}><VisualComp /></div>
            </div>

            <div
              ref={statRef}
              className="flex flex-col items-end gap-0.5"
            >
              <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                {service.statLabel}
              </span>
              <span className="text-xl font-semibold" style={{ color: service.accent }}>
                {service.statValue}
              </span>
            </div>
          </div>

          {/* Card number watermark */}
          <div ref={watermarkRef} className="absolute bottom-4 right-6 pointer-events-none select-none" style={{
            fontSize: "clamp(80px, 10vw, 140px)",
            fontWeight: 800,
            lineHeight: 1,
            color: `${service.accent}0a`,
            letterSpacing: "-0.04em",
          }}>
            {service.id}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Main Section ─────────────── */

export function Bento3Section() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railFillRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const cardNaturalHeights = useRef<number[]>([]);
  const virtualTriggerRef = useRef<HTMLDivElement>(null);
  const dissolveSentinelRef = useRef<HTMLDivElement>(null);
  const diskOffsetYRef = useRef(0.35);
  const depthProxyRef = useRef({ y: 0.35, dustOpacity: 0, hazeOpacity: 0, pointerInfluence: 0 });
  const { pointerRef, isInsideRef } = usePointerParallax(outerRef, !isMobile && !reducedMotion);
  const bgInnerRef = useRef<HTMLDivElement>(null);

  /* Keyframe injection */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = KEYFRAME_CSS;
    document.head.appendChild(s);
    return () => { if (s.parentNode) s.remove(); };
  }, []);

  /* prefers-reduced-motion */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* Mobile detection — matchMedia for consistency with Tailwind's md: breakpoint */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 767.5px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  /* GSAP ScrollTrigger — one per card (desktop) */
  useGSAP(
    () => {
      if (isMobile || reducedMotion) return;

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        ScrollTrigger.create({
          trigger: card,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
          onLeave: i === SERVICES.length - 1 ? () => setActiveIndex(-1) : undefined,
          onLeaveBack: i === 0 ? () => setActiveIndex(-1) : undefined,
        });
      });
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* Continuous scroll progress — drives rail fill */
  useGSAP(
    () => {
      if (!cardsContainerRef.current || isMobile || reducedMotion) return;
      ScrollTrigger.create({
        trigger: cardsContainerRef.current,
        start: "top 60%",
        end: "bottom 30%",
        onUpdate: (self) => {
          if (railFillRef.current) {
            railFillRef.current.style.height = `${self.progress * 100}%`;
          }
        },
      });
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* Left column scroll entrance — horizontal wipe from left */
  useGSAP(
    () => {
      if (!headerRef.current || reducedMotion) return;
      const children = headerRef.current.children;

      if (isMobile) {
        // Mobile: vertical fade-in (unchanged)
        gsap.set(children, { opacity: 0, y: 30, filter: "blur(6px)" });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1, y: 0, filter: "blur(0px)",
              duration: 0.8, stagger: 0.12, ease: "power3.out",
            });
          },
        });
      } else {
        // Desktop: directional wipe from left — matches left-justified alignment
        gsap.set(children, { opacity: 0, x: -30, filter: "blur(6px)" });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1, x: 0, filter: "blur(0px)",
              duration: 0.9, stagger: 0.14, ease: "power3.out",
            });
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* Card entrance — scrub-driven on desktop, once-fire on mobile */
  useGSAP(
    () => {
      if (reducedMotion) return;
      const mm = gsap.matchMedia();

      // Desktop: scrub-driven entrance — horizontal slide from right
      // Creates a directional counterpoint to the left column's wipe-from-left
      mm.add("(min-width: 768px)", () => {
        cardRefs.current.forEach((wrapper, i) => {
          if (!wrapper) return;
          const card = wrapper.querySelector(".svc-panel");
          if (!card) return;
          gsap.set(card, {
            opacity: 0,
            x: 40,
            y: 30,
            scale: 0.97,
            filter: "blur(4px)",
            transformPerspective: 1200,
          });
          gsap.to(card, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.6,
            },
          });
        });
      });

      // Mobile: once-fire with stagger
      mm.add("(max-width: 767px)", () => {
        const cards = cardRefs.current
          .map((w) => w?.querySelector(".svc-panel"))
          .filter(Boolean);
        if (!cards.length) return;
        gsap.set(cards, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: cards[0]!,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power3.out",
            });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* Footer metrics/CTA entrance */
  useGSAP(
    () => {
      if (!footerRef.current || reducedMotion) return;
      const children = footerRef.current.children;
      gsap.set(children, { opacity: 0, y: 30, filter: "blur(4px)" });
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(children, {
            opacity: 1, y: 0, filter: "blur(0px)",
            duration: 0.7, stagger: 0.12, ease: "power3.out",
          });
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* ═══ ACCRETION DISK PARALLAX + DEPTH EFFECT CHOREOGRAPHY ═══ */
  useGSAP(
    () => {
      if (isMobile || reducedMotion) return;

      const proxy = depthProxyRef.current;

      gsap.to(proxy, {
        keyframes: {
          "0%":   { y: 0.35, dustOpacity: 0,    hazeOpacity: 0,    pointerInfluence: 0 },
          "15%":  { y: 0.10, dustOpacity: 0.65,  hazeOpacity: 0.06, pointerInfluence: 1 },
          "85%":  { y: 0.10, dustOpacity: 0.65,  hazeOpacity: 0.06, pointerInfluence: 1 },
          "100%": { y: -0.20, dustOpacity: 0,    hazeOpacity: 0,    pointerInfluence: 0 },
        },
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
        onUpdate: () => {
          diskOffsetYRef.current = proxy.y;
        },
      });
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* ═══ SCROLL-DRIVEN CARD COMPRESSION ═══ */
  /* As card N+1 enters viewport, card N continuously compresses from full → 72px bar.
     Once fully compressed, the bar switches to position:fixed so it stays pinned
     even after its sticky wrapper scrolls off-screen. This lets all compressed bars
     stack visually at the top of the viewport as the user scrolls deeper. */
  useGSAP(
    () => {
      if (isMobile || reducedMotion) return;

      // Measure natural heights after initial render
      cardRefs.current.forEach((wrapper, i) => {
        if (!wrapper) return;
        const card = wrapper.querySelector(".svc-panel") as HTMLElement;
        if (card) {
          const savedH = card.style.height;
          const savedMH = card.style.minHeight;
          card.style.height = "";
          card.style.minHeight = "";
          cardNaturalHeights.current[i] = card.offsetHeight;
          card.style.height = savedH;
          card.style.minHeight = savedMH;
        }
      });

      // Measure card horizontal position from the right column container.
      // All cards share the same left/width since they're in the same grid column.
      const container = cardsContainerRef.current;
      let fixedLeft = 0;
      let fixedWidth = 0;
      if (container) {
        const cr = container.getBoundingClientRect();
        fixedLeft = cr.left;
        fixedWidth = cr.width;
      }

      // Track which cards are currently pinned with position:fixed
      const pinnedCards = new Set<number>();

      // Helper: pin a compressed card bar with position:fixed
      const pinCard = (card: HTMLElement, i: number) => {
        if (pinnedCards.has(i)) return;
        pinnedCards.add(i);
        const stickyTop = 100 + i * 76;
        card.style.position = "fixed";
        card.style.top = `${stickyTop}px`;
        card.style.left = `${fixedLeft}px`;
        card.style.width = `${fixedWidth}px`;
        card.style.zIndex = `${50 + i}`;
        // Ensure fully compressed state
        card.style.height = "72px";
        card.style.minHeight = "0";
        card.style.overflow = "hidden";
      };

      // Helper: unpin a card (revert to normal flow inside sticky parent)
      const unpinCard = (card: HTMLElement, i: number) => {
        if (!pinnedCards.has(i)) return;
        pinnedCards.delete(i);
        card.style.position = "";
        card.style.top = "";
        card.style.left = "";
        card.style.width = "";
        card.style.zIndex = "";
      };

      // Update fixedLeft/fixedWidth on resize so pinned cards stay aligned
      const handleResize = () => {
        if (!container) return;
        const cr = container.getBoundingClientRect();
        fixedLeft = cr.left;
        fixedWidth = cr.width;
        // Update any currently pinned cards
        pinnedCards.forEach((idx) => {
          const wrapper = cardRefs.current[idx];
          const card = wrapper?.querySelector(".svc-panel") as HTMLElement;
          if (card) {
            card.style.left = `${fixedLeft}px`;
            card.style.width = `${fixedWidth}px`;
          }
        });
      };
      window.addEventListener("resize", handleResize);

      /* Edge-touching compression: each card compresses exactly when the next
         card's top edge meets the current card's bottom edge. Pixel-based
         start/end ensure 1:1 scroll-to-compression tracking across viewports.
         The last card uses virtualTriggerRef — an invisible "next wrapper" —
         so it gets identical timing and avoids the sticky-failure teleport. */
      cardRefs.current.forEach((wrapper, i) => {
        if (!wrapper) return;

        // For the last card, use the virtual trigger; otherwise the next wrapper
        const isLast = i === SERVICES.length - 1;
        const triggerEl = isLast
          ? virtualTriggerRef.current
          : cardRefs.current[i + 1];
        if (!triggerEl) return;

        const card = wrapper.querySelector(".svc-panel") as HTMLElement;
        const overlay = card?.querySelector("[data-compressed-overlay]") as HTMLElement;
        const content = card?.querySelector("[data-desktop-content]") as HTMLElement;
        if (!card || !overlay || !content) return;

        const naturalH = cardNaturalHeights.current[i] || card.offsetHeight;
        const stickyTop = 100 + i * 76;

        ScrollTrigger.create({
          trigger: triggerEl,
          // start: next card's top touches current card's bottom
          // end: current card fully compressed (72px), edges still touching
          start: () => `top ${stickyTop + (cardNaturalHeights.current[i] || naturalH)}px`,
          end: () => `top ${stickyTop + 72}px`,
          scrub: 0.15, // tight scrub for precise edge-tracking
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Pinned cards are fully compressed and position:fixed —
            // don't let scrub lag override them. Only onEnterBack unpins.
            if (pinnedCards.has(i)) return;

            if (p <= 0.005) {
              // Fully restored — clear all inline styles
              card.style.height = "";
              card.style.minHeight = "";
              card.style.overflow = "";
              content.style.opacity = "1";
              overlay.style.opacity = "0";
              overlay.style.visibility = "hidden";
              return;
            }

            // Height: naturalH → 72px
            const h = naturalH - (naturalH - 72) * p;
            card.style.height = `${h}px`;
            card.style.minHeight = "0";
            card.style.overflow = "hidden";

            // Content fadeout (first 50% of scrub — fully gone by midpoint)
            const cp = Math.min(p / 0.5, 1);
            content.style.opacity = `${1 - cp}`;

            // Bar fadein — appears only when card height ≈ overlay height (72px).
            const bp = Math.max((p - 0.95) / 0.05, 0);
            overlay.style.opacity = `${bp}`;
            overlay.style.visibility = bp > 0.01 ? "visible" : "hidden";
          },
          // Card fully compressed — pin it so the bar stays visible
          onLeave: () => {
            pinCard(card, i);
            content.style.opacity = "0";
            overlay.style.opacity = "1";
            overlay.style.visibility = "visible";
          },
          // Scrolling back into compression range — unpin to let scrub control it
          onEnterBack: () => {
            unpinCard(card, i);
          },
          // Scroll exited compression range backward — force full visual reset.
          // onUpdate only fires between start/end; styles set by onLeave/pinCard
          // survive outside that range without this explicit cleanup.
          onLeaveBack: () => {
            card.style.height = "";
            card.style.minHeight = "";
            card.style.overflow = "";
            content.style.opacity = "1";
            overlay.style.opacity = "0";
            overlay.style.visibility = "hidden";
          },
        });
      });

      /* Section exit: staggered dissolve of compressed bars.
         Uses dissolveSentinelRef (a 150px marker AFTER the footer) as the
         trigger instead of outerRef — outerRef's bottom shifts dynamically
         as cards pin/unpin (position:fixed changes document flow), causing
         stale trigger positions and progress miscalculation on reverse scroll.

         Uses direct style.opacity (not GSAP tweens) because the entrance
         animations (gsap.to + scrollTrigger scrub) create perpetually-active
         tweens on .svc-panel opacity/transform. GSAP tween conflicts cause
         dissolve to silently fail on the last card. Direct style manipulation
         bypasses GSAP's overwrite mechanism entirely.

         Targets the WRAPPER elements (cardRefs), NOT .svc-panel, because
         the entrance animations (gsap.to + scrollTrigger scrub) maintain
         perpetual GSAP tweens on .svc-panel opacity. GSAP scrub tweens
         re-assert their values every render tick, overwriting any direct
         style.opacity changes. By dissolving the WRAPPER instead, opacity
         cascades visually to .svc-panel children without property conflict.

         Only opacity + visibility are animated (no transform). */
      const sentinel = dissolveSentinelRef.current;
      if (sentinel) {
        ScrollTrigger.create({
          trigger: sentinel,
          start: "top bottom",       // sentinel top hits viewport bottom
          end: "bottom bottom",      // sentinel bottom hits viewport bottom
          onUpdate: (self) => {
            const p = self.progress;
            const stagger = 0.08;
            const duration = 1 - (SERVICES.length - 1) * stagger;
            cardRefs.current.forEach((w, idx) => {
              if (!w) return;
              const barP = Math.max(0, Math.min(1, (p - idx * stagger) / duration));
              w.style.opacity = `${1 - barP}`;
            });
          },
          onLeave: () => {
            cardRefs.current.forEach((w) => {
              if (!w) return;
              w.style.opacity = "0";
              w.style.visibility = "hidden";
            });
          },
          onEnterBack: () => {
            cardRefs.current.forEach((w) => {
              if (!w) return;
              w.style.visibility = "";
            });
          },
          onLeaveBack: () => {
            cardRefs.current.forEach((w) => {
              if (!w) return;
              w.style.opacity = "1";
            });
          },
        });
      }

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* ═══ CUSTOM CURSOR — section-scoped dot + ring ═══ */
  useEffect(() => {
    if (isMobile || reducedMotion) return;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    const section = outerRef.current;
    if (!dot || !ring || !section) return;

    // GSAP quickTo for the ring's lerped follow (0.4s duration = ~100ms perceived lag)
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    let currentTarget: string | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // Dot follows instantly via transform
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      // Ring follows with elastic lag
      ringX(e.clientX);
      ringY(e.clientY);

      // Detect hover target for cursor morphing
      const target = e.target as HTMLElement;
      const isOverCard = target.closest(".svc-panel");
      const isOverButton = target.closest("a, button");
      const newTarget = isOverButton ? "button" : isOverCard ? "card" : null;

      if (newTarget !== currentTarget) {
        currentTarget = newTarget;
        if (isOverButton) {
          gsap.to(dot, { scale: 0, duration: 0.15 });
          gsap.to(ring, { width: 48, height: 48, borderColor: "rgba(255,255,255,0.5)", duration: 0.3, ease: "power2.out" });
        } else if (isOverCard) {
          gsap.to(dot, { scale: 1.5, duration: 0.2, ease: "back.out(2)" });
          gsap.to(ring, { width: 48, height: 48, borderColor: "rgba(255,255,255,0.4)", duration: 0.3, ease: "power2.out" });
        } else {
          gsap.to(dot, { scale: 1, duration: 0.2 });
          gsap.to(ring, { width: 32, height: 32, borderColor: "rgba(255,255,255,0.15)", duration: 0.3 });
        }
      }
    };

    const handleEnter = () => {
      section.style.cursor = "none";
      gsap.to(dot, { opacity: 0.9, scale: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(ring, { opacity: 1, scale: 1, duration: 0.35, ease: "power2.out", delay: 0.05 });
    };

    const handleLeave = () => {
      section.style.cursor = "";
      currentTarget = null;
      gsap.to(dot, { opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in" });
      gsap.to(ring, { opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in" });
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseenter", handleEnter);
    section.addEventListener("mouseleave", handleLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseenter", handleEnter);
      section.removeEventListener("mouseleave", handleLeave);
      section.style.cursor = "";
    };
  }, [isMobile, reducedMotion]);

  /* ═══ POINTER PARALLAX — per-layer damped transforms ═══ */
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const bgInner = bgInnerRef.current;
    const headerEl = headerRef.current;
    if (!bgInner) return;

    // Far plane: heavy damping (1.2s) — the background feels massive
    const bgX = gsap.quickTo(bgInner, "x", { duration: 1.2, ease: "power2.out" });
    const bgY = gsap.quickTo(bgInner, "y", { duration: 1.2, ease: "power2.out" });
    const bgRotate = gsap.quickTo(bgInner, "rotation", { duration: 1.4, ease: "power2.out" });

    // Headline: very light response (0.8s)
    let headX: gsap.QuickToFunc | null = null;
    let headY: gsap.QuickToFunc | null = null;
    if (headerEl) {
      headX = gsap.quickTo(headerEl, "x", { duration: 0.8, ease: "power2.out" });
      headY = gsap.quickTo(headerEl, "y", { duration: 0.8, ease: "power2.out" });
    }

    let rafId = 0;

    const tick = () => {
      const { nx, ny } = pointerRef.current;
      const influence = depthProxyRef.current.pointerInfluence;

      // Far plane: translate 24px x, 18px y, rotate 0.5deg
      bgX(nx * 24 * influence);
      bgY(ny * 18 * influence);
      bgRotate(nx * 0.5 * influence);

      // Headline: translate 4px max
      if (headX && headY) {
        headX(nx * 4 * influence);
        headY(ny * 3 * influence);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [isMobile, reducedMotion]);

  /* Handlers */
  const handleCheckpointClick = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleMobileTap = useCallback((id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div ref={outerRef} className="relative w-full bg-black text-gray-300" id="services">
      {/* Background layers — sticky on desktop (parallax), absolute on mobile */}
      <div className={`${isMobile ? 'absolute inset-0' : 'sticky top-0 h-screen w-full'} overflow-hidden pointer-events-none z-0`}>
        <div ref={bgInnerRef} className="absolute inset-0" style={{ willChange: isMobile ? 'auto' : 'transform' }}>
          <AccretionBackground reducedMotion={reducedMotion} offsetYRef={diskOffsetYRef} />

          {/* Noise grain overlay */}
          <div className="absolute inset-0 pointer-events-none z-[1]" style={{ opacity: 0.03, mixBlendMode: "overlay" }}>
            <svg width="100%" height="100%">
              <filter id="svcNoise">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#svcNoise)" />
            </svg>
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)" }}
          />

          {/* Directional fade — darker on right for card readability */}
          <div
            className="absolute inset-0 pointer-events-none z-[3]"
            style={{
              background: "linear-gradient(to right, transparent 0%, transparent 30%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.45) 100%)",
            }}
          />
        </div>
      </div>

      {/* Separator accent lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9900ff]/60 to-transparent z-[3]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00eeff]/80 to-transparent shadow-[0_0_25px_rgba(0,238,255,1)] z-[3]" />

      {/* ═══ SCROLL RAIL — absolute far-left, outside grid ═══ */}
      {!isMobile && (
        <div
          className="hidden md:block absolute z-20"
          style={{ left: "clamp(16px, 2.5vw, 40px)", top: 0, bottom: 0, width: 48 }}
        >
          <div
            className="sticky flex flex-col items-center"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              height: `${SERVICES.length * 64 + (SERVICES.length - 1) * 20}px`,
            }}
          >
            <ScrollRail
              activeIndex={activeIndex}
              total={SERVICES.length}
              railFillRef={railFillRef}
              onCheckpointClick={handleCheckpointClick}
            />
          </div>
        </div>
      )}

      <motion.section
        ref={sectionRef}
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        className="relative z-10 mx-auto max-w-[1440px] py-20 md:py-28"
        style={{ paddingInline: "clamp(1rem, 4vw, 2.5rem)", marginTop: isMobile ? 0 : '-100vh' }}
      >
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {activeIndex >= 0
            ? `Viewing service ${activeIndex + 1} of ${SERVICES.length}: ${SERVICES[activeIndex].title}`
            : "Scroll to explore services"}
        </div>

        {/* ═══ 2-COLUMN LAYOUT (desktop) / Single column (mobile) ═══ */}
        <div className="md:grid md:grid-cols-[minmax(280px,1.5fr)_minmax(0,3fr)] md:gap-16 lg:gap-20">

          {/* ═══ LEFT COLUMN — Sticky narrative anchor (left-justified) ═══ */}
          <div
            ref={headerRef}
            className="flex flex-col items-start text-left gap-4 pb-10 md:pb-0 md:sticky md:self-start"
            style={{ top: "clamp(80px, 10vh, 120px)" }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#00eeff] shadow-[0_0_10px_rgba(0,238,255,0.5)] animate-pulse" />
              <span className="text-[11px] uppercase tracking-[0.5em] text-[#00eeff]">Core Capabilities</span>
            </div>
            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-semibold tracking-tight leading-[1.1]"
              style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #00eeff 70%, #9900ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              End-to-end development across every layer of the stack.
            </h2>
            {/* Subtitle */}
            <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed md:max-w-none">
              From world-class product interfaces to intelligent backend systems. We build secure, scalable software that moves markets.
            </p>

          </div>

          {/* ═══ RIGHT COLUMN — Scrolling cards (right-justified) ═══ */}
          <div ref={cardsContainerRef} className={isMobile ? "w-full space-y-3 pb-16" : "relative pt-6 lg:pt-10"}>
          {SERVICES.map((service, idx) => (
            <div key={service.id} ref={(el) => { cardRefs.current[idx] = el; }}
              className={isMobile ? "" : "relative"}
              style={isMobile ? undefined : { height: "90vh" }}>
              <div style={isMobile ? undefined : {
                position: "sticky" as const,
                top: `${100 + idx * 76}px`,
                zIndex: idx + 1,
              }}>
                {/* Ambient glow — bleeds outside active card */}
                {!isMobile && (
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      inset: -40,
                      borderRadius: 64,
                      background: `radial-gradient(ellipse at 50% 30%, ${SERVICES[idx].accent}12 0%, transparent 70%)`,
                      opacity: activeIndex === idx ? 1 : 0,
                      transition: "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                      zIndex: 0,
                    }}
                  />
                )}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <StackCard
                    service={service}
                    isActive={activeIndex === idx}
                    isPast={activeIndex >= 0 && activeIndex > idx}
                    index={idx}
                    totalCards={SERVICES.length}
                    isMobile={isMobile}
                    isExpanded={expandedMobileId === service.id}
                    onTap={() => handleMobileTap(service.id)}
                    reducedMotion={reducedMotion}
                  />
                </div>
              </div>
            </div>
          ))}
          {/* Virtual trigger — invisible "next card" for last card compression.
              Same height as other wrappers so the last card gets identical
              compression distance and edge-tracking behavior. */}
          {!isMobile && (
            <div ref={virtualTriggerRef} aria-hidden="true"
              style={{ height: "90vh", pointerEvents: "none" }} />
          )}
          </div>
        </div>

        {/* ═══ FOOTER — Metrics + CTA ═══ */}
        <div ref={footerRef} className="relative z-10 flex flex-col items-center gap-10 pb-20 md:pb-28">
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            {METRICS.map((m) => (
              <div key={m.label} className="flex flex-col items-center gap-1 rounded-xl px-4 py-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-xl md:text-2xl font-semibold text-white">{m.value}</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 text-center">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs uppercase tracking-[0.35em] text-[#00eeff]">Need something custom?</span>
            <a href="#contact"
              className="inline-flex items-center px-8 py-3.5 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              style={{ transition: "all 300ms cubic-bezier(0.16, 1, 0.3, 1)" }}>
              Start a Conversation
            </a>
          </div>
        </div>
      {/* Dissolve sentinel — fixed-height marker whose position is NOT
          affected by card pinning (cards pin above this in the DOM flow).
          The dissolve timeline triggers off this element's top/bottom
          crossing the viewport, giving stable trigger positions. */}
      {!isMobile && (
        <div ref={dissolveSentinelRef} aria-hidden="true"
          style={{ height: 150, pointerEvents: "none" }} />
      )}
      </motion.section>

      {/* ═══ CUSTOM CURSOR — dot + ring, section-scoped ═══ */}
      {!isMobile && (
        <>
          <div
            ref={cursorDotRef}
            className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
            style={{
              width: 8,
              height: 8,
              background: "white",
              opacity: 0,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          />
          <div
            ref={cursorRingRef}
            className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
            style={{
              width: 32,
              height: 32,
              border: "1.5px solid rgba(255,255,255,0.15)",
              opacity: 0,
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          />
        </>
      )}
    </div>
  );
}

export default Bento3Section;
