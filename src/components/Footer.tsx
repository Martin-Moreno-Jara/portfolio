const contactLinks = [
  { label: 'Email', href: 'mailto:martin.moreno.j04@gmail.com' },
  { label: 'GitHub', href: 'https://github.com/Martin-Moreno-Jara' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/martin-moreno-jara-250977242/',
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-neutral-500">
          &copy; {new Date().getFullYear()} Martin Moreno Jara
        </p>
        <ul className="flex gap-6">
          {contactLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="rounded text-neutral-600 underline-offset-4 transition-colors hover:text-indigo-600 hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
