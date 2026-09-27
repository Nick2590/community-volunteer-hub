import Link from 'next/link';
import { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {project.type}
          </span>
          <span className="text-xs text-zinc-500">{project.projectDate}</span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {project.projectName}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
          {project.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {project.location && (
          <span className="text-xs text-zinc-500">📍 {project.location}</span>
        )}
        <Link
          href={`/projects/${project.id}`}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}