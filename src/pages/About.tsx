/* PLACEHOLDER: replace every entry below with your real history. */
const experience = [
  {
    period: '20XX — Present',
    role: 'Job Title Here',
    org: 'Company Name Here',
    detail:
      'Describe what you owned, the stack you worked in, and one concrete result — a metric, a launch, or a system you improved.',
  },
  {
    period: '20XX — 20XX',
    role: 'Previous Job Title Here',
    org: 'Previous Company Name Here',
    detail:
      'Describe your responsibilities and a notable achievement from this role.',
  },
]

const education = [
  {
    period: '20XX — 20XX',
    role: 'Degree Name Here',
    org: 'University Name Here',
    detail: 'Optional note about focus area, honours, or relevant coursework.',
  },
]

const certifications = [
  {
    period: '20XX',
    role: 'Certification Name Here',
    org: 'Issuing Organization Here',
    detail: 'Optional one-line note, or delete this section if not applicable.',
  },
]

interface TimelineEntry {
  period: string
  role: string
  org: string
  detail: string
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="mt-6 space-y-8">
      {entries.map((entry) => (
        <li
          key={`${entry.org}-${entry.period}`}
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
          This is your extended bio. Open with how you got into this work and
          what you have been building lately. Replace this placeholder text.
        </p>
        <p>
          Add a second paragraph about how you like to work — collaboration
          style, the kinds of problems that hold your attention, and what you
          are looking for in your next role.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Experience
        </h2>
        <Timeline entries={experience} />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Education
        </h2>
        <Timeline entries={education} />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Certifications
        </h2>
        <Timeline entries={certifications} />
      </section>
    </div>
  )
}
