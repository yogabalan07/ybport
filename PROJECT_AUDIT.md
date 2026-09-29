# PROJECT_AUDIT.md — Yogabalan B R Portfolio (ybport)

**Audit type:** READ-ONLY. No source code was modified, no rebuild was deployed, no git pushes were made.
**Audit date:** 2026-09-29
**Repo audited:** `C:\Users\HP\Desktop\ybport` (GitHub: https://github.com/yogabalan07/ybport)
**Environment:** Windows 11, Node v22.14.0, npm 10.9.2, Chrome (headless + CDP), TypeScript 7.0.2

---

## 1. Executive Summary

**Overall status: PRODUCTION-READY VISUALLY, NOT YET TRUSTWORTHY FACTUALLY.**

The site is a polished, high-craft single-page React portfolio. It builds cleanly, lints cleanly, renders with **zero console errors and zero failed requests**, has no horizontal-overflow issues at any tested width (320→1440px), and its interaction layer (terminal, snake, project blueprint, resume modal, theme switcher, focus traps, Escape handling) all work as designed. The embedded-engineering visual identity (notebook/blueprint aesthetic, circuit doodles, GPIO-labelled snake board, hardware spec-sheet modals) is genuinely distinctive and fully implemented.

However, the audit found **material factual and trust problems**, all in content/data, not code:

1. **All 7 project GitHub links in the site resolve to HTTP 404** (the repos live under different slugs).
2. **The contact form stores messages only in the visitor's own browser `localStorage`** while telling the visitor "I've received your message and will reply within 24 hours" and "Dispatches directly to Yogabalan B R's verified contact queue." No message ever reaches the owner.
3. **The GitHub contribution heatmap is synthetically generated** (`Math.sin`-based) yet labelled with a hardcoded "486 contributions" figure, and hardcoded stars/repo counts contradict the live GitHub API (0 stars vs claimed 12/9/14/8; 24 real public repos vs 18 claimed).
4. **The LinkedIn URL used throughout (code + structured data + generated resume) is `linkedin.com/in/yogabalan07`**, which does not match the owner-stated profile `linkedin.com/in/yogabalan-b-r-400a483a`.
5. **A clean `npm install` fails** (esbuild peer-dependency conflict), so the README's own setup instructions do not work for a fresh clone.

No security vulnerabilities, no data-exposure issues, and no broken rendering were found. Every problem below is fixable without redesigning anything.

---

## 2. Tech Stack & Architecture (Discovery)

| Layer | Choice | Notes |
|---|---|---|
| Framework | React 19.0.1 + React DOM 19.0.1 | Function components only |
| Build | Vite 8.3.1 (`@vitejs/plugin-react` 6.1.1) | Static build → `dist/` |
| Language | TypeScript 7.0.2, strict | `lint` script = `tsc --noEmit` |
| Styling | Tailwind CSS 4.3.3 via `@tailwindcss/vite` | No config file; CSS-first in `src/index.css` |
| Animation | `motion` 12.23 (Framer Motion successor) | Entrance/exit + scroll reveals |
| Icons | `lucide-react` 0.546 + inline SVG doodles | 139 `<svg>` nodes, **0 `<img>` nodes** |
| Routing | **None (by design)** | Pseudo-routing via `window.location.pathname`; `NotFoundPage.tsx` handles unknown paths |
| State | React state + `localStorage` / `sessionStorage` | No Redux/Zustand/context store |
| Fonts | Google Fonts (4 families) | Architects Daughter, Caveat, JetBrains Mono, Plus Jakarta Sans |

**Architecture:** single-page, section-based (`home, about, skills, projects, experience, education, achievements, github, resume, contact`) orchestrated by `src/App.tsx`. Pathname only distinguishes `/` from anything else — the "pages" are scroll sections, not routes. Theme is a 3-mode system (`paper | dark | blueprint`) persisted at `localStorage["yogabalan_portfolio_theme"]`. Boot animation is gated by `sessionStorage["yb_booted"]`. Global keyboard shortcuts: `t` terminal, `g` snake, `theme <mode>` in terminal, Escape closes modals.

**Key insight:** there is no backend of any kind. Everything labelled "dispatch", "queue", "live", or "verified" in the UI is currently client-side simulation — see §7, §8, §17.

---

## 3. Repository Structure & File Inventory

```
ybport/
├── index.html                  # SEO meta, OG/Twitter, JSON-LD, Google Fonts
├── package.json                # scripts: dev/build/preview/clean/lint
├── vite.config.ts              # React + Tailwind plugins, "@" alias → repo root
├── tsconfig.json
├── metadata.json               # AI Studio remnant (harmless)
├── README.md                   # stock AI Studio template (misleading — see §14)
├── .env.example                # GEMINI_API_KEY / APP_URL placeholders (unused)
├── bun.lock                    # original lockfile (bun, but bun not installed here)
├── package-lock.json           # ⚠ CREATED BY THIS AUDIT (npm install --legacy-peer-deps)
├── scripts/generate-resume.js  # standalone jsPDF script, not wired to any npm script
├── public/
│   ├── robots.txt              # allows all, points to yogabalan.dev/sitemap.xml
│   ├── sitemap.xml             # single URL, lastmod 2026-09-28
│   └── resume-yogabalan.pdf    # static PDF download
└── src/
    ├── main.tsx / App.tsx      # theme + boot + pseudo-routing + shortcuts + modal orchestration
    ├── index.css               # paper/blueprint textures, 3 themes, reduced-motion block
    ├── data/portfolioData.ts   # ← ALL site content lives here (single source of truth)
    ├── hooks/useFocusTrap.ts   # modal focus management
    ├── components/
    │   ├── Navbar, Hero, About, Skills, Projects, Experience, Education,
    │   │   Achievements, GitHubSection, ResumeSection, Contact, Footer
    │   ├── TerminalModal, SnakeGameModal, ProjectBlueprintModal, ResumeModal, BootLoader
    │   ├── NotFoundPage, DraftingCursor, PageScribbles
    │   └── doodles/ElectronicsDoodles.tsx, doodles/DoodleIcons.tsx, HeroDoodleDiagram.tsx
```

**Not present:** `.git/` (project folder is NOT a git repo; `git rev-parse` resolves to `C:/Users/HP`), `.github/`, CI configs, `vercel.json`, `netlify.toml`, `firebase.json`, `Dockerfile`, `.nvmrc`, tests of any kind, `index.css` contains no `@layer` usage issues.

**Audit-only side effect:** `package-lock.json` did not exist in the original repo (bun.lock is original). It was generated during dependency installation for testing. Decision on which lockfile to keep is a Phase B item (§18).

---

## 4. Feature Inventory & Status

| # | Feature | Status | Evidence |
|---|---------|--------|----------|
| 1 | Boot sequence animation (BootLoader) | ✅ Works | Skipped on repeat visits via `sessionStorage["yb_booted"]` |
| 2 | 3-mode theme (paper/dark/blueprint) | ✅ Works | `theme dark` in terminal sets `data-theme="dark"`; persists in localStorage |
| 3 | Terminal easter egg (`t` key + nav) | ✅ Works | Opens, `neofetch` executes, `role="dialog"` + `aria-modal="true"`, Escape closes |
| 4 | Snake game (`g` key + nav) | ✅ Works | Canvas renders, d-pad on mobile, high score persisted (`yogabalan_snake_high_score`) |
| 5 | Project Blueprint modal (per project) | ✅ Works | Opens from project cards, hardware-style spec sheet |
| 6 | Skill spec-sheet modal | ✅ Works | Opens from skill chips |
| 7 | Resume modal (view/download/print) | ✅ Works | All 3 buttons functional; PDF also at `public/resume-yogabalan.pdf` |
| 8 | Project filters (All/Web/Embedded/IoT) | ✅ Works | IoT filter → 2 cards (ESP32 LoRa + Self-Balancing Robot) |
| 9 | GitHub section "live" fetch | ⚠ Partial | Real fetch to `api.github.com` for profile stats; heatmap + some numbers hardcoded/synthetic (§7) |
| 10 | Contact form | ❌ **Broken as a feature** | Saves to visitor's own localStorage only; no email/API/webhook (§7, §17 #2) |
| 11 | Scroll navigation / section links | ✅ Works | All 10 sections render and anchor correctly |
| 12 | Mobile hamburger menu | ✅ Works | "Notebook Navigation" drawer + Resume link (screenshot verified) |
| 13 | Keyboard shortcuts + focus trap | ✅ Works | `useFocusTrap` active in modals; Escape closes |
| 14 | Snake high score persistence | ✅ Works | localStorage read/write verified |
| 15 | Responsive layout 320→1440px | ✅ Works | Zero horizontal overflow at all 7 tested widths |
| 16 | 404 page | ✅ Present | `NotFoundPage.tsx` (only reachable on unknown pathnames) |
| 17 | PDF resume generator script | ⚠ Orphaned | `scripts/generate-resume.js` (jsPDF) not wired to package.json scripts |
| 18 | "Live deployment" / backend | ❌ Absent | No server, no API routes, no hosting config (§13) |

**Nothing was found removed or half-implemented among the 7 named projects** — all 7 (Connect, NRB Vidyalaya LMS, Enterprise BMS, Alumni Portal, Attendance & Feedback, ESP32 LoRa Morse, Self-Balancing Robot) appear in `portfolioData.ts` with full content; only their outbound GitHub URLs are wrong.

---

## 5. Embedded Engineering Visuals Assessment (Phase 3)

The embedded/systems identity is the strongest part of the design and is implemented with real specificity, not clip-art:

- **`doodles/ElectronicsDoodles.tsx`** — hand-drawn-style circuit components: ESP32 module with EN/BOOT tactile buttons, resistors, capacitors, LEDs, DIP chips, headers, potentiometers — all parameterised inline SVG (no image assets).
- **`doodles/DoodleIcons.tsx` + `HeroDoodleDiagram.tsx`** — hero-side annotated block diagram (MCU → sensors → radio → cloud) in notebook ink style.
- **Snake game board** is themed as firmware telemetry: corner labels `GPIO_04`, `I/O_BUS`, `RING_BUFFER[20]`, `CLK: 8.7Hz`; food nodes labelled `ESP32`; heading "Mini Engineering Break".
- **Project Blueprint Modal** presents each project as a hardware spec sheet (MCU, peripherals, protocol rows) rather than a generic card.
- **Skills spec-sheet modal** gives component-level detail (clock speed, GPIO, protocol style rows for tool entries).
- **Terminal `neofetch`** outputs `Repositories: {n} verified` — hardware-nerd flavour consistent with the persona.
- **Paper/blueprint theme modes** (`src/index.css`): graph-paper grid, taped-paper washitape SVG, blueprint invert — all CSS/SVG, zero raster images sitewide.

**Verdict:** ✅ Genuine, coherent, and complete. No changes recommended beyond (a) the `verified` wording in terminal (§17 #6), and (b) any future projects should follow the existing doodle + blueprint patterns. Visual identity must be preserved per audit constraints.

---

## 6. Functionality & Interaction Test Results

All tests run against `npm run dev` (port 3000) and `npm run build` + `vite preview` via Chrome headless with CDP instrumentation.

### 6.1 Console & Network Hygiene
| Check | Result |
|---|---|
| Console errors | **0** |
| Uncaught exceptions | **0** |
| Failed network requests | **0** |
| React hydration/runtime warnings | **0** |

### 6.2 Interaction Tests
| Test | Result |
|---|---|
| Press `t` → terminal opens | ✅ |
| `neofetch` command executes | ✅ (simulated, client-side switch) |
| Terminal `role="dialog"`, `aria-modal="true"`, labelled | ✅ |
| Escape closes terminal | ✅ |
| Press `g` → snake opens, canvas + controls render | ✅ |
| Project "Blueprint" modal opens from card | ✅ |
| Resume modal opens; Download / Print / X all work | ✅ |
| Skills filter → IoT → exactly 2 project cards | ✅ |
| Skill chip → spec-sheet modal | ✅ |
| `theme dark` → `data-theme="dark"` applied | ✅ |
| Mobile hamburger → "Notebook Navigation" drawer | ✅ |
| Modal focus trap keeps Tab inside dialog | ✅ (`useFocusTrap`) |

### 6.3 Structure Counts (DOM census)
- `<h1>`: 1 · `<h2>`: 9 · `<h3>`: 17 — correct single-h1 hierarchy
- `<img>`: 0 · `<svg>`: 139 — all visuals are inline SVG (crisp at any DPI)
- `aria-label`: 16 · modals use `role="dialog"` + `aria-modal` + `aria-labelledby`
- `target="_blank"`: 18 — **all 18 carry `rel="noopener noreferrer"`** ✅

### 6.4 Known interaction defects
1. **BootLoader advertises `[Esc]` to skip, but Escape does not skip the boot** — prompt and behavior disagree (§17 #10).
2. **Snake modal header hint `// press 'G' or 'Esc'` overlaps the absolute-positioned close (X) button at mobile widths** (see §10 screenshot evidence, §17 #9).
3. Contact "success" state is fiction (elevated to §17 #2 — it is a content-truth issue, not just interaction).

---

## 7. Content & Link Verification (Phase 5) — GitHub API Evidence

GitHub's REST API was queried directly (`api.github.com/users/yogabalan07` and per-repo) on 2026-09-28.

### 7.1 All 7 project GitHub links return HTTP 404
| Site slug (in `portfolioData.ts`) | Result | Actual repo that exists |
|---|---|---|
| `esp32-lora-communicator` | ❌ 404 | *(no equivalent found)* |
| `self-balancing-robot-pid` | ❌ 404 | `MPU-6050-3d` (partial match?) |
| `connect-academic-portal` | ❌ 404 | `connect` |
| `nrb-vidyalaya-lms` | ❌ 404 | `NRB-Vidyalaya-LMS-` |
| `enterprise-bms-frontend` | ❌ 404 | *(not found)* |
| `alumni-networking-portal` | ❌ 404 | `Online-Alumni-Networking-Portal-s` |
| `training-attendance-feedback` | ❌ 404 | `Training-Attendance-Feedback-Management` |

→ **Every "View Code" button on the site leads to a 404 page.** This is the single most damaging outward-facing defect: it is the first thing a recruiter clicks.

### 7.2 Hardcoded stats contradict live API
| Metric | Site claims | Live API (2026-09-28) |
|---|---|---|
| Public repos | **18** (`portfolioData.ts:289`) | **24** |
| Total stars | per-project **12 / 9 / 14 / 8** | **0 on every repo** |
| Contributions last year | **486** (`portfolioData.ts:288`) | not publicly verifiable via this endpoint |
| Followers | not shown | 19 (available but unused) |

### 7.3 The contribution heatmap is synthetic
`GitHubSection.tsx:32` (`// 52 weeks of contribution activity`) generates cell values with a `Math.sin(...)` deterministic pattern; cells are then labelled `"${commitCount} contributions"` (`GitHubSection.tsx:173`) and summarised as "486 contributions logged". The profile fetch (`GitHubSection.tsx:10,21`) only pulls `public_repos`/`followers` etc. — **the calendar is decorative but worded as factual data.** HIGH severity under "do not invent metrics" (§17 #3).

### 7.4 LinkedIn URL discrepancy — found in 4 places
Owner-stated profile: `https://linkedin.com/in/yogabalan-b-r-400a483a`.
Code uses: `https://linkedin.com/in/yogabalan07` at
- `src/data/portfolioData.ts:14`
- `index.html:38` (JSON-LD `sameAs`)
- `src/components/ResumeModal.tsx:29` and `:204` (generated resume text)
- `src/components/TerminalModal.tsx:409`

Also note `ResumeModal.tsx:29/204` derives LinkedIn from `PERSONAL_INFO.githubUsername`, coupling two unrelated identities — even a correct fix at line 14 would be overridden here. Whether `yogabalan07` resolves to a real profile was **not** verified (LinkedIn blocks unauthenticated checks) — confirm with the owner before changing.

### 7.5 Other content checks
- Owner facts (name, KSR College of Engineering 2024–2028, 3rd year, GitHub handle) — ✅ consistent everywhere.
- Resume modal additionally lists "Web Development Intern, Touchmark Descience Pvt Ltd — Chennai (2026)". Not among the owner-supplied facts; **flagged for owner confirmation** (could be accurate new content; audit does not judge it, only notes it was not in the provided fact list).
- README instructs `npm install` then setting `GEMINI_API_KEY` — both wrong for this project (§14).

---

## 8. Security Audit (Phase 6)

| Check | Result |
|---|---|
| `eval` / `new Function` in src | ✅ None |
| `innerHTML` / `dangerouslySetInnerHTML` | ✅ None |
| `process.env` leaks to client bundle | ✅ None |
| Secrets in repo | ✅ None (`.env.example` = placeholders only; no `.env*` committed) |
| Git history secret scan | ⚠ N/A — **no `.git` in project folder** (parent repo is `C:/Users/HP`, an unrelated home-directory repo) |
| XSS via user input | ✅ Contact form values render through React escaping only; no raw injection path |
| Terminal simulation | ✅ **Pure frontend command switch — no shell, no filesystem, no env access.** Cannot be escalated |
| External links | ✅ All 18 `target="_blank"` have `rel="noopener noreferrer"` |
| `localStorage` handling | ⚠ Cosmetic risk only: `JSON.parse(localStorage.getItem('yogabalan_portfolio_messages') \|\| '[]')` (`Contact.tsx:25`) will throw if the key is corrupted by hand — no `try/catch` (LOW, §17 #14) |
| Dependency CVEs | ⚠ Not scanned (no audit tooling run; `npm audit` was intentionally not part of scope-creep — recommend as Phase B step) |
| Form data exposure | ✅ No data leaves the browser (this is also *why* the contact form doesn't work — §17 #2) |

**Verdict:** No exploitable vulnerabilities found. The site is unusually clean because it has no backend and no dynamic HTML sinks. The only "security-adjacent" issue is misleading data handling (contact form), which is a trust problem (§17), not an exploit.

---

## 9. Performance Audit (Phase 9)

### 9.1 Build output
| Asset | Raw | Gzip |
|---|---|---|
| `dist/index.html` | 3.44 kB | — |
| CSS | 60.72 kB | 11.31 kB |
| **JS (single chunk)** | **563.06 kB** | **161.03 kB** |

Vite itself emitted the **">500 kB chunk" warning** — one JS chunk contains React 19 + Motion + Lucide + all sections + terminal + snake + blueprint + resume code.

### 9.2 Findings
1. **No code splitting** — no `React.lazy`, no dynamic `import()`, no route-level chunks (there are no routes, but modal-level splitting is still available). `TerminalModal`, `SnakeGameModal`, `ProjectBlueprintModal`, `ResumeModal` are all eagerly loaded even though a visitor may never open them. MEDIUM (§17 #7).
2. **Render-blocking Google Fonts** (`index.html:57`) — 4 font families in one blocking `css2` request from `fonts.googleapis.com`; no `display=swap`... actually `display=swap` **is** present ✅, but the request still serialises with first paint and adds a third-party RTT on cold load. LOW–MEDIUM (§17 #8).
3. **Zero raster images** (0 `<img>`, all inline SVG) — ✅ this is a major *win*; no image payload, no CLS from media, crisp at all DPIs.
4. **Motion usage** — entrance animations are short (0.25s `easeOut` scale/translate), scroll reveals are subtle. ✅ Consistent with "keep animations subtle".
5. **Session boot gating** — boot animation shown once per session (`sessionStorage["yb_booted"]`), so repeat navigation is instant. ✅
6. **No fonts preloading, no modulepreload tuning, no service worker / offline support.** LOW — optional for a portfolio.
7. **Not measured (out of scope for this audit):** Lighthouse/Lighthouse CI scores, real-device frame timing, bundle analyzer treemap. Recommended as a Phase C baseline step.

**Verdict:** Fast enough to feel instant on modern hardware; the single 563 kB chunk is the one structural perf debt.

---

## 10. Mobile & Responsiveness Audit (Phase 9)

### 10.1 Horizontal overflow sweep (CDP emulation, document `scrollWidth` vs viewport)
| Width (px) | 320 | 375 | 390 | 414 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|---|
| Horizontal overflow | **None** | **None** | **None** | **None** | **None** | **None** | **None** |

`scrollWidth == innerWidth` at every breakpoint. ✅

### 10.2 Modal fit under emulation
| Modal @ 375px | Fits viewport | Notes |
|---|---|---|
| Terminal | ✅ | Full command UI usable |
| Snake | ✅ | D-pad controls reachable; canvas scaled |
| Resume | ✅ | Header buttons wrap cleanly (Download PDF / Print / X all visible) |
| Project Blueprint | ✅ | Spec-sheet rows wrap correctly |

### 10.3 Defect found (screenshot: `cdp-mobile-snake.png`)
**Snake modal header overlap:** the orange handwritten hint `// press 'G' or 'Esc'` (`SnakeGameModal.tsx:407-409`) sits in a `flex` row (`:403`) while the close button is absolutely positioned `top-4 right-4` (`:393-399`). The header wrapper has `pr-10` (`:402`, 40px) but the X button occupies ~16px→56px from the right edge, so **the X's focus ring overlaps the end of the hint text** on narrow screens. Cosmetic, but visible on the most-demoed easter egg. (§17 #9 — fix is a one-line `pr-14`/wrap or `hidden sm:inline` on the hint.)

### 10.4 Verified-good mobile behaviors
- Hamburger menu with "Notebook Navigation" drawer + Resume entry ✅
- No tap targets below ~40px observed in d-pad/nav controls ✅
- No zoom-lock: `width=device-width, initial-scale=1.0`, no `user-scalable=no` ✅
- Themes (`dark`, `blueprint`) legible at all widths ✅
- No fixed-width tables or `<pre>` escaping their containers ✅

**Verdict:** Excellent. One cosmetic overlap; otherwise mobile is production-grade.

---

## 11. SEO Audit (Phase 10)

### 11.1 Present & correct ✅
- Unique `<title>` (60 chars, keyword-fronted) — `index.html:6`
- Meta `description` (155 chars) — `index.html:7`
- `lang="en"`, charset, viewport — `index.html:2,4,5`
- **Schema.org JSON-LD `Person`** with `alumniOf`, `sameAs`, `knowsAbout` — `index.html:25-52`
- `robots.txt` allows all + Sitemap pointer — `public/robots.txt`
- `sitemap.xml` well-formed, single URL, `lastmod 2026-09-28` — `public/sitemap.xml`
- Favicon: inline SVG data-URI "YB" monogram — `index.html:58` (no 404 favicon request observed)

### 11.2 Problems
| # | Issue | Severity |
|---|---|---|
| 1 | **Canonical/OG/sitemap/robots all point to `https://yogabalan.dev/`** — domain ownership and deployment target unverified; if the site ships elsewhere, every canonical self-references a domain the owner may not control | HIGH |
| 2 | **`twitter:card=summary_large_image` with NO `og:image` / `twitter:image`** — cards will render without the promised large image (broken preview) | MEDIUM |
| 3 | **JSON-LD `sameAs` contains the wrong LinkedIn** (§7.4) — structured data advertises a possibly-nonexistent profile | MEDIUM |
| 4 | Single-page architecture: all 10 sections share one URL — no `hreflang`, no per-section anchors in sitemap. Acceptable for a portfolio, but caps long-tail SEO | LOW (accepted) |
| 5 | No `og:image`, **no social preview image asset at all** (zero raster files in repo) | MEDIUM (same as #2) |
| 6 | `metadata.json` (`"MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"`) and AI Studio README are **irrelevant to crawlers but publicly shipped** — harmless, but signals template origin | LOW |

**Note — corrected during audit:** `metadata.json` was initially flagged as containing mojibake (`"Yogabalan B R ? Portfolio"`); on reading the file directly it contains a proper UTF-8 em-dash (`—`). **False positive; no fix needed.**

**Verdict:** Strong technical SEO foundation for a SPA; the domain decision and social-image gap are the only real gaps.

---

## 12. Accessibility Audit (Phase 10)

### 12.1 Passing ✅
- **Heading hierarchy:** exactly one `<h1>`; 9 `<h2>` per section; 17 `<h3>` — no skipped levels observed
- **Modals:** `role="dialog"` + `aria-modal="true"` + `aria-labelledby`/`aria-describedby` (verified on terminal & snake)
- **Focus management:** `hooks/useFocusTrap.ts` traps Tab inside open modals; Escape closes (terminal verified)
- **Icon-only buttons:** labelled via `aria-label` (e.g. `aria-label="Close snake game"` — `SnakeGameModal.tsx:396`); 16 `aria-label`s total
- **Colour contrast:** ink `#141517` on paper `#FAF7F0` ≈ 15.8:1; blue `#1D4ED8` on paper ≈ 7.4:1 — both pass AA/AAA for text (spot-checked; full axe/CI sweep not run)
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` block exists at `src/index.css:176` — CSS animations/transitions neutralised
- **Skip/landmark semantics:** sectioning elements with labelled regions; nav has aria labels
- **No `img` alt issues possible** (0 images; SVGs are decorative/labelled)

### 12.2 Gaps ⚠
| # | Gap | Severity |
|---|---|---|
| 1 | **Reduced-motion is CSS-only.** `motion` (Framer) JS animations are not gated by `useReducedMotion()` / `<MotionConfig reducedMotion="user">` — entrance/exit scale-translate animations likely still run for vestibular-sensitive users | MEDIUM (§17 #11) |
| 2 | Snake header hint overlaps close button (§10.3) — focus ring over text | LOW–MEDIUM |
| 3 | BootLoader `[Esc]` prompt non-functional (§6.4) — advertised affordance doesn't work | LOW |
| 4 | Full automated sweep (axe-core / Lighthouse a11y) **not run** — colour pairs above are computed, not tool-verified; forms/labels not exhaustively machine-checked | Recommended |
| 5 | Custom `DraftingCursor` replaces the native cursor — verify it doesn't hide the caret/pointer for users expecting OS affordances (visual-only, desktop theme) | LOW (observed working) |

**Verdict:** Above-average a11y for a heavily animated portfolio. The JS-animation/reduced-motion gap is the one substantive fix.

---

## 13. Deployment Readiness (Phase 10)

| Requirement | Status |
|---|---|
| Produces static site | ✅ `npm run build` → `dist/` (fully static, no SSR) |
| Hosting config (Vercel/Netlify/Firebase/CF) | ❌ **None present** |
| CI/CD (`.github/workflows`) | ❌ **None present** |
| Dockerfile | ❌ None |
| Git repository in project | ❌ **No `.git` in `ybport`** — `git rev-parse` → `C:/Users/HP` (a home-dir repo). The project cannot be committed/pushed as-is, and accidental staging from `C:/Users/HP` is possible |
| Domain / canonical target | ⚠ `yogabalan.dev` asserted in 6 places, ownership unverified |
| Environment variables needed at runtime | ✅ None (`.env.example` is vestigial) |
| Post-deploy smoke test | ⚠ `vite preview` served `dist/` with HTTP 200 + correct assets (done during audit, port 4173, now stopped) |
| Custom domain DNS/SSL | ❌ Not verifiable from repo |
| Analytics/monitoring | ❌ None (arguably a feature, not a bug) |

**Verdict:** Technically 1 command away from being deployable (`vite build` works), **organisationally not deployable**: no git repo, no host config, unverified domain, and unresolved trust issues (§7) that should be fixed *before* any URL goes public.

**Server status at time of writing:** dev server still running on **port 3000** (PID 28600, log `%TEMP%\ybport-dev.log`). Stop it with `Stop-Process -Id 28600` when finished.

---

## 14. Build, Dependency & Dead-Code Health (Phase 4)

### 14.1 Fresh-clone install FAILS ❌
```
npm install
→ npm error code EBADPEER
  peer esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.1
  conflicting esbuild@"^0.25.0" found in root devDependencies
```
Workaround used for this audit: `npm install --legacy-peer-deps` → **205 packages**, install OK.
→ README's `npm install` step is broken for every new clone. (§17 #5)

### 14.2 Dead dependencies (grep-verified across `src/`, `scripts/`, config)
| Package | Verdict |
|---|---|
| `@google/genai` | ❌ Unused — no imports (AI Studio leftover) |
| `express` + `@types/express` | ❌ Unused — `clean` script even tries to delete a `server.js` that doesn't exist |
| `dotenv` | ❌ Unused |
| `jspdf` | ⚠ Used **only** by orphaned `scripts/generate-resume.js`, which is not referenced by any npm script |
| `tsx` (devDep) | ⚠ Appears intended for the same orphaned script |
| `autoprefixer` (devDep) | ⚠ Tailwind v4/Vite pipeline doesn't reference it in config — likely vestigial (confirm before removal) |

### 14.3 Other hygiene
- `package.json` name is **`"react-example"`** (template default) — visible in npm metadata/`dist` manifest usage.
- `clean` script uses `rm -rf` — **not portable to Windows** (audit ran on win32).
- Dual lockfiles: original `bun.lock` + audit-created `package-lock.json` — choose one.
- `metadata.json` `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` — vestigial AI Studio flag.
- README: stock "Run and deploy your AI Studio app" template, banner from `ai.google.dev`, instructs `GEMINI_API_KEY` setup for an app that never calls Gemini.
- **Lint:** `npm run lint` (`tsc --noEmit`) → **exit 0, zero errors** ✅
- **Build:** `npm run build` → **exit 0** ✅ (only the >500 kB chunk warning)
- No tests exist (no framework configured) — acceptable for a portfolio, noted for roadmap.

---

## 15. Verification Evidence (Commands & Results)

All commands executed 2026-09-28/29 on `C:\Users\HP\Desktop\ybport`, Node v22.14.0 / npm 10.9.2.

| # | Command | Exit | Result |
|---|---|---|---|
| 1 | `npm install` | ❌ ≠0 | `EBADPEER`: root `esbuild@^0.25.0` conflicts with `vite@8.3.1` peer `esbuild@^0.27.0 \|\| ^0.28.0` |
| 2 | `npm install --legacy-peer-deps` | ✅ 0 | 205 packages installed; created `package-lock.json` (audit-only artifact) |
| 3 | `npm run lint` (`tsc --noEmit`) | ✅ 0 | Zero TypeScript errors (TS 7.0.2) |
| 4 | `npm run build` | ✅ 0 | `dist/index.html` 3.44 kB · CSS 60.72 kB (gz 11.31) · JS 563.06 kB (gz 161.03) · warning: chunk >500 kB |
| 5 | `npx vite preview` | ✅ 200 | Correct HTML + hashed assets served (port 4173; stopped after audit) |
| 6 | `npm run dev` (detached) | ✅ running | Port 3000, PID 28600, log `%TEMP%\ybport-dev.log` |
| 7 | Chrome headless + CDP (desktop) | ✅ | **0 console errors · 0 exceptions · 0 failed requests**; 1×h1, 9×h2, 17×h3, 0 img, 139 svg, 16 aria-label, 18 `target=_blank` all with `rel="noopener noreferrer"` |
| 8 | CDP interaction suite | ✅ | terminal (`t`, `neofetch`, dialog semantics, Escape), snake (`g`, canvas, d-pad), blueprint modal, resume modal + Download/Print, IoT filter → 2 cards, skill spec-sheet, `theme dark` → `data-theme="dark"` |
| 9 | CDP mobile emulation 375px | ✅ | Menu, terminal, snake, resume, blueprint all fit; hamburger nav works; **snake header X overlaps hint text** |
| 10 | Overflow sweep 320/375/390/414/768/1024/1440px | ✅ | `scrollWidth == innerWidth` at every width — zero horizontal scroll |
| 11 | `GET api.github.com/repos/yogabalan07/{slug}` ×7 | ❌ 404 ×7 | All 7 project `githubUrl`s dead (see §7.1 for slug mapping) |
| 12 | `GET api.github.com/users/yogabalan07` | ✅ 200 | `public_repos: 24`, `followers: 19` (site claims 18 repos) |
| 13 | `GET api.github.com/users/yogabalan07/repos` | ✅ 200 | Real repos: `connect`, `NRB-Vidyalaya-LMS-`, `Online-Alumni-Networking-Portal-s`, `Training-Attendance-Feedback-Management`, `MPU-6050-3d`, `ybport`, … — **all with 0 stars** |
| 14 | Grep: `eval\|innerHTML\|dangerouslySetInnerHTML\|process.env` in `src/` | — | **No matches** |
| 15 | Grep: `@google/genai\|express\|dotenv` imports | — | **No matches** in src/scripts (dead deps) |
| 16 | `git rev-parse --show-toplevel` (in ybport) | — | `C:/Users/HP` — **no `.git` in project** (`Test-Path ybport\.git` → `False`) |
| 17 | File reads: `robots.txt`, `sitemap.xml`, `index.html`, `README.md`, `.env.example`, `metadata.json` | ✅ | Confirmed §11/§14 findings; **metadata.json mojibake claim retracted** (em-dash, not `?`) |
| 18 | Screenshot review: `shot-320…1440.png`, `cdp-mobile-*.png` | ✅ | Visual identity consistent (paper/blueprint/dark), no clipped text, resume/snake modals legible on mobile |

Artifacts retained (audit-only, outside repo): `C:\Users\HP\AppData\Local\Temp\opencode\` — `audit-cdp.mjs`, `audit-mobile.mjs`, 7 breakpoint screenshots, 6 mobile CDP screenshots.

**Constraint compliance:** no source files edited · no build deployed · no GitHub push · no fabricated metrics · no feature removed · visual identity untouched.

---

## 16. Verified Good — Explicitly Not Problems

Recorded so they are not "fixed" by mistake during remediation:

1. **Visual identity** — paper/blueprint/dark themes, washi-tape, doodles, handwriting fonts. Preserve exactly.
2. **No horizontal overflow at any width 320→1440px.** (Tested, not assumed.)
3. **Zero console errors / zero failed requests** on the tested paths.
4. **Zero `<img>` tags** — all-inline-SVG asset strategy; keep it (it's the reason performance is good).
5. **All 18 `target="_blank"` links carry `rel="noopener noreferrer"`.**
6. **Terminal is inert** — a client-side command switch with no shell/FS/env access. It *looks* like a security risk; it is not. Do not "harden" it into a backend.
7. **Heading structure (1 h1 / 9 h2 / 17 h3)** and dialog semantics (`role`/`aria-modal`/labels/focus-trap/Escape) are correct.
8. **`npm run lint` and `npm run build` both exit 0** — no compile errors to fix.
9. **`display=swap` is already set** on Google Fonts; the font situation is a priority issue, not a correctness one.
10. **Reduced-motion CSS block exists** (`src/index.css:176`) — the gap is only JS-animation wiring, not a missing stylesheet.
11. **No secrets anywhere** in the repo or the bundle.
12. **Content architecture** — all copy lives in `src/data/portfolioData.ts`; fixes to facts are single-file edits, not archaeology.
13. **Theme persistence + boot-once-per-session** behavior works and should not be "simplified".
14. **`metadata.json`** — clean UTF-8; earlier mojibake flag was a terminal-encoding false positive.

---

## 17. Problems — Ranked

### 🔴 CRITICAL
**None.** Nothing crashes, exposes data, or corrupts the build.

### 🟠 HIGH
**#1 — Every project GitHub link 404s (7/7).**
`portfolioData.ts` `githubUrl` slugs don't exist under `yogabalan07`. Every "View Code" click lands on GitHub's 404. Fix: map to real slugs (`connect`, `NRB-Vidyalaya-LMS-`, `Online-Alumni-Networking-Portal-s`, `Training-Attendance-Feedback-Management`, …); for the 2 projects with no public repo, either publish the repo or replace the button with "Source not public" — **do not invent URLs.**

**#2 — Contact form is fiction.**
`Contact.tsx:25-30` writes to `localStorage["yogabalan_portfolio_messages"]` (visitor's own browser). Yet `Contact.tsx:200` says *"I've received your message and will reply… within 24 hours"* and `Contact.tsx:279` says *"Dispatches directly to Yogabalan B R's verified contact queue."* The owner receives **nothing**. Fix (choose one): a form endpoint (Formspree/Basin/Cloudflare Pages Functions), `mailto:` fallback, or honest UI copy + visible direct email/GitHub/LinkedIn links. No fake APIs per constraints.

**#3 — Invented/misleading GitHub metrics.**
Synthetic `Math.sin` heatmap (`GitHubSection.tsx:32`) labelled `"${commitCount} contributions"` (`:173`), headline "486 contributions" (`portfolioData.ts:288`); hardcoded stars 12/9/14/8 vs **0 real stars**; `publicRepos: 18` vs **24 actual**. Fix: use only live API fields, drop star badges or fetch them from the API, and either wire a real contributions source or re-label the heatmap as illustrative ("pattern", not counts).

**#4 — Wrong LinkedIn URL in 4 files.**
Code uses `linkedin.com/in/yogabalan07`; owner says `linkedin.com/in/yogabalan-b-r-400a483a`. Appears in `portfolioData.ts:14`, `index.html:38` (JSON-LD), `ResumeModal.tsx:29` **and** `:204` (built from `githubUsername` — must de-couple), `TerminalModal.tsx:409`. **Confirm the correct profile with the owner before editing.**

### 🟡 MEDIUM
**#5 — Fresh `npm install` fails (EBADPEER).** Root `esbuild@^0.25.0` vs Vite 8's `^0.27 || ^0.28`. Fix: bump devDep esbuild (or drop it — Vite bundles its own), delete `--legacy-peer-deps` from docs.

**#6 — "Repositories: n verified" wording** in terminal `neofetch` (`TerminalModal.tsx:356`) asserts verification that never happens. Reword to "Repositories: n" or fetch live.

**#7 — Single 563 kB JS chunk, no code splitting.** Modal/section-level `React.lazy` for Terminal/Snake/Blueprint/Resume would cut initial payload meaningfully.

**#8 — Unverified canonical domain `yogabalan.dev`** asserted in `index.html:10,14`, `robots.txt:4`, `sitemap.xml:4`. Confirm ownership or replace with the actual deploy URL before launch.

**#9 — Snake header overlap on mobile** — hint text under close button (`SnakeGameModal.tsx:403-409` vs `:393`). One-line padding/wrap/`hidden sm:inline` fix.

**#10 — `twitter:card=summary_large_image` with no `og:image`/`twitter:image`** — social previews will be imageless. Needs one static PNG/OG image (new asset, allowed — it's missing content, not invented content).

**#11 — Reduced-motion not wired to JS animations.** Add `MotionConfig reducedMotion="user"` (or `useReducedMotion()` gates) in `App.tsx`; CSS block alone doesn't stop `motion` transforms.

**#12 — README + `.env.example` instruct a broken/misleading setup** (`npm install`, `GEMINI_API_KEY`) for a Gemini-free app.

### 🟢 LOW
**#13 — Dead deps:** `@google/genai`, `express`, `@types/express`, `dotenv` (+ likely `autoprefixer`, orphaned `jspdf`/`tsx` chain).
**#14 — `Contact.tsx:25` unguarded `JSON.parse`** of localStorage can throw on corrupted data.
**#15 — BootLoader advertises `[Esc]` skip that doesn't work** (`BootLoader.tsx:92-101`).
**#16 — No `.git` in project folder**; parent repo is `C:/Users/HP` (accidental home-repo staging risk).
**#17 — `package.json` name `"react-example"`**; `clean` script `rm -rf` not Windows-portable; dual lockfiles (`bun.lock` vs audit-created `package-lock.json`).
**#18 — No `og:image` asset / no social card** (shares MEDIUM #10's remedy).
**#19 — Work-experience entry "Touchmark Descience Pvt Ltd (2026)"** not in owner-supplied facts — confirm accuracy (§7.5).
**#20 — No tests, no CI, no `npm audit` scan** — acceptable now; add before scaling.

---

## 18. Phased Roadmap

> Order = trust first, then build health, then polish. Each phase is independently shippable; nothing requires a redesign.

### Phase A — Truth & Trust (must ship before any public URL) — *5–8 h*
1. Map/repair all 7 `githubUrl`s; remove or honest-label repos with no public source (#1).
2. Fix contact form: real delivery channel OR honest copy + direct contact links (#2).
3. Replace synthetic GitHub claims: heatmap labelling, stars, `publicRepos`, "486", "verified" (#3, #6).
4. Confirm + correct LinkedIn in all 4 locations, de-couple from `githubUsername` (#4).
5. Confirm `yogabalan.dev` ownership; align canonical/OG/robots/sitemap or swap to real URL (#8).

### Phase B — Build & Repo Health — *2–4 h*
6. Fix esbuild peer conflict so plain `npm install` works (#5).
7. Remove dead deps (`@google/genai`, `express`, `@types/express`, `dotenv`; decide `autoprefixer`, `jspdf`, `tsx`) (#13).
8. Rewrite README (real setup, no Gemini), fix `.env.example`, rename package, portable `clean`, pick one lockfile (#12, #17).
9. `git init` **inside** `ybport` + `.gitignore` (dist, node_modules, .env*) + first commit; decide remote (#16).

### Phase C — Performance — *3–5 h*
10. `React.lazy`/`Suspense` for the four modals; verify 0 console errors post-split (#7).
11. Bundle baseline (rollup visualizer + Lighthouse run) to record before/after.
12. Optional: self-host/preload the 4 font families to drop third-party RTT.

### Phase D — Accessibility & UX Polish — *2–4 h*
13. `MotionConfig reducedMotion="user"` (+ verify all `motion` entrances respect it) (#11).
14. Snake header overlap fix (#9); BootLoader `[Esc]` behavior (#15); `try/catch` around localStorage parse (#14).
15. Run axe-core sweep; fix anything it flags (forms/labels/contrast).

### Phase E — SEO & Launch — *3–5 h*
16. Create one `og:image` social card; add `og:image` + `twitter:image` (#10, #18).
17. Choose host (Vercel/Netlify/Cloudflare Pages — static `dist/`), add config + deploy, verify post-deploy smoke test.
18. Verify robots/sitemap at the live URL; submit Search Console; confirm structured data with Rich Results Test.
19. Owner-verify Touchmark internship entry (#19); `npm audit` + CVE review (#20).

**Total estimate: ~15–26 focused hours across 5 phases.** Phases A+B alone (~7–12 h) make the site honest and installable; C+D+E are launch hardening.

---

## 19. Completion Estimate

| Dimension | Status | Completion |
|---|---|---|
| Visual design / identity | Final; premium, distinctive, consistent across 3 themes | **100%** |
| Content sections (10/10) | All present with real content | **100%** |
| Embedded visuals (Phase 3) | Doodles, blueprint modals, themed snake/terminal — genuine | **100%** |
| Core interactions (modals, filters, themes, shortcuts) | All verified working | **100%** |
| Responsive/mobile | Verified 320→1440, one cosmetic overlap | **98%** |
| Accessibility | Strong semantics; JS reduced-motion gap | **85%** |
| SEO technical base | Meta/JSON-LD/robots/sitemap present; domain + OG image gaps | **75%** |
| Performance | Good, but single 563 kB chunk, no splitting | **75%** |
| **Content truthfulness (links/metrics/claims)** | 7 dead links, fake contact delivery, synthetic metrics | **40%** |
| Build/install reproducibility | Build+lint pass; fresh install fails | **70%** |
| Deployment readiness | No git repo, no host config, no CI | **30%** |
| Tests | None | **0%** |

**Overall: ~80% feature-complete, ~60% launch-ready.**
The gap between those two numbers is entirely Phase A (honesty) + Phase B/E (packaging). No architectural rework is required — every remaining item is a contained edit to known files, primarily:

`src/data/portfolioData.ts` · `src/components/Contact.tsx` · `src/components/GitHubSection.tsx` · `src/components/TerminalModal.tsx` · `src/components/ResumeModal.tsx` · `index.html` · `package.json` · `README.md` · `public/robots.txt` · `public/sitemap.xml`

**Status at hand-off:** audit complete; **zero source changes made**; awaiting owner approval before implementing any Phase A item. Dev server still on port 3000 (PID 28600).

---
---

# Phase A Completion

Phase A (Truth & Trust) executed on 2026-09-29 after owner approval. No redesign, no feature removal, no fake functionality, no deployment, no git operations.

## A.1 Project GitHub Links — **PARTIALLY FIXED / 3 REQUIRE REAL-WORLD CONFIGURATION**

**Verification method:** GitHub REST API — full repo listing for `yogabalan07` (24 repos) + per-repo README/tree inspection to confirm identity before linking.

| Project | BEFORE | AFTER | Status |
|---|---|---|---|
| CONNECT | `…/connect-academic-portal` → **404** | `…/connect` (README: "campus academic discussion platform" ✅ identity match) | **FIXED** |
| NRB Vidyalaya LMS | `…/nrb-vidyalaya-lms` → **404** | `…/NRB-Vidyalaya-LMS-` (README match ✅) | **FIXED** |
| Alumni Portal | `…/alumni-networking-portal` → **404** | `…/Online-Alumni-Networking-Portal-s` (README match ✅) | **FIXED** |
| Training Attendance | `…/training-attendance-feedback` → **404** | `…/Training-Attendance-Feedback-Management` (attendance/feedback routes + pages verified in tree ✅) | **FIXED** |
| ESP32 LoRa Morse | `…/esp32-lora-communicator` → **404** | **No repo exists** (no LoRa/Morse candidate among 24 repos) → `githubUrl` removed, button hidden | **REQUIRES REAL-WORLD CONFIGURATION** (publish repo, then add URL) |
| Self-Balancing Robot | `…/self-balancing-robot-pid` → **404** | **No verified repo** — `MPU-6050-3d` contains only an IMU orientation sketch (roll/pitch, no PID/motors), so it is NOT linked → button hidden | **REQUIRES REAL-WORLD CONFIGURATION** |
| Enterprise BMS | `…/enterprise-bms-frontend` → **404** | **No verified repo** — `Team-5` has similar domain but conflicting stack (Firebase vs claimed Spring Boot) and no verifiable identity → button hidden | **REQUIRES REAL-WORLD CONFIGURATION** |

**UI graceful handling (new behavior):** `Project.githubUrl` is now optional (`src/types/portfolio.ts`); GitHub buttons render conditionally in `Projects.tsx`, `ProjectBlueprintModal.tsx`, `TerminalModal.tsx`, and the text-CV export omits the line entirely when absent. No dead links, no profile-redirect shortcuts, no invented URLs.

**Files:** `src/types/portfolio.ts`, `src/data/portfolioData.ts`, `src/components/Projects.tsx`, `src/components/ProjectBlueprintModal.tsx`, `src/components/TerminalModal.tsx`, `src/components/ResumeModal.tsx`
**Verification:** preview run → exactly **4** `aria-label="GitHub Repository"` links, all pointing to the 4 verified repos; blueprint modal for the ESP32 card shows **0** "View Repository" links; `projects lora` in terminal shows 0 GitHub Repo links. Grep confirms zero old slugs.

## A.2 Contact Form Honesty — **FIXED** (mailto primary; real service = optional future config)

- BEFORE: form wrote to visitor's own `localStorage["yogabalan_portfolio_messages"]`; success screen said *"I've received your message and will reply … within 24 hours"*; footnote claimed *"Dispatches directly to Yogabalan B R's verified contact queue"*; button said "Transmitting…".
- AFTER: `handleSubmit` validates fields, builds a `mailto:` URL (moved above the handler, no duplicated constant), navigates the visitor's own email client, then shows **"Email Draft Ready ✓"** with: *"…Press **Send** there to complete delivery — nothing was sent from this page yet."* + fallback (*"No email client opened? Copy the address…"*) + **Reopen Email Draft** / **Back to Edit** (values preserved). Footnote: *"Opens your email app with this message pre-filled — nothing is sent until you press Send in your email client."* Button: "Preparing Email… / Open Email Draft". Header scribble: "Opens your email app"; email-card scribble: "// fastest: email" (was "// replies < 24h"). **localStorage write removed entirely.**
- **Files:** `src/components/Contact.tsx`
- **Verification (CDP, preview build):** `draftReady:true`, `honestCopy:true`, `noReceived:true`, `no24h:true`, `noDispatchClaim:true`, `localStorageClean:true`, `hasReopen:true`, `hasFallback:true`, URL unchanged; screenshot `pa-contact-success.png` confirms design intact.
- **REQUIRES REAL-WORLD CONFIGURATION (optional, later phase):** a real delivery backend (Formspree/Cloudflare Functions) if the owner wants in-page sending instead of mailto.

## A.3 GitHub Statistics — **FIXED**

- BEFORE: metric tiles "Total Contributions 486+" (hardcoded `GITHUB_STATS.totalContributionsLastYear`) and "Stars Accrued 24" (`starsEarned`); heatmap titled *"Annual Commit Heatmap (486 in last year)"* with per-cell `Math.sin`-generated counts shown as `"N contributions"` tooltips and hover readouts; `publicRepos` fallback 18; featured repos were **4 non-existent repos with fabricated stars/forks (12/9/14/8)**; unused invented `primaryLanguages` percentages (38/34/16/12).
- AFTER: tiles = **Public Repositories 24** (live API + verified fallback, live-sync dot) · **Followers 19** (live API + verified fallback, live-sync dot) · **Primary Core Focus: C++ & TypeScript** (qualitative, no metric). Heatmap retitled **"Contribution Activity Visualization"** with permanent note *"Decorative notebook pattern — not real GitHub contribution history."*, legend "Light/Dense", all cell tooltips → *"Decorative pattern cell (not real contribution data)"*; **all commit counts, hover counts and the 486 figure deleted**. Featured repos = the **4 verified repos** with README-accurate descriptions, real API languages (TypeScript) and **real 0★/0 forks**. Fields `totalContributionsLastYear`, `starsEarned`, `primaryLanguages` removed from `GITHUB_STATS`. Terminal `github` command: "Public repositories: 24" + "Counts verified via the public GitHub API" (no contributions line, no "verified" over-claim).
- **Files:** `src/data/portfolioData.ts`, `src/components/GitHubSection.tsx`, `src/components/TerminalModal.tsx`
- **Verification:** DOM probes → heading present, decorative note present, old phrases `["486","Stars Accrued","Total Contributions","contributions logged","Annual Commit Heatmap"]` = **none found**; tiles render **24 / 19 / C++ & TypeScript** (screenshot `pa-github-card.png`); featured links = exactly the 4 verified repos; all heatmap tooltips decorative.
- **REQUIRES REAL-WORLD CONFIGURATION (optional):** real contribution history needs an authenticated GitHub token/GraphQL — not wired (would be a secret-handling decision for a later phase).

## A.4 LinkedIn URL — **FIXED**

- BEFORE: `https://linkedin.com/in/yogabalan07` in `portfolioData.ts:14`, `index.html` JSON-LD `sameAs`, `ResumeModal.tsx:29` (text CV) and `:204` (header — both derived from `githubUsername`, wrongly coupling LinkedIn to the GitHub handle), `TerminalModal.tsx:409` (hardcoded display).
- AFTER: `https://linkedin.com/in/yogabalan-b-r-400a483a` (owner-provided) is the single source in `PERSONAL_INFO.linkedin`; new `LINKEDIN_HANDLE` export derived from that URL (no duplicated constant); ResumeModal header + text CV and TerminalModal display all use it; JSON-LD `sameAs` corrected. GitHub URLs untouched.
- **Files:** `src/data/portfolioData.ts`, `index.html`, `src/components/ResumeModal.tsx`, `src/components/TerminalModal.tsx`
- **Verification:** all `a[href*="linkedin.com/in/"]` → count 3, `allCorrect:true`, unique = the new URL only; resume modal text contains new handle, not old; repo-wide grep for `linkedin.com/in/yogabalan07` → **0 matches**.

## A.5 Canonical / Domain References — **FIXED** (serving config REQUIRES REAL-WORLD CONFIGURATION)

- BEFORE: `<link rel="canonical" href="https://yogabalan.dev/">`, `og:url` = yogabalan.dev, `robots.txt` → `Sitemap: https://yogabalan.dev/sitemap.xml`, `sitemap.xml` with `<loc>https://yogabalan.dev/</loc>`. (`twitter:url` was never present; JSON-LD `url`/`sameAs` point to the verified GitHub profile.)
- AFTER: canonical tag **removed** (no unverified ownership claim), `og:url` **removed** (comment in `index.html` explains why), `robots.txt` reduced to `User-agent: * / Allow: /`, **`sitemap.xml` deleted** (an absolute-URL file cannot exist truthfully before the domain is known). JSON-LD kept with verified GitHub/LinkedIn profile URLs. `og:title/description/type/site_name`, title, description, favicon all retained.
- **Files:** `index.html`, `public/robots.txt`, `public/sitemap.xml` (deleted)
- **Verification:** DOM probes → `canonical: null`, `ogUrl: null`, `ogTitlePresent: true`; grep across repo (excl. this audit file) → **0 matches** for `yogabalan.dev`.
- **REQUIRES REAL-WORLD CONFIGURATION:** after deployment, add canonical + `og:url` + `Sitemap:` line + `sitemap.xml` using the verified production URL (Phase E of the roadmap).

## A.6 Resume Modal Audit — **FIXED** (one item = owner confirmation)

Audit of every field: email/GitHub/education/experience/achievements all render directly from `PERSONAL_INFO`/`EDUCATION`/`EXPERIENCE`/`ACHIEVEMENTS` (single source — consistent by construction). Issues found and fixed:
- LinkedIn built from `githubUsername` → now `PERSONAL_INFO.linkedin` / `LINKEDIN_HANDLE` (2 spots: header + text CV). **FIXED**
- Text CV printed `GitHub: undefined`-capable raw `p.githubUrl` → now conditional (`p.githubUrl ? … : ''`). **FIXED**
- Button title claimed *"Download **verified** PDF resume"* → "Download PDF resume". **FIXED**
- No portfolio/domain URL present anywhere in the modal → nothing to remove. **OK**
- Skills strings in the skill matrix were hand-written but reconcile with the `SKILLS` data (no contradictions found). **OK**
- "Web Development Intern — Touchmark Descience Pvt Ltd (2026)" exists in `EXPERIENCE` and is owner-authored content not present in the original fact sheet → **REQUIRES REAL-WORLD CONFIGURATION (owner confirmation)** — left unchanged (no invented edits, no removals).
- **Files:** `src/components/ResumeModal.tsx`
- **Verification:** resume modal opens; text contains new LinkedIn, no `linkedin.com/in/yogabalan07`; lint passes.

## A.7 Terminal Truthfulness — **FIXED**

- BEFORE: `status` printed hardware rows `ESP32 ONLINE`, `SENSORS ONLINE`, `LoRa CONNECTED (433MHz)`, `MQTT CONNECTED`, `NOMINAL [60fps]` under "SYSTEM TELEMETRY STATUS"; header "YB TERMINAL // PORTFOLIO CLI"; intro had no simulation disclaimer; boot line "connecting engineering database…"; `github` claimed "Repositories: n verified" + "486+ contributions"; `neofetch` claimed "7 Production Systems"; `help` advertised "System telemetry & status".
- AFTER: `status` → header **"SYSTEM STATUS // SIMULATION MODE"** + note **"Portfolio system visualization — hardware telemetry not connected."**; all four hardware rows → **"SIMULATION MODE"** (amber, non-pulsing); system row → "PORTFOLIO UI ACTIVE" (60fps claim removed). Window title → **"YB TERMINAL // PORTFOLIO CLI (SIMULATION)"**. Intro adds *"Front-end simulation — no shell or hardware is connected."* `neofetch` adds `TERMINAL : Front-end simulation, no shell connected` and "(simulation)" in SYSTEM, "7 Portfolio Projects". `github`/`help` reworded as above; boot line → "loading engineering notebook…". `hardware` command already carried its "Simulated device specification profiles" note (kept). `projects` list unchanged. Fun preserved: coffee/matrix/sudo/build/theme easter eggs untouched. Frontend-only: no code path executes OS commands (no eval/exec/fetch-to-shell).
- **Files:** `src/components/TerminalModal.tsx`
- **Verification (CDP):** `status` → simLabel ✓, notConnectedNote ✓, no "ESP32 ONLINE" ✓, no "CONNECTED (433MHz)" ✓, no "[60fps]" ✓; title `(SIMULATION)` ✓; intro note ✓; `github` shows "Public repositories: 24", no 486 ✓; `neofetch` `(simulation)` ✓, no "Production Systems" ✓; terminal still opens on `t`, accepts commands, closes on Escape, dialog ARIA intact.

## A.8 Installation / Dependencies — **FIXED**

- Diagnosis: root devDependency `esbuild@^0.25.0` conflicted with Vite 8's peer range `^0.27.0 || ^0.28.0` → fresh `npm install` failed with EBADPEER. esbuild, `autoprefixer`, `tsx`, `@google/genai`, `dotenv`, `express`, `@types/express` had **zero references** in src/config/scripts (grep-verified) — template leftovers. Intended package manager: **npm** (README documented it; `bun.lock` exists but bun is not available on this machine — `bun.lock` left untouched as an owner file, now stale/self-healing on next bun run).
- Fix: removed `esbuild`, `autoprefixer`, `tsx`, `@types/express`, `@google/genai`, `dotenv`, `express` from `package.json`. Kept `jspdf` (used by `scripts/generate-resume.js`). **No `--force`, no `--legacy-peer-deps`.**
- Clean-slate test: deleted `node_modules` + old lockfile → plain **`npm install` → exit 0, 72 packages, 0 vulnerabilities** (was 205 packages). `package-lock.json` regenerated as the legitimate npm lockfile.
- README rewritten with the actual working commands (`npm install`, `npm run dev` → localhost:3000, `npm run lint`, `npm run build`, `npm run preview`), correct prerequisites, "no env vars needed", and notes on mailto/GitHub-stats behavior. The AI Studio banner + GEMINI_API_KEY instructions are gone.
- **Files:** `package.json`, `package-lock.json` (regenerated), `README.md`
- **Verification:** `npm install` exit 0 (no flags) · `npm run lint` exit 0 · `npm run build` exit 0 · `npm audit`: 0 vulnerabilities.

## A.9 Mobile Snake Header — **FIXED**

- BEFORE: hint `// press 'G' or 'Esc'` shared a non-wrapping flex row with the eyebrow while the absolute close (X) button sat at `top-4 right-4`; on ≤414px the hint ran into the X's focus-ring zone (screenshot `cdp-mobile-snake.png` in the original audit).
- AFTER: header wrapper `pr-14 sm:pr-12` (clears the X at every width) and the row is now `flex flex-wrap items-center gap-x-2 gap-y-0.5` so the hint wraps onto its own line instead of reaching the button. **No redesign** — same fonts, colors, elements.
- **Files:** `src/components/SnakeGameModal.tsx`
- **Verification (CDP rect measurements, preview build):** at **320 / 375 / 390 / 414 px** → `overlap: false`, clearance gap **111 / 166 / 181 / 205 px**, close button fully inside viewport, title visible, hint text intact, **no horizontal scroll**; d-pad verified present with aria-labels `Move Up/Left/Down/Right` + `Enable sound/Pause/Restart`, canvas renders; screenshot `pa-snake-320.png` confirms layout.

## A.10 Code Quality Constraints — **HELD**

TypeScript typing preserved (`githubUrl?: string`, no `any` introduced) · no duplicated constants (LinkedIn handle derived from one URL) · all content reuses `portfolioData` exports · zero new dependencies · dialog ARIA (`role/aria-modal/aria-labelledby`), `useFocusTrap`, Escape-to-close, focus rings all verified working after edits · animations untouched (Motion entrance/exit unchanged, `prefers-reduced-motion` CSS untouched) · `npm run lint` (`tsc --noEmit`) exit **0**.

## A.11 Full Verification Results

| # | Check | Result |
|---|---|---|
| 1 | `npm run lint` (tsc 7.0.2) | **exit 0** |
| 2 | typecheck (`tsc --noEmit` = lint) | **exit 0** |
| 3 | `npm run build` (production) | **exit 0** — `dist/index.html` 3.40 kB · CSS 61.27 kB (gz 11.42) · JS 562.95 kB (gz 161.00) · written 07:57 · (pre-existing >500 kB chunk warning = Phase C) |
| 4 | `vite preview` | **HTTP 200**, all verification run against it |
| 5 | Grep: `yogabalan.dev` | **0 matches** (excl. this audit doc) |
| 6 | Grep: `linkedin.com/in/yogabalan07` | **0 matches** |
| 7 | Grep: `within 24 hours` / `I've received` / `Dispatches directly` / `verified contact queue` | **0 matches** |
| 8 | Grep: `486` / `starsEarned` / fake star counts / `totalContributions` | **0 matches** |
| 9 | Grep: old 404 repo slugs | **0 matches** (only internal project `id`s like `nrb-vidyalaya-lms` remain, which are React keys — not URLs) |
| 10 | Grep: `yogabalan_portfolio_messages` / `Message Sent` | **0 matches** |
| 11 | Browser console (full interaction suite, 3 CDP runs) | **0 errors, 0 exceptions, 0 warnings, 0 failed requests** (`consoleTotal: 0`) |
| 12 | Overflow sweep 320→1440 | no horizontal scroll at any width |
| 13 | `npm audit` | **0 vulnerabilities** |

## A.12 Files Changed (Phase A)

| File | Change |
|---|---|
| `src/types/portfolio.ts` | `githubUrl` → optional |
| `src/data/portfolioData.ts` | LinkedIn fix + `LINKEDIN_HANDLE`; 4 verified repo URLs; 3 dead URLs removed; `GITHUB_STATS` rewritten to verified data |
| `src/components/Projects.tsx` | conditional GitHub button |
| `src/components/ProjectBlueprintModal.tsx` | conditional View Repository button |
| `src/components/Contact.tsx` | mailto workflow + truthful copy; localStorage write removed |
| `src/components/GitHubSection.tsx` | verified tiles, decorative heatmap labelling, real featured repos |
| `src/components/TerminalModal.tsx` | simulation labelling, honest github/neofetch, LinkedIn handle, conditional repo link |
| `src/components/ResumeModal.tsx` | LinkedIn de-coupled, conditional CV GitHub line, "verified" title removed |
| `src/components/SnakeGameModal.tsx` | header clearance + wrap fix |
| `index.html` | canonical/og:url removed, JSON-LD LinkedIn fixed |
| `public/robots.txt` | yogabalan.dev Sitemap line removed |
| `public/sitemap.xml` | **deleted** (wrong-domain URL; recreate at launch) |
| `package.json` | 7 unused deps removed (esbuild conflict root cause) |
| `package-lock.json` | regenerated by clean `npm install` |
| `README.md` | real setup commands, no AI Studio/Gemini instructions |

*Untouched:* `App.tsx`, all other components, `vite.config.ts`, `tsconfig.json`, styling, animations, `bun.lock` (owner file), `metadata.json`, `.env.example`, `public/resume-yogabalan.pdf`.

## A.13 Remaining Launch Blockers (post–Phase A)

1. **REQUIRES REAL-WORLD CONFIGURATION** — deployment target/URL unknown (no git repo in project, no host config): canonical + og:url + sitemap must be added after the domain exists.
2. **REQUIRES REAL-WORLD CONFIGURATION** — 3 projects have no public repos (ESP32 LoRa, Self-Balancing Robot, Enterprise BMS): publish repos → add verified URLs.
3. **REQUIRES OWNER CONFIRMATION** — Touchmark internship entry; existence of the new LinkedIn profile (owner-provided, not machine-verifiable); `connect` repo is Firebase-backed while the portfolio lists React/Node/PostgreSQL for it (content accuracy question, deliberately NOT edited in Phase A).
4. Optional: real contact-delivery backend; authenticated contributions data; `bun.lock` retirement decision (Phase B/E).

**Git safety:** no `git init/add/commit/push` performed; no git history touched. Phase A ends here — Phase B not started.
