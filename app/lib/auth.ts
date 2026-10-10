import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import type { AuthResponse, AuthUser, UserRole } from '@/app/lib/auth-types';
import { DatabaseConfigError, getDatabase } from '@/app/lib/db';

interface CurrentUserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Returns the signed-in user, or null when there is no valid Auth.js session.
// Identity comes from the signed JWT; name, email, and role are always re-read
// from the users table so stale or revoked roles are never trusted.
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  const sql = getDatabase();

  const rows = (await sql`
    SELECT id, name, email, role
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `) as CurrentUserRow[];

  const row = rows[0];

  if (!row) {
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