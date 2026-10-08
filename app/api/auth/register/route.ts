import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { BCRYPT_COST } from '@/app/lib/auth-config';
import {
  badRequest,
  isUniqueViolation,
  readJsonBody,
  serverErrorResponse,
} from '@/app/lib/auth';
import { validateRegistration } from '@/app/lib/auth-validation';
import type { AuthResponse } from '@/app/lib/auth-types';
import { getDatabase } from '@/app/lib/db';

const duplicateEmailResponse = (): NextResponse<AuthResponse> =>
  NextResponse.json(
    { success: false, message: 'An account with that email already exists.' },
    { status: 409 },
  );

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (body === undefined) {
    return badRequest('Request body must be valid JSON.');
  }

  const result = validateRegistration(body);

  if (!result.ok) {
    return badRequest(result.message);
  }

  const { name, email, password, role } = result.value;

  try {
    const sql = getDatabase();

    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email} LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return duplicateEmailResponse();
    }

    const passwordHash = await hash(password, BCRYPT_COST);
    const userId = randomUUID();

    await sql`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (${userId}, ${name}, ${email}, ${passwordHash}, ${role})
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: { id: userId, name, email, role },
      } satisfies AuthResponse,
      { status: 201 },
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      return duplicateEmailResponse();
    }

    return serverErrorResponse('Registration error', error);
  }
}