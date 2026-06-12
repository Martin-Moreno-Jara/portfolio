# 🔧 Learning checklist — intentional issues to fix

This project was scaffolded with **6 deliberate bugs / blanks** so you can fix
them and learn how each piece works. Each one is marked in the code with a
`🔧 FIX ME (#n)` comment. Work through them top to bottom — they roughly go from
"page is broken" to "polish".

Tip: run `npm run dev` and keep the browser console open while you work.

| #  | Symptom you'll see                                   | File                                   | Concept |
|----|------------------------------------------------------|----------------------------------------|---------|
| 1  | The whole site renders with **no styling**           | `tailwind.config.js`                   | Tailwind `content` / class purging |
| 2  | Refreshing `/projects` on Vercel returns **404**     | `vercel.json`                          | SPA fallback rewrites |
| 3  | `npm run build` **fails** with a TypeScript error    | `src/data/projects.ts`                 | Interfaces vs. object shape |
| 4  | Clicking **Contact** shows a 404 error screen        | `src/router.tsx`                       | react-router route config |
| 5  | A **warning** in the browser console on `/projects`  | `src/pages/Projects.tsx`               | React list `key` prop |
| 6  | Submitting the contact form **reloads the page**     | `src/pages/Contact.tsx`                | Controlled forms / `preventDefault` |

There are also a few `TODO` comments (in `Home.tsx` and `About.tsx`) with
placeholder copy you should replace with your own content — those aren't bugs,
just blanks to personalize.

---

## Details & hints

### #1 — Unstyled page (`tailwind.config.js`)
The `content` array tells Tailwind which files to scan for class names. Anything
not found there gets stripped from the final CSS. It's currently `[]`, so every
utility class is purged. Point it at your HTML and source files.

### #2 — Vercel deep-link 404 (`vercel.json`)
This is a Single Page Application: the server only really has `index.html`, and
react-router handles paths in the browser. When you deploy to Vercel and refresh
a URL like `/projects`, Vercel looks for a `/projects` file, doesn't find one,
and 404s. The fix is a "rewrite" that serves `index.html` for every path so the
router can take over. The `rewrites` array is currently empty — add a catch-all.

### #3 — Build-time type error (`src/data/projects.ts`)
The `Project` interface says each project has `tags: string[]`. One object uses
`tech` instead. `npm run dev` won't complain (Vite doesn't type-check), but
`npm run build` runs `tsc` first and will fail. This is a great example of why
the typed build catches mistakes the dev server misses.

### #4 — Missing route (`src/router.tsx`)
The navbar links to `/contact`, but no route renders the `Contact` page. Import
it and register a child route.

### #5 — Missing `key` (`src/pages/Projects.tsx`)
React uses `key` to identify list items between renders. Without it you get a
console warning and potential bugs when the list changes. Add `key={project.id}`.

### #6 — Form reloads the page (`src/pages/Contact.tsx`)
HTML forms navigate/reload by default when submitted. In a SPA you almost always
want to stop that with `event.preventDefault()` and handle the data in JS.

---

## When you're done
- `npm run dev` → site is styled, all nav links work, contact form doesn't reload.
- `npm run build` → completes with no TypeScript errors.
- Browser console on `/projects` → no `key` warning.
