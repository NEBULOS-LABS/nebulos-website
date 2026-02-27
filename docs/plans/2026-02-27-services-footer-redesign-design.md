# Accretion Convergence — Services Footer Redesign

**Date:** 2026-02-27
**Branch:** redesign
**Status:** Approved design, pending implementation

## Problem

The services section footer (metrics grid + CTA) is visually disconnected from the cinematic accretion disk scene. Three flat boxes with `rgba(255,255,255,0.03)` background sit against a shader emitting cyan/purple/magenta light. The CTA is a solid white pill button that breaks the section's visual language at the most important conversion moment. No color hierarchy between metrics, no spatial transition from cards to footer, entrance animation is functional but not memorable.

## Design: "Accretion Convergence"

Thread the accretion disk's color DNA through the footer so it reads as a cohesive finale, not an afterthought. Color-coded metrics callback to service card accents. Gradient-bordered CTA replaces jarring white button with something that belongs in the gravitational field.

## 1. Gradient Separator

Thin horizontal line between card area and footer, signaling transition from content to conclusion.

| Property | Value |
|----------|-------|
| Width | 40%, centered |
| Height | 1px |
| Gradient | `from-transparent via-[#00eeff]/40 to-transparent` |
| Glow | `box-shadow: 0 0 15px rgba(0,238,255,0.15)` |
| Spacing | `mb-12 md:mb-16` before metrics |

## 2. Metrics Boxes — Color-Coded Accent System

Each box maps to a brand color:

| Metric | Accent |
|--------|--------|
| "250+ Active Deployments" | Cyan `#00eeff` |
| "99% Client Satisfaction" | Magenta `#ff00ff` |
| "10M+ Lines Shipped" | Purple `#9900ff` |

### Box Styling

| Property | Current | New |
|----------|---------|-----|
| Background | `rgba(255,255,255,0.03)` | `rgba(accent, 0.04)` |
| Border | `rgba(255,255,255,0.06)` | `rgba(accent, 0.12)` |
| Top stripe | none | 2px solid, accent at 50% opacity |
| Inner glow | none | `inset 0 1px 20px rgba(accent, 0.06)` |
| Value color | white | Accent color (full brightness) |
| Label color | `text-gray-500` | unchanged |
| Padding | `px-4 py-4` | `px-5 py-5` |
| Grid max-width | `max-w-lg` (512px) | `max-w-xl` (576px) |

### Hover (desktop only)

- Border: `0.12` → `0.25` opacity
- Inner glow: `0.06` → `0.12`
- Scale: `1.02`
- Transition: `all 300ms cubic-bezier(0.16, 1, 0.3, 1)`

## 3. CTA Section

### Label Redesign

Flanking gradient lines:
```
———————  Need something custom?  ———————
```
- Layout: `flex items-center gap-4`, full width `max-w-xl`
- Lines: `flex-1 h-[1px]` gradient `from-transparent via-[#00eeff]/30 to-transparent`
- Text: cyan, keep tracking

### Button Redesign

| Property | Current | New |
|----------|---------|-----|
| Background | `bg-white` | `rgba(0,0,0,0.6)` dark translucent |
| Text | `text-black font-bold` | `text-white font-semibold` |
| Border | none | Gradient via `background-clip` (cyan→magenta→purple) |
| Glow | `0_0_20px rgba(255,255,255,0.2)` | `0 0 25px rgba(0,238,255,0.15), 0 0 50px rgba(153,0,255,0.08)` |
| Padding | `px-8 py-3.5` | `px-10 py-4` |

### Button Hover

- Background: `0.6` → `0.4` opacity
- Glow: doubles intensity
- Scale: `1.05`
- Transition: `all 400ms cubic-bezier(0.16, 1, 0.3, 1)`

## 4. Enhanced Entrance Animation

| Property | Current | New |
|----------|---------|-----|
| Initial scale | none | `0.92` |
| Initial blur | `4px` | `6px` |
| Duration | `0.7s` | `0.8s` |
| Stagger | `0.12s` | `0.15s` |

## 5. Files Modified

| File | Changes |
|------|---------|
| `src/components/ui/bento-monochrome-1.tsx` | METRICS data (add accent), footer JSX, entrance animation |

## Accessibility

- Cyan on black: 12.7:1 contrast ratio
- Magenta on black: 4.6:1
- Purple on black: needs brightness lift to hit 4.5:1 — use `#aa44ff` or `filter: brightness(1.3)`
- Reduced motion: entrance animation skipped (existing guard)
- Focus-visible: inherits existing outline pattern
- Hover states are enhancements, not essential
