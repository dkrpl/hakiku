# HAKIKU Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete static SPA prototype for **HAKIKU (Hak dan Kewajibanku)** implementing PT-01 through PT-07, custom 2D storybook SVG assets, Web Audio SFX, Mode Guru Mini, and full WCAG AA + Antislop compliance.

**Architecture:** Vite + React + Tailwind CSS SPA with centralized content in `src/data/hakikuData.js`, pure state and validation helpers in `src/utils/storage.js`, Web Audio synthesizer in `src/utils/sound.js`, custom storybook SVG art in `public/assets/hero-hakiku.svg` and `src/components/illustrations/`, and dedicated modular screens for Intro, World Map, Rooms 1-5, Finale, and Mode Guru modal.

**Tech Stack:** React 19, Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`), Vitest, React Testing Library, `@testing-library/user-event`, jsdom.

**Spec:** `docs/superpowers/specs/2026-11-22-hakiku-prototype-design.md`

## Global Constraints

- Language: Indonesian (`<html lang="id">`), natural copy without em dashes (`—`), AI buzzwords, or decorative emojis.
- Palette: `#FBF8F1` parchment canvas, `#FFFFFF` card surface, `#14261C` ink, `#3D5245` muted ink, `#6F634F` border ink, `#186A42` / `#E6F4EC` green, `#155E95` / `#E6F2FA` blue, `#F2B705` / `#FEF5D6` gold accent, `#B91C1C` / `#FEE2E2` error semantic. All pairs verified WCAG AA.
- Typography: `Baloo 2` display headings, `Nunito` body/UI controls, fluid `clamp()` scale readable on 16:9 smartboards (1366x768 to 1920x1080), tablets (768px), and mobile phones (375px) with zero horizontal overflow and minimum 44x44px tap targets.
- Accessibility: native buttons/links, base-layer `cursor: pointer` / `not-allowed`, visible `:focus-visible` ring (`#155E95`), modal focus traps + Escape close, WCAG 2.5.7 drag alternatives, `prefers-reduced-motion` compliance, `<img fetchPriority="high" width height>` for hero visual.
- Persistence: single `localStorage` key `hakiku_prototype_state_v1` with `try/catch` memory fallback.

## Review Focus

1. Corrupted or partially missing JSON in `localStorage` (e.g., manual edit or quota error) must safely fall back to defaults without crashing the app.
2. Malicious or non-HTTP URLs (`javascript:alert(1)`, empty string, malformed text) entered in Mode Guru for Blooket or YouTube must be rejected with clear error messages and never written into `<a href>` or `<iframe src>`.
3. Turning `Mode Demo Sidang` OFF while the user is currently inside an un-earned room (e.g., Room 4 or 5) must redirect to `WorldMapScreen` with a visible status notice so the user is never stranded in a locked room.
4. Non-contiguous room completions made while `Mode Demo Sidang` was ON (e.g., completing Room 5 without completing Room 1) must still enforce contiguous sequential locking once `Mode Demo Sidang` is turned OFF, and `FinaleScreen` must truthfully report incomplete rooms.
5. Room 2 card sorting must work identically via pointer drag-and-drop, tap-select + tap-zone, and keyboard buttons, never duplicating a card or locking the board after a wrong drop.

---

### Task 1: Project Scaffolding, Tailwind Theme, Base Styles & Hero Asset

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/index.css`, `public/assets/hero-hakiku.svg`, `src/test/setup.js`

**Interfaces:**
- Produces: runnable Vite + React + Tailwind CSS + Vitest environment, CSS design tokens and base pointer-cursor/focus-ring rules, static hero SVG at `/assets/hero-hakiku.svg` (`640x440`).

- [ ] **Step 1:** Create `package.json`, `vite.config.js`, `index.html`, `src/index.css`, `src/test/setup.js`, and install dependencies (`npm install`).
- [ ] **Step 2:** Create custom 2D storybook adventure hero illustration `public/assets/hero-hakiku.svg` (640x440 viewBox using exact HAKIKU palette).
- [ ] **Step 3:** Verify `npx vitest --version` and `npm run build` tooling work cleanly.

---

### Task 2: Centralized Content Data, Pure State/Validation Logic & Web Audio SFX (TDD)

**Files:**
- Create: `src/data/hakikuData.js`, `src/utils/storage.js`, `src/utils/sound.js`
- Test: `src/utils/storage.test.js`

**Interfaces:**
- Produces:
  - `HAKIKU_DATA` (rooms 1..5, Room 1 reading & quiz, Room 2 6 Hak/Kewajiban cards, Room 3/4 blueprint data, Room 5 warmup & Blooket defaults, `DEFAULT_PIN = '1234'`, `DEFAULT_SECRET_CODE = 'HAKIKU'`)
  - `STORAGE_KEY`, `createDefaultState()`, `loadState(storage?)`, `saveState(state, storage?)`, `isRoomUnlocked(state, roomNumber)`, `isFinaleAccessible(state)`, `countCompletedRooms(state)`, `validateHttpUrl(raw)`, `parseYoutubeEmbedUrl(raw)`, `matchesSecretCode(input, expected)`
  - `soundFx`: `{ playClick, playCorrect, playWrong, playUnlock, playVictory }`

- [ ] **Step 1:** Write failing unit tests in `src/utils/storage.test.js` covering default state, sequential lock chain, Demo Mode non-contiguous re-locking, corrupted JSON recovery, HTTP URL validation (rejecting `javascript:`), YouTube URL parsing, and case-insensitive secret code matching.
- [ ] **Step 2:** Run `npm test -- src/utils/storage.test.js` and verify RED failure.
- [ ] **Step 3:** Implement `src/data/hakikuData.js`, `src/utils/storage.js`, and `src/utils/sound.js`.
- [ ] **Step 4:** Run `npm test -- src/utils/storage.test.js` and verify GREEN pass.

---

### Task 3: Custom 2D Storybook Icons, Illustrations & Shared Navigation/Modals

**Files:**
- Create: `src/components/icons/StoryIcons.jsx`, `src/components/illustrations/StoryArt.jsx`, `src/components/LayoutHeader.jsx`, `src/components/RoomFooterNav.jsx`, `src/components/UnlockModal.jsx`, `src/components/TeacherModeModal.jsx`, `src/components/ErrorBoundary.jsx`

**Interfaces:**
- Consumes: `HAKIKU_DATA`, `validateHttpUrl`, `parseYoutubeEmbedUrl`, `soundFx`
- Produces: Reusable accessible chrome, focus-trapped modals (`UnlockModal`, `TeacherModeModal`), custom 2D SVG art components (`HakikuCrest`, `RoomLandmarkArt`, `SortCardArt`, `GoldenKeyArt`, `TrophyFinaleArt`).

- [ ] **Step 1:** Build `StoryIcons.jsx` and `StoryArt.jsx` with consistent 2D storybook ink outlines (`#14261C`) and HAKIKU palette.
- [ ] **Step 2:** Build `LayoutHeader.jsx`, `RoomFooterNav.jsx`, `UnlockModal.jsx`, `TeacherModeModal.jsx` (PIN keypad + switch + URL/code editors + 2-step reset), and `ErrorBoundary.jsx`.

---

### Task 4: Screens (Intro, World Map, Rooms 1-5, Finale) & Main App Wiring (TDD Integration)

**Files:**
- Create: `src/screens/IntroScreen.jsx`, `src/screens/WorldMapScreen.jsx`, `src/screens/Room1Screen.jsx`, `src/screens/Room2Screen.jsx`, `src/screens/PlaceholderRoomScreen.jsx`, `src/screens/Room5Screen.jsx`, `src/screens/FinaleScreen.jsx`, `src/App.jsx`, `src/main.jsx`
- Test: `src/App.test.jsx`

**Interfaces:**
- Consumes: all utilities, data, icons, illustrations, header/footer/modals.
- Produces: Complete interactive SPA routed cleanly in-memory with top-level screen focus management and Demo Mode off-guard.

- [ ] **Step 1:** Write failing integration tests in `src/App.test.jsx` verifying all 5 PRD acceptance criteria plus Review Focus cases (locked room guard, Room 1 quiz, Room 2 sorting with wrong & right drops, Room 3/4 demo flow, Mode Guru PIN + Demo Mode toggle-off redirect + live Blooket URL update + 2-step Reset, Room 5 secret code -> Finale real status, audio mute persistence).
- [ ] **Step 2:** Run `npm test -- src/App.test.jsx` and verify RED failure.
- [ ] **Step 3:** Implement all 7 screens + `src/App.jsx` + `src/main.jsx`.
- [ ] **Step 4:** Run full test suite `npm test` and verify GREEN pass.

---

### Task 5: Production Build, Real Browser Click-Through Verification & Antislop Delivery Gate

**Files:**
- Modify (only if verification catches defects): affected source files

- [ ] **Step 1:** Run `npm test` and `npm run build` (must exit 0 with zero errors).
- [ ] **Step 2:** Launch Vite preview server and perform full real-browser click-through verification across 375px (mobile), 768px (tablet), and 1366x768 (16:9 smartboard): verify zero console errors, zero horizontal overflow, >= 44px tap targets, keyboard Tab/Escape focus, and click every interactive flow end-to-end.
- [ ] **Step 3:** Audit every Antislop Delivery Gate rule (Blocks 1-4 + UI, Copywriting, Layoutmobile, Human, Code checklists) and report full PASS/FAIL evidence.
