import { notFound } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { getOrganizationById, getProjectById } from '@/data/projects';
import type { Metadata } from 'next';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    return { title: 'Project not found' };
  }

  return {
    title: `${project.title}`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps ) {
  const { id } = await params;
  const project = getProjectById(id);

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