import type { ReactNode } from 'react';

interface PageMessageProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}

export default function PageMessage({
  eyebrow,
  title,
  children,
  actions,
}: PageMessageProps) {
  return (
    <main className="min-h-full flex-1 bg-slate-50 px-6 py-16 text-slate-900 sm:py-24">
      <div className="mx-auto w-full max-w-xl rounded-md border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold text-emerald-800">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
        <div className="mt-4 leading-7 text-slate-700">{children}</div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {actions}
        </div>
      </div>
    </main>
  );
}
