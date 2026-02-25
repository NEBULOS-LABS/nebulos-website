# Solution Bento Grid — Novu-Style Product Mockup Revamp

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace abstract SVG backgrounds with Novu-style product UI mockups rendered in pure CSS/HTML, add dramatic focal light beams, redesign to a 5-card bento layout (3+2), and elevate every detail to award-winning quality.

**Architecture:** Complete rewrite of `src/components/solution.tsx` internals. All changes are INSIDE the `<section id="solution">` — the `kpr-transition.tsx` container is untouched. Uses GSAP + ScrollTrigger for entrance animations, CSS for lighting/glow effects, React for interactive mockups.

**Tech Stack:** GSAP 3.12, React 18, TypeScript, Tailwind CSS, inline CSS for mockups/glows

---

## Reference Image Analysis (Novu Bento)

The attached reference shows:
- **Layout**: 3 equal cards (row 1) + 2 equal cards (row 2)
- **Card content**: Each card has a **realistic product UI mockup** in the upper 60-65% — dropdown menus, notification panels, settings screens, inbox views
- **Lighting**: Each card has a **dramatic focal light beam** — purple/pink radial glow originating from a specific point (behind a bell icon, sweeping across top, ambient from corner)
- **Bottom text**: Bold title + gray description text anchored at card bottom, NOT inside the mockup
- **Visual-to-text transition**: The mockup fades into the card background via a gradient, text sits below
- **Card surface**: Very dark (#0d0d14 range), subtle border (white/5-8%), generous rounded corners
- **Overall feel**: Premium, product-focused, "show don't tell"

---

## Design Language Alignment (Nebulos)

| Nebulos DNA | How We Apply It |
|---|---|
| Brand gradient `#9900ff → #ff00ff → #00eeff` | Focal light beams use these exact colors per card |
| `bg-white/[0.05]`, `border-white/[0.12]`, `rounded-[20px]` | Cards keep these values (user requested: don't change card properties) |
| Inset box-shadow edge illumination | Keep the 3-layer edge glow we already built |
| GSAP `power3.out` entrance, `back.out` pop-ins | Entrance choreography matches site patterns |
| `text-[10px] uppercase tracking-[0.25em]` labels | Overline labels in each card follow this pattern |
| Inter font, `tracking-tight` headings | All typography matches existing hierarchy |
| Mouse-tracking radial glow | Keep the `--sol-x/--sol-y` spotlight |

---

## New 5-Card Layout

```
┌─────────────────┬─────────────────┬─────────────────┐
│                 │                 │                 │
│   Sprint Board  │   AI Code       │   Team Roster   │
│   (Dashboard    │   (Editor       │   (Profiles     │
│    mockup)      │    mockup)      │    mockup)      │
│                 │                 │                 │
│  "Two Weeks to  │  "AI Makes Your │  "The Top 1%    │
│   Working       │   Team 10x"     │   Builds Your   │
│   Software"     │                 │   Product"      │
├────────────────────────┬────────────────────────────┤
│                        │                            │
│   Analytics Dashboard  │   Sprint Approval          │
│   (Revenue chart       │   (Checklist +             │
│    mockup)             │    approve button)          │
│                        │                            │
│  "Revenue, Not Just    │  "Zero Risk, Full          │
│   Pixels"              │   Transparency"            │
└────────────────────────┴────────────────────────────┘
```

**Grid CSS**:
```
grid-template-columns: repeat(3, 1fr)       /* Row 1: 3 equal */
                                              /* Row 2: 2 cards, each span ~1.5 cols */
```

In Tailwind:
```
Row 1: 3 x `col-span-1` cards
Row 2: first card `col-span-1 lg:col-span-1` in a 2-col sub-grid OR use `lg:grid-cols-2` for second row
```

Better approach — use a single `lg:grid-cols-6` grid:
- Row 1 cards: each `lg:col-span-2` (2+2+2 = 6)
- Row 2 cards: each `lg:col-span-3` (3+3 = 6)
- Mobile: all `col-span-full` stacking

**Card heights**:
- Row 1: `min-h-[420px]` (generous for mockup + text)
- Row 2: `min-h-[380px]` (slightly shorter — wider cards need less height)

---

## Card-by-Card Specification

### Card 1: Sprint Board Dashboard

**Position:** Row 1, Column 1
**Focal Glow:** Cyan radial from top-center (speed/progress metaphor)

**UI Mockup (pure CSS/HTML):**
```
┌──── Sprint Board ─── Day 12 ───────┐
│                                     │
│  Sprint 4          ██████░░ 73%     │
│                                     │
│  ✓  Auth flow          Done         │
│  ✓  Dashboard UI       Done         │
│  ●  API endpoints      In Progress  │
│  ○  E2E testing        To Do        │
│                                     │
│  [Deploy Preview →]                 │
└─────────────────────────────────────┘
```

Implementation:
- Dark container `bg-[#0a0a14]` with subtle `border border-white/[0.06]`
- Top bar with title "Sprint 4" and progress indicator
- List items with status dots (green=done, cyan=active, gray=todo)
- "Deploy Preview" button at bottom with gradient border
- Entire mockup has `rounded-xl overflow-hidden`

**Focal light beam:**
```css
/* Cyan beam from top-center */
position: absolute; top: -40px; left: 50%; transform: translateX(-50%);
width: 250px; height: 250px;
background: radial-gradient(ellipse, rgba(0,238,255,0.25) 0%, transparent 70%);
filter: blur(30px);
```

**Text below mockup:**
- Overline: `DELIVERY` in cyan
- Title: "Two Weeks to Working Software"
- Body: "While competitors debate roadmaps, you ship deployable code. Every 14 days — reviewed, tested, demo-ready."

---

### Card 2: AI Code Editor

**Position:** Row 1, Column 2
**Focal Glow:** Purple radial from center-right (AI magic emanating from code)

**UI Mockup (pure CSS/HTML):**
```
┌──── app.tsx │ test.ts ──────────────┐
│  ● ● ●                              │
│─────────────────────────────────────│
│  1  import { deploy } from './ci'   │
│  2                                   │
│  3  export async function build() { │
│  4    const optimized = await       │
│  5  ┌─────────────────────────┐     │
│  6  │ ✨ AI: Refactored for   │     │
│  7  │    27% faster execution │     │
│  8  └─────────────────────────┘     │
│  9    return optimized.deploy()     │
│ 10  }                               │
└─────────────────────────────────────┘
```

Implementation:
- Code editor with tab bar ("app.tsx" active tab, "test.ts" inactive)
- Traffic light dots in top-left
- Line numbers in gray
- Syntax coloring: keywords in purple, strings in cyan, functions in white
- AI suggestion popup: glass card with gradient border, star emoji, suggestion text
- Code font: `font-mono text-[11px]`

**Focal light beam:**
```css
/* Purple glow from behind AI popup */
position: absolute; top: 40%; right: 10%;
width: 300px; height: 200px;
background: radial-gradient(ellipse, rgba(153,0,255,0.30) 0%, transparent 70%);
filter: blur(40px);
```

**Text below mockup:**
- Overline: `AI-POWERED` in purple
- Title: "AI Makes Your Team 10x"
- Body: "Every engineer ships with AI embedded in code generation, testing, and review. Not a buzzword — a measured 27% velocity boost."

---

### Card 3: Team Roster

**Position:** Row 1, Column 3
**Focal Glow:** Pink/magenta warm glow from bottom-center (human warmth/talent)

**UI Mockup (pure CSS/HTML):**
```
┌──── Team ─── Your Squad ────────────┐
│                                     │
│  ┌───┐ ┌───┐ ┌───┐                │
│  │ 👤│ │ 👤│ │ 👤│  +2            │
│  └───┘ └───┘ └───┘                │
│                                     │
│  Alex Chen     Staff Engineer       │
│  ████████████ 12 yrs · 89 projects │
│                                     │
│  Specialties                        │
│  [React] [Node] [AWS] [AI/ML]     │
│                                     │
└─────────────────────────────────────┘
```

Implementation:
- Row of 3 avatar circles (gradient borders) + "+2" overflow indicator
- Selected engineer card with name, role, experience bar
- Specialty tags as small pills with brand-colored borders
- The experience bar is a horizontal progress indicator

**Focal light beam:**
```css
/* Pink glow from bottom center */
position: absolute; bottom: 20%; left: 50%; transform: translateX(-50%);
width: 280px; height: 200px;
background: radial-gradient(ellipse, rgba(255,0,255,0.20) 0%, transparent 70%);
filter: blur(35px);
```

**Text below mockup:**
- Overline: `TALENT` in magenta
- Title: "The Top 1% Builds Your Product"
- Body: "8+ years minimum. 120+ products shipped. Zero juniors. Your codebase gets architects, not apprentices."

---

### Card 4: Analytics Dashboard

**Position:** Row 2, Column 1 (wide)
**Focal Glow:** Cyan ascending beam from bottom-left (growth/upward trajectory)

**UI Mockup (pure CSS/HTML):**
```
┌──── Analytics ─── This Quarter ─────────────────────┐
│                                                      │
│  Revenue Impact        Conversion Rate               │
│  ┌──────────────┐      ┌──────────────┐             │
│  │    ╱╲        │  +38%│  2.4x  ▲     │             │
│  │  ╱    ╲      │      │              │             │
│  │╱        ╲────│      │  ████████░░  │             │
│  └──────────────┘      └──────────────┘             │
│                                                      │
│  ● Bounce rate  -23%     ● Load time  1.2s          │
│  ● User retention +41%   ● Core vitals  All green   │
└──────────────────────────────────────────────────────┘
```

Implementation:
- Two mini chart cards side by side
- Left: line/area chart going up (CSS-drawn with gradients)
- Right: circular progress or bar chart
- Bottom row: stat pills with colored dots
- Wider format allows more horizontal space for data

**Focal light beam:**
```css
/* Cyan upward sweep from bottom-left */
position: absolute; bottom: -20px; left: 15%;
width: 350px; height: 250px;
background: radial-gradient(ellipse at 30% 80%, rgba(0,238,255,0.22) 0%, transparent 65%);
filter: blur(40px);
```

**Text below mockup:**
- Overline: `CONVERSION` in cyan
- Title: "Revenue, Not Just Pixels"
- Body: "Born from conversion optimization. Every interface, interaction, and pixel is engineered to move your revenue needle."

---

### Card 5: Sprint Approval (NEW — replaces old metrics bar concept)

**Position:** Row 2, Column 2 (wide)
**Focal Glow:** Purple sweep across top (security/trust)

**UI Mockup (pure CSS/HTML):**
```
┌──── Sprint Review ─── Sprint #4 ────────────────────┐
│                                                      │
│  Deliverables               Status                   │
│  ─────────────────────────────────                   │
│  ✅  Auth system shipped     Approved                │
│  ✅  Dashboard live          Approved                │
│  ✅  Tests passing (47/47)   Approved                │
│  ✅  Code reviewed           Approved                │
│                                                      │
│  ┌──────────────────────────────────────────┐       │
│  │  ✓ Approve & Pay Sprint    │  $0 if not │       │
│  └──────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

Implementation:
- Checklist-style review items with green checkmarks
- Status badges ("Approved" in green pills)
- Bottom CTA: gradient-bordered "Approve & Pay Sprint" button
- "$0 if not satisfied" disclaimer in muted text
- This card directly sells the Sprint-Back Guarantee

**Focal light beam:**
```css
/* Purple horizontal sweep across top */
position: absolute; top: -30px; left: 30%;
width: 400px; height: 150px;
background: radial-gradient(ellipse 70% 50%, rgba(153,0,255,0.25) 0%, transparent 70%);
filter: blur(35px);
```

**Text below mockup:**
- Overline: `GUARANTEE` in purple
- Title: "Zero Risk, Full Transparency"
- Body: "You approve every sprint before paying. If we don't deliver, you don't pay. It's that simple."

---

## Visual-to-Text Transition (Critical Detail)

Every card uses this gradient fade pattern (from reference image):

```tsx
{/* Mockup area */}
<div className="relative flex-1 overflow-hidden p-5 pb-0">
  {/* Focal glow orb */}
  <div className="absolute ..." />
  {/* UI Mockup */}
  <div className="relative z-[2] ...">
    {/* ... mockup content ... */}
  </div>
  {/* Gradient fade from mockup into card bg */}
  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent to-white/[0.05] pointer-events-none z-[3]" />
</div>

{/* Text area — sits below, overlapping slightly */}
<div className="relative z-10 px-6 pb-6 -mt-2">
  <span className="overline">...</span>
  <h3>...</h3>
  <p>...</p>
</div>
```

The `-mt-2` makes the text slightly overlap the fade zone, creating a seamless transition like the reference.

---

## Lighting Effect Specification

Each card gets exactly ONE focal glow orb (matching the Novu reference where each card has a unique light source):

| Card | Color | Position | Size | Blur | Opacity |
|---|---|---|---|---|---|
| Sprint Board | `#00eeff` | top-center | 250x250 | 30px | 0.25 |
| AI Editor | `#9900ff` | center-right, 40% down | 300x200 | 40px | 0.30 |
| Team Roster | `#ff00ff` | bottom-center, 20% up | 280x200 | 35px | 0.20 |
| Analytics | `#00eeff` | bottom-left | 350x250 | 40px | 0.22 |
| Guarantee | `#9900ff` | top-center-right | 400x150 | 35px | 0.25 |

On hover, the glow intensity increases by 40% (e.g., 0.25 → 0.35) via GSAP or CSS transition.

---

## Micro-Interactions

### Card Entrance (GSAP ScrollTrigger)
```
t=0.0s  Card 1 fades up (y:40→0, opacity:0→1, 0.7s, power3.out)
t=0.1s  Card 2 fades up (same)
t=0.2s  Card 3 fades up (same)
t=0.4s  Card 4 fades up (same)
t=0.5s  Card 5 fades up (same)
```
After entrance, each card's mockup elements stagger in:
```
t=+0.3s  Mockup container scales 0.95→1.0 (0.5s, power2.out)
t=+0.5s  Mockup rows/elements fade in (stagger 0.05s, 0.3s each)
t=+0.8s  AI popup / highlight element pops in (0.3s, back.out(1.4))
```

### Card Hover (4-layer system from research)
1. **Card lift**: `translateY(-4px)` via GSAP (0.3s, power2.out)
2. **Border brighten**: border-color transitions to `white/[0.18]` (CSS transition 300ms)
3. **Mockup subtle lift**: the mockup container moves `translateY(-3px) scale(1.01)` (CSS transition 400ms spring easing)
4. **Glow intensify**: focal orb opacity 1.0→1.4x (GSAP 300ms)

### Mouse-Tracking Spotlight (keep existing)
The `--sol-x/--sol-y` radial spotlight stays but color adapts per card:
- Cards 1,4: `rgba(0,238,255,0.15)` (cyan)
- Cards 2,5: `rgba(153,0,255,0.15)` (purple)
- Card 3: `rgba(255,0,255,0.15)` (pink)

---

## Copywriting (Outcome-First, Matching Existing Style)

### Section Header
```
Headline: "Your unfair advantage."  (KEEP — it's strong)
Subtitle: "The engine behind 120+ shipped products — senior engineers, AI
          workflows, and a guarantee that makes risk obsolete."  (KEEP)
```

### Card Copy (compact format for cards)
| Card | Overline | Title | Body |
|---|---|---|---|
| 1 | DELIVERY | Two Weeks to Working Software | While competitors debate roadmaps, you ship deployable code. Every 14 days — reviewed, tested, demo-ready. |
| 2 | AI-POWERED | AI Makes Your Team 10x | Every engineer ships with AI embedded in code generation, testing, and review. Not a buzzword — a measured 27% velocity boost. |
| 3 | TALENT | The Top 1% Builds Your Product | 8+ years minimum. 120+ products shipped. Zero juniors. Your codebase gets architects, not apprentices. |
| 4 | CONVERSION | Revenue, Not Just Pixels | Born from conversion optimization. Every interface, interaction, and pixel is engineered to move your revenue needle. |
| 5 | GUARANTEE | Zero Risk, Full Transparency | You approve every sprint before paying. If we don't deliver, you don't pay. 120+ projects, 2 refunds. |

---

## Metrics Bar (Integrated Into Grid)

Instead of a separate metrics bar below, integrate key stats as accent elements WITHIN the cards (matching how the reference image cards don't have a separate metrics row):

Each card title area includes a stat badge:
- Card 1: "14 days" badge
- Card 2: "27%" badge
- Card 3: "8+ yrs" badge
- Card 4: "+38%" badge
- Card 5: "120+" badge

These render as small gradient-text pills next to the overline label.

---

## Implementation Tasks

### Task 1: Core Architecture — Layout + Card Shell (lines ~44-850)

Complete rewrite of the component. New card data structure:

```tsx
interface CardData {
  id: string;
  title: string;
  body: string;
  overline: string;
  overlineColor: string;   // cyan | purple | pink
  stat: { value: string; label: string };
  span: string;            // Tailwind grid span class
  glowColor: string;       // rgba for focal orb
  glowPosition: string;    // CSS position classes
  spotlightColor: string;  // rgba for mouse spotlight
}
```

5 cards in new layout. Grid: `lg:grid-cols-6`, row1 cards `lg:col-span-2`, row2 cards `lg:col-span-3`.

### Task 2: CSS UI Mockup Components (5 new components)

Create 5 React components, one per card:
- `SprintBoardMockup` — project dashboard
- `AIEditorMockup` — code editor with AI popup
- `TeamRosterMockup` — team profiles grid
- `AnalyticsDashMockup` — revenue charts
- `SprintApprovalMockup` — checklist + approve button

Each is a pure CSS/HTML composition using:
- Dark inner containers (`bg-[#0a0a14]`, `border border-white/[0.06]`)
- Mockup chrome bars (dots, tabs)
- Placeholder content rows with varying widths
- Accent-colored elements matching card theme
- All using Tailwind utility classes + minimal inline styles

### Task 3: Focal Glow Orbs

One absolutely-positioned glow orb per card using the specifications table above. Pure CSS — no animation needed (static focal points like the reference).

### Task 4: GSAP Animations

- Section header entrance (keep existing)
- Card entrance stagger (5 cards, 0.12s offset)
- Mockup element stagger-in after card entrance
- Hover handlers (card lift + glow intensify)
- Mouse-tracking spotlight (keep existing, adapt per-card color)

### Task 5: Build + Visual Verification

- `npx next build` — zero errors
- Visual check: desktop 1280px
- Visual check: mobile 390px
- Hover test: mockup lift + glow intensify
- Scroll test: entrance animations fire correctly

---

## Scope Guardrails

**DO modify:** Everything inside `src/components/solution.tsx`
**DO NOT modify:** `kpr-transition.tsx`, `glass-flow.tsx`, `globals.css`, `bento-monochrome-1.tsx`, or any other file

The `<section id="solution">` root element stays. Its className may adjust for internal needs. The outer container with its scroll-triggered pinning and rotation is completely untouched.

---

## Mockup Visual Fidelity Guide

The mockups should feel like **real product screens, not wireframes**. Key details:

1. **Chrome bars**: 3 dots (red/yellow/green at 6px each), or simplified as 3 gray dots. Tab text in white/50.
2. **Content rows**: Varying widths (70%, 45%, 85%), 8-10px height, rounded-sm, `bg-white/[0.06]` base color.
3. **Active/accent rows**: Use brand colors at low opacity — `bg-[#9900ff]/20` or `bg-[#00eeff]/15`.
4. **Interactive elements**: Buttons have gradient borders, toggles use brand cyan, checkmarks use green.
5. **Text in mockups**: Use real text (not Lorem Ipsum) — "Sprint 4", "Auth flow", "Deploy Preview", etc. Font size 10-11px, `text-white/60`.
6. **Spacing**: Generous padding inside mockups (12-16px). Items spaced 8-10px apart.
7. **Inner cards/panels**: Use `bg-white/[0.03]` with `border border-white/[0.04]`, `rounded-lg`.
