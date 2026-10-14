# NeliCardio — Precision Cardiology

An offline-first clinical reference and decision-support app for cardiology, built as a
Progressive Web App and packaged for Android/iOS with Capacitor.

It currently ships a curated library of conditions, medications, imaging parameters and
clinical calculators. A study-aid layer (guidelines registry, exam coverage matrix, quizzes,
spaced repetition) is planned — see [`SPEC.md`](./SPEC.md).

> **Educational use only.** This is a study and reference aid, not a substitute for clinical
> judgement. Always verify against the primary guideline source before making clinical decisions.

## Tech stack

| Area | Choice |
|---|---|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Animation | `motion` |
| Icons | `lucide-react` |
| Offline | `vite-plugin-pwa` (Workbox service worker) |
| Native | Capacitor 8 (Android + iOS) |
| Tests | Vitest |

## Getting started

```bash
npm install
npm run dev        # start the dev server
```

Open the printed local URL. The app is fully static — no backend or API keys required.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Type-check (`tsc -b`) + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
| `npm test` | Run the Vitest suite |

### Mobile

| Script | Purpose |
|---|---|
| `npm run mobile:sync` | Build the web app and sync into the native projects |
| `npm run mobile:build:android` | Build + sync + produce an Android APK |
| `npm run mobile:open:android` / `mobile:open:ios` | Open the native project |

Android builds also run in CI (`.github/workflows/`).

## Project structure

```
src/
  App.tsx                     # tab shell (Diagnosis / Labs / Imaging / Pharma / Scores)
  index.css                   # Tailwind theme tokens + global styles
  context/                    # PatientContext (age, sex, vitals, labs) persisted to localStorage
  data/
    conditions.ts             # 45 cardiology conditions (pathophysiology → red flags)
    medications.ts            # ~40 medications + dosing + interactions
    measurements.ts           # imaging parameters + severity thresholds
  features/
    conditions/               # condition browser + detail overlay + score widgets
    labs/                     # biochemistry + ABG/VBG interpreter
    imaging/                  # multimodality parameter assessment
    meds/                     # drug library + precision dosing
    calculators/              # risk scores (CHA2DS2-VASc, HAS-BLED, HEART, ...)
  lib/
    medical.ts                # clinical formulas (GFR, BSA, BMI, ABG, dosing criteria)
    units.ts                  # canonical units + conversions (creatinine, cholesterol, NT-proBNP)
    scores.ts                 # score-interpretation resolver
  components/                 # layout shell + UI primitives + clinical UI kit
```

### Units

All clinical values use **canonical SI units** internally (`src/lib/units.ts`):
creatinine **µmol/L**, cholesterol **mmol/L**, NT-proBNP **pg/mL**, troponin **ng/L**.
Conversion happens only at display time or when a guideline threshold is written in another
unit (e.g. Apixaban's "SCr ≥ 1.5 mg/dL"). Do not add a field without declaring its unit.

## Testing

```bash
npm test
```

Pure clinical logic (`lib/`) is covered by unit tests, including a units-integrity test that
asserts every lab field declares a unit. Add a test with every new formula or score.

## Roadmap

See [`SPEC.md`](./SPEC.md) for the full plan: guidelines registry (ESC + AHA/ACC with class/LOE),
exam coverage matrix, calculator engine overhaul, content expansion, and the UI/UX overhaul.
