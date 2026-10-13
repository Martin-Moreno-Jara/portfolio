// Integration test for Home (plan §8.3).
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Home from '../src/pages/Home'

describe('Home', () => {
  it('H1: renders one "Download CV" button in the "View Projects" actions row and no "Download Resume"', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const downloadButtons = screen.getAllByRole('button', { name: 'Download CV' })
    expect(downloadButtons).toHaveLength(1)

    const viewProjects = screen.getByRole('link', { name: 'View Projects' })
    expect(viewProjects.parentElement).toContainElement(downloadButtons[0])

    expect(screen.queryByText(/Download Resume/i)).not.toBeInTheDocument()
  })
})
