export interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  imageUrl: string
  repoUrl: string
  /** `null` when the project has no public deployment. */
  liveUrl: string | null
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Skill {
  name: string
  level?: SkillLevel
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}
