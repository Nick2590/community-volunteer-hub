import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
} from '@/app/lib/auth-config';
import type { AuthResponse, AuthUser, UserRole } from '@/app/lib/auth-types';
import { DatabaseConfigError, getDatabase } from '@/app/lib/db';

interface SessionUserRow {
  session_id: string;
  expires_at: string | Date;
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function hashSessionToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

export function sessionExpiryDate(): Date {
  return new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// Returns the signed-in user, or null when there is no valid, unexpired session.
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const sql = getDatabase();
  const tokenHash = hashSessionToken(token);

  const rows = (await sql`
    SELECT sessions.id AS session_id, sessions.expires_at,
           users.id, users.name, users.email, users.role
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash}
    LIMIT 1
  `) as SessionUserRow[];

  const row = rows[0];

  if (!row) {
    return null;
  }

  if (new Date(row.expires_at).getTime() <= Date.now()) {
    await sql`DELETE FROM sessions WHERE id = ${row.session_id}`;
    return null;
  }

  return { id: row.id, name: row.name, email: row.email, role: row.role };
}

export function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: unknown }).code === '23505'
  );
}

// Maps unexpected failures to safe responses without leaking internals.
export function serverErrorResponse(
  context: string,
  error: unknown,
): NextResponse<AuthResponse> {
  console.error(`${context}:`, error);

  if (error instanceof DatabaseConfigError) {
    return NextResponse.json(
      { success: false, message: 'The service is temporarily unavailable.' },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { success: false, message: 'Something went wrong. Please try again later.' },
    { status: 500 },
  );
}

export async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

export function badRequest(message: string): NextResponse<AuthResponse> {
  return NextResponse.json({ success: false, message }, { status: 400 });
}