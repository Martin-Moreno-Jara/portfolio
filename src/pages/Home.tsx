import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      {/* PLACEHOLDER: every string on this page is placeholder copy. */}
      <p className="text-sm text-neutral-500">Your Professional Title</p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Your Name Here
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neutral-600">
        A short tagline goes here — one memorable line about the kind of work you
        do and who you do it for.
      </p>

      <p className="mt-6 leading-relaxed text-neutral-600">
        This is your intro paragraph. Write two or three sentences covering your
        background, the kind of problems you enjoy working on, and what you are
        looking for right now. Keep it conversational and specific — mention the
        technologies you reach for and the sort of team you want to join.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/projects"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          View Projects
        </Link>
        <a
          href="/resume-placeholder.pdf"
          download
          className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400"
        >
          Download Resume
        </a>
      </div>
    </div>
  )
}
