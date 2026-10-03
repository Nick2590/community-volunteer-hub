'use client';

import { useState } from 'react';

interface ProjectSignupButtonProps {
  projectId: string;
}

export default function ProjectSignupButton({
  projectId,
}: ProjectSignupButtonProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);

  async function handleSignup() {
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`/api/projects/${projectId}/signup`, {
        method: 'POST',
      });

      const data = (await response.json()) as {
        success: boolean;
        message: string;
      };

      setMessage(data.message);

      if (response.ok && data.success) {
        setSignupComplete(true);
      }
    } catch (error) {
      console.error('Project signup request failed:', error);
      setMessage('Unable to complete the project signup.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={handleSignup}
        disabled={isSubmitting || signupComplete}
        className="rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting
          ? 'Signing Up...'
          : signupComplete
            ? 'Signed Up'
            : 'Sign Up'}
      </button>

      {message && (
        <p className="mt-3 text-sm text-slate-700" role="status">
          {message}
        </p>
      )}
    </div>
  );
}