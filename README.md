# Portfolio

A personal portfolio single-page app built with **React + TypeScript + Vite**,
styled with **Tailwind CSS**, routed with **react-router**, and deployable on
**Vercel**.

> 📚 This is a learning scaffold. It ships with 6 intentional bugs/blanks for you
> to fix — see [`LEARNING.md`](./LEARNING.md).

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
```

## Scripts

| Command           | What it does                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Start Vite dev server with hot reload         |
| `npm run build`   | Type-check (`tsc`) and build for production   |
| `npm run preview` | Serve the production build locally            |

## Project structure

```
src/
  main.tsx              # App entry — mounts the router
  router.tsx            # Route definitions
  index.css             # Tailwind directives
  components/
    Layout.tsx          # Shared shell (navbar + <Outlet/>)
    Navbar.tsx          # Top navigation
    ProjectCard.tsx     # Single project card
  pages/
    Home.tsx            # Hero / intro
    Projects.tsx        # Project grid
    About.tsx           # Bio + skills
    Contact.tsx         # Contact form
  data/
    projects.ts         # Your projects (typed)
  types/
    project.ts          # Project type
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New → Project" and import the repo.
3. Vercel auto-detects Vite (build: `npm run build`, output: `dist`).
4. Make sure the SPA rewrite in `vercel.json` is in place (see `LEARNING.md` #2).
