import Link from 'next/link';
import type { Project } from '@/types/project';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block h-full rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-700 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
    >
      <article className="flex h-full flex-col">
        <h2 className="text-xl font-semibold text-emerald-900 group-hover:text-emerald-700">
          {project.title}
        </h2>
        <p className="mt-2 text-sm font-medium text-slate-700">
          {project.organization}
        </p>
        <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="font-medium text-slate-500">Date</dt>
            <dd className="mt-1 text-slate-800">{project.date}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Location</dt>
            <dd className="mt-1 text-slate-800">{project.location}</dd>
          </div>
        </dl>
      </article>
    </Link>
  );
}