import { hash } from 'bcryptjs';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';

import { getDatabase } from '@/app/lib/db';
import type { RegisterInput, UserRole } from '@/app/lib/auth-types';

const validRoles: UserRole[] = ['VOLUNTEER', 'ORGANIZATION'];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RegisterInput>;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const role = body.role;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, email, password, and account type are required.',
        },
        { status: 400 },
      );
    }

    if (!validRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please select a valid account type.',
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 8 characters long.',
        },
        { status: 400 },
      );
    }

    const sql = getDatabase();

    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'An account with that email already exists.',
        },
        { status: 409 },
      );
    }

    const passwordHash = await hash(password, 12);
    const userId = randomUUID();

    await sql`
      INSERT INTO users (id, name, email, password_hash, role)
      VALUES (
        ${userId},
        ${name},
        ${email},
        ${passwordHash},
        ${role}
      )
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully.',
        user: {
          id: userId,
          name,
          email,
          role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          'Registration is currently unavailable because the database connection is not configured.',
      },
      { status: 503 },
    );
  }
}