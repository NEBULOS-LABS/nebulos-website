"use client";

import React, { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const SOL_STYLE_ID = "sol-idle-animations";

/* ── Card Data ──────────────────────────────────────────────────── */

interface CardData {
  id: string;
  title: string;
  body: string;
  overline: string;
  overlineColor: string;
  stat: string;
  span: string;
  minH: string;
  glowColor: string;
  glowStyle: React.CSSProperties;
  glowBlur: string;
  spotlightColor: string;
}

const CARDS: CardData[] = [
  {
    id: "sprint",
    overline: "DELIVERY",
    overlineColor: "#00eeff",
    title: "Two Weeks to Working Software",
    body: "While competitors debate roadmaps, you ship deployable code. Every 14 days \u2014 reviewed, tested, demo-ready.",
    stat: "14 days",
    span: "lg:col-span-2",
    minH: "min-h-[420px]",
    glowColor: "rgba(0,238,255,0.25)",
    glowStyle: { top: "-40px", left: "50%", transform: "translateX(-50%)", width: "250px", height: "250px" },
    glowBlur: "30px",
    spotlightColor: "rgba(0,238,255,0.15)",
  },
  {
    id: "ai",
    overline: "AI-POWERED",
    overlineColor: "#9900ff",
    title: "AI Makes Your Team 10x",
    body: "Every engineer ships with AI embedded in code generation, testing, and review. Not a buzzword \u2014 a measured 27% velocity boost.",
    stat: "27%",
    span: "lg:col-span-2",
    minH: "min-h-[420px]",
    glowColor: "rgba(153,0,255,0.30)",
    glowStyle: { top: "40%", right: "10%", width: "300px", height: "200px" },
    glowBlur: "40px",
    spotlightColor: "rgba(153,0,255,0.15)",
  },
  {
    id: "talent",
    overline: "TALENT",
    overlineColor: "#ff00ff",
    title: "The Top 1% Builds Your Product",
    body: "8+ years minimum. 120+ products shipped. Zero juniors. Your codebase gets architects, not apprentices.",
    stat: "8+ yrs",
    span: "lg:col-span-2",
    minH: "min-h-[420px]",
    glowColor: "rgba(255,0,255,0.20)",
    glowStyle: { bottom: "20%", left: "50%", transform: "translateX(-50%)", width: "280px", height: "200px" },
    glowBlur: "35px",
    spotlightColor: "rgba(255,0,255,0.15)",
  },
  {
    id: "analytics",
    overline: "CONVERSION",
    overlineColor: "#00eeff",
    title: "Revenue, Not Just Pixels",
    body: "Born from conversion optimization. Every interface, interaction, and pixel is engineered to move your revenue needle.",
    stat: "+38%",
    span: "lg:col-span-3",
    minH: "min-h-[380px]",
    glowColor: "rgba(0,238,255,0.22)",
    glowStyle: { bottom: "-20px", left: "15%", width: "350px", height: "250px" },
    glowBlur: "40px",
    spotlightColor: "rgba(0,238,255,0.15)",
  },
  {
    id: "guarantee",
    overline: "GUARANTEE",
    overlineColor: "#9900ff",
    title: "Zero Risk, Full Transparency",
    body: "You approve every sprint before paying. If we don\u2019t deliver, you don\u2019t pay. 120+ projects, 2 refunds.",
    stat: "120+",
    span: "lg:col-span-3",
    minH: "min-h-[380px]",
    glowColor: "rgba(153,0,255,0.25)",
    glowStyle: { top: "-30px", left: "30%", width: "400px", height: "150px" },
    glowBlur: "35px",
    spotlightColor: "rgba(153,0,255,0.15)",
  },
];

/* ── Shadow Constants ────────────────────────────────────────────── */

const REST_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.1)",
  "inset 0 0 40px 0 rgba(153,0,255,0.06)",
  "inset 0 0 80px 0 rgba(0,238,255,0.04)",
].join(", ");

const HOVER_SHADOW = [
  "inset 0 1px 0 0 rgba(255,255,255,0.18)",
  "inset 0 0 50px 0 rgba(153,0,255,0.12)",
  "inset 0 0 80px 0 rgba(0,238,255,0.08)",
  "0 12px 50px rgba(153,0,255,0.18)",
  "0 0 80px rgba(0,238,255,0.08)",
].join(", ");

/* ── Hover Timeline Builders ─────────────────────────────── */

function buildSprintHover(tl: gsap.core.Timeline, card: HTMLElement) {
  const progressFill = card.querySelector("[data-sol-progress-fill]");
  const taskRows = card.querySelectorAll("[data-sol-task-row]");
  const checks = card.querySelectorAll("[data-sol-check]");
  const activeDot = card.querySelector("[data-sol-active-dot]");
  const deploy = card.querySelector("[data-sol-deploy]");

  // Anticipation: task rows micro-dip
  if (taskRows.length) tl.to(taskRows, { y: 1, duration: 0.08 }, 0);

  // Progress bar fills from 73% to 85%
  if (progressFill) tl.to(progressFill, { width: "85%", duration: 0.4, ease: "power3.out" }, 0.05);

  // Task rows stagger-slide right
  if (taskRows.length) tl.to(taskRows, { x: 3, y: 0, stagger: 0.06, duration: 0.25 }, 0.08);

  // Checkmarks scale with glow
  if (checks.length) tl.to(checks, { scale: 1.15, stagger: 0.05, duration: 0.2, ease: "back.out(1.2)" }, 0.12);

  // Active dot expands
  if (activeDot) tl.to(activeDot, { scale: 1.4, duration: 0.25 }, 0.18);

  // Deploy button squash-stretch then lift
  if (deploy) {
    const btn = deploy.querySelector("div");
    if (btn) {
      tl.to(btn, { scaleX: 1.03, scaleY: 0.97, duration: 0.08 }, 0.25);
      tl.to(btn, { scaleX: 1, scaleY: 1, scale: 1.05, borderColor: "rgba(0,238,255,0.4)", duration: 0.3 }, 0.33);
    }
  }

  // Chrome "Day 12" text brightens
  const chromeRight = card.querySelector("[data-sol-chrome-right]");
  if (chromeRight) tl.to(chromeRight, { opacity: 0.6, duration: 0.2 }, 0.3);
}

function buildAIHover(tl: gsap.core.Timeline, card: HTMLElement) {
  const codeLines = card.querySelectorAll("[data-sol-code-line]");
  const lineNums = card.querySelectorAll("[data-sol-line-num]");
  const aiCard = card.querySelector("[data-sol-ai-card]");
  const sparkle = card.querySelector("[data-sol-sparkle]");
  const aiText = card.querySelector("[data-sol-ai-text]");
  const tabActive = card.querySelector("[data-sol-tab-active]");
  const tabInactive = card.querySelector("[data-sol-tab-inactive]");

  // Code lines stagger-shift left
  if (codeLines.length) tl.to(codeLines, { x: -2, stagger: 0.04, duration: 0.2 }, 0);

  // Line numbers brighten
  if (lineNums.length) tl.to(lineNums, { opacity: 0.45, duration: 0.3 }, 0);

  // AI card scales up with glow
  if (aiCard) {
    tl.to(aiCard, {
      scale: 1.04,
      boxShadow: "0 0 20px rgba(153,0,255,0.15)",
      borderColor: "rgba(153,0,255,0.35)",
      duration: 0.35,
    }, 0.08);
  }

  // Sparkle spins and scales
  if (sparkle) tl.to(sparkle, { scale: 1.3, rotation: 180, duration: 0.4 }, 0.12);

  // AI text brightens
  if (aiText) tl.to(aiText, { opacity: 0.8, duration: 0.2 }, 0.18);

  // Tab dimming/brightening
  if (tabActive) tl.to(tabActive, { opacity: 1, duration: 0.25 }, 0.2);
  if (tabInactive) tl.to(tabInactive, { opacity: 0.15, duration: 0.25 }, 0.2);
}

function buildTalentHover(tl: gsap.core.Timeline, card: HTMLElement) {
  const avatarRow = card.querySelector("[data-sol-avatar-row]");
  const avatars = card.querySelectorAll("[data-sol-avatar]");
  const engineerCard = card.querySelector("[data-sol-engineer-card]");
  const expFill = card.querySelector("[data-sol-exp-fill]");
  const name = card.querySelector("[data-sol-engineer-name]");
  const role = card.querySelector("[data-sol-engineer-role]");
  const tags = card.querySelectorAll("[data-sol-skill-tag]");
  const plusBadge = card.querySelector("[data-sol-plus-badge]");

  // Avatars spread apart
  if (avatarRow) tl.to(avatarRow, { gap: "12px", duration: 0.3 }, 0);

  // Each avatar scales with stagger
  if (avatars.length) tl.to(avatars, { scale: 1.08, borderColor: "rgba(255,255,255,0.25)", stagger: 0.05, duration: 0.2 }, 0);

  // Engineer card lifts
  if (engineerCard) tl.to(engineerCard, { y: -3, backgroundColor: "rgba(255,255,255,0.06)", duration: 0.3 }, 0.12);

  // Experience bar fills to 92%
  if (expFill) tl.to(expFill, { width: "92%", duration: 0.4, ease: "power3.out" }, 0.15);

  // Name + role brighten
  if (name) tl.to(name, { opacity: 0.95, duration: 0.2 }, 0.2);
  if (role) tl.to(role, { opacity: 0.85, duration: 0.2 }, 0.2);

  // Skill tags cascade pop
  if (tags.length) tl.to(tags, { scale: 1.06, borderColor: "rgba(255,255,255,0.2)", stagger: 0.06, duration: 0.2, ease: "back.out(1.3)" }, 0.25);

  // Plus badge
  if (plusBadge) tl.to(plusBadge, { opacity: 0.6, scale: 1.05, duration: 0.2 }, 0.35);
}

function buildAnalyticsHover(tl: gsap.core.Timeline, card: HTMLElement) {
  const revCard = card.querySelector("[data-sol-chart-revenue]");
  const convCard = card.querySelector("[data-sol-chart-conversion]");
  const chartLine = card.querySelector("[data-sol-chart-line]");
  const chartArea = card.querySelector("[data-sol-chart-area]");
  const bars = card.querySelectorAll("[data-sol-bar]");
  const statValues = card.querySelectorAll("[data-sol-stat-value]");
  const statDots = card.querySelectorAll("[data-sol-stat-dot]");

  // Chart cards lift with stagger
  if (revCard) tl.to(revCard, { y: -3, duration: 0.25 }, 0);
  if (convCard) tl.to(convCard, { y: -3, duration: 0.25 }, 0.06);

  // SVG line chart brightens
  if (chartLine) tl.to(chartLine, { attr: { "stroke-opacity": "0.9" }, duration: 0.35 }, 0);
  if (chartArea) tl.to(chartArea, { opacity: 0.6, duration: 0.35 }, 0);

  // Bars grow — increase each bar's height by 12, capped at 100%
  if (bars.length) {
    bars.forEach((bar, i) => {
      const el = bar as HTMLElement;
      const currentHeight = parseInt(el.style.height, 10) || 50;
      const boosted = Math.min(currentHeight + 12, 100);
      tl.to(el, { height: `${boosted}%`, duration: 0.3, ease: "power2.out" }, 0.08 + i * 0.04);
    });
  }

  // Stat values brighten
  if (statValues.length) tl.to(statValues, { opacity: 1, duration: 0.2 }, 0.18);

  // Stat dots pulse
  if (statDots.length) tl.to(statDots, { scale: 1.5, opacity: 0.8, stagger: 0.04, duration: 0.25 }, 0.18);

  // Chrome "This Quarter" text brightens
  const chromeRight = card.querySelector("[data-sol-chrome-right]");
  if (chromeRight) tl.to(chromeRight, { opacity: 0.55, duration: 0.2 }, 0.3);
}

function buildGuaranteeHover(tl: gsap.core.Timeline, card: HTMLElement) {
  const checkItems = card.querySelectorAll("[data-sol-check-item]");
  const checkIcons = card.querySelectorAll("[data-sol-check-icon]");
  const badges = card.querySelectorAll("[data-sol-approved-badge]");
  const approveBtn = card.querySelector("[data-sol-approve-btn]");
  const approveText = card.querySelector("[data-sol-approve-text]");
  const header = card.querySelector("[data-sol-deliverables-header]");
  const completionBadge = card.querySelector("[data-sol-completion-badge]");
  const progressRing = card.querySelector("[data-sol-progress-ring]");

  // Anticipation: items micro-dip
  if (checkItems.length) tl.to(checkItems, { y: 1, duration: 0.08 }, 0);

  // Completion badge brightens
  if (completionBadge) tl.to(completionBadge, { scale: 1.08, opacity: 1, duration: 0.25, ease: "back.out(1.3)" }, 0);

  // Progress ring scales subtly
  if (progressRing) tl.to(progressRing, { scale: 1.1, duration: 0.3 }, 0);

  // Items cascade stamp
  if (checkItems.length) tl.to(checkItems, { y: -2, stagger: 0.07, duration: 0.2 }, 0.06);

  // Check icons scale with glow
  if (checkIcons.length) tl.to(checkIcons, { scale: 1.2, stagger: 0.06, duration: 0.25, ease: "back.out(1.5)" }, 0.06);

  // Badges brighten
  if (badges.length) tl.to(badges, { opacity: 0.95, borderColor: "rgba(16,185,129,0.4)", stagger: 0.05, duration: 0.25 }, 0.12);

  // Approve button
  if (approveBtn) {
    const btn = approveBtn.querySelector("div > div:first-child");
    if (btn) tl.to(btn, { scale: 1.03, borderColor: "rgba(153,0,255,0.6)", duration: 0.3 }, 0.2);
  }

  // Guarantee text
  if (approveText) tl.to(approveText, { opacity: 0.5, x: -2, duration: 0.25 }, 0.32);

  // Header brightens
  if (header) tl.to(header, { opacity: 0.7, duration: 0.2 }, 0.35);

  // Chrome text brightens
  const chromeRight = card.querySelector("[data-sol-chrome-right]");
  if (chromeRight) tl.to(chromeRight, { opacity: 0.55, duration: 0.2 }, 0.3);
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hoverTimelines = useRef<(gsap.core.Timeline | null)[]>([]);

  /* ── Inject idle CSS animations ──────────────────────────────── */
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(SOL_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = SOL_STYLE_ID;
    style.textContent = `
/* Shimmer sweep (progress bars) */
@keyframes sol-shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Breathing pulse (dots, glows) */
@keyframes sol-breathe {
  0%, 100% { box-shadow: 0 0 0 0 currentColor; transform: scale(1); }
  50% { box-shadow: 0 0 6px 1px currentColor; transform: scale(1.1); }
}

/* Cursor blink */
@keyframes sol-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}

/* Gentle float */
@keyframes sol-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* Sequential check glow */
@keyframes sol-check-glow {
  0%, 70%, 100% { text-shadow: none; opacity: 0.85; }
  35% { text-shadow: 0 0 6px rgba(52,211,153,0.5); opacity: 1; }
}

/* Badge shimmer */
@keyframes sol-badge-shimmer {
  0% { background-position: -100% center; }
  100% { background-position: 200% center; }
}

/* Gradient shift (buttons) */
@keyframes sol-gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Dot sequential pulse */
@keyframes sol-dot-pulse {
  0%, 70%, 100% { transform: scale(1); opacity: 0.3; }
  35% { transform: scale(1.4); opacity: 0.7; }
}

/* Bar subtle oscillation */
@keyframes sol-bar-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.03); }
}

/* Sparkle rotate pulse */
@keyframes sol-sparkle {
  0%, 100% { transform: scale(0.9) rotate(0deg); }
  50% { transform: scale(1.1) rotate(15deg); }
}

/* ── Apply idle animations ── */

/* Sprint Board */
[data-sol-progress-fill] {
  background-size: 200% 100%;
  background-image: linear-gradient(
    90deg,
    rgba(153,0,255,1) 0%,
    rgba(0,238,255,0.6) 25%,
    rgba(255,255,255,0.3) 50%,
    rgba(0,238,255,0.6) 75%,
    rgba(0,238,255,1) 100%
  );
  animation: sol-shimmer 8s ease-in-out infinite;
}
[data-sol-active-dot] {
  color: rgba(0,238,255,0.5);
  animation: sol-breathe 3s ease-in-out infinite;
}
[data-sol-check] {
  animation: sol-check-glow 6s ease-in-out infinite;
}
[data-sol-check]:nth-of-type(1) { animation-delay: 0s; }
[data-sol-check]:nth-of-type(2) { animation-delay: -2s; }
[data-sol-check]:nth-of-type(3) { animation-delay: -4s; }

/* AI Editor */
[data-sol-cursor] {
  animation: sol-blink 1s step-end infinite;
}
[data-sol-ai-card] {
  animation: sol-float 5s ease-in-out infinite;
}
[data-sol-sparkle] {
  display: inline-block;
  animation: sol-sparkle 4s ease-in-out infinite;
}
[data-sol-tab-active] {
  position: relative;
}
[data-sol-tab-active]::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(153,0,255,0.6), transparent);
  background-size: 200% 100%;
  animation: sol-shimmer 6s ease-in-out infinite;
}

/* Team Roster */
[data-sol-avatar] {
  animation: sol-float 5s ease-in-out infinite;
}
[data-sol-avatar]:nth-child(1) { animation-delay: 0s; }
[data-sol-avatar]:nth-child(2) { animation-delay: -1.2s; }
[data-sol-avatar]:nth-child(3) { animation-delay: -2.4s; }
[data-sol-exp-fill] {
  background-size: 200% 100%;
  background-image: linear-gradient(
    90deg,
    rgba(255,0,255,0.6) 0%,
    rgba(153,0,255,0.4) 25%,
    rgba(255,255,255,0.25) 50%,
    rgba(153,0,255,0.4) 75%,
    rgba(153,0,255,0.6) 100%
  );
  animation: sol-shimmer 8s ease-in-out infinite;
}
[data-sol-plus-badge] {
  animation: sol-float 4s ease-in-out infinite;
  animation-delay: -1s;
}

/* Analytics Dashboard */
[data-sol-stat-dot] {
  animation: sol-dot-pulse 6s ease-in-out infinite;
}
[data-sol-stat-dot]:nth-of-type(1) { animation-delay: 0s; }
[data-sol-stat-dot]:nth-of-type(2) { animation-delay: -1.5s; }
[data-sol-stat-dot]:nth-of-type(3) { animation-delay: -3s; }
[data-sol-stat-dot]:nth-of-type(4) { animation-delay: -4.5s; }
[data-sol-bar] {
  transform-origin: bottom;
  animation: sol-bar-breathe 4s ease-in-out infinite;
}
[data-sol-bar]:nth-child(1) { animation-delay: 0s; }
[data-sol-bar]:nth-child(2) { animation-delay: -0.6s; }
[data-sol-bar]:nth-child(3) { animation-delay: -1.2s; }
[data-sol-bar]:nth-child(4) { animation-delay: -1.8s; }
[data-sol-bar]:nth-child(5) { animation-delay: -2.4s; }
[data-sol-bar]:nth-child(6) { animation-delay: -3.0s; }

/* Sprint Approval */
[data-sol-check-icon] {
  animation: sol-check-glow 6s ease-in-out infinite;
}
[data-sol-check-item]:nth-child(1) [data-sol-check-icon] { animation-delay: 0s; }
[data-sol-check-item]:nth-child(2) [data-sol-check-icon] { animation-delay: -1.5s; }
[data-sol-check-item]:nth-child(3) [data-sol-check-icon] { animation-delay: -3s; }
[data-sol-check-item]:nth-child(4) [data-sol-check-icon] { animation-delay: -4.5s; }
[data-sol-approved-badge] {
  background-size: 200% 100%;
  background-image: linear-gradient(
    90deg,
    rgba(16,185,129,0.15) 0%,
    rgba(16,185,129,0.08) 25%,
    rgba(255,255,255,0.12) 50%,
    rgba(16,185,129,0.08) 75%,
    rgba(16,185,129,0.15) 100%
  );
  animation: sol-badge-shimmer 8s ease-in-out infinite;
}
[data-sol-check-item]:nth-child(1) [data-sol-approved-badge] { animation-delay: 0s; }
[data-sol-check-item]:nth-child(2) [data-sol-approved-badge] { animation-delay: -2s; }
[data-sol-check-item]:nth-child(3) [data-sol-approved-badge] { animation-delay: -4s; }
[data-sol-check-item]:nth-child(4) [data-sol-approved-badge] { animation-delay: -6s; }
[data-sol-approve-btn] > div > div:first-child {
  background-size: 200% 200%;
  animation: sol-gradient-shift 5s ease-in-out infinite;
}
[data-sol-completion-badge] {
  animation: sol-breathe 4s ease-in-out infinite;
  color: rgba(52,211,153,0.9);
}
[data-sol-progress-ring] {
  animation: sol-float 4s ease-in-out infinite;
}
`;
    document.head.appendChild(style);

    return () => {
      if (style.parentNode) style.remove();
    };
  }, []);

  /* ── Mouse handlers ─────────────────────────────────────────── */

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
      const el = cardRefs.current[idx];
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--sol-x", `${e.clientX - r.left}px`);
      el.style.setProperty("--sol-y", `${e.clientY - r.top}px`);
    },
    []
  );

  const handleMouseEnter = useCallback(
    (_e: React.MouseEvent, idx: number) => {
      const tl = hoverTimelines.current[idx];
      if (tl) tl.play();
    },
    []
  );

  const handleMouseLeave = useCallback(
    (_e: React.MouseEvent, idx: number) => {
      const el = cardRefs.current[idx];
      if (el) {
        el.style.removeProperty("--sol-x");
        el.style.removeProperty("--sol-y");
      }
      const tl = hoverTimelines.current[idx];
      if (tl) tl.reverse();
    },
    []
  );

  /* ── GSAP Animations ───────────────────────────────────────── */

  useGSAP(
    () => {
      /* Header entrance */
      const header = sectionRef.current?.querySelector("[data-sol-header]");
      if (header) {
        gsap.fromTo(
          header,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      /* Card entrance stagger */
      const grid = sectionRef.current?.querySelector("[data-sol-grid]");
      const allCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

      if (grid && allCards.length > 0) {
        /* Pre-set hidden states for mockup internals */
        allCards.forEach((card) => {
          const mockup = card.querySelector("[data-sol-mockup]");
          if (mockup) gsap.set(mockup, { scale: 0.95, opacity: 0 });

          const items = card.querySelectorAll("[data-sol-mockup-item]");
          if (items.length) gsap.set(items, { opacity: 0, y: 8 });

          const highlight = card.querySelector("[data-sol-highlight]");
          if (highlight) gsap.set(highlight, { scale: 0.8, opacity: 0 });
        });

        /* Staggered entrance timeline */
        const delays = [0, 0.1, 0.2, 0.4, 0.5];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        allCards.forEach((card, i) => {
          const d = delays[i] ?? i * 0.12;

          /* Card fade-up */
          tl.fromTo(
            card,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            d
          );

          /* Mockup container scale-in */
          const mockup = card.querySelector("[data-sol-mockup]");
          if (mockup) {
            tl.to(
              mockup,
              { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
              d + 0.3
            );
          }

          /* Mockup items stagger */
          const items = card.querySelectorAll("[data-sol-mockup-item]");
          if (items.length) {
            tl.to(
              items,
              { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
              d + 0.5
            );
          }

          /* Highlight element pop-in */
          const highlight = card.querySelector("[data-sol-highlight]");
          if (highlight) {
            tl.to(
              highlight,
              { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.4)" },
              d + 0.8
            );
          }
        });

        /* ── Per-card hover timelines ──────────────────── */
        hoverTimelines.current = [];
        allCards.forEach((card, i) => {
          const cardData = CARDS[i];
          if (!cardData) return;

          const htl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });

          /* Primary layer: card-level */
          htl.to(card, { y: -4, boxShadow: HOVER_SHADOW, duration: 0.3 }, 0);

          const glow = card.querySelector("[data-sol-glow]");
          if (glow) htl.to(glow, { scale: 1.3, duration: 0.3 }, 0);

          /* Per-card secondary + tertiary choreography */
          if (cardData.id === "sprint") buildSprintHover(htl, card);
          if (cardData.id === "ai") buildAIHover(htl, card);
          if (cardData.id === "talent") buildTalentHover(htl, card);
          if (cardData.id === "analytics") buildAnalyticsHover(htl, card);
          if (cardData.id === "guarantee") buildGuaranteeHover(htl, card);

          hoverTimelines.current[i] = htl;
        });
      }
    },
    { scope: sectionRef }
  );

  /* ── Render ─────────────────────────────────────────────────── */

  return (
    <section
      id="solution"
      ref={sectionRef}
      className="relative bg-black/40 backdrop-blur-[24px] overflow-hidden py-20 lg:py-28"
    >
      {/* Ambient decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute top-1/3 -right-40 w-80 h-80 bg-[#ff00ff]/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-[#00eeff]/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ── Header ──────────────────────────────────────────── */}
        <div data-sol-header className="mx-auto max-w-3xl text-center mb-16 opacity-0">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
              unfair advantage.
            </span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            The engine behind 120+ shipped products &mdash; senior engineers, AI
            workflows, and a guarantee that makes risk obsolete.
          </p>
        </div>

        {/* ── Bento Grid (3+2 layout) ────────────────────────── */}
        <div data-sol-grid className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-5">
          {CARDS.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              className={`group relative overflow-hidden rounded-[20px] border border-white/[0.12] bg-white/[0.05] backdrop-blur-sm ${card.minH} flex flex-col opacity-0 ${card.span}`}
              style={{
                willChange: "transform",
                boxShadow: REST_SHADOW,
              }}
              onMouseMove={(e) => handleMouseMove(e, idx)}
              onMouseEnter={(e) => handleMouseEnter(e, idx)}
              onMouseLeave={(e) => handleMouseLeave(e, idx)}
            >
              {/* Focal glow orb */}
              <div
                data-sol-glow
                className="pointer-events-none absolute z-[0]"
                style={{
                  ...card.glowStyle,
                  background: `radial-gradient(ellipse, ${card.glowColor} 0%, transparent 70%)`,
                  filter: `blur(${card.glowBlur})`,
                }}
              />

              {/* Mockup area */}
              <div className="relative flex-1 overflow-hidden p-4 lg:p-5 pb-0">
                <div
                  data-sol-mockup
                  className="relative z-[2] transition-transform duration-400 ease-out group-hover:-translate-y-[3px] group-hover:scale-[1.01]"
                >
                  {card.id === "sprint" && <SprintBoardMockup />}
                  {card.id === "ai" && <AIEditorMockup />}
                  {card.id === "talent" && <TeamRosterMockup />}
                  {card.id === "analytics" && <AnalyticsDashMockup />}
                  {card.id === "guarantee" && <SprintApprovalMockup />}
                </div>
                {/* Gradient fade from mockup into card bg */}
                <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-b from-transparent to-black/60 pointer-events-none z-[3]" />
              </div>

              {/* Text area */}
              <div className="relative z-10 px-5 lg:px-6 pb-5 lg:pb-6 -mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-[12px] uppercase tracking-[0.2em] font-semibold"
                    style={{ color: card.overlineColor, textShadow: `0 0 12px ${card.overlineColor}40` }}
                  >
                    {card.overline}
                  </span>
                  <span className="text-[12px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff] px-2.5 py-0.5 rounded-full border border-white/[0.10]">
                    {card.stat}
                  </span>
                </div>
                <h3 className="text-lg lg:text-xl font-semibold text-white mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {card.body}
                </p>
              </div>

              {/* Edge illumination — directional top + side light */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[20px] z-[1] transition-opacity duration-400"
                style={{
                  background: [
                    "linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 15%, transparent 40%)",
                    "linear-gradient(to right, rgba(153,0,255,0.05), transparent 25%, transparent 75%, rgba(0,238,255,0.05))",
                  ].join(", "),
                }}
              />

              {/* Mouse-tracking glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(400px circle at var(--sol-x,50%) var(--sol-y,50%), ${card.spotlightColor}, transparent 65%)`,
                }}
              />

              {/* Gradient border */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[20px] opacity-25 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  padding: "1px",
                  background:
                    "linear-gradient(135deg, rgba(153,0,255,0.5), rgba(255,0,255,0.25), rgba(0,238,255,0.5))",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Mockup Components — Realistic CSS/HTML product UI screens
   ══════════════════════════════════════════════════════════════════ */

/* ── Chrome Bar (shared pattern) ─────────────────────────────────── */

function MockupChrome({ title, right }: { title: string; right?: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06]">
      <div className="flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <span className="text-[10px] text-white/40 ml-1">{title}</span>
      </div>
      {right && <span data-sol-chrome-right className="text-[9px] text-white/30">{right}</span>}
    </div>
  );
}

/* ── Card 1: Sprint Board Dashboard ─────────────────────────────── */

function SprintBoardMockup() {
  const tasks = [
    { name: "Auth flow", status: "Done", done: true },
    { name: "Dashboard UI", status: "Done", done: true },
    { name: "API endpoints", status: "In Progress", active: true },
    { name: "E2E testing", status: "To Do" },
  ];

  return (
    <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
      <MockupChrome title="Sprint Board" right="Day 12" />

      {/* Sprint progress */}
      <div data-sol-mockup-item className="px-3 py-3 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-white/60 font-medium">Sprint 4</span>
          <span data-sol-progress-text className="text-[9px] text-[#00eeff]/80">73%</span>
        </div>
        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div data-sol-progress-fill className="h-full w-[73%] rounded-full bg-gradient-to-r from-[#9900ff] to-[#00eeff]" />
        </div>
      </div>

      {/* Task list */}
      <div className="px-3 py-2 space-y-1.5">
        {tasks.map((task) => (
          <div
            key={task.name}
            data-sol-mockup-item
            data-sol-task-row
            className="flex items-center justify-between py-1"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                  task.done
                    ? "bg-emerald-500/20"
                    : task.active
                      ? "bg-[#00eeff]/20"
                      : "bg-white/[0.06]"
                }`}
              >
                {task.done && (
                  <span data-sol-check className="text-[7px] text-emerald-400">&#10003;</span>
                )}
                {task.active && (
                  <div data-sol-active-dot className="w-1.5 h-1.5 rounded-full bg-[#00eeff]" />
                )}
              </div>
              <span className="text-[10px] text-white/60">{task.name}</span>
            </div>
            <span
              className={`text-[9px] ${
                task.done
                  ? "text-emerald-400/70"
                  : task.active
                    ? "text-[#00eeff]/70"
                    : "text-white/30"
              }`}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>

      {/* Deploy button */}
      <div data-sol-highlight data-sol-deploy className="px-3 pb-3 pt-1">
        <div className="text-center py-1.5 rounded-lg text-[9px] text-[#00eeff]/80 border border-[#00eeff]/20 bg-[#00eeff]/[0.04]">
          Deploy Preview &rarr;
        </div>
      </div>
    </div>
  );
}

/* ── Card 2: AI Code Editor ──────────────────────────────────────── */

function AIEditorMockup() {
  return (
    <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-0 border-b border-white/[0.06]">
        <div className="flex gap-1.5 px-3 py-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="flex">
          <span data-sol-tab-active className="text-[9px] px-3 py-2 text-white/60 bg-white/[0.04] border-b border-[#9900ff]/40">
            app.tsx
          </span>
          <span data-sol-tab-inactive className="text-[9px] px-3 py-2 text-white/30">test.ts</span>
        </div>
      </div>

      {/* Code area */}
      <div className="px-2 py-2 font-mono text-[10px] leading-[1.7]">
        <CodeLine n={1} data-sol-mockup-item data-sol-code-line>
          <span className="text-purple-400">import</span>
          <span className="text-white/50">{" { deploy } "}</span>
          <span className="text-purple-400">from</span>
          <span className="text-[#00eeff]">{" './ci'"}</span>
        </CodeLine>
        <CodeLine n={2} data-sol-mockup-item data-sol-code-line>
          <span className="text-white/20">{" "}</span>
        </CodeLine>
        <CodeLine n={3} data-sol-mockup-item data-sol-code-line>
          <span className="text-purple-400">export async function</span>
          <span className="text-white/80">{" build"}</span>
          <span className="text-white/50">{"() {"}</span>
        </CodeLine>
        <CodeLine n={4} data-sol-mockup-item data-sol-code-line>
          <span className="text-white/50">{"  "}</span>
          <span className="text-purple-400">const</span>
          <span className="text-white/50">{" optimized = "}</span>
          <span className="text-purple-400">await</span>
        </CodeLine>

        {/* AI suggestion card */}
        <div
          data-sol-highlight
          data-sol-ai-card
          className="ml-8 my-1.5 p-2 rounded-lg bg-[#9900ff]/[0.08] border border-[#9900ff]/20"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span data-sol-sparkle className="text-[9px]">&#10024;</span>
            <span className="text-[9px] text-[#9900ff] font-medium">
              AI Suggestion
            </span>
          </div>
          <span data-sol-ai-text className="text-[9px] text-white/50">
            Refactored for 27% faster execution
          </span>
        </div>

        <CodeLine n={7} data-sol-mockup-item data-sol-code-line>
          <span className="text-white/50">{"  "}</span>
          <span className="text-purple-400">return</span>
          <span className="text-white/50">{" optimized."}</span>
          <span className="text-white/80">deploy</span>
          <span className="text-white/50">{"()"}</span>
        </CodeLine>
        <CodeLine n={8} data-sol-mockup-item data-sol-code-line>
          <span className="text-white/50">{"}"}</span>
          <span data-sol-cursor className="inline-block w-[5px] h-[12px] bg-white/60 ml-0.5 align-middle" />
        </CodeLine>
      </div>
    </div>
  );
}

function CodeLine({
  n,
  children,
  ...rest
}: {
  n: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex" {...rest}>
      <span data-sol-line-num className="w-6 text-right text-white/20 select-none mr-3 flex-shrink-0">
        {n}
      </span>
      <span className="text-white/50">{children}</span>
    </div>
  );
}

/* ── Card 3: Team Roster ─────────────────────────────────────────── */

function TeamRosterMockup() {
  const skills = ["React", "Node", "AWS", "AI/ML"];

  return (
    <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
      <MockupChrome title="Team" right="Your Squad" />

      {/* Avatar row */}
      <div data-sol-mockup-item data-sol-avatar-row className="flex items-center gap-2 px-3 py-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            data-sol-avatar
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9900ff]/40 to-[#00eeff]/40 border border-white/[0.1] flex items-center justify-center"
          >
            <div className="w-4 h-4 rounded-full bg-white/[0.08]" />
          </div>
        ))}
        <span data-sol-plus-badge className="text-[10px] text-white/30 ml-1">+2</span>
      </div>

      {/* Selected engineer card */}
      <div
        data-sol-mockup-item
        data-sol-engineer-card
        className="mx-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.04]"
      >
        <div className="flex items-center justify-between mb-2">
          <span data-sol-engineer-name className="text-[11px] text-white/70 font-medium">
            Alex Chen
          </span>
          <span data-sol-engineer-role className="text-[9px] text-[#00eeff]/60">Staff Engineer</span>
        </div>
        {/* Experience bar */}
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div data-sol-exp-fill className="h-full w-[85%] rounded-full bg-gradient-to-r from-[#ff00ff]/60 to-[#9900ff]/60" />
        </div>
        <span className="text-[9px] text-white/30">12 yrs &middot; 89 projects</span>
      </div>

      {/* Skill tags */}
      <div data-sol-mockup-item className="flex flex-wrap gap-1.5 px-3 py-3">
        {skills.map((skill) => (
          <span
            key={skill}
            data-sol-skill-tag
            className="text-[9px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40 bg-white/[0.02]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Card 4: Analytics Dashboard ─────────────────────────────────── */

function AnalyticsDashMockup() {
  return (
    <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
      <MockupChrome title="Analytics" right="This Quarter" />

      {/* Two chart cards side by side */}
      <div className="grid grid-cols-2 gap-2 p-2.5">
        {/* Revenue Impact chart */}
        <div
          data-sol-mockup-item
          data-sol-chart-revenue
          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-white/40">Revenue Impact</span>
            <span className="text-[9px] text-emerald-400/80 font-medium">+38%</span>
          </div>
          <svg viewBox="0 0 100 50" className="w-full h-14">
            <defs>
              <linearGradient
                id="sol-chart-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#00eeff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00eeff" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <path
              data-sol-chart-line
              d="M 0 42 Q 10 38 20 35 T 40 28 T 60 18 T 80 10 T 100 4"
              fill="none"
              stroke="#00eeff"
              strokeWidth="1.5"
              strokeOpacity="0.7"
            />
            <path
              data-sol-chart-area
              d="M 0 42 Q 10 38 20 35 T 40 28 T 60 18 T 80 10 T 100 4 L 100 50 L 0 50 Z"
              fill="url(#sol-chart-fill)"
            />
            {/* Data point dot at peak */}
            <circle cx="100" cy="4" r="2" fill="#00eeff" opacity="0.9" />
            <circle data-sol-stat-dot cx="100" cy="4" r="4" fill="#00eeff" opacity="0.2" />
          </svg>
        </div>

        {/* Conversion Rate bar chart */}
        <div
          data-sol-mockup-item
          data-sol-chart-conversion
          className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-white/40">Conversion</span>
            <span className="text-[9px] text-[#9900ff] font-medium">
              2.4x &#9650;
            </span>
          </div>
          <div className="flex items-end gap-1 h-14">
            {[25, 40, 50, 65, 78, 92].map((h, i) => (
              <div
                key={i}
                data-sol-bar
                className="flex-1 rounded-sm bg-gradient-to-t from-[#9900ff]/50 to-[#ff00ff]/25"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Key metrics row */}
      <div className="grid grid-cols-2 gap-2 px-2.5 pb-1.5">
        <div data-sol-mockup-item className="p-2 rounded-md bg-white/[0.02] border border-white/[0.03]">
          <span className="text-[8px] text-white/30 block mb-0.5">Bounce rate</span>
          <span data-sol-stat-value className="text-[11px] font-semibold text-emerald-400/80">-23%</span>
        </div>
        <div data-sol-mockup-item className="p-2 rounded-md bg-white/[0.02] border border-white/[0.03]">
          <span className="text-[8px] text-white/30 block mb-0.5">Load time</span>
          <span data-sol-stat-value className="text-[11px] font-semibold text-[#00eeff]/80">1.2s</span>
        </div>
      </div>

      {/* Bottom stats strip */}
      <div
        data-sol-mockup-item
        className="flex items-center justify-between px-2.5 pb-2.5 pt-1"
      >
        {[
          { label: "Retention", value: "+41%", color: "text-emerald-400/70" },
          { label: "Vitals", value: "All green", color: "text-emerald-400/70" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-1.5">
            <div data-sol-stat-dot className="w-1.5 h-1.5 rounded-full bg-emerald-400/30" />
            <span data-sol-stat-label className="text-[8px] text-white/30">{stat.label}</span>
            <span data-sol-stat-value className={`text-[8px] ${stat.color} font-medium`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Card 5: Sprint Approval ─────────────────────────────────────── */

function SprintApprovalMockup() {
  const items = [
    "Auth system shipped",
    "Dashboard live",
    "Tests passing (47/47)",
    "Code reviewed",
  ];

  return (
    <div className="rounded-xl bg-[#0a0a14] border border-white/[0.06] overflow-hidden">
      <MockupChrome title="Sprint Review" right="Sprint #4" />

      {/* Completion header with progress ring */}
      <div data-sol-mockup-item data-sol-deliverables-header className="px-3 pt-3 pb-1.5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {/* Mini progress ring */}
            <svg data-sol-progress-ring width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0">
              <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="#28c840" strokeWidth="2"
                strokeDasharray="50.26" strokeDashoffset="0" strokeLinecap="round"
                transform="rotate(-90 10 10)" opacity="0.8" />
            </svg>
            <span className="text-[9px] text-white/40 font-medium">4/4 Deliverables</span>
          </div>
          <span data-sol-completion-badge className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400/90 border border-emerald-500/25 font-medium">
            100%
          </span>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      </div>

      {/* Checklist items */}
      <div className="px-3 py-1.5 space-y-1">
        {items.map((item) => (
          <div
            key={item}
            data-sol-mockup-item
            data-sol-check-item
            className="flex items-center justify-between py-1.5"
          >
            <div className="flex items-center gap-2">
              <div data-sol-check-icon className="w-4 h-4 rounded bg-emerald-500/25 flex items-center justify-center border border-emerald-500/20">
                <span className="text-[8px] text-emerald-400">&#10003;</span>
              </div>
              <span className="text-[10px] text-white/65">{item}</span>
            </div>
            <span data-sol-approved-badge className="text-[8px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400/80 border border-emerald-500/25">
              Approved
            </span>
          </div>
        ))}
      </div>

      {/* Approve CTA */}
      <div data-sol-highlight data-sol-approve-btn className="px-3 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 text-center py-2 rounded-lg text-[10px] font-semibold text-white/90 bg-gradient-to-r from-[#9900ff]/30 to-[#00eeff]/30 border border-[#9900ff]/40"
            style={{ boxShadow: "0 0 20px rgba(153,0,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            &#10003; Approve &amp; Pay Sprint
          </div>
          <span data-sol-approve-text className="text-[8px] text-white/30 whitespace-nowrap">
            $0 if not satisfied
          </span>
        </div>
      </div>
    </div>
  );
}
