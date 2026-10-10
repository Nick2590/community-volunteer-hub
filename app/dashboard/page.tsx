import type { Metadata } from 'next';

import VolunteerDashboard from '@/components/VolunteerDashboard';

export const metadata: Metadata = {
  title: 'Volunteer Dashboard | Community Volunteer Hub',
  description: 'View and manage your volunteer project signups.',
};

export default function DashboardPage() {
  return <VolunteerDashboard />;
}
