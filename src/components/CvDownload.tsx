import { useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import cv from '../data/cv.json'
import { downloadFile } from '../lib/downloadFile'
import type { CvFile, CvLanguage } from '../types'

const files = cv.files as CvFile[]
const defaultLang = cv.defaultLang as CvLanguage

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
// Matches the existing secondary action on the home page.
const buttonBase = `inline-flex items-center justify-center text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 ${focusRing}`

/** Split button: "Download CV" (default language) + language-options menu. */
export default function CvDownload() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Focus the first option whenever the menu opens, for any input (DEC-04).
  useEffect(() => {
    if (open) itemRefs.current[0]?.focus()
  }, [open])

  // Close on a click or tap outside the control (DEC-05).
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  async function download(lang: CvLanguage) {
    const file = files.find((f) => f.lang === lang)
    if (!file) return
    setError(false)
    try {
      await downloadFile(file.href, file.fileName)
    } catch {
      setError(true)
    }
  }

  function choose(lang: CvLanguage) {
    setOpen(false)
    toggleRef.current?.focus()
    void download(lang)
  }

  function onMenuKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      const items = itemRefs.current
      const current = items.indexOf(document.activeElement as HTMLButtonElement)
      const step = e.key === 'ArrowDown' ? 1 : -1
      items[(current + step + items.length) % items.length]?.focus()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
      toggleRef.current?.focus()
    } else if (e.key === 'Tab') {
      // No preventDefault: focus moves on naturally.
      setOpen(false)
    }
  }

  // A null relatedTarget is ignored: Safari doesn't focus buttons on click,
  // so outside clicks are handled by the pointerdown listener (DEC-05).
  function onRootBlur(e: FocusEvent<HTMLDivElement>) {
    const next = e.relatedTarget
    if (next && !rootRef.current?.contains(next)) setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative flex w-full sm:w-auto" onBlur={onRootBlur}>
      <button
        type="button"
        onClick={() => void download(defaultLang)}
        className={`min-h-11 flex-1 rounded-l-md border border-neutral-300 px-5 py-2.5 ${buttonBase}`}
      >
        Download CV
      </button>
      <button
        ref={toggleRef}
        type="button"
        aria-label="Choose CV language"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((o) => !o)}
        className={`min-h-11 min-w-11 rounded-r-md border-y border-r border-neutral-300 ${buttonBase}`}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          id={menuId}
          aria-label="CV language"
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 top-full z-10 mt-1 min-w-full rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {files.map((f, i) => (
            <li key={f.lang} role="none">
              <button
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => choose(f.lang)}
                className="min-h-11 w-full px-4 py-2 text-left text-sm text-neutral-900 hover:bg-neutral-100 focus:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600"
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <div
          role="alert"
          className="absolute left-0 top-full mt-2 flex w-full items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:w-80"
        >
          <p className="flex-1">
            Couldn't download the CV. You can request it at{' '}
            <a href={`mailto:${cv.contactEmail}`} className={`font-medium underline ${focusRing}`}>
              {cv.contactEmail}
            </a>
            .
          </p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setError(false)}
            className={`min-h-11 shrink-0 rounded-md px-2 font-medium hover:bg-red-100 ${focusRing}`}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  )
}
