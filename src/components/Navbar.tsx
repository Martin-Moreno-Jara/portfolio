import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  return (
    <header className="border-b border-slate-800">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <span className="text-lg font-bold">My Portfolio</span>
        <ul className="flex gap-6">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                // `end` keeps the Home link from matching every route.
                end={link.to === '/'}
                className={({ isActive }) =>
                  isActive ? 'text-sky-400' : 'text-slate-300 hover:text-white'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
