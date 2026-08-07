import type { Project } from '../types'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const {
    title,
    subtitle,
    period,
    description,
    techStack,
    imageUrl,
    repoUrl,
    repoLabel,
    liveUrl,
  } = project

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200 transition-colors hover:border-neutral-300">
      <img
        src={imageUrl}
        alt={`${title} — project image`}
        loading="lazy"
        className="aspect-[16/10] w-full bg-neutral-100 object-cover"
      />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <h3 className="text-base font-medium text-neutral-900">{title}</h3>
            <p className="text-xs text-neutral-500">{period}</p>
          </div>
          <p className="text-sm text-neutral-500">{subtitle}</p>
          <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <li
              key={tech}
              className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-600"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex gap-4 pt-2 text-sm">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded font-medium text-indigo-600 underline-offset-4 hover:underline"
          >
            {repoLabel ?? 'View code'}
            <span className="sr-only"> for {title}</span>
          </a>
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded font-medium text-indigo-600 underline-offset-4 hover:underline"
            >
              Live demo
              <span className="sr-only"> of {title}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
