'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

export interface ProjectFormValues {
  title: string;
  project_date: string;
  location: string;
  description: string;
}

interface ProjectFormProps {
  mode: 'create' | 'edit';
  projectId?: string;
  initialValues?: ProjectFormValues;
}

interface ProjectFormResponse {
  success: boolean;
  message: string;
  project?: { id: string };
}

export default function ProjectForm({
  mode,
  projectId,
  initialValues,
}: ProjectFormProps) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsError(false);

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const body = {
      title: String(formData.get('title') ?? ''),
      description: String(formData.get('description') ?? ''),
      project_date: String(formData.get('project_date') ?? ''),
      location: String(formData.get('location') ?? ''),
    };

    setIsSubmitting(true);

    try {
      const endpoint =
        isEdit && projectId
          ? `/api/projects/${encodeURIComponent(projectId)}`
          : '/api/projects';
      const response = await fetch(endpoint, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as ProjectFormResponse;

      if (!response.ok || !data.success || !data.project) {
        setIsError(true);
        setMessage(
          data.message ||
            (isEdit
              ? 'Unable to save the project.'
              : 'Unable to create the project.')
        );
        return;
      }

      setMessage(
        isEdit
          ? 'Project saved. Opening project details...'
          : 'Project created successfully. Opening project details...'
      );
      router.push(`/projects/${encodeURIComponent(data.project.id)}`);
      router.refresh();
    } catch {
      setIsError(true);
      setMessage(
        isEdit
          ? 'Unable to save the project right now. Please try again later.'
          : 'Unable to create the project right now. Please try again later.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-12 text-slate-900 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {isEdit ? 'Edit Volunteer Project' : 'Create a Volunteer Project'}
        </h1>

        <p className="mt-4 text-slate-600">
          {isEdit
            ? 'Update the details of your volunteer opportunity. The project stays associated with your organization account.'
            : 'Enter the details of your volunteer opportunity. The project will be associated with your organization account.'}
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
              defaultValue={initialValues?.title}
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <div>
            <label htmlFor="project_date" className="block font-medium">
              Project Date
            </label>
            <input
              id="project_date"
              name="project_date"
              type="date"
              required
              defaultValue={initialValues?.project_date}
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
              maxLength={300}
              defaultValue={initialValues?.location}
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
              maxLength={5000}
              defaultValue={initialValues?.description}
              className="mt-2 w-full rounded-md border border-slate-400 p-3"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-emerald-800 px-6 py-3 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isEdit
              ? isSubmitting
                ? 'Saving...'
                : 'Save Changes'
              : isSubmitting
                ? 'Creating Project...'
                : 'Create Project'}
          </button>

          {message && (
            <p
              role={isError ? 'alert' : 'status'}
              aria-live={isError ? 'assertive' : 'polite'}
              className={
                isError ? 'text-sm text-red-800' : 'text-sm text-emerald-800'
              }
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
}
