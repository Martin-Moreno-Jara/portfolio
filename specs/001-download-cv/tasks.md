# Tasks: Download CV in English or Spanish

Spec: ./spec.md · Plan: ./plan.md · Status: Draft (awaiting approval)

Conventions
- Each task ≈ 20–30 min and one reviewable commit.
- TDD: inside each task, write the listed tests first (red), then the code (green).
- Test IDs (U*, C*, H*, A*, M*) refer to plan.md §8.
- `[P]` = can run in parallel with the other `[P]` tasks of the same group.
- Mark `[x]` only when "Done when" is true and `npm test` is green.

## Group 0 — Prerequisites (human gate)

- [x] T00 Apply DEV-01: add "Vitest + Testing Library (dev only)" to constitution §3 table — P2, DEV-01 — files: specs/constitution.md
  - Test: none (governance). Agent proposes the diff; Martin applies/approves it.
  - Done when: constitution §3 lists the test stack as dev-only and Martin has confirmed it.

## Group 1 — Test infrastructure

- [x] T01 Configure Vitest (jsdom, setup file) and add `test` / `test:watch` scripts; fill AGENTS.md §8 test commands — P2, DEC-07 — files: vite.config.ts, tests/setup.ts, package.json, tsconfig*.json (types only if needed), AGENTS.md
  - Test: `tests/setup.ts` registers jest-dom matchers and stubs `URL.createObjectURL` / `revokeObjectURL`; a throwaway sanity check that `expect(document.body).toBeInTheDocument()` passes (deleted before commit or kept as `tests/setup.test.ts`).
  - Done when: `npm test` runs Vitest in jsdom and exits 0; `npx vitest run <file>` works; `npm run build` still passes typecheck.

## Group 2 — Data and assets

- [x] T02 [P] Add `CvLanguage` / `CvFile` types and `src/data/cv.json` (defaultLang, contactEmail, en+es files) — REQ-002, REQ-003, REQ-005, REQ-009 — files: src/types.ts, src/data/cv.json, tests/cv-assets.test.ts
  - Test: A2 — `cv.json` has exactly `en` then `es`, labels "English"/"Español", `defaultLang === 'en'`, contactEmail set.
  - Done when: A2 green; `tsc -b` passes with cv.json typed as `CvFile[]`.

- [x] T03 Move and rename the PDFs to `public/cv/Martin-Moreno-Jara-CV-{EN,ES}.pdf` (git mv) — REQ-002, REQ-004, REQ-005, NFR-Integrity, DEC-03 — files: public/cv/*.pdf, tests/cv-assets.test.ts — depends on T02
  - Test: A1 — for each cv.json entry, `public${href}` exists, starts with `%PDF`, and `fileName` matches `Martin-Moreno-Jara-CV-(EN|ES).pdf` (write first → red, then rename → green).
  - Done when: A1 + A2 green; `public/` no longer contains the old "CV Martin Moreno Jara*.pdf" names; EN file starts with "Computer Science…", ES with "Estudiante…" (open once to confirm).

## Group 3 — Download helper (`src/lib/downloadFile.ts`)

- [x] T04 [P] Implement `downloadFile` happy path: fetch → Blob → temporary `<a download>` click → remove → revoke — REQ-005, NFR-Performance, DEC-02 — files: src/lib/downloadFile.ts, tests/downloadFile.test.ts — depends on T01
  - Test: U1 (EN name, `blob:` href, anchor removed, URL revoked), U2 (ES name).
  - Done when: U1, U2 green; `window.location` is never changed by the helper.

- [x] T05 Add failure detection to `downloadFile` (`DownloadError` on network error, non-2xx, non-PDF content-type) — REQ-009, NFR-Integrity, DEC-02 — files: src/lib/downloadFile.ts, tests/downloadFile.test.ts — depends on T04
  - Test: U3 (404 → rejects, no click), U4 (200 + `text/html` → rejects), U5 (`fetch` throws → rejects).
  - Done when: U1–U5 green.

## Group 4 — `CvDownload` component (same file → sequential)

- [x] T06 Create `CvDownload` split button: "Download CV" main action + attached toggle (`aria-label="Choose CV language"`); main action downloads EN — REQ-001 AC2–3, REQ-002, NFR-Performance — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T02, T05
  - Test: C1 (one main button + one toggle by accessible name), C2 (click main → fetch EN, anchor `download` ends `-EN.pdf`, no `menu` in DOM), C17 (render only → fetch not called).
  - Done when: C1, C2, C17 green.

- [x] T07 Toggle opens/closes the language menu with ARIA menu-button semantics (`aria-haspopup`, `aria-expanded`, `aria-controls`, `role="menu"`, `role="menuitem"` from cv.json order) — REQ-003, REQ-008 — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T06
  - Test: C3 (hidden initially; opens with ["English","Español"] in order; second click closes), C12 (`aria-expanded` false → true → false), C13 (menuitems found by name).
  - Done when: C1–C3, C12, C13, C17 green.

- [x] T08 Selecting a menu option downloads that language, closes the menu and returns focus to the toggle — REQ-004, REQ-005 AC2 — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T07
  - Test: C4 (English → EN fetched, menu closed), C5 (Español → ES fetched, `download` ends `-ES.pdf`, menu closed).
  - Done when: C4, C5 green plus all previous C tests.

- [x] T09 Close the menu on Escape (focus → toggle), outside `pointerdown`, and Tab / focus-out (`onBlur` with non-null `relatedTarget`) — REQ-006, DEC-05 — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T08
  - Test: C6 (Escape → closed, toggle focused), C7 (`pointerdown` on body → closed, fetch not called), C8 (Tab from item → closed).
  - Done when: C6–C8 green; C3 still green (toggle click does not close-then-reopen).

- [x] T10 Keyboard navigation: focus first item on open, ArrowUp/ArrowDown with wrap-around, items `tabIndex={-1}` — REQ-007, DEC-04 — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T09
  - Test: C9 (Tab reaches main then toggle; Enter on main → EN; Space on toggle opens), C10 (open via keyboard → "English" focused), C11 (Down → Español, Down wraps → English, Up wraps → Español, Enter → ES).
  - Done when: C9–C11 green plus all previous C tests.

- [x] T11 Failure alert: `role="alert"` with failure text, `mailto:` contact email from cv.json, and a "Dismiss" button; cleared on new attempt — REQ-009 — files: src/components/CvDownload.tsx, tests/CvDownload.test.tsx — depends on T10
  - Test: C14 (404 → alert with failure text + `mailto:martin.moreno.j04@gmail.com`), C15 (dismiss → alert gone, main button fetches again), C16 (success → no alert).
  - Done when: C1–C17 all green.

- [x] T12 Styling: secondary-button look, shared border/radius group, chevron SVG (`aria-hidden`), `min-h-11 min-w-11` toggle, `focus-visible` outline, responsive menu (`absolute right-0 min-w-full`), error colors — NFR-A11y, NFR-Responsive, NFR-Consistency — files: src/components/CvDownload.tsx — depends on T11
  - Test: no new automated test (jsdom can't measure layout/colour); C1–C17 must stay green. Quick manual pre-check of M1–M3 with `npm run dev`.
  - Done when: suite green; in DevTools the toggle is ≥ 44×44 px, focus ring visible, and the control looks like the old "Download Resume" button at 360 px and ≥ 1024 px.

## Group 5 — Integration and release

- [x] T13 Replace the broken "Download Resume" `<a>` in Home with `<CvDownload />` in the same actions row — REQ-001 AC1 — files: src/pages/Home.tsx, tests/Home.test.tsx — depends on T12
  - Test: H1 (inside `MemoryRouter`: exactly one "Download CV", same container as "View Projects", no "Download Resume").
  - Done when: H1 green; `npm run dev` home page shows the split button next to "View Projects".

- [x] T14 Make `npm run build` run the tests first (`vitest run && tsc -b && vite build`) — NFR-Integrity, DEC-08 — files: package.json — depends on T03, T13 — ⚠ build-pipeline change: confirm with Martin before committing
  - Test: A1 acts as the release guard. Verify by temporarily renaming one PDF → `npm run build` fails; restore → passes.
  - Done when: `npm run build` exits non-zero with a missing CV and 0 with both present.

- [x] T15 [P] Create `specs/backlog.md` with the out-of-scope items from plan §11 (unify contact email Footer ↔ cv.json; `vercel.json` rewrite excluding static assets) — DEC-06 — files: specs/backlog.md
  - Test: none (docs).
  - Done when: both items are listed with a link back to plan.md.

## Verify

- [x] All AC covered by tests (traceability: plan §9) — U1–U5, C1–C17, H1, A1–A2 green
- [x] `npm test` and `npm run build` (typecheck + tests + build) green
- [x] M1 Toggle ≥ 44×44 px (DevTools, mobile emulation) — NFR-A11y
- [x] M2 Focus ring visible on main, toggle and items; contrast ≥ 4.5:1 — NFR-A11y
- [x] M3 360 px and ≥ 1024 px: control and menu fully visible, aligned with "View Projects" — NFR-Responsive, NFR-Consistency
- [ ] M4 NVDA/Orca: "Choose CV language, menu button, collapsed/expanded", items as "menu item", alert read aloud — REQ-008, REQ-009 AC2
- [ ] M5 Vercel preview: both CVs save with the correct names in Chrome, Firefox, Safari macOS and iOS, page stays in place — REQ-005
- [ ] Spec updated to match implementation (Status → Implemented, Changelog entry)

## Dependency graph

```text
T00 → T01 → T04 → T05 ─┐
         T02 → T03 ────┼→ T06 → T07 → T08 → T09 → T10 → T11 → T12 → T13 → T14
                       │
T15 (independent, any time)
```
