# Solution Bento Micro-Interactions Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add sophisticated idle/passive CSS animations and per-card GSAP hover choreography timelines to each of the 5 solution bento card mockups, applying senior-level motion graphics design principles (Disney's 12 Principles, motion hierarchy, easing language).

**Architecture:** Dual-layer animation — CSS `@keyframes` injected via `useEffect` for always-running idle animations (GPU-composited, zero JS overhead per frame), plus GSAP `timeline({ paused: true })` instances built in `useGSAP` for hover choreography (`.play()` on mouseEnter, `.reverse()` on mouseLeave). Data-attribute selectors target mockup internals. All changes within `src/components/solution.tsx` only.

**Tech Stack:** GSAP 3.12.5 (already installed), CSS @keyframes injection, `useGSAP` hook, `data-sol-*` attribute DOM targeting

---

## Audit of Current State

### What Exists
| Element | Current State | Gap |
|---------|---------------|-----|
| Card hover | GSAP `y: -4`, boxShadow transition, glow scale 1.3 | **No internal mockup choreography** |
| Mockup entrance | ScrollTrigger: scale-in, item stagger, highlight pop | Entrance only — no idle loop after |
| Idle animations | **None** | All mockup content is completely static |
| CSS keyframes | **None injected** | No `document.createElement("style")` pattern |
| Hover timelines | **None** | Individual `gsap.to()` calls, not reversible timelines |
| Data attributes | `data-sol-mockup`, `data-sol-mockup-item`, `data-sol-highlight`, `data-sol-glow` | Good foundation — need more granular selectors |

### Reference: bento-monochrome-1.tsx Pattern
The existing bento component injects CSS via `useEffect` + `document.createElement("style")` with a style ID guard. We replicate this exact pattern for solution idle animations.

---

## Motion Design Specification

### Disney's 12 Principles Applied

| Principle | Application in This System |
|-----------|---------------------------|
| **1. Squash & Stretch** | Deploy button on hover: slight `scaleX(1.03) scaleY(0.97)` before settling to `scale(1.05)` |
| **2. Anticipation** | Hover timeline starts with 60ms micro-dip (`y: 1px`) before elements lift |
| **3. Staging** | Motion hierarchy ensures the eye reads primary -> secondary -> tertiary |
| **4. Straight Ahead / Pose to Pose** | Pose-to-pose: defined keyframe states (rest -> hover), not procedural |
| **5. Follow-Through & Overlapping Action** | Child elements finish moving 80-120ms after parent, with slight overshoot (`back.out(1.2)`) |
| **6. Slow In, Slow Out** | All easing uses `power2.out` (enter) and `power2.inOut` (idle cycles) |
| **7. Arc** | Experience bar fill follows a subtle ease arc, not linear |
| **8. Secondary Action** | While card lifts on hover, idle animations continue as supporting motion |
| **9. Timing** | Primary: 200-350ms, Secondary: 300-500ms, Tertiary: 100-600ms staggered, Idle: 2-8s cycles |
| **10. Exaggeration** | Hover progress fill jumps 73% -> 85% (not 73% -> 74%) — dramatic enough to notice |
| **11. Solid Drawing** | Consistent spatial relationships — elements that are "behind" move slower (parallax) |
| **12. Appeal** | Cohesive color language per card — glow colors match card's `glowColor` theme |

### Motion Hierarchy

```
LAYER 0 — IDLE (Always running, CSS @keyframes)
  Infinite loop, ease-in-out, 2-8s durations
  shimmer, pulse, float, blink, breathe

LAYER 1 — PRIMARY (Card-level, 0-200ms)
  Card lift, shadow, glow scale (existing)

LAYER 2 — SECONDARY (Element-level, 50-400ms)
  Mockup items stagger, bars fill, charts grow

LAYER 3 — TERTIARY (Detail flourishes, 200-600ms)
  Badge brightens, sparkle spins, text shifts
```

### Easing Language

| Context | Easing | GSAP Notation |
|---------|--------|---------------|
| Enter/hover start | Quick decel | `power2.out` |
| Exit/hover leave | Smooth decel | `power2.out` (reversed) |
| Idle breathing | Symmetric | `power1.inOut` (CSS `ease-in-out`) |
| Bouncy pops | Overshoot | `back.out(1.4)` |
| Progress fills | Satisfying arc | `power3.out` |

---

## Per-Card Animation Design

### Card 1: Sprint Board (`id: "sprint"`)

**Idle Animations (CSS):**
| Element | Animation | Duration | Details |
|---------|-----------|----------|---------|
| Progress bar (73% fill) | Shimmer sweep | 8s infinite | A `background-position` sweep of a translucent highlight across the gradient bar |
| Active task dot (cyan) | Breathing pulse | 3s infinite | `box-shadow` pulse from 0px to 6px spread at `rgba(0,238,255,0.3)`, ease-in-out |
| Done checkmarks | Sequential glow | 6s infinite | Each checkmark pulses at staggered delay (0s, 1.5s, 3s) — `text-shadow` with emerald |

**Hover Choreography (GSAP Timeline):**
```
0ms    — Anticipation: task rows micro-dip y: 1px (80ms)
50ms   — Progress bar width animates from 73% to 85% (400ms, power3.out)
80ms   — Task rows stagger-slide right by 3px (each 60ms apart, 250ms, power2.out)
120ms  — Done checkmarks scale to 1.15 with emerald glow intensification (200ms, back.out(1.2))
180ms  — Active dot scales to 1.4 with cyan ring expansion (250ms)
250ms  — Deploy button: scaleX(1.03) scaleY(0.97) for 80ms, then scale(1.05) + border brightens (300ms)
300ms  — "Day 12" text shifts to brighter opacity (0.30 -> 0.60, 200ms)
```

**Data Attributes Needed:**
- `data-sol-progress-fill` — the 73% bar inner div
- `data-sol-progress-text` — the "73%" span
- `data-sol-task-row` — each task row div
- `data-sol-active-dot` — the cyan active indicator dot
- `data-sol-check` — each checkmark span
- `data-sol-deploy` — the Deploy Preview button div

---

### Card 2: AI Code Editor (`id: "ai"`)

**Idle Animations (CSS):**
| Element | Animation | Duration | Details |
|---------|-----------|----------|---------|
| Cursor (new element) | Blink | 1s infinite | Classic `opacity: 0/1` step blink after last code character |
| AI suggestion card | Subtle float | 5s infinite | `translateY(0px)` to `translateY(-2px)` to `translateY(0px)`, ease-in-out |
| Sparkle icon | Rotate pulse | 4s infinite | Scale `0.9 -> 1.1 -> 0.9` with `rotate(0deg -> 15deg -> 0deg)` |
| Active tab underline | Shimmer | 6s infinite | `background-position` sweep on the purple border-bottom |

**Hover Choreography (GSAP Timeline):**
```
0ms    — Code lines stagger-shift left by 2px (4 lines, 40ms apart, 200ms each, power2.out)
0ms    — Line numbers brighten: opacity 0.20 -> 0.45 (300ms)
80ms   — AI suggestion card: scale(1.04), border-color brightens, bg opacity doubles (350ms, power2.out)
80ms   — AI card glow: box-shadow 0 0 20px rgba(153,0,255,0.15) (300ms)
120ms  — Sparkle icon: scale(1.3) + rotate(180deg) (400ms, power2.out)
180ms  — "27% faster execution" text brightens 0.50 -> 0.80 (200ms)
200ms  — Inactive tab "test.ts" dims further 0.30 -> 0.15 while active tab brightens (250ms)
```

**Data Attributes Needed:**
- `data-sol-code-line` — each CodeLine wrapper
- `data-sol-line-num` — each line number span
- `data-sol-ai-card` — the AI suggestion container div
- `data-sol-sparkle` — the sparkle span
- `data-sol-ai-text` — the "27% faster" span
- `data-sol-tab-active` — the app.tsx tab
- `data-sol-tab-inactive` — the test.ts tab
- `data-sol-cursor` — new blinking cursor element (added after last code char)

---

### Card 3: Team Roster (`id: "talent"`)

**Idle Animations (CSS):**
| Element | Animation | Duration | Details |
|---------|-----------|----------|---------|
| Avatar circles | Staggered float | 5s infinite | Each avatar floats `translateY(0 -> -2px -> 0)` with delays: 0s, -1.2s, -2.4s |
| Experience bar fill | Shimmer sweep | 8s infinite | Same shimmer pattern as sprint progress bar, over the pink/purple gradient |
| "+2" badge | Gentle breathe | 4s infinite | Opacity oscillates 0.30 -> 0.45 -> 0.30 |

**Hover Choreography (GSAP Timeline):**
```
0ms    — Avatars spread apart: gap increases from 8px to 12px (300ms, power2.out)
0ms    — Each avatar scales to 1.08 with stagger (3 avatars, 50ms apart, 200ms each)
80ms   — Avatar border-color intensifies: white/10 -> white/25 (250ms)
120ms  — Engineer card lifts: y -3px, bg brightens white/3 -> white/6 (300ms, power2.out)
150ms  — Experience bar fill animates 85% -> 92% (400ms, power3.out)
200ms  — "Alex Chen" text brightens 0.70 -> 0.95 (200ms)
200ms  — "Staff Engineer" badge brightens 0.60 -> 0.85 (200ms)
250ms  — Skill tags cascade pop: stagger scale(1) -> scale(1.06), each 60ms apart (4 tags, 200ms each, back.out(1.3))
300ms  — Skill tag borders brighten white/8 -> white/20 (250ms)
350ms  — "+2" text brightens and slightly scales (200ms)
```

**Data Attributes Needed:**
- `data-sol-avatar` — each avatar circle div
- `data-sol-avatar-row` — the flex container holding avatars
- `data-sol-engineer-card` — the Alex Chen card container
- `data-sol-exp-fill` — the experience bar inner fill div
- `data-sol-engineer-name` — the "Alex Chen" span
- `data-sol-engineer-role` — the "Staff Engineer" span
- `data-sol-skill-tag` — each skill tag span
- `data-sol-plus-badge` — the "+2" span

---

### Card 4: Analytics Dashboard (`id: "analytics"`)

**Idle Animations (CSS):**
| Element | Animation | Duration | Details |
|---------|-----------|----------|---------|
| Stats dots (4 dots) | Sequential pulse | 6s infinite | Each dot scales 1 -> 1.3 -> 1 with staggered delays (0s, 1.5s, 3s, 4.5s), creating a sweep effect |
| Bar chart bars | Subtle oscillation | 4s infinite | Each bar `scaleY` oscillates by +/-3% with staggered delays, simulating live data |
| Line chart | Path draw breathing | 8s infinite | `stroke-dashoffset` cycles subtly (very small range) to create a "alive" feel |
| "+38%" value | Gentle glow | 5s infinite | `text-shadow` pulses with emerald tint |

**Hover Choreography (GSAP Timeline):**
```
0ms    — Revenue chart card lifts: y -3px (250ms, power2.out)
60ms   — Conversion chart card lifts: y -3px (250ms, power2.out) — 60ms stagger between the two
0ms    — SVG line chart: stroke brightens strokeOpacity 0.6 -> 0.9, fill area 0.3 -> 0.5 (350ms)
80ms   — Bar chart bars grow: each bar scaleY increases by 10-15% (stagger 40ms x 6 bars, 300ms each, power2.out)
120ms  — "+38%" text brightens to full emerald (200ms)
120ms  — "2.4x" text brightens to full purple (200ms)
180ms  — Stats row: all 4 values brighten simultaneously (200ms)
180ms  — Stats dots scale to 1.5 with color intensification (250ms, stagger 40ms)
250ms  — Chart card borders brighten white/4 -> white/12 (300ms)
300ms  — "This Quarter" chrome text brightens 0.30 -> 0.55 (200ms)
```

**Data Attributes Needed:**
- `data-sol-chart-revenue` — the revenue chart card container
- `data-sol-chart-conversion` — the conversion chart card container
- `data-sol-chart-line` — the SVG path stroke line
- `data-sol-chart-area` — the SVG path fill area
- `data-sol-bar` — each bar chart bar div
- `data-sol-stat-value` — each stat value span ("+38%", "2.4x", etc.)
- `data-sol-stat-dot` — each stats row dot div
- `data-sol-stat-label` — each stat label span

---

### Card 5: Sprint Approval (`id: "guarantee"`)

**Idle Animations (CSS):**
| Element | Animation | Duration | Details |
|---------|-----------|----------|---------|
| Checkmarks (4 items) | Sequential glow | 8s infinite | Each check icon gets a `text-shadow` pulse in sequence, 2s apart, creating a cascading "confirmation wave" |
| "Approved" badges | Shimmer sweep | 10s infinite | Very subtle shimmer across the emerald badges, staggered per row |
| Approve button gradient | Gradient shift | 6s infinite | `background-position` cycles the purple-to-cyan gradient left-to-right |

**Hover Choreography (GSAP Timeline):**
```
0ms    — Checklist items: anticipation micro-dip y: 1px each (80ms)
60ms   — Items cascade stamp: stagger y: 0 -> y: -2px, each 70ms apart (4 items, 200ms each, power2.out)
60ms   — Checkmark icons: stagger scale 1 -> 1.2 -> 1.05 with emerald glow burst (back.out(1.5), 250ms each)
120ms  — "Approved" badges brighten: bg opacity 0.10 -> 0.20, text 0.70 -> 0.95 (250ms)
120ms  — Badge borders brighten: emerald-500/20 -> emerald-500/40 (250ms)
200ms  — Approve button: scale(1.03), border brightens purple/30 -> purple/60, bg opacity doubles (300ms, power2.out)
200ms  — Button gradient intensifies: from/20 to/20 -> from/35 to/35 (300ms)
280ms  — Button checkmark scales to 1.15 (200ms, back.out(1.2))
320ms  — "$0 if not satisfied" text: opacity 0.25 -> 0.50, slight shift left by 2px (250ms)
350ms  — Deliverables/Status header text brightens 0.30 -> 0.50 (200ms)
```

**Data Attributes Needed:**
- `data-sol-check-item` — each checklist row div
- `data-sol-check-icon` — each checkmark icon container div
- `data-sol-approved-badge` — each "Approved" badge span
- `data-sol-approve-btn` — the Approve CTA button container div
- `data-sol-approve-text` — the "$0 if not satisfied" span
- `data-sol-deliverables-header` — the "Deliverables" / "Status" header spans

---

## Implementation Tasks

### Task 1: Add Data Attributes to Mockup Components

**Files:** Modify `src/components/solution.tsx` — mockup components (lines 430-810)

**Purpose:** Add granular `data-sol-*` attributes to every element that needs to be targeted by idle CSS or hover GSAP. This is the foundation — no animation code yet.

**Step 1:** Add attributes to `SprintBoardMockup` (lines 430-503):

- Progress bar fill div (line ~449): add `data-sol-progress-fill`
- "73%" span (line ~446): add `data-sol-progress-text`
- Each task row div (line ~459): add `data-sol-task-row`
- Active task cyan dot (line ~475): add `data-sol-active-dot`
- Each checkmark span (line ~472): add `data-sol-check`
- Deploy button container (line ~496): add `data-sol-deploy`

**Step 2:** Add attributes to `AIEditorMockup` (lines 507-577):

- Each CodeLine: add `data-sol-code-line`
- Active tab "app.tsx" span (line ~518): add `data-sol-tab-active`
- Inactive tab "test.ts" span (line ~521): add `data-sol-tab-inactive`
- AI suggestion card div (line ~549): add `data-sol-ai-card`
- Sparkle span (line ~554): add `data-sol-sparkle`
- AI text "27% faster" span (line ~559): add `data-sol-ai-text`

**Step 3:** Add attributes to `TeamRosterMockup` (lines 599-650):

- Avatar row container (line ~607): add `data-sol-avatar-row`
- Each avatar circle (line ~609): add `data-sol-avatar`
- "+2" span (line ~616): add `data-sol-plus-badge`
- Engineer card container (line ~620): add `data-sol-engineer-card`
- "Alex Chen" name span (line ~625): add `data-sol-engineer-name`
- "Staff Engineer" span (line ~628): add `data-sol-engineer-role`
- Experience bar fill div (line ~632): add `data-sol-exp-fill`
- Each skill tag span (line ~639): add `data-sol-skill-tag`

**Step 4:** Add attributes to `AnalyticsDashMockup` (lines 654-750):

- Revenue chart card (line ~663): add `data-sol-chart-revenue`
- SVG line path (line ~683): add `data-sol-chart-line`
- SVG area path (line ~690): add `data-sol-chart-area`
- Conversion chart card (line ~698): add `data-sol-chart-conversion`
- Each bar div (line ~710): add `data-sol-bar`
- Each stat value span (line ~742): add `data-sol-stat-value`
- Each stat dot div (line ~740): add `data-sol-stat-dot`
- Each stat label span (line ~741): add `data-sol-stat-label`

**Step 5:** Add attributes to `SprintApprovalMockup` (lines 754-810):

- Each checklist item row (line ~779): add `data-sol-check-item`
- Each checkmark icon container (line ~784): add `data-sol-check-icon`
- Each "Approved" badge span (line ~789): add `data-sol-approved-badge`
- Approve button container (line ~797): add `data-sol-approve-btn`
- "$0 if not satisfied" span (line ~802): add `data-sol-approve-text`
- Deliverables/Status header (line ~767): add `data-sol-deliverables-header`

**Build verification:** `npx next build` — zero errors expected (data attributes are passive HTML)

---

### Task 2: Inject Idle CSS @keyframes

**Files:** Modify `src/components/solution.tsx` — add style ID constant and `useEffect` for CSS injection

**Step 1:** Add `useEffect` to the import line (line 3):
Change `import React, { useRef, useCallback } from "react";`
To: `import React, { useRef, useCallback, useEffect } from "react";`

**Step 2:** Add a style ID constant after line 8:
```tsx
const SOL_STYLE_ID = "sol-idle-animations";
```

**Step 3:** Add CSS injection `useEffect` inside `Solution()` component (after `cardRefs` declaration, ~line 121).

The `useEffect` creates a `<style>` element with id guard (same pattern as bento-monochrome-1.tsx), injects all @keyframes definitions, and applies them via data-attribute selectors.

**CSS @keyframes to define:**

1. `sol-shimmer` — `background-position: -200% center` to `200% center` (for progress bars)
2. `sol-breathe` — box-shadow 0px to 6px spread with currentColor, scale 1 to 1.1 (for dots)
3. `sol-blink` — opacity step 1/0 at 50% (for cursor)
4. `sol-float` — translateY 0 to -2px to 0 (for avatars, AI card)
5. `sol-check-glow` — text-shadow none to emerald glow at 35%, back to none (for checkmarks)
6. `sol-badge-shimmer` — background-position sweep (for approved badges)
7. `sol-gradient-shift` — background-position 0% to 100% to 0% (for approve button)
8. `sol-dot-pulse` — scale 1 to 1.4 to 1, opacity 0.3 to 0.7 to 0.3 (for stat dots)
9. `sol-bar-breathe` — scaleY 1 to 1.03 to 1 (for chart bars)
10. `sol-sparkle` — scale 0.9 to 1.1 rotate 0 to 15deg (for sparkle icon)

**CSS selectors to apply animations to:**

Sprint Board:
- `[data-sol-progress-fill]` — sol-shimmer 8s, with shimmer gradient background-image
- `[data-sol-active-dot]` — sol-breathe 3s, color: rgba(0,238,255,0.5)
- `[data-sol-check]` — sol-check-glow 6s, staggered delays via nth-of-type (0s, -2s, -4s)

AI Editor:
- `[data-sol-cursor]` — sol-blink 1s step-end
- `[data-sol-ai-card]` — sol-float 5s
- `[data-sol-sparkle]` — sol-sparkle 4s, display: inline-block
- `[data-sol-tab-active]::after` — pseudo-element with shimmer gradient, sol-shimmer 6s

Team Roster:
- `[data-sol-avatar]` — sol-float 5s, staggered delays per nth-child (0s, -1.2s, -2.4s)
- `[data-sol-exp-fill]` — sol-shimmer 8s, with pink/purple shimmer gradient
- `[data-sol-plus-badge]` — sol-float 4s, delay -1s

Analytics:
- `[data-sol-stat-dot]` — sol-dot-pulse 6s, staggered delays (0s, -1.5s, -3s, -4.5s)
- `[data-sol-bar]` — sol-bar-breathe 4s, transform-origin: bottom, staggered delays per nth-child

Sprint Approval:
- `[data-sol-check-icon]` — sol-check-glow 8s, staggered via parent nth-child
- `[data-sol-approved-badge]` — sol-badge-shimmer 10s, with emerald shimmer gradient
- `[data-sol-approve-btn] > div:first-child` — sol-gradient-shift 6s, background-size 200%

**Cleanup:** Return function removes the style element if its parentNode exists.

**Build verification:** `npx next build` — zero errors expected

---

### Task 3: Build GSAP Hover Timelines

**Files:** Modify `src/components/solution.tsx` — add timeline ref, builder functions, replace hover handlers

**Step 1:** Add `hoverTimelines` ref (after `cardRefs` line ~121):
```tsx
const hoverTimelines = useRef<(gsap.core.Timeline | null)[]>([]);
```

**Step 2:** Add 5 hover timeline builder functions OUTSIDE the component (after shadow constants, ~line 115). These are pure functions taking `(tl: gsap.core.Timeline, card: HTMLElement)`:

**`buildSprintHover`:**
- Anticipation: task rows y:1 (80ms) at 0s
- Progress fill width 73% to 85% (400ms, power3.out) at 0.05s
- Task rows x:3, y:0, stagger 0.06 (250ms) at 0.08s
- Checks scale 1.15, stagger 0.05 (200ms, back.out(1.2)) at 0.12s
- Active dot scale 1.4 (250ms) at 0.18s
- Deploy button: squash-stretch then scale 1.05 at 0.25s

**`buildAIHover`:**
- Code lines x:-2, stagger 0.04 (200ms) at 0s
- Line numbers opacity 0.45 (300ms) at 0s
- AI card scale 1.04 + boxShadow + border (350ms) at 0.08s
- Sparkle scale 1.3 + rotation 180 (400ms) at 0.12s
- AI text opacity 0.8 (200ms) at 0.18s
- Tab active/inactive opacity shift at 0.2s

**`buildTalentHover`:**
- Avatar row gap 12px (300ms) at 0s
- Avatars scale 1.08, stagger 0.05 (200ms) at 0s
- Engineer card y:-3 + bg brighten (300ms) at 0.12s
- Exp fill width 85% to 92% (400ms, power3.out) at 0.15s
- Name + role opacity brighten at 0.2s
- Skill tags scale 1.06, stagger 0.06 (200ms, back.out(1.3)) at 0.25s
- Plus badge opacity 0.6 + scale 1.05 at 0.35s

**`buildAnalyticsHover`:**
- Revenue card y:-3 (250ms) at 0s
- Conversion card y:-3 (250ms) at 0.06s
- SVG line stroke-opacity attr to 0.9 (350ms) at 0s
- SVG area opacity 0.6 (350ms) at 0s
- Bars: each bar height increases by 12% (capped at 100%), stagger 0.04 (300ms) at 0.08s
- Stat values opacity 1 (200ms) at 0.18s
- Stat dots scale 1.5, stagger 0.04 (250ms) at 0.18s

**`buildGuaranteeHover`:**
- Check items y:1 anticipation (80ms) at 0s
- Items y:-2, stagger 0.07 (200ms) at 0.06s
- Check icons scale 1.2, stagger 0.06 (250ms, back.out(1.5)) at 0.06s
- Badges opacity 0.95 + border brighten, stagger 0.05 (250ms) at 0.12s
- Approve button div scale 1.03 + border brighten (300ms) at 0.2s
- Approve text opacity 0.5 + x:-2 (250ms) at 0.32s
- Header opacity 0.7 (200ms) at 0.35s

**Step 3:** Build timelines inside `useGSAP` (after entrance animation block, ~line 268):
- Loop through `allCards`, create `gsap.timeline({ paused: true })` per card
- Add primary layer (card y:-4 + boxShadow + glow scale) at position 0
- Call appropriate builder function per card id
- Store in `hoverTimelines.current[i]`

**Step 4:** Replace `handleMouseEnter` and `handleMouseLeave` (lines 135-173):
- `handleMouseEnter`: call `hoverTimelines.current[idx]?.play()`
- `handleMouseLeave`: remove CSS vars, call `hoverTimelines.current[idx]?.reverse()`

**Build verification:** `npx next build` — zero errors expected

---

### Task 4: Add Cursor Element to AI Editor + Line Number Attributes

**Files:** Modify `src/components/solution.tsx` — `AIEditorMockup` and `CodeLine` components

**Step 1:** Update `CodeLine` (lines 579-595) to add `data-sol-line-num` to the line number span.

**Step 2:** Add a blinking cursor element to the last `CodeLine` in `AIEditorMockup` (line 8's closing brace):
A `<span>` with `data-sol-cursor` class, styled as `inline-block w-[5px] h-[12px] bg-white/60 ml-0.5 align-middle`, placed after the closing brace text.

**Build verification:** `npx next build` — zero errors expected

---

### Task 5: Build + Visual Verification

**Step 1:** Run `npx next build` — expect zero errors

**Step 2:** Start dev server, navigate to solution section

**Step 3:** Verify idle animations:
- Sprint board: progress bar has shimmer sweep, cyan dot pulses, checkmarks glow sequentially
- AI editor: cursor blinks, AI card floats subtly, sparkle rotates, tab has shimmer underline
- Team roster: avatars float with stagger, experience bar shimmers, +2 breathes
- Analytics: stat dots pulse in sequence, bars oscillate subtly
- Approval: checkmarks glow in cascade, badges shimmer, button gradient shifts

**Step 4:** Verify hover choreography (hover over each card):
- Sprint: progress fills to 85%, tasks slide right, checks scale, deploy button lifts
- AI: code shifts left, AI card scales with glow, sparkle spins 180deg, inactive tab dims
- Talent: avatars spread apart, engineer card lifts, exp fills to 92%, tags cascade pop
- Analytics: charts lift with stagger, bars grow, stats brighten, dots pulse
- Approval: items cascade stamp, checks bounce-scale, badges brighten, approve button scales

**Step 5:** Verify hover EXIT (move mouse away):
- ALL card hover animations reverse smoothly (GSAP `.reverse()`)
- Elements return to rest state including original widths (73%, 85%), positions
- No jarring snaps or jumps

**Step 6:** Verify no interference:
- Mouse-tracking spotlight still works
- Gradient border still visible
- Edge illumination intact
- Focal glow orbs still scale
- Entrance ScrollTrigger animations still fire on scroll

---

## Scope Guardrails

**DO modify:** Content inside `src/components/solution.tsx` — specifically:
- Add `data-sol-*` attributes to mockup elements
- Add CSS injection `useEffect` with `@keyframes`
- Add `hoverTimelines` ref with per-card builder functions
- Replace `handleMouseEnter`/`handleMouseLeave` with timeline-based versions
- Add cursor element to AI editor
- Add `data-sol-line-num` to `CodeLine` component

**DO NOT modify:** `kpr-transition.tsx`, `glass-flow.tsx`, `globals.css`, `bento-monochrome-1.tsx`, or any other file. The `<section id="solution">` root structure is unchanged. The card container, grid layout, edge illumination, mouse-tracking glow, and gradient border remain untouched.

**DO NOT:** Add any new npm dependencies. Everything uses existing GSAP 3.12.5 and CSS.
