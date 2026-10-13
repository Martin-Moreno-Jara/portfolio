/** Raised when a file cannot be downloaded (network error, non-2xx, or not a PDF). */
export class DownloadError extends Error {
  /** Underlying error, e.g. the TypeError from a failed fetch. */
  readonly cause?: unknown

  constructor(message: string, options?: { cause?: unknown }) {
    super(message)
    this.name = 'DownloadError'
    this.cause = options?.cause
  }
}

/**
 * Fetches a file and has the browser save it as `fileName`, without leaving
 * the page. A same-origin blob URL guarantees the `download` attribute is
 * honored (see plan DEC-02).
 *
 * Resolves once the browser has been told to save the file. Rejects with
 * DownloadError on a network error, a non-2xx status, or a response that is
 * not a PDF (the SPA rewrite answers missing files with 200 + index.html).
 */
export async function downloadFile(href: string, fileName: string): Promise<void> {
  let res: Response
  try {
    res = await fetch(href)
  } catch (cause) {
    throw new DownloadError(`Request for ${href} failed`, { cause })
  }
  if (!res.ok) {
    throw new DownloadError(`Request for ${href} returned ${res.status}`)
  }
  if (!res.headers.get('content-type')?.includes('application/pdf')) {
    throw new DownloadError(`Response for ${href} is not a PDF`)
  }

  const blob = await res.blob()
  const url = URL.createObjectURL(blob)

  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()

  // Revoke on the next tick so the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
