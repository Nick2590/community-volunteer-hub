export type VolunteerSignupStatus = 'CONFIRMED' | 'CANCELED';

export interface VolunteerDashboardSignup {
  projectId: string;
  status: VolunteerSignupStatus;
  signupDate: string;
  projectTitle: string;
  description: string;
  date: string;
  location: string;
  detailUrl: string;
  projectAvailable: boolean;
}

export interface VolunteerDashboardResponse {
  success: boolean;
  message: string;
  volunteerName: string;
  signups: VolunteerDashboardSignup[];
}
