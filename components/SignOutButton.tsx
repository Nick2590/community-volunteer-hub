'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

export default function SignOutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSignOut() {
    setIsSigningOut(true);
    setMessage('');

    try {
      await signOut({ redirect: false });
      router.push('/login');
      router.refresh();
    } catch {
      setMessage('Unable to sign out right now. Please try again later.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="mt-6 rounded-md bg-emerald-800 px-4 py-2 font-semibold text-white hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSigningOut ? 'Signing Out...' : 'Sign Out'}
      </button>
      {message && (
        <p className="mt-3 text-sm text-red-800" role="alert">
          {message}
        </p>
      )}
    </>
  );
}
