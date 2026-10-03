import { createHash, randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/app/lib/db';
import { projects } from '@/data/projects';

interface SessionUserRow {
  id: string;
  role: 'VOLUNTEER' | 'ORGANIZATION';
}

interface SignupCountRow {
  count: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;

    const project = projects.find(
      (availableProject) => availableProject.id === projectId,
    );

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: 'Project not found.',
        },
        { status: 404 },
      );
    }

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must sign in before signing up for a project.',
        },
        { status: 401 },
      );
    }

    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    const sql = getDatabase();

    const users = (await sql`
      SELECT users.id, users.role
      FROM sessions
      INNER JOIN users ON users.id = sessions.user_id
      WHERE sessions.token_hash = ${tokenHash}
      LIMIT 1
    `) as SessionUserRow[];

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Your session is no longer valid.',
        },
        { status: 401 },
      );
    }

    if (user.role !== 'VOLUNTEER') {
      return NextResponse.json(
        {
          success: false,
          message: 'Only volunteer accounts can sign up for projects.',
        },
        { status: 403 },
      );
    }

    const existingSignups = await sql`
      SELECT id
      FROM volunteer_signups
      WHERE project_id = ${projectId}
        AND volunteer_id = ${user.id}
        AND status = 'CONFIRMED'
      LIMIT 1
    `;

    if (existingSignups.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are already signed up for this project.',
        },
        { status: 409 },
      );
    }

    const signupCounts = (await sql`
      SELECT COUNT(*)::int AS count
      FROM volunteer_signups
      WHERE project_id = ${projectId}
        AND status = 'CONFIRMED'
    `) as SignupCountRow[];

    const currentSignupCount = signupCounts[0]?.count ?? 0;

    /*
     * Project capacity is defined by the team specification, but the current
     * project data on main does not yet include maxVolunteers. Capacity
     * enforcement will be completed when the project database work is merged.
     */
    void currentSignupCount;

    const signupId = randomUUID();

    await sql`
      INSERT INTO volunteer_signups (
        id,
        project_id,
        volunteer_id,
        status
      )
      VALUES (
        ${signupId},
        ${projectId},
        ${user.id},
        'CONFIRMED'
      )
    `;

    return NextResponse.json(
      {
        success: true,
        message: `You are signed up for ${project.title}.`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Volunteer signup error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Unable to complete the project signup.',
      },
      { status: 500 },
    );
  }
}