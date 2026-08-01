import SkillGroup from '../components/SkillGroup'
import skillsData from '../data/skills.json'
import type { SkillCategory } from '../types'

const skillGroups = skillsData as SkillCategory[]

export default function Skills() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Skills
      </h1>
      <p className="mt-4 leading-relaxed text-neutral-600">
        Tools and technologies I work with. Edit{' '}
        <code className="rounded bg-neutral-100 px-1 py-0.5 text-sm">
          src/data/skills.json
        </code>{' '}
        to replace these entries.
      </p>

      <div className="mt-12 space-y-12">
        {skillGroups.map((group) => (
          <SkillGroup key={group.category} group={group} />
        ))}
      </div>
    </div>
  )
}
