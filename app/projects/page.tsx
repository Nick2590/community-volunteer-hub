import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <p className="text-sm font-semibold text-emerald-800">
            Find a way to help
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Volunteer Opportunities
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">
            Explore local projects and find a meaningful way to support your community.
          </p>
        </header>

        {projects.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-md border border-slate-200 bg-white p-6 text-slate-700">
            There are no volunteer opportunities available right now. Please check back soon.
          </p>
        )}
      </div>
    </main>
  );
}