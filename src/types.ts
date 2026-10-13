export interface Project {
  id: string
  title: string
  /** Short framing of the project's focus, e.g. "Backend & Cloud Architecture". */
  subtitle: string
  /** Human-readable date range, e.g. "September — December 2025". */
  period: string
  description: string
  techStack: string[]
  imageUrl: string
  repoUrl: string
  /** Overrides the default "View code" link label (e.g. for a notebook). */
  repoLabel?: string
  /** `null` when the project has no public deployment. */
  liveUrl: string | null
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Native'

export interface Skill {
  name: string
  /** Only set where a meaningful proficiency exists, e.g. spoken languages. */
  level?: SkillLevel
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

export type CvLanguage = 'en' | 'es'

export interface CvFile {
  lang: CvLanguage
  /** Menu label: "English" | "Español". */
  label: string
  /** Public URL, e.g. "/cv/Martin-Moreno-Jara-CV-EN.pdf". */
  href: string
  /** Name the browser saves the file as. */
  fileName: string
}
