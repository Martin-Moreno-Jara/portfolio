import { Link } from 'react-router-dom'
import CvDownload from '../components/CvDownload'

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="text-sm text-neutral-500">
        Systems and Computer Engineering Student · Bogotá, Colombia
      </p>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        Martin Moreno Jara
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-neutral-600">
        I build backend systems and cloud infrastructure — microservices, REST
        APIs, and containerized deployments — with a foot in machine learning and
        computer vision.
      </p>

      <p className="mt-6 leading-relaxed text-neutral-600">
        I'm a Systems and Computer Engineering student at Universidad Nacional de
        Colombia, graduating in June 2027. Most of my work so far has been at the
        infrastructure layer: designing microservices behind an API gateway,
        building APIs in FastAPI and Flask, and deploying containerized services
        to Google Cloud Platform. Alongside that I've trained deep-learning models
        for computer vision, like a classifier for brain MRI scans.
      </p>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/projects"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          View Projects
        </Link>
        <CvDownload />
      </div>
    </div>
  )
}
