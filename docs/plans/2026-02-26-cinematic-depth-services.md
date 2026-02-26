# Cinematic 3D Depth System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a multi-layer cinematic depth system to the services section with pointer-driven parallax, dust motes, volumetric haze, card specular highlights, and gravitational lensing — all synced to the existing 3-phase scroll choreography.

**Architecture:** A shared pointer-tracking ref feeds normalized coordinates to 5 depth layers, each with different GSAP `quickTo` damping durations. New effects multiply their amplitude by a scroll-synced `pointerInfluence` proxy value (0→1→1→0) so they ramp in during arrival, hold during reading, and fade during exit. WebGL lensing uses two new shader uniforms (`u_mouse`, `u_mouse_prox`) for GPU-only vortex center shift.

**Tech Stack:** React 18 + TypeScript, GSAP 3.12 + ScrollTrigger + useGSAP, Canvas 2D API (particles), WebGL2/1 (shader uniforms), CSS custom properties (card specular), Tailwind CSS.

---

## Phase 1: Pointer Tracking + Camera Rig + Card Specular

### Task 1: Create `usePointerParallax` hook

**Files:**
- Create: `src/hooks/use-pointer-parallax.ts`

**Context:** No `src/hooks/` directory exists yet. This hook provides shared normalized pointer coordinates `[-1..1]` via a ref (no re-renders). Consumers create their own `gsap.quickTo` instances for per-layer damping.

**Step 1: Create hooks directory**

Run: `mkdir -p src/hooks`

**Step 2: Write the hook**

```typescript
// src/hooks/use-pointer-parallax.ts
"use client";

import { useRef, useEffect } from "react";

export interface PointerState {
  /** Normalized X in [-1..1] relative to container center */
  nx: number;
  /** Normalized Y in [-1..1] relative to container center */
  ny: number;
}

/**
 * Tracks pointer position normalized to [-1..1] relative to a container element.
 * Returns stable refs (no re-renders). Consumers read .current each frame.
 *
 * @param containerRef - The element to track pointer over
 * @param enabled - Gate to disable tracking (e.g. isMobile || reducedMotion)
 */
export function usePointerParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const pointerRef = useRef<PointerState>({ nx: 0, ny: 0 });
  const isInsideRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      pointerRef.current = { nx: 0, ny: 0 };
      isInsideRef.current = false;
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      // Normalize to [-1..1] where (0,0) is container center
      pointerRef.current = {
        nx: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        ny: ((e.clientY - rect.top) / rect.height) * 2 - 1,
      };
    };

    const handleEnter = () => {
      isInsideRef.current = true;
    };

    const handleLeave = () => {
      isInsideRef.current = false;
      // Don't snap to center — let consumers' quickTo ease back naturally
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [containerRef, enabled]);

  return { pointerRef, isInsideRef };
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiled successfully (unused export is fine — consumed in next task)

**Step 4: Commit**

```
feat(hooks): add usePointerParallax for normalized pointer tracking
```

---

### Task 2: Extend scroll proxy with `pointerInfluence` + `dustOpacity` + `hazeOpacity`

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx:924-951` (existing parallax useGSAP)

**Context:** The existing ScrollTrigger scrubs `proxy.y` with non-linear keyframes. We extend the same proxy object with three new properties that control effect amplitudes across the 3 scroll phases. This avoids adding extra ScrollTrigger instances.

**Step 1: Extend the proxy and keyframes**

Replace the existing accretion disk parallax `useGSAP` block (lines 924-951) with:

```typescript
  /* ═══ ACCRETION DISK PARALLAX + DEPTH EFFECT CHOREOGRAPHY ═══ */
  /* Shared proxy drives: u_offset.y (disk position), dustOpacity,
     hazeOpacity, and pointerInfluence across the 3 scroll phases.
     All values are read by other effects via depthProxyRef.current. */
  const depthProxyRef = useRef({ y: 0.35, dustOpacity: 0, hazeOpacity: 0, pointerInfluence: 0 });

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
```

Note: `depthProxyRef` is declared at component scope (near line 727 with other refs) so it's accessible from the pointer parallax effects and the DustField/haze components.

**Step 2: Add the ref declaration**

After `diskOffsetYRef` (line 727), add:

```typescript
  const depthProxyRef = useRef({ y: 0.35, dustOpacity: 0, hazeOpacity: 0, pointerInfluence: 0 });
```

Remove the inline `depthProxyRef` from inside the useGSAP callback (it's now the outer ref).

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 4: Commit**

```
feat(services): extend scroll proxy with depth choreography values
```

---

### Task 3: Wire `usePointerParallax` + background layer pointer transforms

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx:1-12` (imports)
- Modify: `src/components/ui/bento-monochrome-1.tsx:710-728` (refs)
- Modify: `src/components/ui/bento-monochrome-1.tsx:1189-1255` (custom cursor effect)
- Modify: `src/components/ui/bento-monochrome-1.tsx:1268-1296` (background wrapper JSX)

**Context:** The sticky background wrapper (`z-0`) contains the AccretionBackground canvas + overlays. We cannot transform the sticky wrapper itself (breaks `position: sticky`). Instead, we add a new inner `div` that wraps all bg children and receives the far-plane pointer transforms. The custom cursor effect is extended to also update `pointerRef`.

**Step 1: Add import**

At line 11 (after AccretionBackground import), add:

```typescript
import { usePointerParallax } from "@/hooks/use-pointer-parallax";
```

**Step 2: Wire the hook**

After the `depthProxyRef` line in the component, add:

```typescript
  const { pointerRef, isInsideRef } = usePointerParallax(outerRef, !isMobile && !reducedMotion);
  const bgInnerRef = useRef<HTMLDivElement>(null);
  const headerParallaxRef = useRef<HTMLDivElement>(null);
```

**Step 3: Add far-plane pointer parallax effect**

After the custom cursor `useEffect` (after line 1255), add a new effect:

```typescript
  /* ═══ POINTER PARALLAX — per-layer damped transforms ═══ */
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    const bgInner = bgInnerRef.current;
    const headerEl = headerParallaxRef.current;
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
```

**Step 4: Wrap background contents in parallax inner div**

In the JSX (line 1270), wrap the children of the sticky bg wrapper:

Current (lines 1270-1296):
```jsx
<div className={`${isMobile ? 'absolute inset-0' : 'sticky top-0 h-screen w-full'} overflow-hidden pointer-events-none z-0`}>
  <AccretionBackground ... />
  {/* Noise ... */}
  {/* Vignette ... */}
  {/* Directional fade ... */}
</div>
```

Replace with:
```jsx
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
```

The `bgInnerRef` div is `absolute inset-0` inside the sticky wrapper. Transforms on this inner div move all background contents together without breaking the parent's sticky positioning. The `overflow: hidden` on the parent clips any translated edges.

**Step 5: Add `ref={headerParallaxRef}` to headline wrapper**

At line 1346, add the ref to the left column header div:

```jsx
<div
  ref={(el) => { headerRef.current = el; headerParallaxRef.current = el; }}
  className="flex flex-col items-start text-left gap-4 pb-10 md:pb-0 md:sticky md:self-start"
  style={{ top: "clamp(80px, 10vh, 120px)" }}
>
```

Note: We share the DOM node with `headerRef` (used by the entrance animation). Using a callback ref to set both.

**Step 6: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 7: Visual check**

Run: `npm run dev`
- Move pointer across the services section
- Background should shift 24px max with heavy inertia (1.2s damping)
- Headline should shift 4px max with moderate inertia
- Effect should fade in/out with scroll phases (0-15% ramp, 85-100% fade)
- Mobile: no effect at all

**Step 8: Commit**

```
feat(services): add pointer-driven parallax to background + headline layers
```

---

### Task 4: Card perspective + specular highlight

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx` (StackCard component, lines 332-706)

**Context:** The StackCard's `.svc-panel` container gets perspective-based rotateX/Y and translateZ. A `::before` pseudo-element provides the specular highlight. We use CSS custom properties set from a pointer-tracking effect inside StackCard, gated on `isActive && !compressed`.

The specular and perspective transforms are driven by `onMouseMove` on the card itself (not the section-level pointer tracker) because each card needs its own local coordinate space.

**Step 1: Add card-local pointer tracking and perspective transforms**

In the StackCard component (after line 368, the `watermarkRef` declaration), add:

```typescript
  const specularRef = useRef<HTMLDivElement>(null);

  /* Card pointer parallax — local to this card (perspective + specular) */
  useEffect(() => {
    if (isMobile || reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const onMove = (e: MouseEvent) => {
      if (compressed) return;
      const rect = card.getBoundingClientRect();
      // Normalize to [-1..1]
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      if (expanded) {
        // Perspective tilt: rotateY follows X, rotateX follows -Y (natural tilt)
        card.style.transform = `perspective(1200px) rotateY(${nx * 1.2}deg) rotateX(${-ny * 0.8}deg) translateZ(${expanded ? 16 : 0}px)`;

        // Specular highlight position (maps [-1..1] to [30%..70%] of card)
        card.style.setProperty("--spec-x", `${50 + nx * 20}%`);
        card.style.setProperty("--spec-y", `${50 + ny * 20}%`);
        card.style.setProperty("--spec-opacity", "0.12");
      }
    };

    const onLeave = () => {
      if (compressed) return;
      // Ease back to flat
      gsap.to(card, {
        rotateY: 0, rotateX: 0, z: 0,
        duration: 0.6, ease: "power2.out",
        clearProps: "transform",
      });
      card.style.setProperty("--spec-opacity", "0");
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, [isMobile, reducedMotion, expanded, compressed]);
```

**Step 2: Add the specular pseudo-element**

Inside the StackCard JSX, right after the opening `<div ref={cardRef} ...>` tag (line 457), add as the first child:

```jsx
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
```

**Step 3: Add box-shadow shift for depth grounding**

In the `.svc-panel` style object (line 447-453), modify the expanded boxShadow to include a directional shift. This is a minor enhancement — the existing `boxShadow` for `expanded` state already has a glow. We add CSS custom property `--shadow-x` and `--shadow-y` that the pointer handler sets:

Actually, the simplest approach: the existing `boxShadow` in the style block is already complex with ternary logic. Instead, add a second shadow layer via the specular div's boxShadow — this avoids touching the existing shadow logic.

**Step 4: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 5: Visual check**

Run: `npm run dev`
- Hover over the active service card
- Card should tilt slightly (max 1.2deg Y, 0.8deg X)
- A soft white specular highlight should follow the cursor
- On mouseleave, card eases back to flat over 0.6s
- Compressed/mobile cards: no effect

**Step 6: Commit**

```
feat(services): add card perspective tilt + specular highlight on pointer
```

---

## Phase 2: Dust Motes + Volumetric Haze

### Task 5: Create `DustField` canvas component

**Files:**
- Create: `src/components/dust-field.tsx`

**Context:** A lightweight canvas-based particle system. ~80 particles with additive blending, biased toward left/mid-left negative space. Reads `pointerRef` and `depthProxyRef` for parallax and opacity. Pauses when off-screen or tab-hidden (same lifecycle pattern as accretion-bg.tsx).

**Step 1: Write the component**

```typescript
// src/components/dust-field.tsx
"use client";

import React, { useRef, useEffect, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────────────────────── */

interface Particle {
  x: number;        // base X [0..1]
  y: number;        // base Y [0..1]
  size: number;     // radius in px
  opacity: number;  // base opacity
  phase: number;    // sin offset for drift
  speed: number;    // drift speed multiplier
  drift: number;    // drift amplitude in px
}

interface DustFieldProps {
  /** Ref to normalized pointer [-1..1] */
  pointerRef: React.RefObject<{ nx: number; ny: number }>;
  /** Ref to depth proxy (reads dustOpacity, pointerInfluence) */
  depthProxyRef: React.RefObject<{
    dustOpacity: number;
    pointerInfluence: number;
  }>;
  /** Disable on mobile / reduced motion */
  enabled: boolean;
  className?: string;
}

/* ─── Constants ─────────────────────────────────────────────────────── */

const BASE_COUNT = 80;
const LOW_END_COUNT = 40;
const NEAR_PLANE_PARALLAX = 45; // px max offset from pointer

/* ─── Component ─────────────────────────────────────────────────────── */

export default function DustField({
  pointerRef,
  depthProxyRef,
  enabled,
  className,
}: DustFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const isVisibleRef = useRef(true);
  const isTabVisibleRef = useRef(true);
  const startTimeRef = useRef(0);

  /* ── Initialize particles ──────────────────────────────────────── */
  const initParticles = useCallback(() => {
    const count =
      typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4
        ? LOW_END_COUNT
        : BASE_COUNT;

    particlesRef.current = Array.from({ length: count }, () => {
      // Bias spawn toward left/mid-left: X weighted toward [0..0.55]
      const rawX = Math.random();
      const x = rawX * rawX * 0.7 + Math.random() * 0.3; // quadratic bias left

      return {
        x: Math.min(x, 1),
        y: Math.random(),
        size: 1 + Math.random() * 3,
        // Particles near the right column (x > 0.6) get lower opacity
        opacity: x > 0.6 ? 0.02 + Math.random() * 0.04 : 0.04 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        drift: 8 + Math.random() * 16,
      };
    });
  }, []);

  /* ── Render loop ──────────────────────────────────────────────── */
  const renderLoop = useCallback(() => {
    if (!isVisibleRef.current || !isTabVisibleRef.current) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const now = performance.now() * 0.001;
    if (startTimeRef.current === 0) startTimeRef.current = now;
    const t = now - startTimeRef.current;

    const w = canvas.width;
    const h = canvas.height;

    // Read shared refs
    const { nx, ny } = pointerRef.current ?? { nx: 0, ny: 0 };
    const proxy = depthProxyRef.current ?? { dustOpacity: 0, pointerInfluence: 0 };
    const globalOpacity = proxy.dustOpacity;
    const influence = proxy.pointerInfluence;

    // Clear
    ctx.clearRect(0, 0, w, h);

    if (globalOpacity <= 0.001) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    // Additive blending for glow
    ctx.globalCompositeOperation = "lighter";

    particlesRef.current.forEach((p) => {
      // Sinusoidal drift (12-24s period based on speed)
      const period = (1 / p.speed) * 18;
      const driftX = Math.sin(t / period + p.phase) * p.drift;
      const driftY = Math.cos(t / period * 0.7 + p.phase * 1.3) * p.drift * 0.6;

      // Pointer parallax (near plane: large offset, damped by influence)
      const parallaxX = nx * NEAR_PLANE_PARALLAX * influence;
      const parallaxY = ny * NEAR_PLANE_PARALLAX * 0.7 * influence;

      const px = p.x * w + driftX + parallaxX;
      const py = p.y * h + driftY + parallaxY;

      // Soft circle with gaussian-ish falloff
      const r = p.size * (window.devicePixelRatio > 1 ? 1.5 : 1);
      const alpha = p.opacity * globalOpacity;

      if (alpha < 0.002) return;

      const grad = ctx.createRadialGradient(px, py, 0, px, py, r * 2);
      grad.addColorStop(0, `rgba(200, 230, 255, ${alpha})`);
      grad.addColorStop(0.4, `rgba(150, 210, 255, ${alpha * 0.6})`);
      grad.addColorStop(1, `rgba(100, 180, 255, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, r * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";

    rafRef.current = requestAnimationFrame(renderLoop);
  }, [pointerRef, depthProxyRef]);

  /* ── Resize handler ────────────────────────────────────────────── */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 1.5);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  }, []);

  /* ── Lifecycle ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    initParticles();
    handleResize();

    // ResizeObserver
    const resizeObs = new ResizeObserver(handleResize);
    resizeObs.observe(canvas);

    // IntersectionObserver — pause when off-screen
    const intObs = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    intObs.observe(canvas);

    // Document visibility
    const onVis = () => {
      isTabVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    // Start
    startTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObs.disconnect();
      intObs.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [enabled, initParticles, handleResize, renderLoop]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 3: Commit**

```
feat(dust): add DustField canvas particle component
```

---

### Task 6: Add haze layer to sticky background wrapper

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx` (JSX, inside sticky bg wrapper)

**Context:** A CSS-only atmospheric haze layer using blended gradients with slow rotation. Positioned inside the `bgInnerRef` wrapper (moves with background parallax). Opacity is scroll-synced via `depthProxyRef.current.hazeOpacity`.

**Step 1: Add haze ref**

After `headerParallaxRef` (from Task 3), add:

```typescript
  const hazeRef = useRef<HTMLDivElement>(null);
```

**Step 2: Add haze element inside `bgInnerRef` wrapper**

After the directional fade div (the last child before `</div>` closing `bgInnerRef`), add:

```jsx
        {/* Volumetric haze — slow-rotating light scatter, biased lower-right */}
        {!isMobile && (
          <div
            ref={hazeRef}
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              background: `
                radial-gradient(ellipse at 70% 65%, rgba(0, 238, 255, 0.08) 0%, transparent 50%),
                conic-gradient(from 0deg at 65% 60%, rgba(153, 0, 255, 0.04) 0deg, transparent 90deg, rgba(0, 238, 255, 0.03) 180deg, transparent 270deg)
              `,
              mixBlendMode: "screen",
              opacity: 0,
              animation: "hazeRotate 90s linear infinite",
              willChange: "transform",
            }}
          />
        )}
```

**Step 3: Add the haze keyframe to KEYFRAME_CSS**

At line 124-132, append to the `KEYFRAME_CSS` array (before `.join("\n")`):

```typescript
  "@keyframes hazeRotate{0%{transform:rotate(0deg) scale(1.2)}100%{transform:rotate(360deg) scale(1.2)}}",
```

The `scale(1.2)` ensures no corner gaps appear during rotation since the element rotates inside an `overflow: hidden` container.

**Step 4: Add haze opacity sync to pointer parallax tick**

In the pointer parallax `useEffect` from Task 3, inside the `tick()` function, after the headline transforms, add:

```typescript
      // Haze opacity sync
      const haze = hazeRef.current;
      if (haze) {
        haze.style.opacity = `${depthProxyRef.current.hazeOpacity}`;
      }
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 6: Visual check**

Run: `npm run dev`
- Scroll into services section
- A very subtle (3-8% opacity) haze should appear around the lower-right area
- It should slowly rotate (90s full rotation)
- Should fade in during 0-15% scroll, hold during 15-85%, fade during 85-100%
- The haze should move with the background parallax (inside `bgInnerRef`)
- Haze should NEVER brighten the headline/card text areas

**Step 7: Commit**

```
feat(services): add volumetric haze layer with scroll-synced opacity
```

---

### Task 7: Wire `DustField` into the services section

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx` (imports + JSX)

**Context:** The DustField canvas goes at `z-[15]` — above content but at very low opacity with additive blending so it doesn't reduce readability. It's positioned absolute to `outerRef` (not inside the sticky wrapper) so it covers the full section height.

**Step 1: Add import**

After the AccretionBackground import (line 11), add:

```typescript
import DustField from "@/components/dust-field";
```

**Step 2: Add DustField to JSX**

After the separator accent lines (line 1300), before the scroll rail, add:

```jsx
      {/* Dust motes — near plane, additive blend overlay */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none z-[15]">
          <DustField
            pointerRef={pointerRef}
            depthProxyRef={depthProxyRef}
            enabled={!isMobile && !reducedMotion}
          />
        </div>
      )}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 4: Visual check**

Run: `npm run dev`
- Scroll into services section
- Soft, sparse dust particles should appear (mostly left/mid-left)
- Particles should drift slowly (12-24s sinusoidal loops)
- Moving pointer should shift particles (near-plane: ~45px max offset)
- Particles should fade in during 0-15%, hold during 15-85%, fade during 85-100%
- Mobile: no particles
- Reduced motion: no particles

**Step 5: Commit**

```
feat(services): wire DustField particle overlay into services section
```

---

## Phase 3: Gravitational Lensing

### Task 8: Add `u_mouse` + `u_mouse_prox` uniforms to accretion shader

**Files:**
- Modify: `src/components/accretion-bg.tsx:14-78` (FRAG_SRC)
- Modify: `src/components/accretion-bg.tsx:89-144` (FRAG_SRC_V1)
- Modify: `src/components/accretion-bg.tsx:209-222` (interface + props)
- Modify: `src/components/accretion-bg.tsx:338-347` (uniform cache)
- Modify: `src/components/accretion-bg.tsx:373-380` (render loop uniforms)
- Modify: `src/components/accretion-bg.tsx:428-435` (reduced motion uniforms)

**Context:** Two new uniforms allow the vortex center to shift by ±0.02 UV when the cursor is near the black hole quadrant. The `u_mouse_prox` scalar ensures the effect is localized. The parent passes `mouseRef` (a ref to `{ nx, ny, prox }`) similar to how `offsetYRef` works.

**Step 1: Update FRAG_SRC (WebGL2)**

At line 25, after `uniform vec2 u_offset;`, add:

```glsl
uniform vec2  u_mouse;
uniform float u_mouse_prox;
```

At line 59, replace:
```glsl
  vec2 offset = u_offset * uResolution;
```
with:
```glsl
  vec2 lensShift = u_mouse * u_mouse_prox * 0.02;
  vec2 offset = (u_offset + lensShift) * uResolution;
```

**Step 2: Update FRAG_SRC_V1 (WebGL1)**

At line 98, after `uniform vec2 u_offset;`, add:

```glsl
uniform vec2  u_mouse;
uniform float u_mouse_prox;
```

At line 125, replace:
```glsl
  vec2 offset = u_offset * uResolution;
```
with:
```glsl
  vec2 lensShift = u_mouse * u_mouse_prox * 0.02;
  vec2 offset = (u_offset + lensShift) * uResolution;
```

**Step 3: Update the component interface**

At line 209-213, update the interface:

```typescript
interface AccretionBackgroundProps {
  className?: string;
  reducedMotion?: boolean;
  offsetYRef?: React.MutableRefObject<number>;
  mouseRef?: React.MutableRefObject<{ nx: number; ny: number; prox: number }>;
}
```

Update the destructure (line 215-218):

```typescript
export default function AccretionBackground({
  className,
  reducedMotion,
  offsetYRef: externalOffsetYRef,
  mouseRef: externalMouseRef,
}: AccretionBackgroundProps) {
```

Add an internal fallback (after line 222):

```typescript
  const internalMouseRef = useRef({ nx: 0, ny: 0, prox: 0 });
  const activeMouseRef = externalMouseRef ?? internalMouseRef;
```

**Step 4: Update uniform cache**

At lines 338-347, add two new entries:

```typescript
    uniformsRef.current = {
      uTime: gl.getUniformLocation(program, "uTime"),
      uResolution: gl.getUniformLocation(program, "uResolution"),
      u_brightness: gl.getUniformLocation(program, "u_brightness"),
      u_speed: gl.getUniformLocation(program, "u_speed"),
      u_turbulence: gl.getUniformLocation(program, "u_turbulence"),
      u_depth: gl.getUniformLocation(program, "u_depth"),
      u_offset: gl.getUniformLocation(program, "u_offset"),
      u_mouse: gl.getUniformLocation(program, "u_mouse"),
      u_mouse_prox: gl.getUniformLocation(program, "u_mouse_prox"),
    };
```

**Step 5: Update render loop uniform sets**

At line 380 (after `gl.uniform2f(u.u_offset, ...)`), add:

```typescript
    const mouse = activeMouseRef.current;
    gl.uniform2f(u.u_mouse, mouse.nx, mouse.ny);
    gl.uniform1f(u.u_mouse_prox, mouse.prox);
```

**Step 6: Update reduced-motion single-frame render**

At line 435 (after `gl.uniform2f(u.u_offset, ...)`), add:

```typescript
          gl.uniform2f(u.u_mouse, 0, 0);
          gl.uniform1f(u.u_mouse_prox, 0);
```

**Step 7: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 8: Commit**

```
feat(accretion): add u_mouse + u_mouse_prox uniforms for gravitational lensing
```

---

### Task 9: Wire lensing — compute proximity + pass `mouseRef` from Bento3Section

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx` (refs, pointer parallax effect, JSX)

**Context:** The lensing proximity is computed from the pointer's distance to the black hole center (lower-right). When the pointer is in the lower-right quadrant and within a threshold, `prox` ramps from 0 to 1. This is computed in the pointer parallax tick and written to a `mouseRef` that's passed to AccretionBackground.

The black hole visual center is approximately at normalized coordinates (0.35, 0.3) — offset by OFFSET_X=-0.35 and the parallax u_offset.y which hovers near 0.10. In viewport-normalized space, this maps roughly to the lower-right quadrant (x > 0.3, y > 0.2).

**Step 1: Add mouseRef**

After `depthProxyRef` (from Task 2), add:

```typescript
  const diskMouseRef = useRef({ nx: 0, ny: 0, prox: 0 });
```

**Step 2: Compute proximity in the pointer parallax tick**

In the pointer parallax `useEffect` from Task 3, inside the `tick()` function, add after the headline transforms:

```typescript
      // Lensing proximity: distance from pointer to black hole center (lower-right)
      // Black hole is roughly at normalized (0.5, 0.4) in viewport space
      const bhCenterX = 0.5;
      const bhCenterY = 0.4;
      const dx = nx - bhCenterX;
      const dy = ny - bhCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Proximity ramps from 0 at dist=0.8 to 1 at dist=0
      const prox = Math.max(0, 1 - dist / 0.8) * influence;

      diskMouseRef.current = { nx: nx * influence, ny: ny * influence, prox };
```

**Step 3: Pass mouseRef to AccretionBackground**

In the JSX (the AccretionBackground element), add the prop:

```jsx
<AccretionBackground reducedMotion={reducedMotion} offsetYRef={diskOffsetYRef} mouseRef={diskMouseRef} />
```

**Step 4: Auto-scale — disable lensing on low-end devices**

In the proximity computation, add a hardware check. After `depthProxyRef`, add:

```typescript
  const enableLensing = useRef(true);
```

In the `useEffect` for pointer parallax, at the start:

```typescript
    // Disable lensing on low-end devices
    if (typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4) {
      enableLensing.current = false;
    }
```

Then guard the proximity computation:

```typescript
      const prox = enableLensing.current
        ? Math.max(0, 1 - dist / 0.8) * influence
        : 0;
```

**Step 5: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 6: Visual check**

Run: `npm run dev`
- Scroll to the services section (into the 15-85% hold phase)
- Move the cursor toward the lower-right area (where the black hole vortex is)
- The vortex center should shift very subtly (max ±0.02 UV) toward the cursor
- Move the cursor away — the shift eases back to center
- Move the cursor to the upper-left (headline area) — no lensing effect
- Reduced motion: no lensing
- Mobile: no lensing

**Step 7: Commit**

```
feat(services): wire gravitational lensing proximity to accretion shader
```

---

### Task 10: Smooth pointer exit + final polish

**Files:**
- Modify: `src/components/ui/bento-monochrome-1.tsx` (pointer parallax effect)

**Context:** When the cursor leaves the section, transforms should ease to center over 0.8s instead of holding at the last position. The `isInsideRef` from `usePointerParallax` signals the exit.

**Step 1: Add exit easing to the pointer parallax tick**

In the pointer parallax `tick()` function, wrap the transform applications with a fade-to-center when pointer exits:

```typescript
    const tick = () => {
      let { nx, ny } = pointerRef.current;
      const influence = depthProxyRef.current.pointerInfluence;

      // When pointer leaves section, ease normalized coords toward center
      if (!isInsideRef.current) {
        pointerRef.current.nx += (0 - pointerRef.current.nx) * 0.03;
        pointerRef.current.ny += (0 - pointerRef.current.ny) * 0.03;
        nx = pointerRef.current.nx;
        ny = pointerRef.current.ny;
      }

      // ... rest of transforms unchanged
    };
```

This applies a manual exponential decay (3% per frame ≈ 0.8s to reach ~10% of original at 60fps) when the pointer is outside. The `quickTo` instances on each layer add their own damping on top, creating a smooth cascading settle.

**Step 2: Verify build**

Run: `npm run build`
Expected: Compiled successfully

**Step 3: Visual check**

Run: `npm run dev`
- Move pointer within the services section — parallax active
- Move pointer OUT of the section — all layers ease gracefully back to center
- No snap/jump at the boundary

**Step 4: Final integration check**

Verify all requirements:
- [ ] Background parallax: 24px x, 18px y, 0.5deg rotate, 1.2s damping
- [ ] Headline parallax: 4px max, 0.8s damping
- [ ] Card perspective: 1.2deg Y, 0.8deg X, 16px Z, specular highlight
- [ ] Dust particles: ~80 count, left-biased, 12-24s drift, additive blend
- [ ] Haze layer: screen blend, 0.03-0.08 opacity, 90s rotation, lower-right bias
- [ ] Lensing: ±0.02 UV shift, proximity-gated to lower-right quadrant
- [ ] Scroll choreography: all effects sync to 0-15% / 15-85% / 85-100%
- [ ] Reduced motion: all effects disabled, static scene only
- [ ] Mobile: no pointer effects, no dust, no haze, no lensing
- [ ] Pointer exit: smooth ease to center
- [ ] Performance: auto-scale particles on low-end, disable lensing on ≤4 cores

**Step 5: Commit**

```
feat(services): add smooth pointer exit easing + polish depth system
```

---

## Summary

| Task | Component | Files | Reqs Covered |
|------|-----------|-------|-------------|
| 1 | `usePointerParallax` hook | Create `src/hooks/use-pointer-parallax.ts` | R2.2-R2.3 |
| 2 | Scroll proxy extension | Modify `bento-monochrome-1.tsx` | R4.1-R4.3 |
| 3 | Background + headline parallax | Modify `bento-monochrome-1.tsx` | R0.2-R0.4, R2.2a, R2.2e, R1.1 |
| 4 | Card perspective + specular | Modify `bento-monochrome-1.tsx` | R2.2d, R3C.1-R3C.4, R7.3 |
| 5 | `DustField` component | Create `src/components/dust-field.tsx` | R3A.1-R3A.5, R5.5 |
| 6 | Haze layer | Modify `bento-monochrome-1.tsx` | R3B.1-R3B.5 |
| 7 | Wire DustField | Modify `bento-monochrome-1.tsx` | R3A.3, R7.2 |
| 8 | Shader uniforms | Modify `accretion-bg.tsx` | R3D.1, R0.5 |
| 9 | Lensing proximity | Modify `bento-monochrome-1.tsx` | R3D.1, R7.1, R7.4 |
| 10 | Smooth exit + polish | Modify `bento-monochrome-1.tsx` | R5.1-R5.4, R1.2-R1.5 |

**Total: 10 tasks, 3 phases, 4 files touched (2 new, 2 modified)**
