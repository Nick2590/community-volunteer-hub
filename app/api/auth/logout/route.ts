import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import {
  clearSessionCookie,
  hashSessionToken,
  serverErrorResponse,
} from '@/app/lib/auth';
import { SESSION_COOKIE_NAME } from '@/app/lib/auth-config';
import type { AuthResponse } from '@/app/lib/auth-types';
import { getDatabase } from '@/app/lib/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      const sql = getDatabase();

      await sql`
        DELETE FROM sessions WHERE token_hash = ${hashSessionToken(sessionToken)}
      `;
    }

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully.',
    } satisfies AuthResponse);

    clearSessionCookie(response);

    return response;
  } catch (error) {
    return serverErrorResponse('Logout error', error);
  }
}