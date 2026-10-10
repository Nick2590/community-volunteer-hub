import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { SESSION_DURATION_SECONDS } from '@/app/lib/auth-config';
import type { UserRole } from '@/app/lib/auth-types';
import { validateLogin } from '@/app/lib/auth-validation';
import { getDatabase } from '@/app/lib/db';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: SESSION_DURATION_SECONDS },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const result = validateLogin(credentials);

        if (!result.ok) {
          return null;
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
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Credentials authorize error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && typeof token.id === 'string') {
        session.user.id = token.id;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
});
