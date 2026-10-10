import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import {
  badRequest,
  getCurrentUser,
  readJsonBody,
  serverErrorResponse,
} from '@/app/lib/auth';
import { validateCreateProject } from '@/app/lib/project-validation';
import { getDatabase } from '@/app/lib/db';
import type { Project } from '@/types/project';

interface CreatedProjectRow {
  id: string;
  title: string;
  description: string;
  project_date: string | Date;
  location: string;
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Sign in as an organization to create a project.',
        },
        { status: 401 }
      );
    }

    if (user.role !== 'ORGANIZATION') {
      return NextResponse.json(
        {
          success: false,
          message: 'Only organization accounts can create projects.',
        },
        { status: 403 }
      );
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
    const projectId = randomUUID();
    const sql = getDatabase();
    const rows = (await sql`
      INSERT INTO projects (
        id, title, description, project_date, location, organization_id
      )
      VALUES (
        ${projectId},
        ${title},
        ${description},
        ${projectDate},
        ${location},
        ${user.id}
      )
      RETURNING id::text AS id, title, description, project_date, location
    `) as CreatedProjectRow[];

    const created = rows[0];

    if (!created) {
      console.error('Project creation did not return an inserted record.');
      return NextResponse.json(
        { success: false, message: 'Unable to create the project right now.' },
        { status: 500 }
      );
    }

    const project: Project = {
      id: created.id,
      title: created.title,
      description: created.description,
      date:
        created.project_date instanceof Date
          ? created.project_date.toISOString().slice(0, 10)
          : created.project_date.slice(0, 10),
      location: created.location,
      organization: user.name,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Project created successfully.',
        project,
      },
      { status: 201 }
    );
  } catch (error) {
    return serverErrorResponse('Project creation error', error);
  }
}
