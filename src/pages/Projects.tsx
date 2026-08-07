import ProjectCard from '../components/ProjectCard'
import projectsData from '../data/projects.json'
import type { Project } from '../types'

const projects = projectsData as Project[]

export default function Projects() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Projects
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">
        Backend and cloud architecture work, plus a deep-learning project in
        computer vision. Each one links out to its source.
      </p>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
