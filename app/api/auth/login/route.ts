import { compare } from 'bcryptjs';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/app/lib/db';
import type { AuthUser, LoginInput } from '@/app/lib/auth-types';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'VOLUNTEER' | 'ORGANIZATION';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LoginInput>;

    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required.',
        },
        { status: 400 },
      );
    }

    const sql = getDatabase();

    const users = (await sql`
      SELECT id, name, email, password_hash, role
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `) as UserRow[];

    const user = users[0];

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        },
        { status: 401 },
      );
    }

    const passwordMatches = await compare(password, user.password_hash);

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password.',
        },
        { status: 401 },
      );
    }

    const sessionId = randomUUID();
    const sessionToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256')
      .update(sessionToken)
      .digest('hex');

    await sql`
      INSERT INTO sessions (id, user_id, token_hash)
      VALUES (${sessionId}, ${user.id}, ${tokenHash})
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
    });

    response.cookies.set('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          'Sign-in is currently unavailable because the database connection is not configured.',
      },
      { status: 503 },
    );
  }
}