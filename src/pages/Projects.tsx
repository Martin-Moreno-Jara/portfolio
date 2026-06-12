import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/projects'

export default function Projects() {
  return (
    <section>
      <h2 className="text-3xl font-bold">Projects</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {/* 🔧 FIX ME (#5): when you render a list with .map(), React needs a
            stable, unique `key` prop on each element so it can track items
            efficiently. Open the browser console and you'll see a warning.
            Hint: add key={project.id} to <ProjectCard />. */}
        {projects.map((project) => (
          <ProjectCard project={project} />
        ))}
      </div>
    </section>
  )
}
