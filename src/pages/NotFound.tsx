import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-sm text-neutral-500">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 leading-relaxed text-neutral-600">
        That page does not exist. It may have been moved or removed.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded font-medium text-indigo-600 underline-offset-4 hover:underline"
      >
        Back to home
      </Link>
    </div>
  )
}
