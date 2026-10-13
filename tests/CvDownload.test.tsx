// Component tests for CvDownload (plan §8.2).
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CvDownload from '../src/components/CvDownload'

const EN_HREF = '/cv/Martin-Moreno-Jara-CV-EN.pdf'
const ES_HREF = '/cv/Martin-Moreno-Jara-CV-ES.pdf'

let downloads: string[]
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  downloads = []
  fetchMock = vi.fn(async () => ({
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'application/pdf' }),
    blob: async () => new Blob(['%PDF-1.7'], { type: 'application/pdf' }),
  }))
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:http://localhost/cv-blob')
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this.download)
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

const notFound = () => ({
  ok: false,
  status: 404,
  headers: new Headers({ 'content-type': 'text/plain' }),
  blob: async () => new Blob(['Not found']),
})

const mainButton = () => screen.getByRole('button', { name: 'Download CV' })
const toggle = () => screen.getByRole('button', { name: /choose cv language/i })

describe('CvDownload', () => {
  // C1 — REQ-001 AC2, AC3
  it('C1: renders one "Download CV" main action and one language toggle', () => {
    render(<CvDownload />)

    expect(screen.getAllByRole('button', { name: 'Download CV' })).toHaveLength(1)
    expect(screen.getAllByRole('button', { name: /choose cv language/i })).toHaveLength(1)
  })

  // C2 — REQ-002 AC1, AC2
  it('C2: the main action downloads the English CV without opening the menu', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(mainButton())

    expect(fetchMock).toHaveBeenCalledWith(EN_HREF)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-EN.pdf']))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // C17 — NFR-Performance
  it('C17: does not fetch any CV until the visitor asks for one', () => {
    render(<CvDownload />)

    expect(fetchMock).not.toHaveBeenCalled()
  })

  // C3 — REQ-003 AC1, AC2, AC3
  it('C3: the toggle shows "English" and "Español" in order, and closes on a second click', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    await user.click(toggle())

    const menu = screen.getByRole('menu')
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent)).toEqual([
      'English',
      'Español',
    ])

    await user.click(toggle())

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // C12 — REQ-008 AC1
  it('C12: the toggle exposes a menu popup and its expanded/collapsed state', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    expect(toggle()).toHaveAttribute('aria-haspopup', 'menu')
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')

    await user.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'true')
    expect(toggle()).toHaveAttribute('aria-controls', screen.getByRole('menu').id)

    await user.click(toggle())
    expect(toggle()).toHaveAttribute('aria-expanded', 'false')
  })

  // C13 — REQ-008 AC2
  it('C13: each option is exposed as a menu item with its visible name', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())

    expect(screen.getByRole('menu', { name: 'CV language' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'English' })).toBeVisible()
    expect(screen.getByRole('menuitem', { name: 'Español' })).toBeVisible()
  })

  // C4 — REQ-004 AC1, AC3
  it('C4: choosing "English" downloads the English CV and closes the menu', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())
    await user.click(screen.getByRole('menuitem', { name: 'English' }))

    expect(fetchMock).toHaveBeenCalledWith(EN_HREF)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-EN.pdf']))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(toggle()).toHaveFocus()
  })

  // C5 — REQ-004 AC2, AC3; REQ-005 AC2
  it('C5: choosing "Español" downloads the Spanish CV and closes the menu', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())
    await user.click(screen.getByRole('menuitem', { name: 'Español' }))

    expect(fetchMock).toHaveBeenCalledWith(ES_HREF)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-ES.pdf']))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(toggle()).toHaveFocus()
  })

  // C6 — REQ-006 AC1
  it('C6: Escape closes the menu and returns focus to the toggle', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())
    act(() => screen.getByRole('menuitem', { name: 'Español' }).focus())
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(toggle()).toHaveFocus()
  })

  // C7 — REQ-006 AC2
  it('C7: a click or tap outside closes the menu without downloading', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())
    await user.click(document.body)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // C8 — REQ-006 AC3
  it('C8: pressing Tab from a menu item closes the menu', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())
    act(() => screen.getByRole('menuitem', { name: 'English' }).focus())
    await user.tab()

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  // C8 — REQ-006 AC3 (focus leaves the control by other means)
  it('C8: moving focus outside the control closes the menu', async () => {
    const user = userEvent.setup()
    render(
      <>
        <CvDownload />
        <button type="button">Elsewhere</button>
      </>,
    )

    await user.click(toggle())
    act(() => screen.getByRole('menuitem', { name: 'English' }).focus())
    act(() => screen.getByRole('button', { name: 'Elsewhere' }).focus())

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // C9 — REQ-007 AC1
  it('C9: main action and toggle are reachable with Tab and work with Enter / Space', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.tab()
    expect(mainButton()).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(fetchMock).toHaveBeenCalledWith(EN_HREF)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-EN.pdf']))

    await user.tab()
    expect(toggle()).toHaveFocus()
    await user.keyboard(' ')
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  // C10 — REQ-007 AC2
  it('C10: opening the menu from the keyboard focuses the first option', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    act(() => toggle().focus())
    await user.keyboard('{Enter}')

    expect(screen.getByRole('menuitem', { name: 'English' })).toHaveFocus()
  })

  // C11 — REQ-007 AC3
  it('C11: arrow keys move between options with wrap-around; Enter selects', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)
    const item = (name: string) => screen.getByRole('menuitem', { name })

    act(() => toggle().focus())
    await user.keyboard('{Enter}')
    expect(item('English')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(item('Español')).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(item('English')).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(item('Español')).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(fetchMock).toHaveBeenCalledWith(ES_HREF)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-ES.pdf']))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  // C11 — REQ-007 AC3 (roving focus: options are not separate Tab stops)
  it('C11: options are reached with arrow keys, not with Tab', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(toggle())

    for (const item of screen.getAllByRole('menuitem')) {
      expect(item).toHaveAttribute('tabindex', '-1')
    }
  })

  // C14 — REQ-009 AC1, AC2
  it('C14: a failed download shows an alert with the contact email', async () => {
    fetchMock.mockResolvedValueOnce(notFound())
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(mainButton())

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/couldn.t download the cv/i)
    expect(within(alert).getByRole('link', { name: 'martin.moreno.j04@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:martin.moreno.j04@gmail.com',
    )
    expect(downloads).toEqual([])
  })

  // C15 — REQ-009 AC3
  it('C15: the alert can be dismissed and the control keeps working', async () => {
    fetchMock.mockResolvedValueOnce(notFound())
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(mainButton())
    const alert = await screen.findByRole('alert')
    await user.click(within(alert).getByRole('button', { name: /dismiss/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await user.click(mainButton())
    expect(fetchMock).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-EN.pdf']))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  // C15 — REQ-009 AC3 (a new attempt clears a previous failure)
  it('C15: a new successful attempt clears a previous failure message', async () => {
    fetchMock.mockResolvedValueOnce(notFound())
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(mainButton())
    await screen.findByRole('alert')

    await user.click(toggle())
    await user.click(screen.getByRole('menuitem', { name: 'Español' }))

    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-ES.pdf']))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  // C16 — REQ-009 AC4
  it('C16: no message is shown when the download succeeds', async () => {
    const user = userEvent.setup()
    render(<CvDownload />)

    await user.click(mainButton())

    await waitFor(() => expect(downloads).toEqual(['Martin-Moreno-Jara-CV-EN.pdf']))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
