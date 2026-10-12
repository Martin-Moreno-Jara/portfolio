# Plan: Download CV in English or Spanish

Spec: ./spec.md · Status: Approved (2026-10-11) · Date: 2026-10-11

## 1. Constitution check

| Principle / constraint | Status | Notes |
| --- | --- | --- |
| P1 Spec ↔ code | ✅ | Every design section is tagged with the REQ it implements. §9 maps REQ → component → test. |
| P2 Test-backed acceptance | ⚠️ needs new dev deps | No test runner exists yet (`tests/` is empty, `package.json` has no `test` script). See DEV-01. |
| P3 Simplicity first | ✅ | No UI or menu library. Added abstractions: one component (`CvDownload`), one helper (`downloadFile`), one JSON data file. Each one is justified in §5. |
| Language: TypeScript | ✅ | |
| Framework: React | ✅ | |
| Data: local JSON | ✅ | CV metadata goes in `src/data/cv.json`, the same pattern as `projects.json` and `skills.json`. |
| Infra: Vercel | ✅ | Static files are served from `public/`. No server code. `vercel.json` stays unchanged. |
| Dependencies: Tailwind, Vite | ⚠️ | Only test dev-dependencies are added (DEV-01). Nothing is added at runtime. |

**DEV-01: §3 Dependencies — P2 needs an automated test runner, and none of the allowed
dependencies provides one — scope: devDependencies only (`vitest`, `jsdom`,
`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`) —
expiry: permanent. Proposed amendment: add "Vitest + Testing Library (dev only)" to the
constitution's §3 table.** Approved by Martin on 2026-10-11, as required by AGENTS.md
§9/§10 ("ask before adding any dependency").

## 2. Current state

- `src/pages/Home.tsx` renders "View Projects" (`<Link>`) and a secondary
  `<a href="/Martin-Moreno-Jara-CV.pdf" download>Download Resume</a>`. That file was
  deleted, so this link is broken today.
- `public/` contains `CV Martin Moreno Jara.pdf`, which is the **English** CV (it starts
  with "Computer Science and Engineering Student…"), and
  `CV Martin Moreno Jara copy.pdf`, which is the **Spanish** CV ("Estudiante de
  Ingeniería de Sistemas…").
- `vercel.json` rewrites **every** path to `/index.html`. If a PDF is missing, the server
  therefore answers **200 with HTML**, not 404. This affects the design of REQ-009
  (see DEC-02).
- The contact email `martin.moreno.j04@gmail.com` is hardcoded in
  `src/components/Footer.tsx`.
- Secondary button style in use: `rounded-md border border-neutral-300 px-5 py-2.5 text-sm
  font-medium text-neutral-900 hover:border-neutral-400`.

## 3. Architecture

```
Home.tsx
 └─ <CvDownload />                       (REQ-001)
     ├─ main button "Download CV"        → download('en')          (REQ-002)
     ├─ toggle button ▾                  → open/close menu          (REQ-003, 008)
     ├─ <ul role="menu">                                            (REQ-003, 004, 006–008)
     │    ├─ <button role="menuitem">English</button>
     │    └─ <button role="menuitem">Español</button>
     └─ <div role="alert"> error + mailto + dismiss </div>          (REQ-009)

download(lang) → downloadFile(url, fileName)  (src/lib/downloadFile.ts)
                 fetch → validate → Blob → <a download> click       (REQ-005, 009)
```

### 3.1 Files

| Path | Change | Covers |
| --- | --- | --- |
| `public/cv/Martin-Moreno-Jara-CV-EN.pdf` | renamed from `public/CV Martin Moreno Jara.pdf` | REQ-002, 005 |
| `public/cv/Martin-Moreno-Jara-CV-ES.pdf` | renamed from `public/CV Martin Moreno Jara copy.pdf` | REQ-004, 005 |
| `src/data/cv.json` | new: CV list and contact email | REQ-002, 004, 005, 009 |
| `src/types.ts` | add `CvLanguage` and `CvFile` types | — |
| `src/lib/downloadFile.ts` | new: fetch, validate, save as file | REQ-005, 009, NFR-Perf |
| `src/components/CvDownload.tsx` | new: split button, menu, error message | REQ-001…009 |
| `src/pages/Home.tsx` | replace the broken `<a>` with `<CvDownload />` | REQ-001 |
| `vite.config.ts` | add the `test` block (jsdom, setup file) | P2 |
| `package.json` | dev deps; `test` script; `build` runs tests first | P2, NFR-Integrity |
| `tests/setup.ts` | jest-dom matchers; `URL.createObjectURL` stubs | P2 |
| `tests/*.test.ts(x)` | test files (§8) | all |

## 4. Data model / contracts

`src/types.ts`:
```ts
export type CvLanguage = 'en' | 'es'

export interface CvFile {
  lang: CvLanguage
  /** Menu label: "English" | "Español". */
  label: string
  /** Public URL, e.g. "/cv/Martin-Moreno-Jara-CV-EN.pdf". */
  href: string
  /** Name the browser saves the file as. */
  fileName: string
}
```

`src/data/cv.json` (array order = menu order, which is REQ-003 AC1):
```json
{
  "defaultLang": "en",
  "contactEmail": "martin.moreno.j04@gmail.com",
  "files": [
    { "lang": "en", "label": "English", "href": "/cv/Martin-Moreno-Jara-CV-EN.pdf", "fileName": "Martin-Moreno-Jara-CV-EN.pdf" },
    { "lang": "es", "label": "Español", "href": "/cv/Martin-Moreno-Jara-CV-ES.pdf", "fileName": "Martin-Moreno-Jara-CV-ES.pdf" }
  ]
}
```

`src/lib/downloadFile.ts` contract:
```ts
/** Resolves once the browser has been told to save the file.
 *  Rejects with DownloadError on a network error, a non-2xx status,
 *  or a response that is not a PDF. */
export async function downloadFile(href: string, fileName: string): Promise<void>
```
Steps:
1. `fetch(href)`.
2. Throw if `!res.ok` or if `content-type` does not include `application/pdf`.
3. `blob = await res.blob()`.
4. `url = URL.createObjectURL(blob)`.
5. Create a temporary `<a href=url download=fileName>`, append it, `click()` it,
   then remove it.
6. `URL.revokeObjectURL(url)` on the next tick.

## 5. Component design: `CvDownload`

**State:** `open: boolean`, `error: boolean`.
**Refs:** `rootRef` (wrapper), `toggleRef`, `itemRefs[]`.

| Behaviour | Implementation | Covers |
| --- | --- | --- |
| One control in place of "Download Resume", next to "View Projects" | `Home.tsx` renders `<CvDownload />` inside the existing `flex` actions row | REQ-001 AC1 |
| Main label | `<button type="button">Download CV</button>` | REQ-001 AC2 |
| Toggle attached to main action | Both buttons sit in an `inline-flex` group with shared border and radius: main is `rounded-l-md`, toggle is `rounded-r-md border-l`. Toggle shows a chevron icon (inline SVG, `aria-hidden`) and has `aria-label="Choose CV language"` | REQ-001 AC3, NFR-Consistency |
| Main → English | `onClick={() => download('en')}`. The menu stays closed | REQ-002 AC1–2 |
| Toggle opens/closes | `onClick` flips `open`. The menu is rendered only when `open` (`{open && <ul…>}`) | REQ-003 AC2–3 |
| Two options in order | `cv.files.map(...)`, so the order comes from JSON | REQ-003 AC1 |
| Choose option | `onClick={() => { setOpen(false); toggleRef.focus(); download(f.lang) }}` | REQ-004 AC1–3 |
| Save as file with name, tab not replaced | Handled by `downloadFile` (blob + `download` attr). The page never navigates | REQ-005 AC1–3 |
| Escape | menu `onKeyDown`: `Escape` → close, then focus the toggle | REQ-006 AC1 |
| Outside click/tap | `useEffect` attaches a `pointerdown` listener on `document` while `open`. If the target is outside `rootRef`, close. No download is triggered | REQ-006 AC2 |
| Tab away | menu `onKeyDown`: `Tab` → close, without `preventDefault`, so focus moves on naturally. Also, `onBlur` on the root closes the menu when `relatedTarget` is outside the root and not null (DEC-05) | REQ-006 AC3 |
| Keyboard reach/activate | Native `<button>`s, so Tab, Enter and Space work for free | REQ-007 AC1 |
| Focus first option on open | After opening, a `useEffect([open])` calls `itemRefs[0].focus()`. This also happens on mouse open, following the WAI-ARIA APG menu-button pattern (DEC-04) | REQ-007 AC2 |
| Arrow navigation | Menu items have `tabIndex={-1}` (roving focus). `ArrowDown`/`ArrowUp` move focus to next/previous with wrap-around. Enter and Space activate the native button | REQ-007 AC3 |
| ARIA | Toggle: `aria-haspopup="menu"`, `aria-expanded={open}`, `aria-controls={menuId}` (`useId`). Menu: `<ul role="menu" id={menuId} aria-label="CV language">`. Each `<li role="none">` contains `<button role="menuitem">{label}</button>` | REQ-008 AC1–2 |
| Error message | `download()` wraps `downloadFile` in try/catch and sets `error=true` on failure. Renders `<div role="alert">` with "Couldn't download the CV. You can request it at <a href="mailto:…">email</a>." and a "Dismiss" button (`aria-label="Dismiss message"`). A new download attempt clears `error` first | REQ-009 AC1–4 |
| Touch target ≥ 44×44 | Toggle gets `min-h-11 min-w-11` (44 px). Main button gets `min-h-11` | NFR-A11y |
| Focus visibility | `focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600` on all buttons and items | NFR-A11y |
| Contrast | Reuses the existing palette: `text-neutral-900` on white, and `text-red-700` on `bg-red-50` for the error. Both are ≥ 4.5:1 | NFR-A11y |
| Responsive | Root is `relative w-full sm:w-auto`. The group stretches full width on mobile, like the current column layout. Menu is `absolute right-0 mt-1 min-w-full z-10` and stays inside the viewport on narrow screens because it aligns to the control's right edge | NFR-Responsive |

## 6. Decisions

- **DEC-01: Split button + custom accessible menu built in React, no headless-UI library**
  — The spec needs only 2 static options. Writing it by hand is about 100 lines and
  meets P3 and the "ask before adding dependencies" rule.
  — Rejected: Headless UI / Radix (new runtime dependency); native `<select>` (cannot
  look like a split button, and has no "main action + toggle" model);
  `<details>/<summary>` (does not expose menu/menuitem roles and does not support arrow
  keys, so it fails REQ-007/008).

- **DEC-02: Download through `fetch` → Blob → temporary `<a download>`, not a plain
  `<a href download>`**
  — Reason 1: a plain anchor cannot detect failure (REQ-009).
  — Reason 2: because of `vercel.json`'s catch-all rewrite, a missing PDF returns
  `index.html` with status 200. A plain anchor would then silently save an HTML page
  as a ".pdf". Checking `res.ok` **and** `content-type: application/pdf` catches both
  cases.
  — The Blob URL is same-origin, so the `download` attribute is always honored. That
  enforces "save as file, with this name, without leaving the page" (REQ-005).
  — Bonus: nothing is fetched until the visitor clicks (NFR-Performance).
  — Rejected: a `HEAD` request followed by an anchor (two requests, race-prone, still
  fooled by the rewrite without the content-type check); `Content-Disposition` headers
  in `vercel.json` (infra change, still no failure feedback).

- **DEC-03: Rename the PDFs to `public/cv/Martin-Moreno-Jara-CV-{EN,ES}.pdf`**
  — Removes spaces from the URLs, makes the language explicit (the current names are
  "…pdf" and "… copy.pdf"), and keeps the URL path the same as the saved file name
  (REQ-005).
  — Rejected: keep the current names and rely only on `download=`. The URLs would stay
  ambiguous and need encoding.

- **DEC-04: Always move focus to the first menu item when the menu opens, whatever
  the input method**
  — REQ-007 AC2 requires it for keyboard input, and the WAI-ARIA APG menu-button
  pattern does it for every input method. Doing it for all inputs avoids fragile
  keyboard-vs-mouse detection (`event.detail === 0`).
  — Rejected: detecting the input method.

- **DEC-05: Outside click uses a `pointerdown` listener on `document`. Focus-out uses
  `Tab` in the menu's `onKeyDown`, plus `onBlur` with a non-null `relatedTarget`.**
  — Safari on macOS does not focus buttons on click, so `relatedTarget` can be `null`
  when the toggle is clicked. If the menu closed on any blur, it would close and then
  immediately re-open. Ignoring `null` and relying on `pointerdown` for clicks avoids
  that bug.

- **DEC-06: CV metadata and contact email in `src/data/cv.json`**
  — Follows the constitution's "local JSON" rule and the existing `src/data/` pattern.
  Adding a third language later would only need a data change.
  — Known duplication: the email is also hardcoded in `Footer.tsx`. Footer is outside
  this feature's scope (AGENTS §7), so unifying them goes to `specs/backlog.md`.

- **DEC-07: Test stack = Vitest + jsdom + Testing Library + user-event** (see DEV-01)
  — Vitest reuses the existing `vite.config.ts` and TypeScript setup with no extra
  transform config. user-event simulates real Tab, Arrow, Escape and Space key
  sequences, which REQ-006/007 need. Role-based queries (`getByRole('menuitem')`)
  test REQ-008 directly.
  — Rejected: Jest (needs a separate TS/ESM transform); Playwright (a browser download
  harness is too heavy for one component; listed below as optional manual/E2E).

- **DEC-08: `npm run build` runs `vitest run` before `tsc -b && vite build`**
  — Vercel runs `npm run build`, so a missing or renamed CV fails the deploy instead
  of reaching production (NFR-Integrity: "a missing CV is a release defect").
  — Rejected: a separate CI workflow (no CI exists yet; that would be an infra change).
  — This touches the build pipeline, so it is flagged for explicit approval.

## 7. Error handling

| Failure | Detected by | Result |
| --- | --- | --- |
| Network error / offline | `fetch` rejects | Alert shown (REQ-009) |
| 404 / 5xx | `!res.ok` | Alert shown |
| File missing but SPA rewrite returns HTML 200 | `content-type` is not `application/pdf` | Alert shown |
| Missing file at release time | `tests/cv-assets.test.ts` inside `build` | Deploy fails (NFR-Integrity) |

The error message is local to `CvDownload`. Everything else on the home page keeps
working (REQ-009 AC3). There is no observability or analytics (out of scope).

## 8. Test strategy

Tools: Vitest + jsdom + @testing-library/react + user-event + jest-dom (DEC-07).
Global stubs in `tests/setup.ts`: `URL.createObjectURL` and `revokeObjectURL` (jsdom
lacks them). `fetch` is stubbed per test with `vi.stubGlobal`. To verify downloads,
tests spy on `HTMLAnchorElement.prototype.click` and read the clicked anchor's
`download` and `href`.

New scripts: `"test": "vitest run"`, `"test:watch": "vitest"`. Single file:
`npx vitest run tests/CvDownload.test.tsx`. AGENTS.md §8 placeholders get filled in the
same task.

### 8.1 `tests/downloadFile.test.ts` (unit)
| ID | Case | Covers |
| --- | --- | --- |
| U1 | 200 + `application/pdf` → anchor clicked with `download="Martin-Moreno-Jara-CV-EN.pdf"` and a `blob:` href; the anchor is removed; the object URL is revoked | REQ-005 AC1, AC3 |
| U2 | Same as U1 with the ES file name | REQ-005 AC2 |
| U3 | 404 → rejects, no anchor clicked | REQ-009 AC1 |
| U4 | 200 + `text/html` (SPA rewrite) → rejects | REQ-009 AC1, NFR-Integrity |
| U5 | `fetch` throws → rejects | REQ-009 AC1 |

### 8.2 `tests/CvDownload.test.tsx` (component, user-event)
| ID | Case | Covers |
| --- | --- | --- |
| C1 | Exactly one "Download CV" button and one toggle named /choose cv language/i | REQ-001 AC2, AC3 |
| C2 | Click main → `fetch('/cv/…-EN.pdf')`; anchor `download` ends in `-EN.pdf`; no `menu` role in the DOM | REQ-002 AC1, AC2 |
| C3 | Menu absent initially. Click toggle → menu present with menuitems `["English","Español"]` in order. Click toggle again → menu absent | REQ-003 AC1–3 |
| C4 | Open, click "English" → EN fetched; menu closed | REQ-004 AC1, AC3 |
| C5 | Open, click "Español" → ES fetched; anchor `download` ends in `-ES.pdf`; menu closed | REQ-004 AC2, AC3; REQ-005 AC2 |
| C6 | Open, press Escape → menu closed; toggle has focus | REQ-006 AC1 |
| C7 | Open, `pointerdown` on `document.body` → menu closed; `fetch` not called | REQ-006 AC2 |
| C8 | Open, press Tab from a menu item → menu closed | REQ-006 AC3 |
| C9 | Tab reaches main, then toggle. Enter on main downloads EN. Space on toggle opens the menu | REQ-007 AC1 |
| C10 | Open via keyboard → first menuitem ("English") has focus | REQ-007 AC2 |
| C11 | ArrowDown → "Español" focused; ArrowDown wraps to "English"; ArrowUp wraps to "Español"; Enter → ES downloaded | REQ-007 AC3 |
| C12 | Toggle has `aria-haspopup="menu"` and `aria-expanded` is `false`, then `true` after opening, then `false` after closing | REQ-008 AC1 |
| C13 | `getAllByRole('menuitem', { name })` finds "English" and "Español" | REQ-008 AC2 |
| C14 | fetch → 404: `role="alert"` visible, contains "download" failure text and a `mailto:martin.moreno.j04@gmail.com` link | REQ-009 AC1, AC2 |
| C15 | Dismiss → alert gone; main button still works (a second click fetches again) | REQ-009 AC3 |
| C16 | Successful download → no `role="alert"` | REQ-009 AC4 |
| C17 | Render only → `fetch` not called | NFR-Performance |

### 8.3 `tests/Home.test.tsx` (integration, inside `MemoryRouter`)
| ID | Case | Covers |
| --- | --- | --- |
| H1 | Home renders exactly one "Download CV" button, in the same actions container as the "View Projects" link; no "Download Resume" left | REQ-001 AC1 |

### 8.4 `tests/cv-assets.test.ts` (release integrity, runs in `build`)
| ID | Case | Covers |
| --- | --- | --- |
| A1 | For each entry in `cv.json`, `public${href}` exists, the file starts with `%PDF`, and `fileName` matches `Martin-Moreno-Jara-CV-(EN|ES).pdf` | NFR-Integrity, REQ-005 AC1–2 |
| A2 | `cv.json` has exactly the `en` and `es` entries, in that order, and `defaultLang === 'en'` | REQ-002, REQ-003 AC1 |

### 8.5 Manual checks (in the Verify checklist in `tasks.md`)
jsdom cannot measure layout or color, so these NFRs are checked by hand with
`npm run dev`, Chrome/Firefox DevTools, and a screen reader:
- M1: Toggle box ≥ 44×44 px (DevTools box model, mobile emulation) — NFR-A11y
- M2: Focus ring visible on main, toggle, and items; contrast ≥ 4.5:1 (DevTools contrast picker) — NFR-A11y
- M3: At 360 px and ≥ 1024 px widths, the control and menu are fully visible and match "View Projects" alignment — NFR-Responsive, NFR-Consistency
- M4: NVDA or Orca announces "Choose CV language, menu button, collapsed/expanded", the items as "menu item", and reads the alert — REQ-008, REQ-009 AC2
- M5: On the Vercel preview, both downloads save with the right names in Chrome, Firefox, Safari (iOS and macOS) — REQ-005

## 9. Traceability matrix

| REQ | Design | Tests |
| --- | --- | --- |
| REQ-001 | §3, §5 rows 1–3, Home.tsx | C1, H1 |
| REQ-002 | §5 row 4, cv.json | C2, A2 |
| REQ-003 | §5 rows 5–6 | C3, A2 |
| REQ-004 | §5 row 7 | C4, C5 |
| REQ-005 | §4 `downloadFile`, DEC-02, DEC-03 | U1, U2, C2, C5, A1, M5 |
| REQ-006 | §5 rows 9–11, DEC-05 | C6, C7, C8 |
| REQ-007 | §5 rows 12–14, DEC-04 | C9, C10, C11 |
| REQ-008 | §5 row 15 | C12, C13, M4 |
| REQ-009 | §5 row 16, §7, DEC-02 | U3–U5, C14, C15, C16, M4 |
| NFR-A11y | §5 rows 17–19 | M1, M2, M4 |
| NFR-Responsive / Consistency | §5 rows 3, 20 | M3 |
| NFR-Performance | DEC-02 (fetch on demand) | C17 |
| NFR-Integrity | DEC-02, DEC-08, §7 | U4, A1 |

## 10. Risks

| Risk | Mitigation / test |
| --- | --- |
| SPA rewrite hides missing PDFs as HTML 200 | content-type check (DEC-02); U4; build-time A1 |
| iOS Safari handles `download` on blob URLs inconsistently (it may open a preview sheet) | The Blob is same-origin, so modern iOS (≥ 13) honors it. Verified manually in M5. If it fails, report it as a spec delta rather than patching silently |
| Safari focus/blur quirks close then re-open the menu | DEC-05; C3 and C7 cover the toggle/outside paths |
| jsdom cannot verify layout, contrast, or real downloads | Manual checks M1–M5 are listed in the Verify checklist |
| New dev dependencies change constitution §3 | DEV-01 is flagged for explicit human approval before T01 |
| Build now depends on tests passing | Intended (DEC-08). The suite is small and fast (< 5 s) |

## 11. Backlog (not in this feature)
- Unify the contact email between `Footer.tsx` and `cv.json` (DEC-06).
- `vercel.json` rewrite could exclude real static assets so missing files return 404.
