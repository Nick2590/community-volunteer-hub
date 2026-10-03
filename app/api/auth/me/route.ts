import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/app/lib/db';
import type { AuthUser } from '@/app/lib/auth-types';

interface SessionUserRow {
  id: string;
  name: string;
  email: string;
  role: 'VOLUNTEER' | 'ORGANIZATION';
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        {
          success: false,
          message: 'You are not signed in.',
        },
        { status: 401 },
      );
    }

    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    const sql = getDatabase();

    const users = (await sql`
      SELECT users.id, users.name, users.email, users.role
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

    const authenticatedUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return NextResponse.json({
      success: true,
      message: 'User session found.',
      user: authenticatedUser,
    });
  } catch (error) {
    console.error('Session lookup error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          'Session lookup is currently unavailable because the database connection is not configured.',
      },
      { status: 503 },
    );
  }
}