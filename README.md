# Portfolio

A personal portfolio single-page app: React + TypeScript + Vite, React Router, Tailwind CSS.
All content is static — no backend, no CMS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build locally
```

## Replacing the placeholder content

Everything ships as clearly-labeled placeholder copy. To find all of it:

```bash
grep -rn "Here\|yourusername\|you@example.com\|20XX" src/ index.html
```

The files to edit, in order of importance:

| What | Where |
| --- | --- |
| Projects (title, description, tech, links, image) | `src/data/projects.json` |
| Skills, grouped by category | `src/data/skills.json` |
| Name, title, tagline, intro, CTAs | `src/pages/Home.tsx` |
| Bio, experience, education, certifications | `src/pages/About.tsx` |
| Email, GitHub, LinkedIn | `src/components/Footer.tsx` |
| Name in the header | `src/components/Navbar.tsx` |
| Page title, meta description | `index.html` |
| Resume PDF | replace `public/resume-placeholder.pdf` |

### Data shapes

`projects.json` — array of:

```jsonc
{
  "id": "unique-slug",
  "title": "…",
  "description": "…",
  "techStack": ["React", "TypeScript"],
  "imageUrl": "/placeholder-project.svg",  // put real images in public/
  "repoUrl": "https://github.com/…",
  "liveUrl": "https://…"                   // null hides the "Live demo" link
}
```

`skills.json` — array of `{ "category": "Frontend", "skills": [{ "name": "React", "level": "Advanced" }] }`.
`level` is optional and must be `Beginner`, `Intermediate`, or `Advanced`. Types live in `src/types.ts`.

## Deploying to Vercel

Import the repo — Vercel detects Vite and uses `npm run build` → `dist/`. No extra configuration needed.

`vercel.json` contains a catch-all rewrite to `/index.html` so that refreshing or deep-linking a
non-root route (e.g. `/about`) serves the app instead of a 404.

## Notes on versions

The toolchain is deliberately pinned to versions that run on **Node 18**, which is what this
project was set up against:

- Vite 6 (Vite 7+ requires Node 20.19+)
- React Router 6 (v7 requires Node 20+)
- Tailwind CSS 3 (v4's toolchain expects Node 20+)
- React 18

If you upgrade to Node 20 or 22, you can move to the current majors of all four.

**Known advisory:** `npm audit` reports 2 moderate issues in react-router. They are only patched in
7.17.1+, which needs Node 20 — there is no fixed 6.x release. Neither is reachable here: one requires
SSR hydration (this app is client-only), the other requires user-controlled navigation targets (all
routes are hardcoded). Upgrading Node and moving to React Router 7 clears them.

## Structure

```
src/
  components/   Layout, Navbar, Footer, ProjectCard, SkillGroup, SkillBadge
  pages/        Home, About, Projects, Skills, NotFound
  data/         projects.json, skills.json
  types.ts      Project, Skill, SkillCategory
```
