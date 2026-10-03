import { createHash } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/app/lib/db';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (sessionToken) {
      const tokenHash = createHash('sha256')
        .update(sessionToken)
        .digest('hex');

      const sql = getDatabase();

      await sql`
        DELETE FROM sessions
        WHERE token_hash = ${tokenHash}
      `;
    }

    const response = NextResponse.json({
      success: true,
      message: 'Signed out successfully.',
    });

    response.cookies.set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          'Sign-out is currently unavailable because the database connection is not configured.',
      },
      { status: 503 },
    );
  }
}