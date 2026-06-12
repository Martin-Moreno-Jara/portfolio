import type { Project } from '../types/project'

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Personal Portfolio',
    description: 'This very website, built with React, TypeScript and Vite.',
    tags: ['React', 'TypeScript', 'Vite'],
    url: 'https://github.com/you/portfolio',
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    description: 'A small app that fetches and displays the local forecast.',
    // 🔧 FIX ME (#3): the Project interface (src/types/project.ts) declares
    // this field as `tags`, but here it's written as `tech`. TypeScript will
    // refuse to build (`npm run build` runs `tsc` first) until the key name
    // matches the interface. Rename `tech` to `tags`.
    tech: ['React', 'OpenWeather API'],
    url: 'https://github.com/you/weather-app',
  },
]
