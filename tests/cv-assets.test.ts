// Release-integrity tests for the CV data and files (plan §8.4).
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import cv from '../src/data/cv.json'
import type { CvFile } from '../src/types'

const files = cv.files as CvFile[]

describe('cv.json', () => {
  // A2 — REQ-002, REQ-003 AC1
  it('A2: lists exactly the en and es CVs, in menu order, with English as default', () => {
    expect(cv.defaultLang).toBe('en')
    expect(files.map((f) => f.lang)).toEqual(['en', 'es'])
    expect(files.map((f) => f.label)).toEqual(['English', 'Español'])
  })

  // A2 — REQ-009 (contact email shown when a download fails)
  it('A2: has a contact email', () => {
    expect(cv.contactEmail).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  })

  // A2 — every entry matches the CvFile contract (plan §4)
  it('A2: every entry has lang, label, href and fileName', () => {
    for (const f of files) {
      expect(Object.keys(f).sort()).toEqual(['fileName', 'href', 'label', 'lang'])
      expect(f.href).toMatch(/^\/cv\/.+\.pdf$/)
      expect(f.fileName).toMatch(/\.pdf$/)
    }
  })
})

describe('CV files in public/', () => {
  const publicDir = resolve(process.cwd(), 'public')

  // A1 — NFR-Integrity, REQ-005 AC1–2
  it.each(files)('A1: $lang CV exists at public$href and is a PDF', ({ href }) => {
    const path = resolve(publicDir, `.${href}`)
    expect(existsSync(path), `missing ${path}`).toBe(true)
    expect(readFileSync(path).subarray(0, 4).toString('latin1')).toBe('%PDF')
  })

  // A1 — REQ-005 AC1–2
  it.each(files)('A1: $lang CV is saved as Martin-Moreno-Jara-CV-<LANG>.pdf', ({ lang, fileName }) => {
    expect(fileName).toMatch(/^Martin-Moreno-Jara-CV-(EN|ES)\.pdf$/)
    expect(fileName).toBe(`Martin-Moreno-Jara-CV-${lang.toUpperCase()}.pdf`)
  })
})
