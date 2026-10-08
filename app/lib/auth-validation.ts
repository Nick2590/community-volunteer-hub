import type { LoginInput, RegisterInput, UserRole } from '@/app/lib/auth-types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 8;
// bcrypt ignores everything after 72 bytes
const MAX_PASSWORD_BYTES = 72;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  const email = value.trim().toLowerCase();

  if (email.length === 0 || email.length > MAX_EMAIL_LENGTH) {
    return null;
  }

  return EMAIL_PATTERN.test(email) ? email : null;
}

export function normalizeRole(value: unknown): UserRole | null {
  if (typeof value !== 'string') {
    return null;
  }

  const role = value.trim().toUpperCase();

  return role === 'VOLUNTEER' || role === 'ORGANIZATION' ? role : null;
}

export function validateRegistration(body: unknown): ValidationResult<RegisterInput> {
  if (!isRecord(body)) {
    return { ok: false, message: 'Request body must be a JSON object.' };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      message: `Name is required and must be at most ${MAX_NAME_LENGTH} characters.`,
    };
  }

  const email = normalizeEmail(body.email);

  if (!email) {
    return { ok: false, message: 'A valid email address is required.' };
  }

  const password = body.password;

  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Password must be a string of at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    return {
      ok: false,
      message: `Password must be at most ${MAX_PASSWORD_BYTES} bytes long.`,
    };
  }

  const role = normalizeRole(body.role);

  if (!role) {
    return {
      ok: false,
      message: 'Account type must be either volunteer or organization.',
    };
  }

  return { ok: true, value: { name, email, password, role } };
}

export function validateLogin(body: unknown): ValidationResult<LoginInput> {
  if (!isRecord(body)) {
    return { ok: false, message: 'Request body must be a JSON object.' };
  }

  const email = normalizeEmail(body.email);
  const password = body.password;

  if (!email || typeof password !== 'string' || password.length === 0) {
    return { ok: false, message: 'Email and password are required.' };
  }

  return { ok: true, value: { email, password } };
}