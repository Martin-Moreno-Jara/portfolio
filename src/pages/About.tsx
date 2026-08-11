import projectsData from "../data/projects.json";
import type { Project } from "../types";

const projects = projectsData as Project[];

interface TimelineEntry {
  period: string;
  role: string;
  org: string;
  detail: string;
}

const education: TimelineEntry[] = [
  {
    period: "2022 — Present · Expected graduation June 2027",
    role: "Systems and Computer Engineering",
    org: "Universidad Nacional de Colombia · Bogotá, Colombia",
    detail:
      "Relevant coursework: Software Architecture and Software Engineering, Data Structures & Algorithms, Databases, Computer Networks, and Introduction to Intelligent Systems (Machine Learning & Deep Learning).",
  },
];

// The project timeline is derived from the same data that drives /projects,
// so the two pages can never drift apart.
const projectTimeline: TimelineEntry[] = projects.map((project) => ({
  period: project.period,
  role: project.title,
  org: project.subtitle,
  detail: project.description,
}));

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="mt-6 space-y-8">
      {entries.map((entry) => (
        <li
          key={`${entry.role}-${entry.period}`}
          className="border-l border-neutral-200 pl-6">
          <p className="text-xs uppercase tracking-wide text-neutral-500">
            {entry.period}
          </p>
          <h3 className="mt-1 text-base font-medium text-neutral-900">
            {entry.role}
          </h3>
          <p className="text-sm text-neutral-600">{entry.org}</p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            {entry.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
        About
      </h1>

      <div className="mt-6 space-y-4 leading-relaxed text-neutral-600">
        <p>
          I'm a Systems and Computer Engineering student at Universidad Nacional
          de Colombia in Bogotá, with an expected graduation in June 2027. My
          coursework has centred on software architecture and engineering,
          databases, data structures and algorithms, computer networks, and
          intelligent systems.
        </p>
        <p className="text-justify">
          The work I enjoy most sits at the backend and infrastructure layer -
          designing and implementing the microservices and APIs that power
          applications, and then carefully choosing the cloud infrastructure
          that supports them. <br></br>
          In practice that has meant developing APIs and implementing software
          architectural elements to create an efficient and safe communication
          between them, such as API gateways, reverse proxies and secure
          channels, as well as monitoring systems that help track the health of
          the system, like telemetry pipelines built using Prometheus and
          Grafana. All in order to create robust and scalable software systems
          that can be deployed in cloud environments, with containerized
          deployments on platforms such as GCP. Alongside that, I've picked an
          interest in machine learning and computer vision, and have been
          studying and building deep learning pipelines, such as a classifier
          for brain MRI scans, and a pipeline for detecting and classifying
          objects in images.
        </p>
      </div>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Education
        </h2>
        <Timeline entries={education} />
      </section>

      <section className="mt-16">
        <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-900">
          Project Timeline
        </h2>
        <Timeline entries={projectTimeline} />
      </section>
    </div>
  );
}
