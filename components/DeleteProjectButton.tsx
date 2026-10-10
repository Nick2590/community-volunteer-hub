'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setIsDeleting(true);
    setError('');

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}`,
        { method: 'DELETE' }
      );
      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      if (!response.ok || !data.success) {
        setError(data.message || 'Unable to delete the project.');
        setIsDeleting(false);
        return;
      }

      router.push('/projects?deleted=1');
      router.refresh();
    } catch {
      setError('Unable to delete the project right now. Please try again.');
      setIsDeleting(false);
    }
  }

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="rounded-md border border-red-700 px-4 py-2 font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
      >
        Delete project
      </button>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-labelledby="delete-project-heading"
      aria-describedby="delete-project-description"
      className="w-full rounded-md border border-red-300 bg-red-50 p-4"
    >
      <h2
        id="delete-project-heading"
        className="text-lg font-semibold text-red-950"
      >
        Delete &quot;{projectTitle}&quot;?
      </h2>
      <p id="delete-project-description" className="mt-2 text-sm text-red-950">
        Deleting this project is permanent. Existing volunteer signups will be
        canceled.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setIsConfirming(false);
            setError('');
          }}
          disabled={isDeleting}
          autoFocus
          className="rounded-md border border-slate-400 bg-white px-4 py-2 font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-md bg-red-800 px-4 py-2 font-semibold text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? 'Deleting...' : 'Delete project'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
