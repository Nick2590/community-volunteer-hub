# Community Volunteer Hub

Community Volunteer Hub is a web application that helps people find volunteer opportunities in their local community and allows organizations to post volunteer projects.

## Team Members

- Nicholas Goodsell
- Saul Abraham Arana Calderon
- Benjamin Merari Flores
- Cheuk Long Daiel Yim

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Authentication

Registration, sign-in, and sessions are backed by PostgreSQL (via the Neon serverless driver).

### Setup

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to your PostgreSQL connection string. Never commit real credentials.
2. Apply the schema to your database: `psql "$DATABASE_URL" -f database/schema.sql` (safe to re-run; it creates the `users`, `sessions` and `volunteer_signups` tables and adds `sessions.expires_at` to older databases). This single file is the complete schema.
3. Restart the dev server after changing environment variables.

### Pages

- `/register` - create a Volunteer or Organization account
- `/login` - sign in
- `/account` - view the signed-in account and sign out

### API routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create an account (`name`, `email`, `password` of 8+ characters, `role`: `volunteer` or `organization`). Returns 400 for invalid input and 409 for a duplicate email. |
| `/api/auth/login` | POST | Sign in with `email` and `password`. Returns 401 for invalid credentials. |
| `/api/auth/logout` | POST | Delete the current session and clear the cookie. |
| `/api/auth/me` | GET | Return the signed-in user, or 401 if there is no valid session. |
| `/api/projects/[id]/signup` | POST | Sign the signed-in volunteer up for a project. Returns 401 if signed out or the session expired, 403 for organization accounts, 404 for an unknown project, and 409 if already signed up. A previously canceled signup is reactivated. Project capacity is not enforced yet. |

### Sessions

- Passwords are hashed with bcrypt (cost 12).
- Signing in creates a random session token. Only its SHA-256 hash is stored in the `sessions` table.
- The token is sent in an HTTP-only, `SameSite=Lax` cookie (`Secure` in production) that lasts 7 days; the session row expires at the same time.
- Expired sessions are rejected and deleted. Signing out deletes the session immediately.
- Server code can call `getCurrentUser()` from `app/lib/auth.ts` to protect routes and actions.
- Without `DATABASE_URL`, auth endpoints that need the database return 503.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Development Workflow

- Work on feature branches.
- No direct pushes to main.
- All changes require a pull request.
- At least one teammate must review each pull request.
- ESLint and Prettier must be used before submitting changes.
