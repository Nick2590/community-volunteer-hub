import type { Organization, Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'river-trail-cleanup',
    title: 'River Trail Cleanup',
    organization: 'Greenway Community Alliance',
    organizationId: 'greenway-community-alliance',
    date: 'October 17, 2026',
    location: 'Riverside Park, Portland, OR',
    description:
      'Help remove litter and invasive plants along the river trail. Gloves, bags, and cleanup supplies will be provided. Volunteers should wear comfortable clothes and sturdy shoes.',
  },
  {
    id: 'community-food-pantry',
    title: 'Community Food Pantry Support',
    organization: 'Northside Neighbors Network',
    organizationId: 'northside-neighbors-network',
    date: 'October 24, 2026',
    location: 'Northside Community Center, Portland, OR',
    description:
      'Sort donated groceries, prepare pantry orders, and welcome neighbors during the weekly food distribution. No experience is needed, and an orientation will be provided at the start of the shift.',
  },
  {
    id: 'reading-buddies',
    title: 'Saturday Reading Buddies',
    organization: 'Rose City Youth Literacy',
    organizationId: 'rose-city-youth-literacy',
    date: 'October 31, 2026',
    location: 'Brookside Public Library, Portland, OR',
    description:
      'Spend a Saturday morning reading with elementary school students and helping them build confidence with books. Volunteers are matched with a small group and given age-appropriate reading materials.',
  },
];
export const organizations: Organization[] = [
  {
    id: 'greenway-community-alliance',
    name: 'Greenway Community Alliance',
    description:
      'A neighborhood group dedicated to local cleanup efforts and sustainability initiatives.',
    contactEmail: 'contact@greenwayalliance.org',
    phoneNumber: '503-200-3355',
  },
  {
    id: 'northside-neighbors-network',
    name: 'Northside Neighbors Network',
    description:
      'Providing food and support to families in need across the Northside community.',
    contactEmail: 'info@northsideneighbors.org',
    phoneNumber: '503-282-0555',
  },
  {
    id: 'rose-city-youth-literacy',
    name: 'Rose City Youth Literacy',
    description:
      'Helping elementary school students build reading skills and confidence through volunteer mentoring.',
    contactEmail: 'hello@rosecityliteracy.org',
    phoneNumber: '503-844-9571',
  },
];

export function getOrganizationById(id: string | undefined): Organization | undefined {
  return id ? organizations.find((organization) => organization.id === id) : undefined;
}

export function getProjectById(id: string | undefined): Project | undefined {
  return id ? projects.find((project) => project.id === id) : undefined;
}