import { Organization, Project } from './types';

export const mockOrganizations: Organization[] = [
  {
    id: 'org-1',
    name: 'Green Earth Community',
    description: 'Dedicados a la limpieza ambiental local e iniciativas de sostenibilidad.',
    contactEmail: 'contact@greenearth.org',
  },
  {
    id: 'org-2',
    name: 'Food For All Network',
    description: 'Proporcionando alimentos y apoyo a familias de escasos recursos.',
    contactEmail: 'info@foodforall.org',
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    projectName: 'Community Park Cleanup',
    description: 'Únete a nosotros para una mañana de plantación de árboles, recolección de basura y embellecimiento del parque central.',
    projectDate: '2026-04-15',
    type: 'Environment',
    organizationId: 'org-1',
    location: 'Central City Park',
    maxVolunteers: 20,
  },
  {
    id: '2',
    projectName: 'Food Bank Packing & Sorting',
    description: 'Ayuda a clasificar y empaquetar alimentos no perecederos para su distribución en refugios locales.',
    projectDate: '2026-04-20',
    type: 'Community Service',
    organizationId: 'org-2',
    location: 'Downtown Community Center',
    maxVolunteers: 15,
  },
];

export function getProjects(): Project[] {
  return mockProjects;
}

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((project) => project.id === id);
}

export function getOrganizationById(id: string): Organization | undefined {
  return mockOrganizations.find((org) => org.id === id);
}