import type { ValidationResult } from '@/app/lib/auth-validation';

export interface CreateProjectInput {
  title: string;
  description: string;
  location: string;
  projectDate: string;
}

const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_LOCATION_LENGTH = 300;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCalendarDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (year === 0 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day <= daysInMonth[month - 1];
}

export function validateCreateProject(
  body: unknown
): ValidationResult<CreateProjectInput> {
  if (!isRecord(body)) {
    return { ok: false, message: 'Request body must be a JSON object.' };
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';

  if (title.length === 0 || title.length > 120) {
    return {
      ok: false,
      message: 'Title is required and must be at most 120 characters.',
    };
  }

  const description =
    typeof body.description === 'string' ? body.description.trim() : '';

  if (description.length === 0 || description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      message: `Description is required and must be at most ${MAX_DESCRIPTION_LENGTH} characters.`,
    };
  }

  const location =
    typeof body.location === 'string' ? body.location.trim() : '';

  if (location.length === 0 || location.length > MAX_LOCATION_LENGTH) {
    return {
      ok: false,
      message: `Location is required and must be at most ${MAX_LOCATION_LENGTH} characters.`,
    };
  }

  const projectDate =
    typeof body.project_date === 'string' ? body.project_date.trim() : '';

  if (!isCalendarDate(projectDate)) {
    return {
      ok: false,
      message:
        'Project date must be a valid calendar date in YYYY-MM-DD format.',
    };
  }

  return {
    ok: true,
    value: { title, description, location, projectDate },
  };
}
