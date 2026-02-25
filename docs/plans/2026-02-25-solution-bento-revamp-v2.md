# Solution Bento Grid Revamp v2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the barely-visible CSS-animated solution bento backgrounds with high-contrast, meaning-driven GSAP+SVG animations, upgrade micro-interactions, and rewrite copy using world-class persuasion principles — all within `src/components/solution.tsx` only.

**Architecture:** Single-file rewrite of `solution.tsx`. Replace Framer Motion entrance animations and CSS keyframe backgrounds with GSAP `useGSAP` + `ScrollTrigger` for scroll-triggered SVG path-draw choreography. Each card gets a hand-crafted inline SVG whose elements animate on viewport entry via a GSAP timeline, then settle into subtle idle loops. Card contrast, hover micro-interactions, and mouse-tracking glow all intensified.

**Tech Stack:** GSAP 3.12 (`gsap`, `@gsap/react` `useGSAP`, `ScrollTrigger`), React 18, TypeScript, Tailwind CSS, inline SVG

---

## Audit of Current Problems

| Issue | Evidence | Impact |
|-------|----------|--------|
| SVG opacity 0.15–0.25 base | `opacity-25`, `opacity-20`, `opacity-15` classes | Backgrounds invisible — wastes 60% of card visual space |
| CSS keyframe-only animation | `sol-ring-rotate`, `sol-beam-flow` etc. | No entrance choreography, no scroll-trigger, infinite loops feel ambient not intentional |
| Animations don't convey meaning | Rotating ring ≠ sprints; random dots ≠ talent selection | Zero cognitive mapping between visual and value proposition |
| Card bg `white/[0.02]` | 0.02 alpha on black | Cards indistinguishable from section background |
| Border `white/[0.08]` | 8% white | Edges practically invisible |
| Gradient border only on hover | `opacity-0 group-hover:opacity-100` | No visual structure at rest |
| No GSAP despite parent using it | solution.tsx imports framer-motion only | Inconsistent with KPR, Hero, GlassFlow animation systems |
| Copy is features-first | "14-Day Sprints", "AI-Accelerated Engineering" | Doesn't sell outcomes; reads like a spec sheet |

---

## Design Decisions

### Color Contrast Matrix (calculated)

| Element | Current | New | Reasoning |
|---------|---------|-----|-----------|
| Card background | `bg-white/[0.02]` | `bg-white/[0.05]` | 2.5x more surface definition, still glass-morphic |
| Card border (rest) | `border-white/[0.08]` | `border-white/[0.12]` | Edges visible at rest without harsh lines |
| Gradient border (rest) | opacity 0 | opacity 0.25 | Always-on structural cue; full 1.0 on hover |
| SVG primary strokes | opacity 0.15–0.25 | opacity 0.6–0.8 | **Dramatic increase** — the visual IS the card |
| SVG secondary elements | opacity 0.10 | opacity 0.25–0.35 | Grid lines, ghost strokes visible as texture |
| SVG on hover | 0.35–0.50 | 0.8–1.0 | Full vivid; no longer "barely there" |
| Mouse glow radius | 280px, 0.12 alpha | 400px, 0.20 alpha | Covers more card area, clearly visible |
| Card hover lift | `translateY(-3px)` | `translateY(-6px)` | More dramatic, match site's `-5px` card-gradient pattern |
| Card hover shadow | `0 8px 40px 0.1` | `0 12px 50px 0.18, 0 0 80px 0.08` | Double-layer: directional + ambient glow |

### Motion Design Principles Applied

1. **Anticipation + Follow-through**: SVG elements overshoot slightly before settling (GSAP `back.out(1.4)`)
2. **Staging**: Background SVG draws first (700ms lead), then text fades in — clear visual hierarchy
3. **Timing**: Fast entrance (0.6–1.0s), slow idle loops (4–6s). Entrance uses `power3.out` (strong deceleration). Idle uses `sine.inOut` (gentle organic).
4. **Path-draw technique**: `getTotalLength()` → `strokeDasharray: length` → animate `strokeDashoffset: length → 0`. Free alternative to DrawSVGPlugin.
5. **Stagger cascade**: Cards enter with 120ms stagger. Within each card: SVG draws → stat counter begins → text fades in (200ms offset).

### Copywriting Framework: Outcome-First + Contrast Pattern

Every headline names the **result the buyer gets**, not the feature.
Every description uses **competitive framing** ("while others...") or **contrast** ("not X, Y") to anchor value.

---

## Card-by-Card SVG Animation Specification

### Card 1 (1 col): "Two Weeks to Working Software"

**Metaphor**: Compressed sprint timeline — a horizontal progress bar with milestone nodes

**SVG Structure** (viewBox `0 0 280 200`):
```
- Ghost timeline bar (full width, white/8, horizontal)
- Progress line (draws left→right, gradient stroke #9900ff→#00eeff, strokeWidth 3)
- 3 milestone nodes at 25%, 50%, 85% of timeline:
  - Node 1: small circle, label "Plan"
  - Node 2: small circle, label "Build"
  - Node 3: larger circle, label "Ship" with checkmark path
- Large ghost "14d" text centered above timeline (opacity 0.12, font-size 56)
```

**GSAP Timeline** (triggered on card intersection):
```
t=0.0s  Ghost bar fades in (0.3s, power2.out)
t=0.1s  Progress line draws left→right (0.8s, power3.out)
t=0.3s  Node 1 scales 0→1 (0.35s, back.out(1.4))
t=0.5s  Node 2 scales 0→1 (0.35s, back.out(1.4))
t=0.7s  Node 3 scales 0→1.1→1.0 (0.4s, back.out(1.7)) + glow ring expands
t=0.9s  Checkmark draws on Node 3 (0.3s, power2.out)
t=1.0s  "14d" ghost text fades to 0.15 (0.4s)
--- Idle ---
t=loop  Node 3 pulses subtly (scale 1→1.08→1, 3s, sine.inOut, repeat:-1)
t=loop  A small dot travels along progress line left→right (2.5s, none, repeat:-1)
```

**Opacity targets**: Primary strokes 0.7, nodes 0.8, ghost elements 0.12–0.15. On hover: strokes 0.9, nodes 1.0.

---

### Card 2 (2 cols): "AI Makes Your Team 10x"

**Metaphor**: Neural pipeline — input signals flow through AI processing nodes to amplified output

**SVG Structure** (viewBox `0 0 480 220`):
```
- 3 input nodes (left column, x=50):
  - y=55  "Code" (r=5, #9900ff)
  - y=110 "Test" (r=5, #ff00ff)
  - y=165 "Design" (r=5, #00eeff)
- 2 AI processing nodes (center, x=240):
  - y=80  (r=12, gradient fill, double-ring)
  - y=140 (r=12, gradient fill, double-ring)
- 2 output nodes (right column, x=430):
  - y=80  "Deployed" (r=7, #00eeff, bright)
  - y=140 "Quality" (r=7, #00eeff, bright)
- Connection paths (cubic beziers):
  - Each input → both processing nodes (6 paths)
  - Each processing → both outputs (4 paths)
  - Total: 10 connection paths, gradient strokes
- 3 data pulse dots (small circles that travel along paths)
```

**GSAP Timeline**:
```
t=0.0s  Input nodes scale in (stagger 0.1s, 0.3s each, back.out)
t=0.2s  Input→Processing paths draw (stagger 0.08s, 0.5s each, power3.out)
t=0.6s  Processing nodes scale 0→1.15→1.0 (0.4s, back.out(1.7)) + gradient glow ring
t=0.8s  Processing→Output paths draw (stagger 0.08s, 0.4s each, power3.out)
t=1.0s  Output nodes scale in (stagger 0.1s, 0.35s each, back.out) + bright glow
--- Idle ---
t=loop  3 pulse dots traverse random input→processing→output paths (stagger 0.8s, 2s per traverse, repeat:-1)
t=loop  Processing node glow rings pulse (scale 1→1.15→1, 3s, sine.inOut, repeat:-1)
```

**Opacity targets**: Connection paths 0.4 (drawn), nodes 0.7–0.9, processing glow 0.5. On hover: paths 0.6, nodes 1.0.

---

### Card 3 (2 cols): "The Top 1% Builds Your Product"

**Metaphor**: Talent funnel — many enter, elite few emerge

**SVG Structure** (viewBox `0 0 480 260`):
```
- 14 candidate dots scattered across top band (y: 25–70, x: evenly spread):
  - Small (r=3), white/40
- Funnel shape:
  - Left diagonal line from (60, 90) to (190, 195)
  - Right diagonal line from (420, 90) to (290, 195)
  - Bottom filter bar from (190, 195) to (290, 195), gradient stroke
- 3 selected elite dots at bottom (y=235):
  - x=210 (r=7, #9900ff)
  - x=240 (r=9, #00eeff, brightest, largest)
  - x=270 (r=7, #ff00ff)
- Glow rings around each selected dot
- Ghost horizontal lines at top (subtle grid texture)
```

**GSAP Timeline**:
```
t=0.0s  Funnel lines draw top→bottom (0.5s, power2.out)
t=0.1s  Filter bar draws center→out (0.3s, power2.out)
t=0.2s  14 candidate dots appear at top (stagger 0.04s, 0.2s each, power1.out)
t=0.5s  Candidates start drifting downward (0.8s, power1.in)
t=0.8s  11 candidate dots fade out as they hit funnel walls (stagger 0.05s, 0.3s each)
t=1.0s  3 surviving dots pass through filter, drift to final positions (0.5s, power2.out)
t=1.2s  Selected dots scale up (0.35s, back.out(1.7)) + glow rings expand (0.4s)
--- Idle ---
t=loop  Selected dot glow rings pulse (opacity 0.3→0.6→0.3, 3s, sine.inOut, repeat:-1)
t=loop  Center selected dot subtle float (y ±3px, 4s, sine.inOut, repeat:-1, yoyo:true)
```

**Opacity targets**: Funnel lines 0.3, candidate dots 0.5 (then fade), selected dots 0.85, glow rings 0.5. On hover: selected dots 1.0, glow 0.7.

---

### Card 4 (1 col): "Revenue, Not Just Pixels"

**Metaphor**: Ascending revenue curve — a clean chart with a curve drawing upward

**SVG Structure** (viewBox `0 0 280 220`):
```
- Y-axis line (x=40, y: 20→190, white/10)
- X-axis line (y=190, x: 40→260, white/10)
- 3 horizontal grid lines (y: 60, 105, 150; dashed, white/6)
- Revenue curve path: cubic bezier from (40, 175) curving up to (255, 35)
  - Gradient stroke #9900ff→#00eeff, strokeWidth 2.5
- Area fill under curve (same path + bottom-right + bottom-left close)
  - Linear gradient fill, 0.15 opacity
- 4 data points along curve:
  - (80, 160) r=3
  - (140, 130) r=3.5
  - (200, 80) r=4
  - (250, 38) r=5 (final, largest, brightest)
- Upward arrow at curve end (small chevron)
```

**GSAP Timeline**:
```
t=0.0s  Axes fade in (0.3s, power2.out)
t=0.1s  Grid lines fade in (0.2s)
t=0.2s  Revenue curve draws left→right (1.0s, power2.out)
t=0.5s  Area gradient fades in following curve (0.6s, power1.out)
t=0.6s  Data points pop in at positions (stagger 0.12s, 0.25s each, back.out(1.4))
t=1.0s  Arrow chevron draws (0.2s, power2.out)
t=1.1s  Final data point gets glow ring (0.3s)
--- Idle ---
t=loop  Final data point glow pulses (opacity 0.4→0.7→0.4, 3s, sine.inOut, repeat:-1)
t=loop  Subtle shimmer along curve (a small bright segment travels the path, 4s, repeat:-1)
```

**Opacity targets**: Axes/grid 0.15, curve stroke 0.7, area fill 0.2, data points 0.7–0.9. On hover: curve 0.9, points 1.0, area 0.3.

---

## Copywriting Specification

### Section Header
**Before**: "Enter NEBULOS"
**After**:
```
Headline: "Your unfair advantage."
Subtitle: "The engine behind 120+ shipped products — senior engineers, AI workflows,
           and a guarantee that makes risk obsolete."
```
**Why**: "Unfair advantage" triggers competitive desire/FOMO. Subtitle leads with social proof (120+), stacks 3 value pillars, ends with guarantee hook.

### Card 1 Copy
**Before**: "14-Day Sprints" / "Working software every two weeks..."
**After**:
```
Stat:  "2 wk" / "Time to first deploy"
Title: "Two Weeks to Working Software"
Body:  "While competitors debate roadmaps, you ship deployable code.
        Every 14 days — reviewed, tested, demo-ready."
```
**Why**: Competitive framing opens ("while competitors..."). Concrete outcome ("ship deployable code"). Rhythm in the closer ("reviewed, tested, demo-ready" — tricolon with ascending stakes).

### Card 2 Copy
**Before**: "AI-Accelerated Engineering" / "Our engineers ship with AI copilots..."
**After**:
```
Stat:  "27%" / "Velocity advantage"
Title: "AI Makes Your Team 10x"
Body:  "Every engineer ships with AI embedded in code generation, testing,
        and review. Not a buzzword — a measured 27% velocity boost."
```
**Why**: "10x" is tech's most powerful multiplier framing. "Not a buzzword" preemptively disarms skepticism. "Measured" adds scientific credibility.

### Card 3 Copy
**Before**: "Senior Engineers Only" / "No juniors learning on your dime..."
**After**:
```
Stat:  "8+" / "Years minimum experience"
Title: "The Top 1% Builds Your Product"
Body:  "8+ years minimum. 120+ products shipped. Zero juniors.
        Your codebase gets architects, not apprentices."
```
**Why**: "Top 1%" creates aspirational exclusivity. Staccato stat-stacking ("8+. 120+. Zero.") builds cumulative weight. "Architects, not apprentices" — memorable alliterative contrast.

### Card 4 Copy
**Before**: "Built to Convert" / "Born from CRO roots..."
**After**:
```
Stat:  "38%" / "Fewer production bugs"
Title: "Revenue, Not Just Pixels"
Body:  "Born from conversion optimization. Every interface, interaction,
        and pixel is engineered to move your revenue needle."
```
**Why**: Title is a direct contrast frame ("revenue, not pixels"). Tricolon rhythm ("interface, interaction, pixel") with escalating specificity. "Move your revenue needle" — concrete, measurable language.

### Metrics Bar
**Before**: "Sprint Length: 14 days" / "Faster Delivery: 27%" / "Fewer Bugs: 38%"
**After**: Reframed as outcomes:
```
"Time to first deploy" → "14 days"
"Velocity advantage"   → "27%"
"Bug reduction"        → "38%"
```

---

## Micro-Interaction Specification

### Mouse-Tracking Glow (enhanced)
- Radius: 280px → **400px**
- Intensity: `rgba(153,0,255,0.12)` → `rgba(153,0,255,0.20)`
- Transition: 500ms → **300ms** (snappier response)

### Card Hover (enhanced)
- Lift: `-3px` → **`-6px`**
- Border: `rgba(153,0,255,0.35)` → `rgba(153,0,255,0.50)`
- Shadow: Single layer → **double-layer**: `0 12px 50px rgba(153,0,255,0.18), 0 0 80px rgba(0,238,255,0.08)`
- Duration: 400ms → **350ms** (snappier)

### SVG Hover Response (new)
- On card `mouseenter`: GSAP increases SVG timeline `timeScale` to 1.3 (faster idle loops)
- On card `mouseleave`: GSAP restores `timeScale` to 1.0
- SVG primary element opacity animates to hover targets (0.3s, power2.out)

### Counter Glow (new)
- When counter reaches final value: a subtle glow pulse on the number (text-shadow 0→glow→0, 0.6s)

### Gradient Border (always-on)
- At rest: opacity **0.25** (currently 0)
- On hover: opacity **1.0** (unchanged)
- Transition: 400ms ease

---

## Implementation Tasks

### Task 1: Core Architecture — GSAP Migration + Refs

**Files:** Modify `src/components/solution.tsx:1-442`

**Step 1:** Replace imports
```tsx
// REMOVE
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/lib/animations";

// ADD
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

**Step 2:** Remove `injectStyles()` function and CSS keyframes entirely

**Step 3:** Set up component refs structure
```tsx
export default function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // SVG element refs — one set per card
  const svgRefs = useRef<Record<string, SVGElement | null>>({});
  // Idle timeline refs (for hover timeScale control)
  const idleTimelines = useRef<gsap.core.Timeline[]>([]);
```

**Step 4:** Master `useGSAP` with ScrollTrigger

This single `useGSAP` replaces all Framer Motion `whileInView`. Uses `scrollTrigger` per card with `toggleActions: "play none none none"` for one-shot entrance.

---

### Task 2: SVG Background Components (all 4)

**Files:** Modify `src/components/solution.tsx` — replace `SprintRingBg`, `AIBeamBg`, `TalentNetworkBg`, `GrowthBarsBg`

Each SVG component:
- Uses `React.forwardRef` or callback refs to expose SVG child elements
- Returns inline `<svg>` with class names / data attributes for GSAP targeting
- NO CSS animations — all motion via GSAP
- Initial states set via `gsap.set()` in the master `useGSAP`

**SVG path-draw pattern** (used in all cards):
```tsx
// In useGSAP:
const path = svgRefs.current['sprint-progress'];
if (path) {
  const len = (path as SVGPathElement).getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  tl.to(path, { strokeDashoffset: 0, duration: 0.8, ease: "power3.out" }, 0.1);
}
```

Each card's SVG elements get unique ref keys:
- Card 1: `sprint-bar`, `sprint-progress`, `sprint-node-0/1/2`, `sprint-check`, `sprint-ghost`
- Card 2: `ai-input-0/1/2`, `ai-path-0..9`, `ai-proc-0/1`, `ai-output-0/1`, `ai-pulse-0/1/2`
- Card 3: `talent-funnel-l`, `talent-funnel-r`, `talent-filter`, `talent-cand-0..13`, `talent-elite-0/1/2`, `talent-glow-0/1/2`
- Card 4: `rev-axis-y`, `rev-axis-x`, `rev-grid-0/1/2`, `rev-curve`, `rev-area`, `rev-dot-0/1/2/3`, `rev-arrow`

---

### Task 3: GSAP Animation Choreography

**Files:** Modify `src/components/solution.tsx` — inside `useGSAP`

For each card (i = 0..3):
```tsx
const cardEl = cardRefs.current[i];
if (!cardEl) return;

// Entrance timeline for this card
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: cardEl,
    start: "top 85%",
    toggleActions: "play none none none",
  }
});

// Card container entrance (replaces Framer fadeIn)
tl.fromTo(cardEl,
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
  i * 0.12  // stagger
);

// SVG choreography (per-card, detailed in Task 2)
// ...

// After entrance completes, start idle loops
tl.call(() => {
  const idle = gsap.timeline({ repeat: -1 });
  // Card-specific idle animations...
  idleTimelines.current[i] = idle;
});
```

---

### Task 4: Enhanced BentoCard Component

**Files:** Modify `src/components/solution.tsx` — `BentoCard` function

Key changes:
- Remove `motion.div` → use plain `div` (GSAP handles entrance)
- Remove `useCountUp` IntersectionObserver (GSAP ScrollTrigger handles timing)
- Card bg: `bg-white/[0.05]` (was 0.02)
- Card border: `border-white/[0.12]` (was 0.08)
- Gradient border at rest: opacity 0.25
- Mouse glow: 400px, 0.20 alpha, 300ms transition
- Hover lift: `-6px`, shadow doubled
- **New**: on mouseenter/leave, adjust idle timeline `timeScale`

```tsx
const handleMouseEnter = useCallback(() => {
  const idle = idleTimelines.current[index];
  if (idle) gsap.to(idle, { timeScale: 1.3, duration: 0.4 });
}, [index]);

const handleMouseLeave = useCallback(() => {
  const idle = idleTimelines.current[index];
  if (idle) gsap.to(idle, { timeScale: 1.0, duration: 0.6 });
}, [index]);
```

---

### Task 5: Copywriting + Header + Metrics

**Files:** Modify `src/components/solution.tsx` — data arrays and JSX

Replace all text content per the Copywriting Specification above.

Header becomes GSAP-animated (scroll-triggered fromTo with stagger between h2 and p).

Metrics bar becomes GSAP-animated (scroll-triggered fadeIn).

---

### Task 6: Build Verification

**Step 1:** Run `npx next build`
Expected: zero errors, zero type errors

**Step 2:** Visual verification
- Start dev server, navigate to solution section
- Verify: SVG animations play on scroll entry
- Verify: Cards have visible borders and backgrounds
- Verify: Hover effects work (glow, lift, border, SVG timeScale)
- Verify: Counter animation fires
- Verify: Mobile responsive (cards stack)
- Verify: KPR container transition unaffected

---

## Scope Guardrails

**DO modify:** Everything inside `src/components/solution.tsx`
**DO NOT modify:** `kpr-transition.tsx`, `glass-flow.tsx`, `globals.css`, `animations.ts`, `page.tsx`, or any other file

The `<section id="solution">` root element keeps its `id` for navigation anchoring. Its className may be adjusted for internal styling needs but the section remains the Solution component's root.

---

## Reference: GSAP SVG Path-Draw Without Plugins

The free strokeDashoffset technique ([source](https://dev.to/hexshift/how-to-animate-complex-svg-paths-with-gsap-for-stunning-ui-effects-3oei)):

```tsx
const path = document.querySelector('.my-path') as SVGPathElement;
const length = path.getTotalLength();
gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
gsap.to(path, {
  strokeDashoffset: 0,
  duration: 1.2,
  ease: "power3.out",
  scrollTrigger: { trigger: path, start: "top 80%" }
});
```
