import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((availableProject) => availableProject.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <article className="mx-auto w-full max-w-3xl">
        <Link
          href="/projects"
          className="text-sm font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          &larr; Back to opportunities
        </Link>

        <div className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-emerald-800">
            {project.organization}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{project.title}</h1>

          <dl className="mt-6 grid gap-5 border-y border-slate-200 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-slate-500">Date</dt>
              <dd className="mt-1 text-slate-900">{project.date}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Location</dt>
              <dd className="mt-1 text-slate-900">{project.location}</dd>
            </div>
          </dl>

          <section className="mt-6" aria-labelledby="project-description-heading">
            <h2
              id="project-description-heading"
              className="text-lg font-semibold text-slate-900"
            >
              About this opportunity
            </h2>
            <p className="mt-3 leading-7 text-slate-700">{project.description}</p>
          </section>
        </div>
      </article>
    </main>
  );
}