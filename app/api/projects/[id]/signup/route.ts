import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import {
  getCurrentUser,
  isUniqueViolation,
  serverErrorResponse,
} from '@/app/lib/auth';
import type { AuthResponse } from '@/app/lib/auth-types';
import { getDatabase } from '@/app/lib/db';
import { getProjectById } from '@/app/lib/projects';

const jsonResponse = (
  message: string,
  status: number
): NextResponse<AuthResponse> =>
  NextResponse.json({ success: false, message }, { status });

const alreadySignedUp = (): NextResponse<AuthResponse> =>
  jsonResponse('You are already signed up for this project.', 409);

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonResponse(
        'You must sign in before signing up for a project.',
        401
      );
    }

    if (user.role !== 'VOLUNTEER') {
      return jsonResponse(
        'Only volunteer accounts can sign up for projects.',
        403
      );
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return jsonResponse('Project not found.', 404);
    }

    const sql = getDatabase();

    // A single atomic statement: insert a new signup, or reactivate a CANCELED one.
    // An already CONFIRMED signup matches the conflict but not the WHERE clause,
    // so no row is returned. Concurrent duplicate requests cannot both succeed.
    const signups = await sql`
      INSERT INTO volunteer_signups (id, project_id, volunteer_id, status)
      VALUES (${randomUUID()}, ${projectId}, ${user.id}, 'CONFIRMED')
      ON CONFLICT (project_id, volunteer_id) DO UPDATE
        SET status = 'CONFIRMED', signup_date = CURRENT_TIMESTAMP
        WHERE volunteer_signups.status = 'CANCELED'
      RETURNING id
    `;

    if (signups.length === 0) {
      return alreadySignedUp();
    }

    return NextResponse.json(
      {
        success: true,
        message: `You are signed up for ${project.title}.`,
      } satisfies AuthResponse,
      { status: 201 }
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return alreadySignedUp();
    }

    return serverErrorResponse('Volunteer signup error', error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;

  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonResponse(
        'You must sign in before canceling a project signup.',
        401
      );
    }

    if (user.role !== 'VOLUNTEER') {
      return jsonResponse(
        'Only volunteer accounts can cancel project signups.',
        403
      );
    }

    const project = await getProjectById(projectId);

    if (!project) {
      return jsonResponse('Project not found.', 404);
    }

    const sql = getDatabase();
    const signups = await sql`
      UPDATE volunteer_signups
      SET status = 'CANCELED'
      WHERE project_id = ${projectId}
        AND volunteer_id = ${user.id}
        AND status = 'CONFIRMED'
      RETURNING id
    `;

    if (signups.length === 0) {
      return jsonResponse(
        'No confirmed signup was found for this project.',
        404
      );
    }

    return NextResponse.json({
      success: true,
      message: `Your signup for ${project.title} was canceled.`,
    } satisfies AuthResponse);
  } catch (error) {
    return serverErrorResponse('Volunteer signup cancellation error', error);
  }
}
