import projectsData from '../data/projects.json'
import type { Project } from '../types'

const projects = projectsData as Project[]

interface TimelineEntry {
  period: string
  role: string
  org: string
  detail: string
}

const education: TimelineEntry[] = [
  {
    period: '2022 — Present · Expected graduation June 2027',
    role: 'Systems and Computer Engineering',
    org: 'Universidad Nacional de Colombia · Bogotá, Colombia',
    detail:
      'Relevant coursework: Software Architecture, Data Structures & Algorithms, Computer Networks, and Introduction to Intelligent Systems (Machine Learning & Deep Learning).',
  },
]

// The project timeline is derived from the same data that drives /projects,
// so the two pages can never drift apart.
const projectTimeline: TimelineEntry[] = projects.map((project) => ({
  period: project.period,
  role: project.title,
  org: project.subtitle,
  detail: project.description,
}))

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="mt-6 space-y-8">
      {entries.map((entry) => (
        <li
          key={`${entry.role}-${entry.period}`}
          className="border-l border-neutral-200 pl-6"
        >
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {entry.period}
          </p>
          <h3 className="mt-1 text-base font-medium text-neutral-900">
            {entry.role}
          </h3>
          <p className="text-sm text-neutral-600">{entry.org}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {entry.detail}
          </p>
        </li>
      ))}
    </ol>
  )
}

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        About
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-neutral-600">
        <p>
          I'm a Systems and Computer Engineering student at Universidad Nacional
          de Colombia in Bogotá, with an expected graduation in June 2027. My
          coursework has centred on software architecture, data structures and
          algorithms, computer networks, and intelligent systems.
        </p>
        <p>
          The work I enjoy most sits at the infrastructure layer — deciding how
          services talk to each other, where the boundaries belong, and how you
          know the system is healthy. In practice that has meant API gateways and
          reverse proxies, secured service-to-service communication,
          containerized deployments on Google Cloud Platform, and telemetry
          pipelines built on Prometheus and Grafana. Alongside that I've been
          training deep-learning models for computer vision.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Education
        </h2>
        <Timeline entries={education} />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Project Timeline
        </h2>
        <Timeline entries={projectTimeline} />
      </section>
    </div>
  )
}
