import type { Skill } from '../types'

interface SkillBadgeProps {
  skill: Skill
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <li className="flex items-baseline gap-2 rounded border border-neutral-200 px-3 py-2">
      <span className="text-sm text-neutral-900">{skill.name}</span>
      {skill.level && (
        <span className="text-xs text-neutral-500">{skill.level}</span>
      )}
    </li>
  )
}
