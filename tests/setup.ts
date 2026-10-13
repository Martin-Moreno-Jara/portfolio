// Global test setup (plan §8): jest-dom matchers + object-URL stubs jsdom lacks.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

if (!URL.createObjectURL) {
  URL.createObjectURL = vi.fn(() => 'blob:mock-object-url')
}
if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = vi.fn()
}

afterEach(() => {
  cleanup()
})
