# Community Volunteer Hub

Community Volunteer Hub connects volunteers with local organizations and community service opportunities. Volunteers can browse and search sample and organization-created project listings, view project and organization details, create accounts, and sign up for projects. Organization-created projects are stored in Neon PostgreSQL.

## About the Project

### Problem

Local organizations often struggle to reach willing volunteers, and volunteers have no single place to find nearby opportunities, sign up, and keep track of what they have committed to. Information is scattered across social media posts, flyers, and email threads.

### Solution

Community Volunteer Hub gives organizations one place to post and manage volunteer opportunities, and gives volunteers one place to discover them, sign up, and manage their signups from a personal dashboard.

### Intended Audience

- **Volunteers:** community members who want to find, join, and track local volunteer projects.
- **Organizations:** nonprofits, neighborhood groups, and schools that need volunteers and want to publish and manage projects.
## Live Application

[https://community-volunteer-hub-ebon.vercel.app/](https://community-volunteer-hub-ebon.vercel.app/)

## Team Members

- Nicholas Goodsell
- Saul Abraham Arana Calderon
- Benjamin Merari Flores
- Cheuk Long Daniel Yim

## Features

- Homepage introducing the Community Volunteer Hub
- Browse and search volunteer opportunities
- Individual project details
- Organization listings and details
- Volunteer and Organization account registration
- Email-and-password sign-in, account information, and sign-out
- Volunteer project signup, including duplicate-signup prevention and reactivation of canceled signups
- Volunteer dashboard for viewing joined projects and canceling confirmed signups
- Organization-only project creation at `/projects/new`; projects are associated with the signed-in organization account
- Organization project editing at `/projects/[id]/edit`, available only to the organization that owns the project
- Organization project deletion with a confirmation step; existing confirmed volunteer signups are changed to `CANCELED` and kept as history
- Responsive navigation that shows My Account and Sign Out for signed-in users, a skip-to-main-content link, and custom 404 and error pages

The existing sample projects remain available alongside database projects. Newly created database projects appear in the same opportunity list, search results, and project detail route.

## Technologies

- Next.js with App Router
- React and TypeScript
- Tailwind CSS
- Neon PostgreSQL with the Neon serverless driver
- bcryptjs for password hashing
- Vercel
- ESLint and Prettier

## Application Pages

| Route                 | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `/`                   | Homepage                                                    |
| `/projects`           | Browse and search volunteer opportunities                   |
| `/projects/[id]`      | View a project and its signup option                        |
| `/dashboard`          | View volunteer project signups and cancel confirmed signups |
| `/projects/new`       | Organization-only project creation form                     |
| `/projects/[id]/edit` | Organization-only form to edit a project the organization owns |
| `/organizations`      | Browse organizations                                        |
| `/organizations/[id]` | View an organization                                        |
| `/register`           | Create a Volunteer or Organization account                  |
| `/login`              | Sign in                                                     |
| `/account`            | View account information and sign out                       |

## Design System

- **Palette:** emerald is the brand color. `emerald-800` is used for primary buttons and headings (white text on it has a contrast ratio of about 7.7:1) and `emerald-700` for links and hover states. Slate shades provide text (`slate-900`, `slate-700`, `slate-600`), borders (`slate-200`, `slate-300`), and the `slate-50` page background. White is used for cards, the header, and the footer. Red (`red-800`) is reserved for destructive actions such as deleting a project.
- **Typography:** Geist Sans, loaded with `next/font` and applied to the whole site. Headings use Tailwind's `text-3xl`/`text-4xl` (page titles) down to `text-lg`/`text-xl` (section titles), with `text-sm` for labels and secondary text.
- **Components:** reusable components live in [`components/`](./components).
  - Used on every page through the root layout: `Header`, `NavLink` (the main navigation), and `Footer`.
  - Used on more than one page: `ProjectCard` (the opportunities list and each organization's detail page) and `ProjectForm` (create and edit).
  - Also shared: `PageMessage` (the 404 and error pages), `ProjectDetail`, `OrganizationCard`, `ProjectSignupButton`, `DeleteProjectButton`, and `VolunteerDashboard`.
- **Accessibility:** a skip-to-main-content link, visible `focus-visible` outlines, labeled form fields, `aria-current` on the active navigation link, `role="alert"` and `role="status"` for feedback messages, and an accessible confirmation dialog for deleting projects.
## Local Setup

### Requirements

- Node.js and npm
- A Neon PostgreSQL database for authentication, volunteer signups, and organization-created projects
- The PostgreSQL command-line client (`psql`) to apply the schema

### Install and configure

1. Clone the repository and move into its directory:

   ```bash
   git clone https://github.com/Nick2590/community-volunteer-hub.git
   cd community-volunteer-hub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to the connection string for your Neon database. Keep the connection string secret and never commit `.env.local`.

   `.env.example` documents the only environment variable currently used by the application:

   | Variable       | Required                          | Description                       |
   | -------------- | --------------------------------- | --------------------------------- |
   | `DATABASE_URL` | Yes, for database-backed features | Neon PostgreSQL connection string |

4. Apply the database schema as described in [Neon Database Setup](#neon-database-setup).

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

### Build and lint

Run a production build:

```bash
npm run build
```

Run ESLint:

```bash
npm run lint
```

## Neon Database Setup

1. Create a PostgreSQL project in [Neon](https://neon.tech/) and copy its connection string from the Neon dashboard.
2. Set that string as `DATABASE_URL` in `.env.local` for local development. Configure the same variable in the Vercel project settings for deployment; do not expose it through a `NEXT_PUBLIC_` variable.
3. Ensure `psql` is installed and apply [`database/schema.sql`](./database/schema.sql) to the Neon database. Use the connection string in place of `<NEON_CONNECTION_STRING>`:

   ```bash
   psql "<NEON_CONNECTION_STRING>" -f database/schema.sql
   ```

   This creates the `users`, `sessions`, `volunteer_signups`, and `projects` tables, indexes, and constraints. It also adds `sessions.expires_at` to existing session tables when needed. The project table links ownership to the organization account in `users`; applying this schema is required for project creation and database-backed project listings.

4. Keep database credentials out of source control. The local `.env.local` file should not be committed.

## Authentication

Authentication uses custom email-and-password flows backed by Neon PostgreSQL; the project does not use Auth.js or Clerk. **Note:** the course specification lists Auth.js v5 or Clerk for authentication. This custom implementation still needs instructor confirmation that it is acceptable. Register at `/register` with a name, email, password of at least eight characters, and either the Volunteer or Organization role. Sign in at `/login`; the `/account` page shows the current account and provides sign-out.

Passwords are hashed with bcrypt using cost factor 12. On sign-in, the application creates a random session token and stores only its SHA-256 hash in the `sessions` table. The session cookie is HTTP-only and `SameSite=Lax`, with `Secure` enabled in production. Sessions expire after seven days; expired sessions are rejected and removed, and signing out deletes the database session. Server-side code can use `getCurrentUser()` from [`app/lib/auth.ts`](./app/lib/auth.ts) to check the signed-in user. Authentication endpoints that need the database return HTTP 503 when `DATABASE_URL` is not configured.

## API Documentation

| Route                       | Method | Description                                                                                                                                                                                                                     |
| --------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/api/auth/register`        | POST   | Creates an account from `name`, `email`, `password` (at least eight characters), and `role` (`volunteer` or `organization`). Returns 400 for invalid input and 409 for a duplicate email.                                       |
| `/api/auth/login`           | POST   | Signs in with `email` and `password`. Returns 400 for invalid input and 401 for invalid credentials.                                                                                                                            |
| `/api/auth/logout`          | POST   | Deletes the current database session when present and clears the session cookie.                                                                                                                                                |
| `/api/auth/me`              | GET    | Returns the signed-in user, or 401 when no valid session exists.                                                                                                                                                                |
| `/api/projects`             | POST   | Creates a project for the signed-in Organization account. Returns 401 when signed out, 403 for Volunteer accounts, 400 for invalid input, and 201 with the created project's public data on success.                            |
| `/api/projects/[id]`        | PATCH  | Updates a database-backed project owned by the signed-in Organization account. Returns 401 when signed out, 403 for Volunteer accounts, 404 for sample, missing, invalid, or non-owned projects, and 400 for invalid input.     |
| `/api/projects/[id]`        | DELETE | Deletes a database-backed project owned by the signed-in Organization account. Existing confirmed volunteer signups are marked CANCELED atomically before the project is deleted. Returns 401 when signed out, 403 for Volunteer accounts, and 404 for sample, missing, invalid, or non-owned projects. |
| `/api/volunteer/dashboard`  | GET    | Returns the authenticated volunteer's name and project signup details. Returns 401 when signed out and 403 for Organization accounts.                                                                                           |
| `/api/projects/[id]/signup` | POST   | Signs up the current Volunteer for an existing project. Returns 401 when signed out, 403 for Organization accounts, 404 for an unknown project, and 409 for an existing confirmed signup. A canceled signup can be reactivated. |
| `/api/projects/[id]/signup` | DELETE | Cancels the authenticated volunteer's confirmed signup for the project. Returns 401 when signed out, 403 for Organization accounts, and 404 when the project or confirmed signup is not found.                                  |

Project signup records are stored in PostgreSQL. Sample projects retain their existing IDs and details; database projects are read through the shared server-side project data layer and appear alongside those samples. Project creation and editing ownership is derived from the authenticated Organization account, not from submitted form data. When an organization deletes one of its database-backed projects, existing confirmed volunteer signups are preserved as history and changed to `CANCELED` before the project record is removed.

## Testing the Application (for Graders)

No pre-made accounts are required, and no credentials are published in this repository. Anyone can create test accounts on the live site:

1. Go to `/register` and create an **Organization** account (choose the Organization account type), then sign in at `/login`.
2. Create a project at `/projects/new`. Open its detail page and use **Edit** (`/projects/[id]/edit`) and **Delete** (with the confirmation step) to try editing and deleting.
3. Sign out from the navigation, then create and sign in with a **Volunteer** account in the same way.
4. As the volunteer, open a project, sign up, and view and cancel the signup on `/dashboard`.
5. Confirm the permission rules: a Volunteer cannot create, edit, or delete projects, and an Organization cannot edit or delete another organization's projects (they receive a not-found page).

The three sample projects and sample organizations are static demo data. They can be browsed and signed up for, but cannot be edited or deleted. If you would like pre-made demo accounts, ask the team to share credentials privately.
## Deployment

The application is deployed on Vercel:

[https://community-volunteer-hub-ebon.vercel.app/](https://community-volunteer-hub-ebon.vercel.app/)

To deploy another instance:

1. Import the GitHub repository into Vercel.
2. Add `DATABASE_URL` in the Vercel project settings.
3. Apply [`database/schema.sql`](./database/schema.sql) to the Neon database used by the deployment.
4. Deploy the application.
5. Verify registration, sign-in, project browsing, organization project creation/editing/deletion, volunteer dashboard access, signup, and cancellation in the deployed environment.

Never expose database credentials in client-side environment variables.

## Known Issues and Future Improvements

### Known issues

- **Authentication requirement:** authentication is custom, not Auth.js or Clerk. Instructor confirmation is still needed (see [Authentication](#authentication)).
- Organization pages and the three sample projects are static data; organizations are not database records, so organization pages do not list database-created projects.
- Volunteer signup does not enforce project capacity.
- Lighthouse mobile scores and a full color-contrast audit have not been completed. Contrast ratios were calculated by hand but not verified with an audit tool.
- The navigation checks the signed-in user with a request after the page loads, so the Sign In or My Account/Sign Out links appear a moment after the page renders.

### Future improvements

- Move to Auth.js v5 or Clerk if the instructor requires it.
- Store organization profiles in the database and show their projects on their pages.
- Add project capacity limits and waitlists.
- Add profile management and password reset.
- Add pagination and filtering (by date and location) to the opportunities list.
- Add automated tests and a database migration tool.
## Development Workflow

- Work on feature branches; do not push directly to `main`.
- Submit changes through pull requests and have at least one teammate review each pull request.
- Use ESLint and Prettier to maintain code quality.
- Track project tasks and remaining work through GitHub Issues.

## Project Repository

[https://github.com/Nick2590/community-volunteer-hub](https://github.com/Nick2590/community-volunteer-hub)
