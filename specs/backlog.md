# Backlog

Ideas and follow-ups that are out of scope for the feature that found them
(AGENTS.md §7). Each item needs its own spec before it is implemented.

## From 001-download-cv

Source: [plan.md §11 — Backlog](./001-download-cv/plan.md#11-backlog-not-in-this-feature)

- [ ] **Unify the contact email between `Footer.tsx` and `cv.json`.** The email
  `martin.moreno.j04@gmail.com` is hardcoded in `src/components/Footer.tsx` and
  also stored in `src/data/cv.json`. Footer was outside the feature's scope, so the
  duplication was kept. See [DEC-06](./001-download-cv/plan.md#6-decisions).
- [ ] **Exclude real static assets from the `vercel.json` rewrite.** Today every
  path is rewritten to `/index.html`, so a missing file returns 200 with HTML instead
  of 404. The CV download works around this with a content-type check. See
  [plan.md §2](./001-download-cv/plan.md#2-current-state) and
  [DEC-02](./001-download-cv/plan.md#6-decisions).
