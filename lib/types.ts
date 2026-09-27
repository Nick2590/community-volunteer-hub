export interface Organization {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
}

export interface Project {
  id: string;
  projectName: string;
  description: string;
  projectDate: string;
  type: string;
  organizationId: string;
  location?: string;
  maxVolunteers?: number;
}

export interface Volunteer {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  username: string;
}

export interface Signup {
  id: string;
  projectId: string;
  volunteerId: string;
  signupDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}