import { NextResponse } from 'next/server';

import {
  badRequest,
  getCurrentUser,
  readJsonBody,
  serverErrorResponse,
} from '@/app/lib/auth';
import { getDatabase } from '@/app/lib/db';
import { validateCreateProject } from '@/app/lib/project-validation';
import { isDatabaseProjectId, toProjectDate } from '@/app/lib/projects';
import type { Project } from '@/types/project';

interface UpdatedProjectRow {
  id: string;
  title: string;
  description: string;
  project_date: string | Date;
  location: string;
}

interface DeleteResultRow {
  deleted_count: string | number;
  canceled_count: string | number;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ success: false, message }, { status });
}

const NOT_FOUND_MESSAGE = 'Project not found.';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError('Sign in as an organization to edit a project.', 401);
    }

    if (user.role !== 'ORGANIZATION') {
      return jsonError('Only organization accounts can edit projects.', 403);
    }

    const { id } = await params;

    if (!isDatabaseProjectId(id)) {
      return jsonError(NOT_FOUND_MESSAGE, 404);
    }

    const body = await readJsonBody(request);

    if (body === undefined) {
      return badRequest('Request body must be valid JSON.');
    }

    const validation = validateCreateProject(body);

    if (!validation.ok) {
      return badRequest(validation.message);
    }

    const { title, description, location, projectDate } = validation.value;
    const sql = getDatabase();
    const rows = (await sql`
      UPDATE projects
      SET title = ${title},
          description = ${description},
          project_date = ${projectDate},
          location = ${location},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
        AND organization_id = ${user.id}
      RETURNING id::text AS id, title, description, project_date, location
    `) as UpdatedProjectRow[];

    const updated = rows[0];

    if (!updated) {
      return jsonError(NOT_FOUND_MESSAGE, 404);
    }

    const project: Project = {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      date: toProjectDate(updated.project_date),
      location: updated.location,
      organization: user.name,
    };

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully.',
      project,
    });
  } catch (error) {
    return serverErrorResponse('Project update error', error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return jsonError('Sign in as an organization to delete a project.', 401);
    }

    if (user.role !== 'ORGANIZATION') {
      return jsonError('Only organization accounts can delete projects.', 403);
    }

    const { id } = await params;

    if (!isDatabaseProjectId(id)) {
      return jsonError(NOT_FOUND_MESSAGE, 404);
    }

    // One statement, so ownership check, signup cancellation and deletion
    // succeed or fail together. Signups are only touched for an owned project.
    const sql = getDatabase();
    const rows = (await sql`
      WITH owned AS (
        SELECT id
        FROM projects
        WHERE id = ${id}
          AND organization_id = ${user.id}
        FOR UPDATE
      ),
      canceled AS (
        UPDATE volunteer_signups
        SET status = 'CANCELED'
        WHERE project_id IN (SELECT id::text FROM owned)
          AND status = 'CONFIRMED'
        RETURNING id
      ),
      deleted AS (
        DELETE FROM projects
        WHERE id IN (SELECT id FROM owned)
        RETURNING id
      )
      SELECT (SELECT COUNT(*) FROM deleted) AS deleted_count,
             (SELECT COUNT(*) FROM canceled) AS canceled_count
    `) as DeleteResultRow[];

    if (Number(rows[0]?.deleted_count ?? 0) === 0) {
      return jsonError(NOT_FOUND_MESSAGE, 404);
    }

    return NextResponse.json({
      success: true,
      message: 'Project deleted. Existing volunteer signups were canceled.',
      canceledSignups: Number(rows[0].canceled_count),
    });
  } catch (error) {
    return serverErrorResponse('Project deletion error', error);
  }
}
