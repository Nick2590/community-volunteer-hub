'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { AuthResponse } from '@/app/lib/auth-types';
import type {
  VolunteerDashboardResponse,
  VolunteerDashboardSignup,
} from '@/types/volunteer-dashboard';

type DashboardState = 'loading' | 'ready' | 'signed-out' | 'forbidden' | 'error';

export default function VolunteerDashboard() {
  const [dashboard, setDashboard] = useState<VolunteerDashboardResponse | null>(
    null,
  );
  const [state, setState] = useState<DashboardState>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cancelingProjectId, setCancelingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('/api/volunteer/dashboard', {
          cache: 'no-store',
        });
        const data = (await response.json()) as VolunteerDashboardResponse;

        if (response.status === 401) {
          setState('signed-out');
          setErrorMessage(data.message);
          return;
        }

        if (response.status === 403) {
          setState('forbidden');
          setErrorMessage(data.message);
          return;
        }

        if (!response.ok || !data.success || !data.volunteerName || !data.signups) {
          setState('error');
          setErrorMessage(data.message || 'Unable to load your dashboard.');
          return;
        }

        setDashboard(data);
        setState('ready');
      } catch {
        setState('error');
        setErrorMessage(
          'Unable to load your dashboard right now. Please try again later.',
        );
      }
    }

    void loadDashboard();
  }, []);

  async function cancelSignup(signup: VolunteerDashboardSignup) {
    setCancelingProjectId(signup.projectId);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(signup.projectId)}/signup`,
        { method: 'DELETE' },
      );
      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setErrorMessage(data.message || 'Unable to cancel this signup.');
        return;
      }

      setDashboard((currentDashboard) => {
        if (!currentDashboard?.signups) {
          return currentDashboard;
        }

        return {
          ...currentDashboard,
          signups: currentDashboard.signups.map((currentSignup) =>
            currentSignup.projectId === signup.projectId
              ? { ...currentSignup, status: 'CANCELED' }
              : currentSignup,
          ),
        };
      });
      setSuccessMessage(`Your signup for ${signup.projectTitle} was canceled.`);
    } catch {
      setErrorMessage(
        'Unable to cancel this signup right now. Please try again later.',
      );
    } finally {
      setCancelingProjectId(null);
    }
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <p className="text-sm font-semibold text-emerald-800">
            Your volunteer commitments
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Volunteer Dashboard
          </h1>
        </header>

        {state === 'loading' && (
          <p className="mt-6 text-slate-700" role="status" aria-live="polite">
            Loading your dashboard...
          </p>
        )}

        {state === 'signed-out' && (
          <section
            className="mt-8 rounded-md border border-slate-200 bg-white p-6"
            aria-labelledby="dashboard-sign-in-heading"
          >
            <h2 id="dashboard-sign-in-heading" className="text-xl font-semibold">
              Sign in required
            </h2>
            <p className="mt-2 text-slate-700">{errorMessage}</p>
            <Link
              href="/login"
              className="mt-4 inline-flex rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Sign in
            </Link>
          </section>
        )}

        {state === 'forbidden' && (
          <p
            className="mt-8 rounded-md border border-amber-300 bg-amber-50 p-5 text-amber-950"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {state === 'error' && (
          <p
            className="mt-8 rounded-md border border-red-300 bg-red-50 p-5 text-red-900"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        {state === 'ready' && dashboard && (
          <>
            <p className="mt-4 text-slate-700">
              Welcome, <span className="font-semibold">{dashboard.volunteerName}</span>.
              Here are the projects you have joined.
            </p>

            {errorMessage && (
              <p
                className="mt-6 rounded-md border border-red-300 bg-red-50 p-4 text-red-900"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p
                className="mt-6 rounded-md border border-emerald-300 bg-emerald-50 p-4 text-emerald-900"
                role="status"
                aria-live="polite"
              >
                {successMessage}
              </p>
            )}

            {dashboard.signups.length === 0 ? (
              <section className="mt-8 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">
                  No project signups yet
                </h2>
                <p className="mt-3 text-slate-700">
                  You haven&apos;t signed up for any volunteer projects yet.
                </p>
                <Link
                  href="/projects"
                  className="mt-5 inline-flex rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  Browse Projects
                </Link>
              </section>
            ) : (
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {dashboard.signups.map((signup) => (
                  <li key={signup.projectId}>
                    <article className="flex h-full flex-col rounded-md border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-emerald-900">
                        {signup.projectTitle}
                      </h2>

                      {signup.projectAvailable ? (
                        <p className="mt-3 leading-7 text-slate-700">
                          {signup.description}
                        </p>
                      ) : (
                        <p className="mt-3 leading-7 text-slate-600">
                          {signup.description}
                        </p>
                      )}

                      <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm">
                        <div>
                          <dt className="font-medium text-slate-600">Project date</dt>
                          <dd className="mt-1 text-slate-800">
                            {signup.date || 'Unavailable'}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-600">Location</dt>
                          <dd className="mt-1 text-slate-800">
                            {signup.location || 'Unavailable'}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-medium text-slate-600">Signup status</dt>
                          <dd
                            className={
                              signup.status === 'CONFIRMED'
                                ? 'mt-1 font-semibold text-emerald-800'
                                : 'mt-1 font-semibold text-slate-600'
                            }
                          >
                            {signup.status}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
                        {signup.projectAvailable ? (
                          <Link
                            href={signup.detailUrl}
                            className="font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                          >
                            View project details
                          </Link>
                        ) : (
                          <p className="text-sm text-slate-600">
                            Project details are unavailable.
                          </p>
                        )}
                        {signup.status === 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => void cancelSignup(signup)}
                            disabled={cancelingProjectId !== null}
                            aria-label={`Cancel signup for ${signup.projectTitle}`}
                            className="rounded-md border border-red-300 px-4 py-2 font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {cancelingProjectId === signup.projectId
                              ? 'Canceling...'
                              : 'Cancel Signup'}
                          </button>
                        )}
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-8">
              <Link
                href="/projects"
                className="font-semibold text-emerald-800 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                Browse Projects
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
