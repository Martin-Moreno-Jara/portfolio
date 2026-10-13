// T01 — sanity checks for the test environment (plan §8, DEC-07).
import { describe, expect, it } from 'vitest'

describe('test environment', () => {
  it('runs in jsdom with jest-dom matchers', () => {
    expect(document.body).toBeInTheDocument()
  })

  it('stubs URL.createObjectURL / revokeObjectURL', () => {
    const url = URL.createObjectURL(new Blob(['%PDF']))
    expect(url).toMatch(/^blob:/)
    expect(() => URL.revokeObjectURL(url)).not.toThrow()
  })
})
