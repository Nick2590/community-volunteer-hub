import { notFound } from 'next/navigation';
import { getProjectById, getOrganizationById } from '@/lib/mock-data';
import ProjectDetail from '@/components/ProjectDetail';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const organization = getOrganizationById(project.organizationId);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <ProjectDetail project={project} organization={organization} />
    </main>
  );
}