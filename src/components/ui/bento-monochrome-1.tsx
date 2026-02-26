"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { staggerContainer } from "@/lib/animations";
import { Layers, Code2, Brain, Server } from "lucide-react";

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

/* ─────────────── Liquid Canvas (Paper.js) ─────────────── */

interface BlobConfig {
  x: number;
  y: number;
  radius: number;
  color: string;
  noiseSpeed: number;
  noiseAmp: number;
}

const BLOB_CONFIGS: BlobConfig[] = [
  { x: 0.15, y: 0.2,  radius: 180, color: "rgba(153,0,255,0.4)",  noiseSpeed: 0.4, noiseAmp: 30 },
  { x: 0.7,  y: 0.35, radius: 170, color: "rgba(0,238,255,0.35)", noiseSpeed: 0.35, noiseAmp: 28 },
  { x: 0.4,  y: 0.15, radius: 160, color: "rgba(255,0,255,0.35)", noiseSpeed: 0.45, noiseAmp: 25 },
  { x: 0.2,  y: 0.65, radius: 140, color: "rgba(153,0,255,0.3)",  noiseSpeed: 0.3, noiseAmp: 22 },
  { x: 0.75, y: 0.7,  radius: 130, color: "rgba(0,238,255,0.25)", noiseSpeed: 0.38, noiseAmp: 20 },
];

const SEGMENTS = 8;
const CURSOR_RADIUS = 200;
const CURSOR_FORCE = 8000;
const LERP_FACTOR = 0.08;

const LiquidCanvas = React.memo(function LiquidCanvas({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paperScopeRef = useRef<any>(null);
  const mousePos = useRef({ x: -9999, y: -9999 });
  const lastFrameTime = useRef(0);
  const reducedMotionRef = useRef(reducedMotion);
  const isMobileRef = useRef(isMobile);

  // Keep refs in sync without tearing down Paper.js
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);
  useEffect(() => { isMobileRef.current = isMobile; }, [isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let destroyed = false;
    let resizeHandler: (() => void) | null = null;
    let resizeCleanup: (() => void) | null = null;

    (async () => {
      // Use paper-core (excludes PaperScript/Acorn) to avoid
      // dev-mode `global.acorn` resolution failure in webpack.
      const paperModule = await import(
        /* webpackChunkName: "paper" */ "paper/dist/paper-core.js"
      );
      const paper = (paperModule.default ?? paperModule) as typeof import("paper");

      if (destroyed) return;

      const scope = new paper.PaperScope();
      scope.setup(canvas);
      paperScopeRef.current = scope;

      const paths: paper.Path[] = [];

      BLOB_CONFIGS.forEach((cfg) => {
        const center = new scope.Point(
          canvas.width * cfg.x,
          canvas.height * cfg.y
        );

        const path = new scope.Path();
        path.closed = true;
        path.fillColor = new scope.Color(cfg.color);

        for (let i = 0; i < SEGMENTS; i++) {
          const angle = (i / SEGMENTS) * Math.PI * 2;
          const px = center.x + Math.cos(angle) * cfg.radius;
          const py = center.y + Math.sin(angle) * cfg.radius;
          path.add(new scope.Point(px, py));
        }
        path.smooth({ type: "continuous" });
        paths.push(path);
      });

      // Store original positions for noise reference
      const originals = paths.map((p) =>
        p.segments.map((s) => ({ x: s.point.x, y: s.point.y }))
      );

      // Animation loop — time-based 30fps cap (works on 60/120/144Hz)
      const FRAME_INTERVAL = 1 / 30;

      scope.view.onFrame = (event: { count: number; time: number }) => {
        if (event.time - lastFrameTime.current < FRAME_INTERVAL) return;
        lastFrameTime.current = event.time;

        const t = event.time;
        const rm = reducedMotionRef.current;
        const mob = isMobileRef.current;

        paths.forEach((path, bi) => {
          const cfg = BLOB_CONFIGS[bi];
          const orig = originals[bi];
          const speed = rm ? 0 : (mob ? cfg.noiseSpeed * 0.3 : cfg.noiseSpeed);
          const amp = rm ? 0 : cfg.noiseAmp;

          path.segments.forEach((seg, si) => {
            const o = orig[si];

            // Layered sin composition for organic noise
            const n1 = Math.sin(t * speed + si * 1.7 + bi * 2.3) * amp;
            const n2 = Math.sin(t * speed * 0.7 + si * 2.9 + bi * 1.1) * amp * 0.5;
            const n3 = Math.cos(t * speed * 1.3 + si * 0.8 + bi * 3.7) * amp * 0.3;

            let targetX = o.x + n1 + n3;
            let targetY = o.y + n2 + n3;

            // Cursor magnetic repulsion (desktop only)
            if (!mob && !rm) {
              const mx = mousePos.current.x;
              const my = mousePos.current.y;
              const dx = targetX - mx;
              const dy = targetY - my;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < CURSOR_RADIUS && dist > 1) {
                const force = CURSOR_FORCE / (dist * dist);
                targetX += (dx / dist) * force;
                targetY += (dy / dist) * force;
              }
            }

            // Lerp for smooth thick-liquid motion
            seg.point.x += (targetX - seg.point.x) * LERP_FACTOR;
            seg.point.y += (targetY - seg.point.y) * LERP_FACTOR;
          });

          path.smooth({ type: "continuous" });
        });
      };

      // Resize handler
      resizeHandler = () => {
        if (!canvas || destroyed) return;
        const rect = canvas.parentElement?.getBoundingClientRect();
        if (!rect) return;
        scope.view.viewSize = new scope.Size(rect.width, rect.height);

        paths.forEach((path, bi) => {
          const cfg = BLOB_CONFIGS[bi];
          const newCenter = new scope.Point(rect.width * cfg.x, rect.height * cfg.y);
          const oldCenter = path.bounds.center;
          const delta = newCenter.subtract(oldCenter);
          path.translate(delta);
          originals[bi] = path.segments.map((s) => ({ x: s.point.x, y: s.point.y }));
        });
      };

      let resizeTimer: ReturnType<typeof setTimeout>;
      const debouncedResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { if (resizeHandler) resizeHandler(); }, 150);
      };
      window.addEventListener("resize", debouncedResize);

      // Store debounced handler for cleanup
      resizeCleanup = () => {
        clearTimeout(resizeTimer);
        window.removeEventListener("resize", debouncedResize);
      };
    })();

    // Mouse tracking on the canvas
    const handleMouse = (e: MouseEvent) => {
      if (isMobileRef.current) return;
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      destroyed = true;
      canvas.removeEventListener("mousemove", handleMouse);
      if (resizeCleanup) resizeCleanup();
      if (paperScopeRef.current) {
        // scope.remove() calls clear() internally, removing all projects and views
        paperScopeRef.current.remove();
        paperScopeRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{
        filter: "blur(40px)",
        mixBlendMode: "screen",
        willChange: "transform",
      }}
      data-paper-resize="true"
    />
  );
});

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
  onCheckpointClick,
}: {
  activeIndex: number;
  total: number;
  onCheckpointClick: (index: number) => void;
}) {
  const fillPct = activeIndex >= 0 ? ((activeIndex + 1) / total) * 100 : 0;

  return (
    <div
      className="hidden md:block absolute z-20"
      style={{
        left: "clamp(16px, 2vw, 32px)",
        top: 0,
        bottom: 0,
        width: 48,
      }}
    >
      {/* Sticky container — vertically centered in viewport */}
      <div
        className="sticky flex flex-col items-center"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          height: `${total * 64 + (total - 1) * 20}px`,
        }}
        role="navigation"
        aria-label="Service progress"
      >
        {/* Track line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Gradient fill line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-[1px] rounded-full"
          style={{
            height: `${fillPct}%`,
            background: "linear-gradient(to bottom, #00eeff, #ff00ff, #9900ff)",
            boxShadow: "0 0 10px rgba(0,238,255,0.3), 0 0 4px rgba(255,0,255,0.15)",
            transition: "height 700ms cubic-bezier(0.16, 1, 0.3, 1)",
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

      if (oc) gsap.set(oc, { opacity: 0, y: 14 });
      if (dl) gsap.set(dl, { opacity: 0, y: 12 });
      if (sc) gsap.set(sc, { opacity: 0, scale: 0.92, y: 10 });
      if (tg) gsap.set(tg, { opacity: 0, y: 10 });
      if (st) gsap.set(st, { opacity: 0, y: 8 });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (oc) tl.to(oc, { opacity: 1, y: 0, duration: 0.5 }, 0);
      if (dl) tl.to(dl, { opacity: 1, y: 0, duration: 0.45 }, 0.08);
      if (tg) tl.to(tg, { opacity: 1, y: 0, duration: 0.4 }, 0.18);
      if (sc) tl.to(sc, { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.3)" }, 0.26);
      if (st) tl.to(st, { opacity: 1, y: 0, duration: 0.4 }, 0.32);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (isMobile) onTap();
      }
    },
    [isMobile, onTap]
  );

  /* ═══ COMPRESSED STATE (desktop, scrolled past) ═══ */
  if (compressed) {
    return (
      <div ref={cardRef} className="svc-panel relative overflow-hidden" style={{
        height: 72,
        borderRadius: 16,
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        background: "linear-gradient(145deg, rgba(25,25,30,0.5), rgba(15,15,20,0.7))",
        borderTop: `2px solid ${service.accent}40`,
        borderLeft: "1px solid rgba(255,255,255,0.04)",
        borderRight: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        transition: `all 600ms cubic-bezier(0.16, 1, 0.3, 1)`,
      }}>
        <div className="flex items-center justify-between h-full px-6">
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
      </div>
    );
  }

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
      onMouseEnter={!isMobile ? () => setIsHovered(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsHovered(false) : undefined}
      style={{
        height: isMobile ? "auto" : undefined,
        minHeight: isMobile ? undefined : "clamp(520px, 60vh, 720px)",
        borderRadius: isMobile ? 20 : 24,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "linear-gradient(145deg, rgba(25,25,30,0.3), rgba(15,15,20,0.45))",
        border: `1px solid ${expanded ? `${service.accent}50` : "rgba(255,255,255,0.06)"}`,
        transform: (!isMobile && isHovered && !expanded) ? "translateY(-4px)" : "translateY(0)",
        boxShadow: expanded
          ? `inset 0 1px 0 rgba(255,255,255,0.12), 0 12px 48px ${service.accent}18, 0 0 80px ${service.accent}08`
          : isHovered
            ? `inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)`
            : "inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: `transform 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease, box-shadow 400ms ease`,
        willChange: expanded ? "transform" : "auto",
      }}
    >
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
        <div className="relative z-10 flex flex-col h-full" style={{ padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
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
          <div className="absolute bottom-4 right-6 pointer-events-none select-none" style={{
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

  /* Refresh ScrollTrigger after card height transitions */
  useEffect(() => {
    if (isMobile) return;
    const timer = setTimeout(() => { ScrollTrigger.refresh(); }, 700);
    return () => clearTimeout(timer);
  }, [activeIndex, isMobile]);

  /* Left column scroll entrance */
  useGSAP(
    () => {
      if (!headerRef.current || isMobile || reducedMotion) return;
      const children = headerRef.current.children;
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
    },
    { scope: sectionRef, dependencies: [isMobile, reducedMotion] }
  );

  /* Card staggered entrance with perspective */
  useGSAP(
    () => {
      if (reducedMotion) return;
      cardRefs.current.forEach((wrapper, i) => {
        if (!wrapper) return;
        const card = wrapper.querySelector(".svc-panel");
        if (!card) return;
        gsap.set(card, {
          opacity: 0,
          y: 60,
          scale: 0.95,
          filter: "blur(8px)",
          rotateX: 4,
          transformPerspective: 1200,
        });
        ScrollTrigger.create({
          trigger: wrapper,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              rotateX: 0,
              duration: 0.9,
              delay: i * 0.08,
              ease: "power3.out",
            });
          },
        });
      });
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

  /* Handlers */
  const handleCheckpointClick = useCallback((index: number) => {
    const card = cardRefs.current[index];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleMobileTap = useCallback((id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="relative w-full bg-black text-gray-300" id="services">
      {/* Liquid nebula canvas background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <LiquidCanvas reducedMotion={reducedMotion} isMobile={isMobile} />
      </div>

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

      {/* ═══ SECTION WATERMARK ═══ */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-[1]"
        style={{
          fontSize: "clamp(120px, 15vw, 220px)",
          fontWeight: 800,
          letterSpacing: "0.05em",
          color: "rgba(255,255,255,0.02)",
          whiteSpace: "nowrap",
        }}
      >
        SERVICES
      </div>

      {/* Separator accent lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#9900ff]/60 to-transparent z-[3]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-gradient-to-r from-transparent via-[#00eeff]/80 to-transparent shadow-[0_0_25px_rgba(0,238,255,1)] z-[3]" />

      {/* ═══ SCROLL RAIL — Far left (desktop only) ═══ */}
      {!isMobile && (
        <ScrollRail
          activeIndex={activeIndex}
          total={SERVICES.length}
          onCheckpointClick={handleCheckpointClick}
        />
      )}

      {/* ═══ HORIZONTAL ACCENT LINE — tracks active card, scoped to section ═══ */}
      {!isMobile && activeIndex >= 0 && (
        <div
          className="absolute left-0 right-0 z-[4] pointer-events-none"
          style={{
            top: 0,
            bottom: 0,
          }}
        >
          <div
            className="sticky left-0 right-0 w-full"
            style={{
              top: `${100 + activeIndex * 72 + 36}px`,
              height: 1,
              background: `linear-gradient(to right, transparent 0%, ${SERVICES[activeIndex].accent}15 10%, ${SERVICES[activeIndex].accent}30 50%, ${SERVICES[activeIndex].accent}15 90%, transparent 100%)`,
              transition: "top 700ms cubic-bezier(0.16, 1, 0.3, 1), background 400ms ease",
            }}
          />
        </div>
      )}

      <motion.section
        ref={sectionRef}
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.08 }}
        className="relative z-10 mx-auto max-w-6xl py-20 md:py-28"
        style={{ paddingInline: "clamp(1.25rem, 5vw, 3rem)" }}
      >
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {activeIndex >= 0
            ? `Viewing service ${activeIndex + 1} of ${SERVICES.length}: ${SERVICES[activeIndex].title}`
            : "Scroll to explore services"}
        </div>

        {/* ═══ SECTION HEADER — Centered, full-width ═══ */}
        <div ref={headerRef} className="flex flex-col items-center text-center gap-5 pb-16 md:pb-20 max-w-2xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#00eeff] shadow-[0_0_10px_rgba(0,238,255,0.5)] animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.5em] text-[#00eeff]">Core Capabilities</span>
          </div>
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]"
            style={{ background: "linear-gradient(135deg, #ffffff 0%, #ffffff 40%, #00eeff 70%, #9900ff 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            End-to-end development across every layer of the stack.
          </h2>
          {/* Subtitle */}
          <p className="text-base md:text-lg text-gray-400 font-light leading-relaxed max-w-lg">
            From world-class product interfaces to intelligent backend systems. We build secure, scalable software that moves markets.
          </p>
        </div>

        {/* ═══ CARDS — Sticky stacking deck ═══ */}
        <div ref={cardsContainerRef} className={isMobile ? "w-full space-y-3 pb-16" : "relative pb-[50vh]"}>
          {SERVICES.map((service, idx) => (
            <div key={service.id} ref={(el) => { cardRefs.current[idx] = el; }}
              className={isMobile ? "" : "relative"}
              style={isMobile ? undefined : { height: "100vh" }}>
              <div style={isMobile ? undefined : {
                position: "sticky" as const,
                top: `${100 + idx * 72}px`,
                zIndex: idx + 1,
                ...(activeIndex >= 0 && idx > activeIndex ? {
                  transform: "scale(0.985)",
                  opacity: 0.6,
                  transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                } : {
                  transform: "scale(1)",
                  opacity: 1,
                  transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
                }),
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
      </motion.section>
    </div>
  );
}

export default Bento3Section;
