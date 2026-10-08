import { NextResponse } from 'next/server';

import { getCurrentUser, serverErrorResponse } from '@/app/lib/auth';
import type { AuthResponse } from '@/app/lib/auth-types';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'You are not signed in.' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User session found.',
      user,
    } satisfies AuthResponse);
  } catch (error) {
    return serverErrorResponse('Session lookup error', error);
  }
}