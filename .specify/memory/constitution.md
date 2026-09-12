<!--
Sync Impact Report:
- Version change: N/A → 1.0.0
- Modified principles:
  - Initialized Core Principles:
    - I. Next.js App Router Architecture (NON-NEGOTIABLE)
    - II. Strict TypeScript & Type Safety (NON-NEGOTIABLE)
    - III. Utility-First Styling & Responsive Design
    - IV. Code Quality & Formatting Standards
    - V. Component Architecture & Reusability
    - VI. Secure Authentication & Data Management
    - VII. Git & Branching Governance (NON-NEGOTIABLE)
- Added sections:
  - Core Principles
  - Technology Stack & Constraints
  - Development & Review Workflow
  - Governance
- Removed sections: N/A (template placeholders replaced)
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md (Updated Next.js App Router path conventions)
  - ✅ .specify/templates/tasks-template.md (Updated path conventions for App Router without src/)
- Follow-up TODOs: None
-->

# Community Volunteer Hub Constitution

## Core Principles

### I. Next.js App Router Architecture (NON-NEGOTIABLE)
All web application routes and pages MUST utilize the Next.js App Router (`app/` directory). Components MUST be React Server Components (RSC) by default to minimize client bundle sizes and optimize data fetching. The `'use client'` directive MUST be reserved exclusively for components requiring browser APIs, React hooks, or interactive event listeners.

*Rationale*: Server Components improve initial page load performance, SEO, and security for community members and organizations browsing volunteer opportunities.

### II. Strict TypeScript & Type Safety (NON-NEGOTIABLE)
The project MUST run TypeScript in strict mode (`"strict": true`). The `any` type is strictly forbidden across all files; explicit interface definitions or generic types MUST be declared for all data structures, API responses, props, and database models.

*Rationale*: Strict typing eliminates entire classes of runtime errors, ensures predictable data structures for user profiles and volunteer posts, and improves developer velocity and refactoring safety.

### III. Utility-First Styling & Responsive Design
All visual components MUST be styled using utility-first Tailwind CSS classes. Custom CSS MUST be avoided unless defining global theme primitives in CSS variables. UI layouts MUST be responsive across mobile, tablet, and desktop viewports, and MUST adhere to accessibility standards (WCAG 2.1 AA) using semantic HTML and ARIA attributes.

*Rationale*: Tailwind CSS guarantees visual consistency and rapid iteration, while accessible and responsive design ensures all community members can easily find and join volunteer activities on any device.

### IV. Code Quality & Formatting Standards
All code committed to the repository MUST pass ESLint linting rules and Prettier formatting checks without errors or warnings. Automated code quality checks (`npm run lint` and Prettier formatting checks) MUST pass prior to merging any pull request.

*Rationale*: Enforcing unified formatting and static code analysis reduces code review overhead and prevents syntax and stylistic friction within the development team.

### V. Component Architecture & Reusability
Code components MUST follow clean naming conventions (PascalCase for React components, camelCase for utility functions and hooks). UI elements MUST be modular, single-responsibility, and reusable. Business logic and data fetching MUST be decoupled from presentational components.

*Rationale*: Modular design prevents duplication across organization workflows and volunteer dashboards, keeping the codebase maintainable as feature requirements expand.

### VI. Secure Authentication & Data Management
Authentication and authorization logic MUST follow secure practices (e.g., HTTPS-only cookies, verified sessions, input sanitization, and parameterized database queries). Server-side actions and API handlers MUST validate authorization levels before performing read/write operations on community or user data.

*Rationale*: Protecting user personal data and organizational management rights builds trust within the volunteer community and prevents unauthorized data modifications.

### VII. Git & Branching Governance (NON-NEGOTIABLE)
Development MUST take place on dedicated feature branches (e.g., `feature/###-short-description` or `fix/###-short-description`). Direct pushes to `main` are strictly prohibited. Merging into `main` REQUIRES an opened Pull Request (PR) and at least one approving code review after all automated CI checks pass.

*Rationale*: Mandating pull requests and peer code reviews protects production stability and keeps all team members informed of architectural and functional updates.

## Technology Stack & Constraints

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Directory Layout**: No `src/` directory; `app/`, `components/`, and `lib/` are located at the project root.
- **Import Alias**: Default `@/*` pointing to project root (`./*`).
- **Tooling**: ESLint (`eslint.config.mjs`) & Prettier (`.prettierrc`).

## Development & Review Workflow

1. **Feature Planning**: All new capabilities MUST begin with a specification and implementation plan created via Spec-Kit (`.specify/`).
2. **Branch Creation**: Create a branch off `main` following naming conventions (`feature/name` or `fix/name`).
3. **Implementation & Testing**: Write code adhering to strict TypeScript types, RSC defaults, and Tailwind CSS patterns.
4. **Validation**: Execute `npm run lint` and `npm run build` locally to verify clean compilation.
5. **Pull Request**: Open a PR against `main`. Require peer review and automated verification passing before squash-and-merge.

## Governance

This constitution supersedes all informal team practices and technical decisions. Any modifications or amendments to this document MUST follow these governance rules:

1. **Amendment Procedure**: Proposed changes to principles, stack constraints, or workflows MUST be submitted via Pull Request detailing the rationale and impact.
2. **Versioning Policy**:
   - **MAJOR** version bump for backward-incompatible rule changes, removal of core principles, or major stack transitions.
   - **MINOR** version bump for new principles, expanded guidance, or added stack conventions.
   - **PATCH** version bump for clarifications, formatting fixes, or minor documentation updates.
3. **Compliance Verification**: All PR code reviews MUST explicitly check compliance against the Core Principles outlined in this document.

**Version**: 1.0.0 | **Ratified**: 2026-09-11 | **Last Amended**: 2026-09-11
