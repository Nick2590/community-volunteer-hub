import { getDatabase } from '@/app/lib/db';
import { projects as sampleProjects } from '@/data/projects';
import type { Project } from '@/types/project';

interface DatabaseProjectRow {
  id: string;
  title: string;
  description: string;
  project_date: string | Date;
  location: string;
  organization_name: string;
}

function isMissingProjectsTable(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '42P01'
  );
}

function toProjectDate(value: string | Date): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

export async function getProjects(): Promise<Project[]> {
  try {
    const sql = getDatabase();
    const rows = (await sql`
      SELECT projects.id::text AS id,
             projects.title,
             projects.description,
             projects.project_date,
             projects.location,
             users.name AS organization_name
      FROM projects
      INNER JOIN users ON users.id = projects.organization_id
      WHERE users.role = 'ORGANIZATION'
      ORDER BY projects.created_at DESC
    `) as DatabaseProjectRow[];

    const databaseProjects: Project[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      organization: row.organization_name,
      date: toProjectDate(row.project_date),
      location: row.location,
      description: row.description,
    }));

    return [...databaseProjects, ...sampleProjects];
  } catch (error) {
    if (isMissingProjectsTable(error)) {
      console.warn(
        'The projects table is not available yet; showing sample projects only.'
      );
      return sampleProjects;
    }

    throw error;
  }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const availableProjects = await getProjects();
  return availableProjects.find((project) => project.id === id);
}
