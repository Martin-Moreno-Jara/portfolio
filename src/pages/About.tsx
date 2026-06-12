const skills = ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js']

export default function About() {
  return (
    <section>
      <h2 className="text-3xl font-bold">About</h2>
      <p className="mt-4 max-w-2xl text-slate-300">
        {/* TODO: replace with a couple of sentences about yourself. */}
        I'm a developer who enjoys building things for the web.
      </p>

      <h3 className="mt-8 text-xl font-semibold">Skills</h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li key={skill} className="rounded bg-slate-800 px-3 py-1 text-sm">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  )
}
