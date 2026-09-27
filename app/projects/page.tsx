import { getProjects } from '@/lib/mock-data';
import ProjectCard from '@/components/ProjectCard';

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Volunteer Opportunities
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Explore volunteer projects available in your community and sign up to participate.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
}