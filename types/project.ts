export interface Organization {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
}

export interface Project {
  id: string;
  title: string;
  organization: string;
  organizationId?: string;
  date: string;
  location: string;
  description: string;
}
