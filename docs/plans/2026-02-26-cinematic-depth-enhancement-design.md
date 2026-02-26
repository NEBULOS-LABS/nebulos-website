# Cinematic Depth Enhancement — "Gravitational Illumination"

**Date:** 2026-02-26
**Branch:** redesign
**Status:** Approved design, pending implementation

## Problem

The services section's depth system has a strong far-plane (bg parallax, shader lensing) and near-plane (dust), but the mid-plane is hollow. Cards and header sit flat with no depth participation. The haze barely registers at 6% opacity. The card hover specular washes content in white light instead of revealing it.

## Design Philosophy

Three pillars:

1. **Complete the depth stack** — Add the missing mid-plane (cards + header move with pointer)
2. **Make the haze an atmospheric presence** — Volumetric fog, not a CSS experiment
3. **Card hover reveals instead of conceals** — Directional edge glow + content luminance boost

All light in the scene emanates from the accretion disk. Hover effects feel like gravitational light catching card edges.

## 1. Revised Parallax Motion Mapping

| Layer | X | Y | Rotate | Damping | Change |
|-------|---|---|--------|---------|--------|
| BG inner (far) | ±32px | ±24px | ±0.6° | 1.2s | +8/+6 |
| Shader lensing | 0.025 UV | — | — | 1.0s | +0.005 |
| Haze (mid-far) | ±20px | ±15px | 90s CSS | 1.1s | NEW |
| Cards (mid) | ±10px | ±7px | — | 0.7s | NEW |
| Header (mid-near) | ±6px | ±4px | — | 0.6s | +2/+1 |
| Dust (near) | ±55px | ±38px | — | 0.4s | +10/+7 |

Card parallax uses CSS custom properties (`--cpx`, `--cpy`) set on `outerRef` in the RAF tick loop. Each card's sticky wrapper applies `transform: translate(var(--cpx, 0px), var(--cpy, 0px))`. Transforms on the sticky element itself are safe; only ancestor transforms break sticky positioning.

## 2. Haze Enhancement

| Property | Current | New |
|----------|---------|-----|
| Max scroll opacity | 0.06 | 0.16 |
| Radial gradient alpha | 0.08 | 0.14 |
| Conic gradient purple | 0.04 | 0.07 |
| Conic gradient cyan | 0.03 | 0.06 |
| Pointer parallax X/Y | 0/0 | ±20px/±15px |
| Scale response | none | 1.2 + nx×0.02 |

Haze gets its own quickTo instances for X/Y translation (1.1s damping). Moving the haze independently from bg and content creates a "floating fog" effect — highest-impact single change.

## 3. Card Hover Redesign

### a) Specular → Accent Edge Aura
- Kill white radial gradient (`rgba(255,255,255,0.12)`)
- Replace: `rgba(0, 238, 255, 0.035)`, spread to `transparent 65%`
- 70% dimmer, thematically coherent with accretion disk light

### b) Content Luminance Boost
- CSS custom property `--card-brightness`: 1.0 → 1.12 on hover
- Applied via `filter: brightness(var(--card-brightness, 1))` on content wrapper
- Text becomes crisper, icons more vivid
- Transition: `filter 400ms ease`

### c) Directional Border Glow
- Border: `rgba(255,255,255,0.06)` → `rgba(0,238,255, 0.18)` on hover
- Inner glow: `inset ${nx*2}px ${ny*1.5}px 25px rgba(0,238,255,0.05)`
- Depth shadow: `${-nx*6}px ${-ny*4}px 40px rgba(0,0,0,0.35)`

### d) Card Tilt Enhancement
- rotateY: ±1.2° → ±1.5°
- rotateX: ±0.8° → ±1.0°
- translateZ: 16px → 20px

## 4. Scroll Choreography Update

```
0%:   { y: 0.35, dustOpacity: 0,    hazeOpacity: 0,    pointerInfluence: 0 }
15%:  { y: 0.10, dustOpacity: 0.65, hazeOpacity: 0.16, pointerInfluence: 1 }
85%:  { y: 0.10, dustOpacity: 0.65, hazeOpacity: 0.16, pointerInfluence: 1 }
100%: { y: -0.20, dustOpacity: 0,    hazeOpacity: 0,   pointerInfluence: 0 }
```

## 5. Files Modified

| File | Changes |
|------|---------|
| `src/components/ui/bento-monochrome-1.tsx` | All parallax values, haze quickTo, card hover redesign, card parallax CSS vars, scroll proxy |
| `src/components/accretion-bg.tsx` | Bump lensing UV shift 0.02 → 0.025 |

## Accessibility & Performance

- Reduced motion: all new parallax disabled
- Mobile: no changes (skips all effects)
- Performance: two new quickTo (haze), one CSS custom property write/frame. Zero new RAF loops.
- Readability: card hover improves readability (brightness boost + reduced specular)
