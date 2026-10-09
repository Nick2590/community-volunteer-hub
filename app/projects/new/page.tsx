
'use client';

import { useState, type FormEvent } from 'react';

export default function NewProjectPage() {
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setMessage(
      'Your project information is valid. Database saving is not connected yet.'
    );
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Create a Volunteer Project
        </h1>

        <p className="mt-4 text-slate-600">
          Enter the details of your volunteer opportunity.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label htmlFor="title" className="block font-medium">
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={120}
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <div>
            <label htmlFor="organization" className="block font-medium">
              Organization
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              required
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <div>
            <label htmlFor="date" className="block font-medium">
              Project Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <div>
            <label htmlFor="location" className="block font-medium">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              required
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              required
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            Validate Project
          </button>

          {message && (
            <p role="status" className="text-sm text-emerald-800">
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
