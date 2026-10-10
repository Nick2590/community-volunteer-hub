import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUser } from '@/app/lib/auth';
import { getOwnedProject, getProjectById } from '@/app/lib/projects';
import ProjectDetail from '@/components/ProjectDetail';
import { getOrganizationById } from '@/data/projects';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    return { title: 'Project not found' };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  const user = await getCurrentUser();
  const canManage =
    user?.role === 'ORGANIZATION' &&
    (await getOwnedProject(project.id, user.id)) !== undefined;

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <ProjectDetail
        project={project}
        organization={getOrganizationById(project.organizationId)}
        canManage={canManage}
      />
    </main>
  );
}