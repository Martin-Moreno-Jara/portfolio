// Unit tests for downloadFile (plan §8.1).
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DownloadError, downloadFile } from '../src/lib/downloadFile'

interface ClickedAnchor {
  href: string
  download: string
  connected: boolean
}

function pdfResponse() {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/pdf' }),
    blob: async () => new Blob(['%PDF-1.7'], { type: 'application/pdf' }),
  }
}

let clicked: ClickedAnchor[]
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  clicked = []
  fetchMock = vi.fn(async () => pdfResponse())
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/cv-blob')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicked.push({ href: this.href, download: this.download, connected: this.isConnected })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** Lets the deferred revokeObjectURL run. */
const nextTick = () => new Promise((r) => setTimeout(r, 0))

describe('downloadFile', () => {
  // U1 — REQ-005 AC1, AC3
  it('U1: saves the EN CV as a file via a blob URL, then cleans up', async () => {
    const locationBefore = window.location.href

    await downloadFile('/cv/Martin-Moreno-Jara-CV-EN.pdf', 'Martin-Moreno-Jara-CV-EN.pdf')

    expect(fetchMock).toHaveBeenCalledWith('/cv/Martin-Moreno-Jara-CV-EN.pdf')
    expect(clicked).toHaveLength(1)
    expect(clicked[0]).toEqual({
      href: 'blob:http://localhost/cv-blob',
      download: 'Martin-Moreno-Jara-CV-EN.pdf',
      connected: true,
    })
    // Temporary anchor removed from the DOM.
    expect(document.querySelector('a[download]')).toBeNull()
    // Object URL revoked on the next tick.
    await nextTick()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/cv-blob')
    // The portfolio stays in the current tab.
    expect(window.location.href).toBe(locationBefore)
  })

  // U2 — REQ-005 AC2
  it('U2: saves the ES CV with its own file name', async () => {
    await downloadFile('/cv/Martin-Moreno-Jara-CV-ES.pdf', 'Martin-Moreno-Jara-CV-ES.pdf')

    expect(fetchMock).toHaveBeenCalledWith('/cv/Martin-Moreno-Jara-CV-ES.pdf')
    expect(clicked).toHaveLength(1)
    expect(clicked[0].download).toBe('Martin-Moreno-Jara-CV-ES.pdf')
    expect(clicked[0].href).toMatch(/^blob:/)
  })

  // U3 — REQ-009 AC1
  it('U3: rejects on a 404 and does not save anything', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'text/plain' }),
      blob: async () => new Blob(['Not found']),
    })

    await expect(
      downloadFile('/cv/Martin-Moreno-Jara-CV-EN.pdf', 'Martin-Moreno-Jara-CV-EN.pdf'),
    ).rejects.toBeInstanceOf(DownloadError)
    expect(clicked).toHaveLength(0)
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  // U4 — REQ-009 AC1, NFR-Integrity (SPA rewrite answers 200 + index.html)
  it('U4: rejects a 200 response that is HTML instead of a PDF', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
      blob: async () => new Blob(['<!doctype html>'], { type: 'text/html' }),
    })

    await expect(
      downloadFile('/cv/Martin-Moreno-Jara-CV-EN.pdf', 'Martin-Moreno-Jara-CV-EN.pdf'),
    ).rejects.toBeInstanceOf(DownloadError)
    expect(clicked).toHaveLength(0)
  })

  // U5 — REQ-009 AC1
  it('U5: rejects when the request itself fails (offline / network error)', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await expect(
      downloadFile('/cv/Martin-Moreno-Jara-CV-EN.pdf', 'Martin-Moreno-Jara-CV-EN.pdf'),
    ).rejects.toBeInstanceOf(DownloadError)
    expect(clicked).toHaveLength(0)
  })
})
