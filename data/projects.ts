import type { Project } from '@/types/project';

export const projects: Project[] = [
  {
    id: 'river-trail-cleanup',
    title: 'River Trail Cleanup',
    organization: 'Greenway Community Alliance',
    date: 'October 17, 2026',
    location: 'Riverside Park, Portland, OR',
    description:
      'Help remove litter and invasive plants along the river trail. Gloves, bags, and cleanup supplies will be provided. Volunteers should wear comfortable clothes and sturdy shoes.',
  },
  {
    id: 'community-food-pantry',
    title: 'Community Food Pantry Support',
    organization: 'Northside Neighbors Network',
    date: 'October 24, 2026',
    location: 'Northside Community Center, Portland, OR',
    description:
      'Sort donated groceries, prepare pantry orders, and welcome neighbors during the weekly food distribution. No experience is needed, and an orientation will be provided at the start of the shift.',
  },
  {
    id: 'reading-buddies',
    title: 'Saturday Reading Buddies',
    organization: 'Rose City Youth Literacy',
    date: 'October 31, 2026',
    location: 'Brookside Public Library, Portland, OR',
    description:
      'Spend a Saturday morning reading with elementary school students and helping them build confidence with books. Volunteers are matched with a small group and given age-appropriate reading materials.',
  },
];