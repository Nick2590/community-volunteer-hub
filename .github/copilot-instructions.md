# Project Style & Architecture Guidelines

## Tech Stack
- Framework: Next.js using the App Router
- Language: TypeScript with strict mode
- Styling: Tailwind CSS
- UI: Tailwind CSS with shadcn/ui-style components
- Font: Geist Sans
- Database: PostgreSQL
- Colors: Emerald as the primary color, with White and Slate/Zinc for backgrounds, text, and contrast

## Coding Standards & Conventions
- Do not use the `any` type in TypeScript.
- Define reusable shared interfaces/types for project data.
- Keep reusable components modular and inside the appropriate components directory.
- Prefer Server Components by default.
- Add `'use client'` only when a component requires state, hooks, browser APIs, or client event handlers.
- Follow the existing ESLint and Prettier configuration.
- Keep components focused and reusable.
- API endpoints should return JSON responses and appropriate HTTP status codes, including 400 for bad requests and 404 for missing records.

## Core Entities

### Organization
- id
- name
- description
- contactEmail

### Project
- id
- projectName
- description
- projectDate
- type
- organizationId

### Volunteer
- id
- name
- age
- gender
- phone
- email
- username
- passwordHash

### Signup
- id
- projectId
- volunteerId
- signupDate
- status

## Relationships
- One Organization can have many Projects.
- Each Project belongs to one Organization.
- Volunteers and Projects have a many-to-many relationship through Signup.

## Component Architecture
Primary reusable components:
- Header
- Footer
- NavLink
- ProjectCard
- ProjectDetail
- VolunteerCard

Week 04 priorities:
- Global Header, Footer, and NavLink components
- `/projects`
- `/projects/[id]`
- PostgreSQL setup and shared TypeScript types
- Project API routes
