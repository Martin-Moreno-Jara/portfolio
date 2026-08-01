import type { SkillCategory } from '../types'
import SkillBadge from './SkillBadge'

interface SkillGroupProps {
  group: SkillCategory
}

export default function SkillGroup({ group }: SkillGroupProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
        {group.category}
      </h2>
      <ul className="flex flex-wrap gap-3">
        {group.skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} />
        ))}
      </ul>
    </section>
  )
}
