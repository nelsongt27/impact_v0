# Handoff: Axialent Impact Dashboard

## Overview

This is the design handoff for the **Axialent Impact Dashboard** — an internal tool for Axialent's operations, partners and commercial team to demonstrate the firm's track record (15+ years, 593 surveys, 7,266 responses, 30+ named clients). It is also intended to be shown live to prospective clients as part of sales propositions.

The design covers four views, in priority order:

1. **Overview** — "the number that matters" landing, with KPI strip, activity-over-time chart, top clients, survey-type breakdown, coverage & quality.
2. **Clients drilldown** — `/clients/[client]` per-client timeline + filterable surveys table.
3. **Programs drilldown** — `/programs/[program]` mirror of the clients view, grouped by program.
4. **Pre → Post Impact** — placeholder/roadmap page (intentionally unbuilt; communicates what's next).

The deliverable in this handoff is **Vista 1 (Overview), fully designed**, plus the design system to apply across all four. Vistas 2–4 are scaffolded with placeholders only.

---

## About the Design Files

**The HTML files in `prototype/` are design references, not production code.** They were built with React via in-browser Babel transformation and inline SVG charts so the design can be reviewed and iterated quickly. **They are not meant to be shipped, embedded, or copy-pasted into your repo.**

Your job is to **recreate these designs in the target stack** (Next.js 15 App Router · TypeScript · Tailwind 4 · shadcn/ui · Recharts · lucide-react), using the patterns that stack already encourages. The token files in `design-system/` are the source of truth for colors, typography, spacing, radii and shadows — wire those into Tailwind 4 (`@theme` block) and into a `globals.css` import.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, layout proportions and copy are final. Reproduce the visual style pixel-faithfully. The only intentionally rough surfaces are the placeholder views (Clients/Programs/Pre→Post) — those are scaffolded but not designed in detail yet.

---

## Target stack (non-negotiable, per client brief)

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** for all base components
- **Recharts** for all charts (no D3 directly)
- **lucide-react** for icons
- No backend — data is read statically from `/public/data/surveys_normalized.json`
- Client-side filtering / state — `useState` or `nuqs` for query params
- Deployable to Vercel `out-of-the-box`

---

## Design Tokens

All tokens are exported in three formats in `design-system/`:

- `tokens.css` — CSS custom properties (light + dark + density), import into `globals.css`
- `tokens.json` — Style Dictionary / Figma Tokens compatible
- `tailwind.config.js` — Tailwind v3 theme; for Tailwind v4 translate the `extend` block into `@theme` directives

### Brand colors (Axialent)

| Token        | Hex       | Use |
|---|---|---|
| `--ax-ink-800` (primary) | `#1D2F5E` | Headlines, primary buttons, dominant chart series |
| `--ax-amber-400` (accent) | `#F3B230` | Highlights, accent year markers, top-rank bar, hover states |
| `--ax-cobalt`            | `#2275AA` | Tertiary chart series, info |
| `--ax-cyan`              | `#3CB3D6` | Quaternary chart series |

### Ink scale (navy hue, neutralized)
`50:#F4F5F8`, `100:#E6E9F0`, `200:#C8CEDD`, `300:#99A3BC`, `400:#6B7796`, `500:#475270`, `600:#2F3A57`, `700:#25324F`, `800:#1D2F5E`, `900:#0F1A38`, `950:#070D20`.

### Amber scale
`50:#FEF8E9`, `100:#FCEDC2`, `200:#F9DC8A`, `300:#F6C957`, `400:#F3B230`, `500:#D9962A`, `600:#B07920`, `700:#855B18`.

### Paper (warm neutrals)
`paper-1:#FBFAF6` (page background), `paper-2:#F5F3EC`, `paper-3:#ECE9DF`.

### Data-viz palette (ordered for series)
1. `--ax-ink-800` 2. `--ax-amber-400` 3. `--ax-cobalt` 4. `--ax-cyan` 5. `--ax-ink-400` 6. `--ax-amber-200`.

### Typography

- **Display / headings:** `DM Serif Display` — 400 only (no bold available; use italic for emphasis).
- **Body / UI:** `Albert Sans` — weights 400, 500, 600, 700.
- **Mono / numbers / metadata:** `JetBrains Mono` — 400, 500.

Type scale (px): 11 / 12 / 13 / 15 (base) / 16 / 18 / 22 / 28 / 36 / 48 / 64.
Tracking: tight `-0.02em` for display, `0.14em` uppercase for eyebrows.

### Spacing (4-pt grid)
`0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96`.

### Radius
`xs:2 · sm:4 · md:8 · lg:12 · xl:20 · 2xl:28 · pill:9999`.

### Shadows
Warm low-saturation, `rgba(29,47,94,…)`. xs/sm/md/lg/xl. **Cards generally use hairline borders, not shadows** — keep this restraint.

### Motion
`fast:120ms · base:200ms · slow:360ms`, easings `standard cubic-bezier(.2,.8,.2,1)`, `emphasized cubic-bezier(.16,1,.3,1)`.

---

## Visual principles (from the brand book)

- Editorial, FT/BCG-Atlas density. **Not a SaaS dashboard.**
- Generous whitespace. Hairlines (`--ax-ink-100`) instead of shadowed cards.
- B&W with a single accent — emphasis in **amber**, neutral in **navy**.
- No emojis. No SaaS dashboard colors (cyan/neon/fuchsia outside the data-viz palette). No gradients. No 3D. No drop-shadows in charts.
- Sparkles (the four-pointed rounded diamonds from the logomark) used **sparingly**: in the brand mark, as a hero accent, and as the visual anchor of the Pre→Post placeholder. **Never** as repeating bullets in lists.

---

## Screens / Views

### Vista 1 — Overview

**Layout:** sidebar (240px sticky) + main column (max-width 1320px, padding `32px 56px 96px`).

#### Sidebar (`Sidebar`)
- Brand block: 28×28 navy sparkle SVG + "Axialent" in DM Serif Display 22px.
- Section label: `IMPACT RECORD` (mono 10px, tracking `0.16em`, uppercase, color `--ax-text-subtle`).
- Nav items: Overview · Clients · Programs · Pre → Post Impact (with `Soon` tag chip in amber-100/amber-700, mono uppercase).
- Active state: 2px amber bar pseudo-element on the left, ink-900 text, weight 600. Hover: ink-50 background.
- Bottom: tiny mono metadata `v0.1 · prototype` and `Last sync · 2026-04-28`.

#### Topbar (`Topbar`, 64px sticky)
- Left: breadcrumb in mono 11px uppercase: `Impact Record · `**`Overview`** (ink-900 bold for current).
- Right cluster (gap 12px):
  - Search input (240px, pill, paper-2 background) with `Search` icon.
  - Secondary button: `Calendar` icon + `2010 – 2026` (date range, currently static).
  - Primary button: `Download` icon + `Export PDF`.

#### Hero
- Eyebrow: `AXIALENT · IMPACT RECORD · 2010 – 2026`.
- Headline (DM Serif Display, `clamp(40px, 5.6vw, 76px)`, line-height 1.05, max-width 18ch):
  > **7,266 responses** *across* **593 surveys**, **30+ clients**, *15 years.*
  - Bold numbers in `ink-900`; the connecting words ("across", commas) in `ink-400`; **"15 years."** rendered in italic. This italic-on-final-clause is the hero's editorial signature — preserve it.
- Right of headline: `SparkleTrio` at 120px in `--ax-amber-400`.
- Subline: muted body 16px, max-width 560px, last clause in italic — *"does the work move people?"*.

#### KPI Strip
4-column grid, hairline `--ax-ink-100` top + bottom + dividers between cells. **No background, no shadow.** Each cell:
- Label (eyebrow style, uppercase mono).
- Value: DM Serif Display **56px**, ink-900, line-height 1, `letter-spacing -0.02em`, top-margin 16.
- Note: mono 12px, `--ax-text-muted`, top-margin 12.

Values: `7,266 Responses` · `593 Surveys` · `30+ Active clients` · `15 Years of history`.

#### Activity over time (`ActivityChart`)
Section header: eyebrow `Section 01` + display 28px `Activity over time`. Right legend: ink-800 line + amber-400 dot (`Surveys` / `Inflection year`).

Chart (Recharts `AreaChart`):
- 2010–2026 yearly counts.
- Line in `--ax-ink-800`, stroke 1.75px.
- Area fill `--ax-amber-400` at 14% opacity.
- Y-axis: 5 horizontal hairline gridlines (`--ax-ink-100`); tick labels in mono 10px `--ax-ink-400`. **No vertical gridlines, no axis line.**
- Accent years (2020, 2022, 2025): amber dashed vertical guide + filled amber dot (r=5, 2px paper stroke) + label above (mono 10px, `--ax-ink-700`, letter-spacing 0.05em).
- Other years: small ink-700 dots (r=2.5).
- X labels: mono 10px on first/last/even years only.
- Footnote under chart in mono: *"2020 marked a pause as engagements moved virtual. 2022 and 2025 are the two largest years on record."*

#### Top clients & Survey types (`ClientsAndTypes`)
Two-column section, `1.4fr 1fr`, gap 56, hairline top divider.

**Left — Top clients** (Recharts `BarChart` `layout="vertical"`):
- Top 15 named clients, **`unknown` excluded**.
- Bars 8px tall, gap 6px between rows.
- Rank 1 (P&G) bar in `--ax-amber-400`; ranks 2–15 in `--ax-ink-700`.
- Row layout: `[01]` rank in mono 11px `--ax-text-subtle` + label · bar (flex grow) · `surveys` count + `·` + responses count, all right-aligned in mono 12px.
- Below: footnote in mono 11px: *"219 surveys with client name pending — backfill in progress."* (Honest disclosure, do not hide.)

**Right — Survey types** (Recharts `PieChart` donut):
- `innerRadius` set so stroke ≈ 18px, no fill.
- Center label: total count (DM Serif Display 28px) + `SURVEYS` (mono 10px tracking 0.14em).
- Legend list to the right: 8×8 colored square swatch · type (capitalized, replace `_` with space) · count (mono 12px) · % (mono 11px, width 38, right-aligned).
- Palette in declared order maps to data-viz palette 1–7.
- Footnote: *`"other"` reflects surveys pending taxonomy review.*

#### Coverage & Quality (`QualityCoverage`)
Hairline top, eyebrow `Section 04`, display 28px `Coverage & quality`. Three-column grid, gap 48.

**Languages** — stacked horizontal bar (10px tall, 1px radius) ink-800/amber-400/cobalt for EN/ES/PT, then list with swatches, count and %.
**Phase coverage** — 4 rows. Each row: count in DM Serif Display 28px (post in ink-900, others ink-700, min-width 56) + label (capitalized) + mono 11px description ("after-program feedback", "mid-program checkpoint", "baseline diagnostic", "unphased / one-shot").
**Parse confidence** — same stacked-bar pattern, ink-800/ink-400/ink-200 for high/medium/low. Footnote: low-confidence rows are flagged for manual review.

#### Footer
Hairline top, mono 11px `--ax-text-subtle`. Left: `Source · surveys_normalized.json · 593 records`. Right: `Axialent · Impact Record · v0.1 prototype · 2026`.

---

### Vista 2 — Clients drilldown (designed shape, not yet visualized)

Path: `/clients/[client]`.

- **Header:** breadcrumb `Impact Record · Clients · `**`P&G`**, then DM Serif 48px client name, KPI strip same pattern as Overview (Years engaged · # surveys · # responses · First/last activity).
- **Timeline:** horizontal time axis (ink-100 hairline). Each survey is a 6px circle on the line, color-coded by program (data-viz palette). Hover tooltip: program name · date · type · response count.
- **Programs swim-lanes** (optional): each program in a row with its own dotted axis baseline; surveys plotted on it.
- **Surveys table** (shadcn `Table`):
  - Columns: Date · Program · Type · Phase · Responses · Confidence.
  - Type / Phase / Confidence rendered as `Badge` (outline variant, mono 10px uppercase). Confidence = high (ink-800), medium (ink-400), low (ink-200) badge background.
  - Sortable by date desc default. Pagination 25/page.
- **Filters above table:** `ToggleGroup` for Type, `Select` for Phase, `Select` for Language. Use `nuqs` for query-param sync.

### Vista 3 — Programs drilldown

Path: `/programs/[program]`. Same pattern as Clients but rows are clients-using-this-program.

### Vista 4 — Pre → Post Impact (placeholder, ship as-is)

Centered, 120px vertical padding. SparkleTrio 80px in amber-400. Eyebrow `Roadmap`. Display 44px `Pre → Post `*impact analysis.* (italic, ink-400). Body copy with `17 baseline diagnostics` and `23 endlines` highlighted in ink-900 bold. Bottom mono row: `17 PRE · 205 POST · 23 MID`.

---

## Components mapping (shadcn/ui ↔ design)

| Design need | shadcn/ui | Notes |
|---|---|---|
| Sidebar | custom nav (no official shadcn sidebar) | `Button variant="ghost"` per item; left amber bar via pseudo-element |
| Topbar buttons | `Button` (`default` / `outline`) | Pill shape — override `rounded-full` |
| Search input | `Input` wrapped with icon | Use `paper-2` background, pill |
| Date range | `Popover` + `Calendar` | Currently static label |
| KPI cells | custom — **do not** use shadcn `Card` (it has shadow/border defaults that fight the editorial look) | Pure CSS grid with hairlines |
| Activity chart | Recharts `AreaChart` + `ReferenceLine` for accent years | Custom `Tooltip` to match typography |
| Top clients | Recharts `BarChart` `layout="vertical"` with `Cell` for rank-1 highlight | Or render as DOM (more flexible for the rank/label/bar/count row) |
| Survey types donut | Recharts `PieChart` w/ `Cell` palette, `innerRadius` ≈ 75 | Custom legend on the right |
| Tables (Vista 2/3) | `Table`, `Badge`, `Pagination` | |
| Filters | `Select`, `ToggleGroup`, `Input` | Sync via `nuqs` |
| Tabs | `Tabs` | If multiple sub-views per client |
| Tooltips | `Tooltip` (Radix) for UI; custom `Tooltip` content for Recharts | |
| Coming-soon empty state | custom — `SparkleTrio` SVG | |
| Breadcrumb | `Breadcrumb` | |

---

## Interactions & Behavior

- **Sidebar nav:** sets active route. Active style is left amber bar + ink-900 text.
- **Topbar Export PDF:** prints current view (later) — for now, no-op + visual button.
- **Hero:** static (no animation).
- **Activity chart:** hover any year → tooltip with `{year}: N surveys / M responses`. Accent-year vertical guide always visible.
- **Top clients bar:** hover row → tooltip with full responses count + first-engagement year. Click row → navigate to `/clients/{name}`.
- **Donut:** hover slice → highlight + show count and % in center label, dim other slices to 50%.
- **Coverage bars:** decorative; no hover.
- **Transitions:** all width / opacity / color transitions use `200ms cubic-bezier(.2,.8,.2,1)` (`--ax-duration-base` / `--ax-ease-standard`). Bar animations on first paint use `360ms` emphasized easing.
- **Loading states:** skeletons in `--ax-ink-50` blocks, no shimmer (editorial restraint).
- **Empty states:** mono 12px text in `--ax-text-subtle`; never illustrations.
- **Responsive:**
  - ≥1280: full grid as designed.
  - 1024–1279: KPI strip becomes 2×2; Clients+Types section stacks vertically.
  - <1024: sidebar collapses to top drawer; reduce hero headline to ~44px.

---

## State Management

- Active view (`'overview' | 'clients' | 'programs' | 'prepost'`) — `useState` or App Router routes.
- Date range — `useState` for now; later `nuqs` `?from=2010&to=2026`.
- Vista 2/3 filters — `nuqs`: `?type=feedback&phase=post&lang=EN&q=`.
- Sort + pagination on tables — `nuqs`.

No global store needed.

---

## Data layer

- File: `/public/data/surveys_normalized.json` (the user provides; ~593 records, ~37MB).
- Read once on the server with `fs.readFileSync` in a Server Component or via `import` if bundler permits, or fetch from `/data/...` on the client if SSG-incompatible.
- Derive aggregations (yearly counts, top clients, type breakdown, phase counts, language counts, confidence) **at build time** in a single helper (e.g. `lib/aggregate.ts`) and expose typed selectors.
- Type the survey shape per the brief; mirror it in `types/survey.ts`.

**Important:** never invent data fields not present in the JSON. The brief calls this out explicitly. If a chart requires a field that's missing for some rows (e.g. `client === 'unknown'`), surface it honestly via a footnote — that pattern is already designed into the Overview.

---

## Assets

In `brand/`:

- `logo-primary.png` — full Axialent logotype + amber sparkles cluster (color, on light).
- `logo-mono-dark.png` — full logotype + dark sparkles (mono on light).
- `symbol-color.png` — `A` mark with amber sparkle inside.
- `logomark-stars.png` — the three sparkles cluster only (use for the SparkleTrio if you prefer raster over SVG; SVG version included in `prototype/src/sparkle.jsx`).

The four-pointed rounded sparkle path (canonical, reuse this in your icon component):

```
M50 0 C50 28, 72 50, 100 50 C72 50, 50 72, 50 100 C50 72, 28 50, 0 50 C28 50, 50 28, 50 0 Z
```

---

## Files in this handoff

```
design_handoff_impact_dashboard/
├── README.md                         ← this file
├── design-system/
│   ├── tokens.css                    ← CSS variables (light + dark + density)
│   ├── tokens.json                   ← Style Dictionary / Figma Tokens
│   └── tailwind.config.js            ← Tailwind v3 theme (port to v4 @theme)
├── brand/
│   ├── logo-primary.png
│   ├── logo-mono-dark.png
│   ├── symbol-color.png
│   └── logomark-stars.png
└── prototype/
    ├── Impact Dashboard.html         ← open this to see the live design
    ├── src/
    │   ├── app.css                   ← component-level CSS conventions
    │   ├── sparkle.jsx               ← Sparkle + SparkleTrio canonical SVGs
    │   ├── icons.jsx                 ← stroke-icon set (replace w/ lucide-react)
    │   ├── data.jsx                  ← synthetic data matching the brief totals
    │   ├── charts.jsx                ← reference SVG charts (replace w/ Recharts)
    │   └── overview.jsx              ← Vista 1 sections — read for layout intent
    ├── export/                       ← duplicate of design-system/ for the prototype
    └── assets/                       ← brand assets used by the prototype
```

---

## Implementation order

1. Scaffold Next.js 15 + Tailwind 4 + shadcn/ui + Recharts + lucide-react.
2. Wire `tokens.css` into `globals.css`; translate `tailwind.config.js` `extend` into Tailwind 4 `@theme`.
3. Set up fonts (DM Serif Display, Albert Sans, JetBrains Mono) via `next/font`.
4. Build the layout shell (sidebar + topbar + main content area), routes for `/`, `/clients`, `/programs`, `/pre-post`.
5. Implement Vista 1 section by section in the order they appear (Hero → KPI Strip → Activity → ClientsAndTypes → QualityCoverage → Footer). Match the live HTML proportions side-by-side.
6. Stop. Show to client. Iterate.
7. Then Vista 2 (Clients drilldown), then Vista 3 (Programs), then leave Vista 4 as the designed placeholder.

---

## What NOT to do (per brief)

- No login / auth.
- No backend, DB, or API routes.
- No animations beyond the simple width/opacity transitions described.
- No decorative charts that don't carry information.
- No invented metrics (e.g. don't create a "satisfaction score" if it isn't in the JSON).
- No 3D, no chartjunk, no drop shadows on charts, no gradient bars.
- No emojis anywhere in the UI.
- No SaaS-dashboard colors outside the declared data-viz palette.
