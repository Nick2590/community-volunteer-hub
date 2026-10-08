import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { getOrganizationById, projects } from '@/data/projects';

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
      <ProjectDetail
        project={project}
        organization={getOrganizationById(project.organizationId)}
      />
    </main>
  );
}