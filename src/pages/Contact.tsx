import { useState } from 'react'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // 🔧 FIX ME (#6): this handler is a stub. It never calls
    // `event.preventDefault()`, so submitting the form triggers a full page
    // reload (the default browser behaviour) and your React state is lost.
    // Hint: call event.preventDefault() first, then decide what to do with
    // the data — log it, POST it to an API, or use a service like Formspree.
    console.log(event.type, { email, message })
  }

  return (
    <section>
      <h2 className="text-3xl font-bold">Contact</h2>
      <form onSubmit={handleSubmit} className="mt-6 flex max-w-md flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message"
          rows={4}
          className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-sky-500 px-5 py-2.5 font-medium text-white hover:bg-sky-400"
        >
          Send
        </button>
      </form>
    </section>
  )
}
