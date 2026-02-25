# Solution Bento Edge Illumination + Metrics Bar Upgrade

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add inner edge illumination to solution bento cards that creates 3D depth (bright at edges, fading to center), and upgrade the bottom proof-metrics bar to match the elevated design quality.

**Architecture:** CSS-only edge illumination via inset box-shadows + pseudo-element gradients, no JavaScript animation needed (the effect is static/hover-enhanced). Metrics bar redesign uses existing GSAP scroll-trigger entrance. All changes within `src/components/solution.tsx` only.

**Tech Stack:** Tailwind CSS, CSS pseudo-elements, existing GSAP setup

---

## Audit of Current State

### Bento Cards (what they have now)
| Element | Current Value | Issue |
|---------|---------------|-------|
| Card bg | `bg-white/[0.05]` | Flat surface, no depth perception |
| Card border | `border-white/[0.12]` | Thin line, doesn't convey volume |
| Gradient border overlay | `opacity-25` rest, `opacity-100` hover | Colorful but flat — no inward light bleed |
| Inner illumination | **None** | Zero edge-to-center fade = no 3D feel |
| Box-shadow | Only on hover via GSAP | No ambient depth at rest |

### Metrics Bar (what it has now)
| Element | Current Value | Issue |
|---------|---------------|-------|
| Background | `bg-white/[0.02]` | Practically invisible |
| Border | `border-white/[0.06]` | Barely visible |
| Padding | `p-4` | Cramped |
| Layout | `grid-cols-3 gap-3` | No separators between metrics |
| Labels | `text-[10px] tracking-[0.3em] text-gray-500` | Too small, too faint |
| Values | `text-base lg:text-lg font-semibold text-white` | Acceptable but could be bolder |
| Visual interest | **None** | No gradient accents, no depth, no differentiation from cards |

---

## Design Specification

### Edge Illumination Effect (Cards)

The effect creates the impression of light catching on a glass card's beveled edges. Three layers combine to produce this:

**Layer 1 — Inset ambient glow (always visible)**
```css
box-shadow:
  inset 0 1px 0 0 rgba(255,255,255,0.1),           /* top edge highlight line */
  inset 0 0 40px 0 rgba(153,0,255,0.06),            /* purple ambient bleed */
  inset 0 0 80px 0 rgba(0,238,255,0.04);            /* cyan deep diffuse */
```
- The `0 1px 0 0` top highlight is the key "light source indicator" — a thin bright line at the very top edge
- The 40px and 80px spreads create a soft glow that fades naturally to center (box-shadow spreads from edges inward)

**Layer 2 — Directional top-edge gradient (pseudo-element)**
A `::before` pseudo-element overlaid on the card interior:
```css
background: linear-gradient(
  to bottom,
  rgba(255,255,255,0.08) 0%,
  rgba(255,255,255,0.02) 15%,
  transparent 40%
);
```
- Simulates overhead ambient lighting
- Strongest at top edge, completely faded by 40% down
- Pointer-events none, z-index below content but above SVG bg

**Layer 3 — Side edge glow (same pseudo-element, compound gradient)**
Adding subtle side illumination:
```css
background:
  linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 15%, transparent 40%),
  linear-gradient(to right, rgba(153,0,255,0.05), transparent 20%, transparent 80%, rgba(0,238,255,0.05));
```
- Left edge gets a subtle purple tinge
- Right edge gets a subtle cyan tinge
- Both fade to transparent well before center

**Hover enhancement:**
- Inset glow intensifies: `rgba(153,0,255,0.06)` -> `rgba(153,0,255,0.10)`
- Top-edge gradient: `0.08` -> `0.12`
- Transition: 400ms ease

**Key constraint:** The edge illumination must NOT interfere with:
- The existing SVG background mask `[mask-image:linear-gradient(to_bottom,#000_35%,transparent_80%)]`
- The existing mouse-tracking glow
- The existing gradient border overlay

### Metrics Bar Redesign

**Structural changes:**
- Increase padding: `p-4` -> `py-5 px-6`
- Add vertical dividers between the 3 metrics (1px gradient lines)
- Match card border radius: `rounded-2xl` -> `rounded-[20px]` (consistent with cards)
- Better background: `bg-white/[0.02]` -> `bg-white/[0.04]` with same edge illumination as cards (lighter version)

**Visual enhancements:**
- Add inset box-shadow (lighter version of card treatment)
- Gradient accent line at top of bar: `before::` element with `linear-gradient(to right, #9900ff, #ff00ff, #00eeff)` at 1px height, 0.3 opacity
- Values get gradient text treatment: `text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]`
- Labels: slightly larger `text-[11px]` and brighter `text-gray-400` instead of `text-gray-500`

**Divider specification:**
Between each metric cell, a 1px-wide gradient divider:
```css
/* Vertical gradient divider */
background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.15) 70%, transparent);
```
Only visible on `lg:` breakpoint (on mobile, metrics stack or remain in row without dividers).

---

## Implementation Tasks

### Task 1: Card Edge Illumination

**Files:** Modify `src/components/solution.tsx` — the card `<div>` inside the `.map()` at ~line 749-760

**Step 1:** Add the inset box-shadow to the card's `className` or inline style.

Since Tailwind doesn't support complex multi-value inset shadows, use `style` prop to add the ambient inset glow alongside the existing `willChange` style:

```tsx
style={{
  willChange: "transform",
  boxShadow: [
    "inset 0 1px 0 0 rgba(255,255,255,0.1)",
    "inset 0 0 40px 0 rgba(153,0,255,0.06)",
    "inset 0 0 80px 0 rgba(0,238,255,0.04)",
  ].join(", "),
}}
```

**Step 2:** Add a `::before` pseudo-element for the directional top-edge + side gradient. Since the card already uses `group` and `relative`, add a new child div (CSS pseudo-elements can't be added via React inline):

```tsx
{/* Edge illumination — top + side light */}
<div
  className="pointer-events-none absolute inset-0 rounded-[20px] z-[1] transition-opacity duration-400 opacity-100 group-hover:opacity-150"
  style={{
    background: [
      "linear-gradient(to bottom, rgba(255,255,255,0.07), rgba(255,255,255,0.02) 15%, transparent 40%)",
      "linear-gradient(to right, rgba(153,0,255,0.05), transparent 25%, transparent 75%, rgba(0,238,255,0.05))",
    ].join(", "),
  }}
/>
```

Place this AFTER the SVG background div but BEFORE the text content div so it layers correctly.

**Step 3:** Update the GSAP hover handler to also intensify the inset glow on hover:

In `handleMouseEnter`, modify the `gsap.to()` call to include the enhanced boxShadow:
```tsx
gsap.to(el, {
  y: -6,
  boxShadow: [
    "inset 0 1px 0 0 rgba(255,255,255,0.18)",
    "inset 0 0 50px 0 rgba(153,0,255,0.12)",
    "inset 0 0 80px 0 rgba(0,238,255,0.08)",
    "0 12px 50px rgba(153,0,255,0.18)",
    "0 0 80px rgba(0,238,255,0.08)",
  ].join(", "),
  duration: 0.35,
  ease: "power2.out",
  overwrite: "auto",
});
```

In `handleMouseLeave`, restore the rest-state boxShadow:
```tsx
gsap.to(el, {
  y: 0,
  boxShadow: [
    "inset 0 1px 0 0 rgba(255,255,255,0.1)",
    "inset 0 0 40px 0 rgba(153,0,255,0.06)",
    "inset 0 0 80px 0 rgba(0,238,255,0.04)",
  ].join(", "),
  duration: 0.45,
  ease: "power2.out",
  overwrite: "auto",
});
```

**Build verification:** `npx next build` — zero errors expected (CSS-only changes + GSAP string values)

---

### Task 2: Metrics Bar Redesign

**Files:** Modify `src/components/solution.tsx` — the metrics bar div at ~line 822-837

**Step 1:** Replace the metrics bar container with enhanced styling:

From:
```tsx
<div
  data-sol-metrics
  className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4 opacity-0"
>
```

To:
```tsx
<div
  data-sol-metrics
  className="relative mt-8 rounded-[20px] border border-white/[0.10] bg-white/[0.04] backdrop-blur-sm overflow-hidden opacity-0"
  style={{
    boxShadow: [
      "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      "inset 0 0 30px 0 rgba(153,0,255,0.04)",
      "inset 0 0 60px 0 rgba(0,238,255,0.03)",
    ].join(", "),
  }}
>
  {/* Top accent line */}
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#9900ff]/40 to-transparent" />
  <div className="grid grid-cols-3 divide-x divide-white/[0.08]">
```

**Step 2:** Replace metric cell rendering:

From:
```tsx
{proofMetrics.map((m) => (
  <div key={m.label} className="text-center py-3">
    <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-1.5">
      {m.label}
    </span>
    <span className="text-base lg:text-lg font-semibold text-white">
      {m.value}
    </span>
  </div>
))}
```

To:
```tsx
{proofMetrics.map((m) => (
  <div key={m.label} className="text-center py-5 px-4">
    <span className="block text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-2">
      {m.label}
    </span>
    <span className="text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9900ff] via-[#ff00ff] to-[#00eeff]">
      {m.value}
    </span>
  </div>
))}
```

**Step 3:** Close the new container divs properly (the inner grid div + outer container).

**Build verification:** `npx next build` — zero errors expected

---

### Task 3: Build + Visual Verification

**Step 1:** Run `npx next build` — expect zero errors

**Step 2:** Start dev server, navigate to solution section

**Step 3:** Verify:
- Cards show visible edge illumination at rest (top edge brightest, sides tinted)
- Illumination intensifies on hover
- SVG backgrounds still visible through illumination layer
- Text content readable (illumination doesn't wash out text)
- Mouse-tracking glow still works independently
- Gradient border still visible at rest and on hover
- Metrics bar has visible top accent line
- Metric values show gradient text
- Dividers visible between metrics on desktop
- Mobile: metrics bar still looks good at small width

---

## Scope Guardrails

**DO modify:** Content inside `src/components/solution.tsx` — specifically:
- Card container div (add inset shadow, edge glow child div)
- GSAP hover handlers (boxShadow values)
- Metrics bar markup and styling

**DO NOT modify:** `kpr-transition.tsx`, `glass-flow.tsx`, `globals.css`, `bento-monochrome-1.tsx`, or any other file. The `<section id="solution">` root element's structural role is unchanged.
