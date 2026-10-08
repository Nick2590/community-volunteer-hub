import ProjectCard from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import Link from 'next/link';

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParamsValue = await searchParams;
  const queryParam = searchParamsValue.query;
  const query = (Array.isArray(queryParam) ? queryParam[0] : queryParam)?.trim() ?? '';
  const normalizedQuery = query.toLowerCase();
  const matchingProjects = normalizedQuery
    ? projects.filter((project) =>
        [project.title, project.organization, project.description, project.location]
          .some((field) => field.toLowerCase().includes(normalizedQuery)),
      )
    : projects;

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

        <form action="/projects" method="get" className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="project-search" className="mb-2 block text-sm font-medium text-slate-800">
              Search volunteer opportunities
            </label>
            <input
              id="project-search"
              name="query"
              type="search"
              defaultValue={query}
              placeholder="Title, organization, description, or location"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Search
          </button>
          {query && (
            <Link
              href="/projects"
              className="px-2 py-2 text-sm font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Clear search
            </Link>
          )}
        </form>

        {matchingProjects.length > 0 ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {matchingProjects.map((project) => (
              <li key={project.id}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
        ) : query ? (
          <p role="status" className="mt-8 rounded-md border border-slate-200 bg-white p-6 text-slate-700">
            No volunteer opportunities found.
          </p>
        ) : (
          <p className="mt-8 rounded-md border border-slate-200 bg-white p-6 text-slate-700">
            There are no volunteer opportunities available right now. Please check back soon.
          </p>
        )}
      </div>
    </main>
  );
}