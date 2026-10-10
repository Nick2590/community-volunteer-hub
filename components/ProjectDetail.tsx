import Link from 'next/link';
import DeleteProjectButton from '@/components/DeleteProjectButton';
import ProjectSignupButton from '@/components/ProjectSignupButton';
import type { Organization, Project } from '@/types/project';

interface ProjectDetailProps {
  project: Project;
  organization?: Organization;
  canManage?: boolean;
}

export default function ProjectDetail({
  project,
  organization,
  canManage = false,
}: ProjectDetailProps) {
  return (
    <article className="mx-auto w-full max-w-3xl">
      <Link
        href="/projects"
        className="text-sm font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        &larr; Back to opportunities
      </Link>

      <div className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-emerald-800">{project.organization}</p>
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
          <h2 id="project-description-heading" className="text-lg font-semibold text-slate-900">
            About this opportunity
          </h2>
          <p className="mt-3 leading-7 text-slate-700">{project.description}</p>
        </section>

        {organization && (
          <section
            className="mt-6 border-t border-slate-200 pt-6"
            aria-labelledby="project-organization-heading"
          >
            <h2 id="project-organization-heading" className="text-lg font-semibold text-slate-900">
              About the organization
            </h2>
            <p className="mt-3 leading-7 text-slate-700">{organization.description}</p>
            <p className="mt-3 text-sm text-slate-700">
              Contact:{' '}
              <a
                href={`mailto:${organization.contactEmail}`}
                className="font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                {organization.contactEmail}
              </a>
            </p>
            <p className="mt-3 text-sm">
              <Link
                href={`/organizations/${organization.id}`}
                className="font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                View {organization.name} profile
              </Link>
            </p>
          </section>
        )}

        <div className="mt-8 flex justify-end">
          <ProjectSignupButton projectId={project.id} />
        </div>

        {canManage && (
          <section
            className="mt-8 border-t border-slate-200 pt-6"
            aria-labelledby="project-manage-heading"
          >
            <h2
              id="project-manage-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Manage this project
            </h2>
            <div className="mt-4 flex flex-wrap items-start gap-3">
              <Link
                href={`/projects/${encodeURIComponent(project.id)}/edit`}
                className="rounded-md border border-emerald-800 px-4 py-2 font-semibold text-emerald-800 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Edit project
              </Link>
              <DeleteProjectButton
                projectId={project.id}
                projectTitle={project.title}
              />
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
