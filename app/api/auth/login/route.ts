import { compare } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import {
  badRequest,
  generateSessionToken,
  hashSessionToken,
  readJsonBody,
  serverErrorResponse,
  sessionExpiryDate,
  setSessionCookie,
} from '@/app/lib/auth';
import { validateLogin } from '@/app/lib/auth-validation';
import type { AuthResponse, AuthUser, UserRole } from '@/app/lib/auth-types';
import { getDatabase } from '@/app/lib/db';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

const invalidCredentials = (): NextResponse<AuthResponse> =>
  NextResponse.json(
    { success: false, message: 'Invalid email or password.' },
    { status: 401 },
  );

export async function POST(request: Request) {
  const body = await readJsonBody(request);

  if (body === undefined) {
    return badRequest('Request body must be valid JSON.');
  }

  const result = validateLogin(body);

  if (!result.ok) {
    return badRequest(result.message);
  }

  const { email, password } = result.value;

  try {
    const sql = getDatabase();

    const users = (await sql`
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `) as UserRow[];

    const user = users[0];

    if (!user || !(await compare(password, user.password_hash))) {
      return invalidCredentials();
    }

    const sessionToken = generateSessionToken();
    const expiresAt = sessionExpiryDate();

    await sql`
      INSERT INTO sessions (id, user_id, token_hash, expires_at)
      VALUES (
        ${randomUUID()},
        ${user.id},
        ${hashSessionToken(sessionToken)},
        ${expiresAt.toISOString()}
      )
    `;

    const authenticatedUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully.',
      user: authenticatedUser,
    } satisfies AuthResponse);

    setSessionCookie(response, sessionToken);

    return response;
  } catch (error) {
    return serverErrorResponse('Login error', error);
  }
}