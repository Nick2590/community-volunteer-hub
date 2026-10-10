
# Community Volunteer Hub

Community Volunteer Hub is a web application that connects volunteers with local organizations and community service opportunities. Volunteers can browse projects, search for opportunities, create accounts, and sign up to help. Organizations can register accounts, with project creation and management features under development.

## Live Application

https://community-volunteer-hub-ebon.vercel.app/

## Team Members

- Nicholas Goodsell
- Saul Abraham Arana Calderon
- Benjamin Merari Flores
- Cheuk Long Daiel Yim

## Technologies

- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- Neon PostgreSQL
- Vercel
- ESLint and Prettier

## Current Features

- Homepage introducing the Community Volunteer Hub
- Volunteer opportunity listings and search
- Individual project details
- Organization listings and details
- Volunteer and Organization account registration
- Email-and-password sign-in
- Account information and sign-out
- Volunteer project signup
- Duplicate signup prevention
- Project creation form with required-field validation

The project creation form is available at `/projects/new`. The initial implementation was merged through PR #23. Database saving and organization-only authorization are not yet connected.

## Getting Started

### Requirements

- Node.js and npm
- A PostgreSQL database, such as Neon, for authentication and volunteer signup features

### Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Nick2590/community-volunteer-hub.git
   cd community-volunteer-hub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and configure `DATABASE_URL` with your PostgreSQL connection string.

   Do not commit database credentials or other secrets to GitHub.

4. Apply the database schema:

   ```bash
   psql "$DATABASE_URL" -f database/schema.sql
   ```

   The schema creates the `users`, `sessions`, and `volunteer_signups` tables. It also adds `sessions.expires_at` to older databases when needed.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

### Build and Code Quality

Run the production build:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

## Application Pages

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/projects` | Browse and search volunteer opportunities |
| `/projects/new` | Volunteer project creation form; database saving is pending |
| `/register` | Create a Volunteer or Organization account |
| `/login` | Sign in |
| `/account` | View account information and sign out |

The application also includes individual project and organization detail pages.

## Authentication

Registration, sign-in, and sessions are backed by PostgreSQL through the Neon serverless driver. The application uses custom email-and-password authentication rather than Auth.js or Clerk.

### API Routes

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create an account using `name`, `email`, `password` (at least 8 characters), and `role` (`volunteer` or `organization`). Returns 400 for invalid input and 409 for duplicate email. |
| `/api/auth/login` | POST | Sign in with email and password. Returns 401 for invalid credentials. |
| `/api/auth/logout` | POST | Delete the current session and clear the session cookie. |
| `/api/auth/me` | GET | Return the signed-in user, or 401 when there is no valid session. |
| `/api/projects/[id]/signup` | POST | Register a signed-in volunteer for a project. Returns 401 for unauthorized access, 403 for Organization accounts, 404 for unknown projects, and 409 for duplicate signup. Previously canceled signups can be reactivated. |

### Session Security

- Passwords are hashed using bcrypt with cost factor 12.
- Sign-in creates a random session token. Only its SHA-256 hash is stored in the `sessions` table.
- Sessions use an HTTP-only, `SameSite=Lax` cookie, with `Secure` enabled in production.
- Session cookies and database sessions expire after seven days.
- Expired sessions are rejected and deleted.
- Signing out deletes the session.
- Server-side code can use `getCurrentUser()` from `app/lib/auth.ts` to protect routes and actions.
- Without `DATABASE_URL`, authentication endpoints requiring the database return HTTP 503.

## Database

The current database schema includes:

- `users` — registered Volunteer and Organization accounts
- `sessions` — authentication sessions
- `volunteer_signups` — volunteer registrations for opportunities

The project creation form is not yet connected to database storage. A database-backed project creation workflow is part of the remaining work for Issue #9.

## Deployment

The application is deployed using Vercel.

Production URL:

https://community-volunteer-hub-ebon.vercel.app/

To deploy another instance:

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables, including `DATABASE_URL`.
3. Ensure the PostgreSQL schema has been applied.
4. Deploy the application.
5. Verify registration, login, project browsing, and volunteer signup in the deployed environment.

Do not expose database credentials in client-side environment variables.

## Known Issues and Future Improvements

- **Issue #9:** Connect the project creation form to Neon PostgreSQL and restrict project creation to Organization accounts.
- **Homepage navigation:** Update the Post an Opportunity button to open `/projects/new` instead of linking to the footer.
- **Account navigation:** Improve the header so authenticated users can easily access My Account and Sign Out.
- **Project listing:** Display newly created projects after database integration.
- **Issue #8:** Complete the volunteer dashboard.
- **Issue #10:** Complete organization project management features.
- **Project capacity:** Volunteer signup currently does not enforce project capacity.
- Complete final Lighthouse mobile testing and CSS Overview color contrast verification.

## Development Workflow

- Work on feature branches.
- Avoid direct pushes to `main`.
- Submit changes through pull requests.
- Have at least one teammate review each pull request.
- Use ESLint and Prettier to maintain code quality.
- Track project tasks and remaining work through GitHub Issues.

## Project Repository

https://github.com/Nick2590/community-volunteer-hub
