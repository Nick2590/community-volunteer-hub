import Link from 'next/link';
import { Project, Organization } from '@/lib/types';

interface ProjectDetailProps {
  project: Project;
  organization?: Organization;
}

export default function ProjectDetail({ project, organization }: ProjectDetailProps) {
  return (
    <div className="mx-auto max-w-4xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {project.type}
          </span>
          <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {project.projectName}
          </h1>
        </div>
        <Link
          href="/projects"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Projects
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg bg-zinc-50 p-4 sm:grid-cols-3 dark:bg-zinc-800/50">
        <div>
          <p className="text-xs text-zinc-500">Date</p>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">{project.projectDate}</p>
        </div>
        {project.location && (
          <div>
            <p className="text-xs text-zinc-500">Location</p>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{project.location}</p>
          </div>
        )}
        {organization && (
          <div>
            <p className="text-xs text-zinc-500">Organized By</p>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">{organization.name}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">About this project</h2>
          <p className="mt-2 leading-relaxed text-zinc-700 dark:text-zinc-300">{project.description}</p>
        </div>

        {organization && (
          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">Organization Info</h3>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{organization.description}</p>
            <p className="mt-2 text-sm font-medium text-emerald-600">
              ✉️ {organization.contactEmail}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700">
          Sign Up for Project
        </button>
      </div>
    </div>
  );
}