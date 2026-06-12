import type { Project } from '../types/project'

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h3 className="text-xl font-semibold">{project.title}</h3>
      <p className="mt-2 text-slate-300">{project.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="rounded bg-slate-800 px-2 py-1 text-xs text-sky-300"
          >
            {tag}
          </li>
        ))}
      </ul>
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-block text-sky-400 hover:underline"
      >
        View project →
      </a>
    </article>
  )
}
