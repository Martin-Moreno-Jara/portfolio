import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/skills', label: 'Skills' },
]

function linkClasses({ isActive }: { isActive: boolean }): string {
  return [
    'rounded px-1 py-2 text-sm transition-colors',
    isActive
      ? 'font-medium text-indigo-600'
      : 'text-neutral-600 hover:text-neutral-900',
  ].join(' ')
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4"
      >
        <NavLink
          to="/"
          className="rounded text-sm font-semibold tracking-tight text-neutral-900"
        >
          {/* PLACEHOLDER: replace with your name */}
          Your Name Here
        </NavLink>

        <ul className="hidden gap-8 sm:flex">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} className={linkClasses}>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="-mr-1 rounded p-1 text-neutral-600 hover:text-neutral-900 sm:hidden"
        >
          <span className="sr-only">
            {isMenuOpen ? 'Close main menu' : 'Open main menu'}
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            className="h-6 w-6"
          >
            {isMenuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <ul
          id="mobile-menu"
          className="border-t border-neutral-200 px-6 pb-4 pt-2 sm:hidden"
        >
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${linkClasses({ isActive })} block py-2`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
