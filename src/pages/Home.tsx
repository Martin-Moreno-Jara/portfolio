import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Hi, I'm <span className="text-sky-400">Your Name</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
        {/* TODO: replace this with a one-line tagline describing what you do. */}
        A short tagline about what you build and care about.
      </p>
      <Link
        to="/projects"
        className="mt-8 inline-block rounded-md bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-400"
      >
        See my work
      </Link>
    </section>
  )
}
