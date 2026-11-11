# Rootline: Design Specification (Preliminary Frontend)

Working name: **Rootline**. Replace `APP_NAME` in `src/config.ts` if the name changes.

## 1. Purpose

This repository is a **frontend-only prototype** of a phone app that helps Malaysian chilli smallholders check plant health, find the likely root cause of a problem, and keep a per-row record. It exists to:

- show every planned screen in a realistic phone-sized layout,
- support usability tests with farmers and supervisors,
- give the team a shared visual reference before the real app is built.

**Out of scope:** backend, authentication, real image analysis, real database, real sync, real weather, payments, marketplace.

All data is **mock data** defined in `src/data/`. All "AI" results are hard-coded examples.

## 2. Stack

| Concern    | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Framework  | React 18 + TypeScript                                           |
| Build tool | Vite                                                            |
| Styling    | Tailwind CSS                                                    |
| Icons      | lucide-react (outline style only)                               |
| Routing    | None. A screen switcher holds the current screen in React state |
| State      | Local React state and a single mock data module                 |
| Language   | English only                                                    |
| Tests      | Vitest + React Testing Library (smoke tests per screen)         |

No external network calls. The app must run fully offline once installed.

## 3. Project structure

```
src/
  main.tsx
  App.tsx                 # phone frame + screen switcher
  config.ts               # APP_NAME, mock toggles
  data/
    mockFarm.ts           # farm profile, rows, plants
    mockChecks.ts         # past checks and findings
    mockFlags.ts          # flags and pattern warnings
    mockProducts.ts       # verified product list (placeholders)
  types/
    domain.ts             # shared TypeScript types
  components/
    PhoneFrame.tsx
    ScreenSwitcher.tsx
    TopBar.tsx
    BottomNav.tsx
    Card.tsx
    Button.tsx
    IconTile.tsx          # icon-first option tile
    StatusBadge.tsx
    ProgressDots.tsx
    EmptyState.tsx
  screens/
    HomeScreen.tsx
    CaptureScreen.tsx
    ProblemPickerScreen.tsx
    CaptureCheckScreen.tsx
    ResultScreen.tsx
    FollowUpScreen.tsx
    OfficerReferralScreen.tsx
    RowHistoryScreen.tsx
    EventLogScreen.tsx
    PatternWarningScreen.tsx
    FarmSetupScreen.tsx
    SyncScreen.tsx
  styles/
    index.css             # Tailwind directives and tokens
```

## 4. Screen map

The switcher lists every screen. Selecting one shows it inside the phone frame. There is no real navigation logic. Buttons that would go somewhere in the real app switch the screen in the prototype instead.

| #   | Screen             | Purpose                                             | Key elements                                                                                                   |
| --- | ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | Home               | Today's daily check card and a short status summary | Check-up card with "Start check", rows due, last check date, any open warning                                  |
| 2   | Capture (check-up) | Guided whole-plant photo for fixed sample plants    | Plant ID from QR tag, row and plant number, framing guide, "flip a leaf" prompt, photo count                   |
| 3   | Problem picker     | Farmer chooses where the symptom is                 | Icon tiles: leaves, fruit, stem, whole plant wilting, whole row                                                |
| 4   | Capture check      | Result of the photo quality check                   | Pass or fail, reason (blurry, too dark, no plant), retake button                                               |
| 5   | Result             | Health result for one plant                         | Healthy or flagged badge, likely cause, confidence wording, first check to do, product list link if applicable |
| 6   | Follow-up question | Asks one question to narrow the cause               | Question text with icon answers, progress dots (question 1 of up to 3)                                         |
| 7   | Officer referral   | Shown when the app cannot decide                    | Explanation, saved case summary, "Contact officer" placeholder                                                 |
| 8   | Row history        | Timeline of one row over time                       | Date strip, check results per plant, flags with status                                                         |
| 9   | Event log          | Quick entry for watering, feeding, spraying, rain   | Four large icon buttons, optional amount field, date defaults to today                                         |
| 10  | Pattern warning    | Warning from the pattern engine                     | Evidence in plain words ("Row 4 was flagged on 3 of the last 5 checks"), suggested check, dismiss and confirm  |
| 11  | Farm setup         | One-time farm profile                               | Farm name, variety, spacing, soil or polybag, rows, QR tag count                                               |
| 12  | Sync status        | Offline queue and sync state                        | Pending items count, last sync time, photo upload set to Wi-Fi only, consent toggle                            |

**Default screen on launch:** Home.

**Mock state switch:** a small control on the switcher lets the reviewer set the mock result (healthy, disease, nutrient stress, water stress, supply fault, unsure). This drives Result and Follow-up screens so every branch can be shown.

## 5. Language and wording rules

- English only in this version. Keep all strings in `src/data/copy.ts` so Bahasa Malaysia can be added later.
- Sentence case everywhere.
- Use plain words a farmer would use. Avoid "pathogen", "etiology", "classifier", "confidence score".
- Confidence is shown in words, not percentages: "Likely", "Possible", "Unsure".
- The app **suggests a check**; it never says "spray X" for a supply fault.
- Bacterial wilt is never paired with a spray. If it appears in mock data, the suggestion is "check resistant varieties" only.
- Product names only come from `mockProducts.ts`, and each shows its pre-harvest interval.
- Never write "reliably", "guaranteed", or "accurate diagnosis" in UI copy.

## 6. Visual design

### 6.1 Principles

- **Icon-first.** Every choice has an icon and a short label. Text is never the only way to answer.
- **Large targets.** Minimum 48 px touch targets, with 16 px spacing between them.
- **Calm and legible.** Outdoor use means strong contrast and no tiny text.
- **One primary action per screen.**

### 6.2 Layout

- Design width: 390 px (phone portrait). The `PhoneFrame` simulates this on desktop with a 390 × 844 viewport and a neutral bezel.
- On real phones the frame is removed and the app fills the screen.
- Safe-area padding at top and bottom.
- Body text is never below 16 px. Labels are never below 14 px.

### 6.3 Colour tokens

Defined in `styles/index.css` as Tailwind theme colours. Light theme only for this version.

| Token        | Hex       | Use                         |
| ------------ | --------- | --------------------------- |
| `brand`      | `#2F6B3A` | Primary buttons, active nav |
| `brand-soft` | `#E7F1E4` | Healthy card background     |
| `ink`        | `#1E2A22` | Primary text                |
| `ink-muted`  | `#5B6B5F` | Secondary text              |
| `surface`    | `#FFFFFF` | Cards                       |
| `canvas`     | `#F6F7F4` | Screen background           |
| `line`       | `#D9DED6` | Dividers, borders           |
| `healthy`    | `#2F6B3A` | Healthy badge               |
| `caution`    | `#B7791F` | Possible or unsure          |
| `alert`      | `#B23A2E` | Flagged, warning            |
| `info`       | `#2B6CB0` | Pattern notes, sync info    |

Cause colours are paired with an icon and label, never colour alone:

| Cause           | Colour  | Icon                  |
| --------------- | ------- | --------------------- |
| Disease         | alert   | `bug-off` or `leaf`   |
| Pest damage     | caution | `bug`                 |
| Nutrient stress | info    | `flask-conical`       |
| Water stress    | info    | `droplets`            |
| Supply fault    | caution | `pipette` or `wrench` |

### 6.4 Typography

- Font: system UI stack (`system-ui, -apple-system, Segoe UI, Roboto, sans-serif`). No web fonts, so the prototype works offline.
- Headings: 22 px (screen title), 18 px (card title), weight 600.
- Body: 16 px, weight 400, line height 1.5.
- Captions and metadata: 14 px, `ink-muted`.

### 6.5 Spacing and shape

- Spacing scale: 4, 8, 12, 16, 24, 32 px.
- Card radius 16 px. Button radius 12 px. Chip radius full.
- Shadows: none. Use the `line` border for separation.

### 6.6 Components

| Component      | Notes                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------- |
| `Button`       | Variants: primary, secondary, ghost. Full width by default on mobile                            |
| `Card`         | `surface` background, `line` border, 16 px padding                                              |
| `IconTile`     | 96 px square, icon 32 px, label below. Selected state uses `brand` border and `brand-soft` fill |
| `StatusBadge`  | Icon plus text. Variants: healthy, possible, flagged, unsure, pending, synced                   |
| `ProgressDots` | For follow-up questions. Filled dot for answered questions                                      |
| `TopBar`       | Back button (optional), title, optional right action                                            |
| `BottomNav`    | Home, Log, Row history, Farm. Icons with labels                                                 |
| `EmptyState`   | Icon, one line, one action                                                                      |

Icons: lucide-react, outline style only. Decorative icons get `aria-hidden`. Icon-only buttons get an `aria-label`.

## 7. Interaction behaviour (mocked)

- Taps on buttons change the screen or state in the prototype. No real navigation.
- Photo capture shows a static sample image from `public/samples/` and a fake "checking" delay of 1.5 s, then shows the mock capture-check result.
- Follow-up questions: selecting an answer updates the progress dots and moves to the next question or to the result. After three questions, the app goes to the officer referral screen if the cause is still unsure.
- Event log entries add to the mock log list in memory only. Reloading resets them.
- Pattern warning "Dismiss" moves the warning to a dismissed list. "Confirm" marks it as confirmed. Both stay visible in row history.
- Sync screen toggles change local state only.
- Keep animations to simple fades under 200 ms. Respect `prefers-reduced-motion`.

## 8. Mock data

Define these types in `src/types/domain.ts` and fill them with sample values.

```ts
type Cause = "healthy" | "disease" | "pest" | "nutrient" | "water" | "supply" | "unsure";
type PartType = "leaf" | "stem" | "fruit" | "whole";
type CheckMode = "check-up" | "problem";
type FlagStatus = "unconfirmed" | "confirmed" | "dismissed";
type EventType = "watered" | "fed" | "sprayed" | "rain";

interface Farm {
  name: string;
  variety: string;
  spacingCm: number;
  growingMedium: "soil" | "polybag";
  rows: Row[];
}
interface Row {
  id: string;
  label: string;
  plants: Plant[];
}
interface Plant {
  id: string;
  qrTag: string;
  rowId: string;
  positionInRow: number;
}
interface Check {
  id: string;
  date: string;
  mode: CheckMode;
  plantId: string;
  cause: Cause;
  part: PartType;
  note?: string;
}
interface Flag {
  id: string;
  checkIds: string[];
  cause: Cause;
  status: FlagStatus;
}
interface PatternWarning {
  id: string;
  rowId: string;
  evidence: string;
  suggestedCheck: string;
  status: FlagStatus;
}
interface FarmEvent {
  id: string;
  date: string;
  type: EventType;
  rowId: string;
  amount?: string;
  product?: string;
}
interface Product {
  id: string;
  name: string;
  targets: Cause[];
  preHarvestDays: number;
  registered: boolean;
}
```

Sample data requirements:

- One farm with 4 rows of 6 plants each.
- At least 12 past checks spread over 3 weeks, including healthy checks.
- Row 4 flagged on 3 of its last 5 checks (drives the pattern warning screen).
- A rain event logged 2 days before a flag cluster (drives the wet-day rise example).
- Product list with at least 3 **clearly marked placeholder** entries, for example `Placeholder product A (replace with verified list)`. Do not invent real brand names or dosages.
- Each mock Result must show a first check, not a product, unless the cause is disease and the product list has an entry.

## 9. Scope checklist for the prototype

- [ ] Vite + React + TypeScript + Tailwind project runs with `npm run dev`
- [ ] Phone frame and screen switcher show all 12 screens
- [ ] Mock state switch drives Result and Follow-up branches
- [ ] Every screen uses only mock data and works offline
- [ ] Tap targets 48 px minimum, text 16 px minimum for body
- [ ] English copy only, all strings in `copy.ts`
- [ ] Each screen has a smoke test that renders without errors
- [ ] `README.md` explains how to run the prototype and switch screens
- [ ] No network requests, no analytics, no external fonts

## 10. Commands

```bash
npm install
npm run dev        # local preview at http://localhost:5173
npm run build      # production build to dist/
npm run test       # Vitest smoke tests
```

## 11. Out of scope for this repository

Recorded so nobody builds them by accident:

- Real image analysis or CNN inference
- Bayesian update logic beyond the mocked answer path
- Pattern engine rules (the warning is hard-coded in mock data)
- Database, sync or retraining
- Authentication, user accounts or consent storage
- Weather data
- Bahasa Malaysia translation
- Hardware or sensor integration

## 12. Open items

- Final app name (Rootline is the working name).
- Verified product list from DOA or MARDI. Until then, placeholders only.
- Icon set confirmation for cause icons (lucide names above are suggestions).
- Whether the phone frame stays in the final prototype or is removed for sharing.
