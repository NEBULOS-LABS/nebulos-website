# Cinematic 3D Depth System — Services Section

**Date:** 2026-02-26
**Branch:** redesign
**Status:** Approved design, pending implementation

## Problem

The accretion disk WebGL background reads as a beautiful background event but lacks the depth cues that make a scene feel physically present and cinematic. The section needs a "virtual camera" system with motion parallax, atmospheric layers, and surface response to transform it from "nice background" into "gravitational anchor."

## Design Intent

Treat the black hole as the **gravitational anchor** of the scene. Introduce a virtual camera with:
- **Pivot/anchor:** black hole center (lower-right of viewport)
- **Scroll behavior:** tiny dolly + orbit (existing u_offset.y scrub)
- **Pointer behavior:** tiny tilt + parallax across 5 depth planes
- **Depth cues:** motion parallax, atmospheric haze, specular highlights, one controlled lensing moment

The key discipline: **if you can feel the motion while reading, it's too much.**

## Architecture

### Layer Stack (top to bottom)

```
z-[9999]  Cursor dot (existing)
z-[9998]  Cursor ring (existing)
z-20      Scroll rail (existing, absolute far-left)
z-[15]    DustField canvas — near plane, additive blend, pointer-events: none
z-10      Content — cards, header, footer (existing motion.section)
z-[5]     Haze layer — pseudo-element inside sticky wrapper
z-[3]     Directional fade (existing, inside sticky wrapper)
z-[2]     Vignette (existing, inside sticky wrapper)
z-[1]     Noise grain (existing, inside sticky wrapper)
z-0       AccretionBackground WebGL canvas (existing, inside sticky wrapper)
```

### Pointer Tracking

Shared hook: `usePointerParallax(containerRef)`

Returns refs (not state, to avoid re-renders):
- `normalizedRef: { x: number, y: number }` — pointer in [-1..1] space
- `isInsideRef: boolean` — whether pointer is within section bounds

The existing custom cursor `handleMouseMove` on `outerRef` already fires on every mouse event. The hook taps into the same listener pattern (or extends it) to populate the normalized ref. Zero additional event listeners.

Each consuming layer creates its own `gsap.quickTo` instances with different durations for the damping cascade:
- Far plane (bg internals): `duration: 1.2` — heavy, inertial
- Mid plane (card): `duration: 0.8` — moderate response
- Near plane (dust): `duration: 0.5` — responsive, floaty

### Per-Layer Motion Mapping

Pointer normalized to `[-1..1]`:

| Layer | translateX | translateY | rotate | Extra | Damp |
|-------|-----------|-----------|--------|-------|------|
| Background (far) | 18-30px | 12-24px | 0.3-0.8deg | — | 1.2s |
| WebGL scene (mid) | — | — | — | u_mouse ±0.02 UV shift | 1.0s |
| Haze (mid-far) | 8-14px | 6-10px | slow 60-120s rotation | — | 1.2s |
| Card (hero) | — | — | rotateX/Y 0.6-1.5deg | translateZ 10-24px, specular | 0.8s |
| Headline | 2-6px | 2-4px | — | prefer glow response | 0.8s |
| Dust (near) | 30-60px | 20-45px | — | very low opacity, additive | 0.5s |

Note: WebGL scene parallax is handled entirely GPU-side via uniform shift, not DOM transforms. This avoids breaking `position: sticky` on the canvas wrapper.

### Scroll Choreography Sync

Extend the existing parallax proxy object to include new effect amplitudes:

```
Keyframes synced to existing 3-phase scroll:

0% (top):
  y: 0.35, dustOpacity: 0, hazeOpacity: 0, pointerInfluence: 0

15% (reveal complete):
  y: 0.10, dustOpacity: 0.65, hazeOpacity: 0.06, pointerInfluence: 1.0

85% (hold ends):
  y: 0.10, dustOpacity: 0.65, hazeOpacity: 0.06, pointerInfluence: 1.0

100% (exit):
  y: -0.20, dustOpacity: 0, hazeOpacity: 0, pointerInfluence: 0
```

All new effects multiply their motion amplitude by `proxy.pointerInfluence` so they automatically ramp in during arrival, hold during reading, and fade during exit.

## New Components

### 1. `usePointerParallax` hook

**File:** `src/hooks/use-pointer-parallax.ts`

Lightweight ref-based pointer tracker. Normalizes clientX/clientY to [-1..1] relative to the container's bounding rect. Provides `isInsideRef` for enter/leave detection. Does NOT manage transforms — consumers handle their own `quickTo` instances.

### 2. `DustField` component

**File:** `src/components/dust-field.tsx`

Canvas-based particle system. ~80 particles (auto-scaled down on low-end devices via `navigator.hardwareConcurrency`). Uses `globalCompositeOperation: 'lighter'` for additive blending.

Particle properties:
- Position: biased toward left/mid-left (weighted random spawn)
- Size: 1-4px base, rendered as soft circles with gaussian blur baked in
- Opacity: 0.04-0.12 (lower near right column where cards are)
- Drift: 12-24s sinusoidal loops, sine.inOut
- Pointer response: offset by normalized pointer × layer depth factor

Lifecycle: IntersectionObserver + document.visibilitychange + reduced-motion guard (same pattern as accretion-bg.tsx).

### 3. Haze Layer (CSS pseudo-element)

Added inside the sticky background wrapper as a new div:
- `radial-gradient` + `conic-gradient` blend
- `mix-blend-mode: screen`
- Opacity 0.03-0.08 (scroll-synced via proxy)
- Slow rotation: 90s CSS animation
- Positioned to wrap around black hole rim (lower-right quadrant bias)
- Never brightens the copy zone (masked by gradient falloff)

### 4. Card Specular Highlight

CSS custom properties driven by JS pointer tracker:
- `--spec-x`: highlight X position (8-20% of card width range)
- `--spec-y`: highlight Y position
- `--spec-opacity`: 0.06-0.18 (based on pointer proximity)

Applied via a `::before` pseudo-element on `.svc-panel` with `radial-gradient`. Only active when card is expanded (isActive) and not compressed.

Card container transforms:
- `perspective(1200px)` on parent wrapper
- `rotateX(var(--rx)) rotateY(var(--ry)) translateZ(var(--tz))` on `.svc-panel`
- Max rotation: 1.5deg, max Z: 24px
- Shadow shifts with pointer direction for grounding

### 5. Gravitational Lensing (WebGL uniform)

Two new uniforms in the accretion shader:
- `u_mouse` (vec2): normalized pointer position [-1..1]
- `u_mouse_prox` (float): proximity scalar [0..1], only > 0 when cursor is in the lower-right quadrant near the black hole

In the fragment shader:
```glsl
vec2 lensShift = u_mouse * u_mouse_prox * 0.02;
vec2 offset = (u_offset + lensShift) * uResolution;
```

This shifts the vortex center by up to ±0.02 UV when the cursor is near the black hole. The existing scroll choreography (u_offset.y keyframes) is completely unaffected — lensShift is additive.

## Accessibility

- `prefers-reduced-motion`: disable all pointer parallax, freeze dust particles, remove haze animation, disable lensing. Static scene only.
- Mobile (`isMobile`): no pointer parallax, no dust canvas, no haze, no card transforms. Keep existing absolute-positioned background.
- `pointer-events: none` on all overlay layers.
- DustField canvas pauses via IntersectionObserver when off-screen.
- Focus-visible: apply subtle specular highlight on keyboard focus (accessibility bridge).

## Performance Budget

- DustField: single `<canvas>`, ~80 particles, one RAF loop (paused when not visible)
- Haze: pure CSS animation (GPU-composited rotation), zero JS cost
- Card specular: CSS custom property updates (one `requestAnimationFrame` read per pointer event)
- Lensing: two additional `gl.uniform` calls per frame (negligible)
- Auto-scaling: `navigator.hardwareConcurrency <= 4` → reduce particles to 40, disable lensing

## Improvements Beyond Requirements

1. **Scroll velocity modulation** — `ScrollTrigger.getVelocity()` slightly increases dust drift during fast scrolls (wind from motion).
2. **Performance auto-scaling** — hardware detection reduces complexity on low-end devices.
3. **Focus-visible card highlight** — specular effect on `:focus-visible` for keyboard users.
4. **Smooth pointer exit** — transforms ease to center over 0.8s on mouseleave (not snap).
5. **Adaptive haze accent** — haze opacity subtly shifts with `activeIndex` accent color.

## Implementation Phases

### Phase 1: Pointer Tracking + Camera Rig + Card Specular
- `usePointerParallax` hook
- Background layer pointer transforms
- Card perspective + specular pseudo-element
- Headline micro-response
- Scroll-synced pointerInfluence multiplier

### Phase 2: Dust Motes + Haze
- `DustField` canvas component
- Spatially-weighted particle distribution
- Haze CSS layer in sticky wrapper
- Scroll-synced opacity for both
- IntersectionObserver lifecycle

### Phase 3: Gravitational Lensing
- `u_mouse` + `u_mouse_prox` uniforms in shader
- Proximity detection (cursor near lower-right quadrant)
- Additive lens shift in fragment shader
- Both WebGL2 and WebGL1 fallback shaders updated
