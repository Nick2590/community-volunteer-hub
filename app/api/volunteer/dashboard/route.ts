import { NextResponse } from 'next/server';

import { getCurrentUser, serverErrorResponse } from '@/app/lib/auth';
import { getDatabase } from '@/app/lib/db';
import { projects } from '@/data/projects';
import type {
  VolunteerDashboardResponse,
  VolunteerDashboardSignup,
  VolunteerSignupStatus,
} from '@/types/volunteer-dashboard';

interface SignupRow {
  project_id: string;
  status: VolunteerSignupStatus;
  signup_date: string | Date;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to view your volunteer dashboard.' },
        { status: 401 },
      );
    }

    if (user.role !== 'VOLUNTEER') {
      return NextResponse.json(
        { success: false, message: 'Volunteer dashboard access is only available to volunteers.' },
        { status: 403 },
      );
    }

    const sql = getDatabase();
    const signupRows = (await sql`
      SELECT project_id, status, signup_date
      FROM volunteer_signups
      WHERE volunteer_id = ${user.id}
      ORDER BY signup_date DESC
    `) as SignupRow[];

    const signups: VolunteerDashboardSignup[] = signupRows.map((signup) => {
      const project = projects.find(
        (availableProject) => availableProject.id === signup.project_id,
      );

      return {
        projectId: signup.project_id,
        status: signup.status,
        signupDate: new Date(
          signup.signup_date instanceof Date
            ? signup.signup_date.getTime()
            : signup.signup_date,
        ).toISOString(),
        projectTitle: project?.title ?? 'Project no longer available',
        description:
          project?.description ??
          'Details for this volunteer project are no longer available.',
        date: project?.date ?? '',
        location: project?.location ?? '',
        detailUrl: `/projects/${encodeURIComponent(signup.project_id)}`,
        projectAvailable: Boolean(project),
      };
    });

    return NextResponse.json({
      success: true,
      message: 'Volunteer dashboard loaded.',
      volunteerName: user.name,
      signups,
    } satisfies VolunteerDashboardResponse);
  } catch (error) {
    return serverErrorResponse('Volunteer dashboard error', error);
  }
}
