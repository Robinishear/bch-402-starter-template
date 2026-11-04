import { Suspense } from 'react';

import AuthButtons, { AuthButtonsSkeleton } from '@/features/auth/components/AuthButtons';
import { BackgroundFX } from '@/app/(public)/components/BackgroundFX';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#03070a] text-gray-100 selection:bg-emerald-400/30">
      <BackgroundFX />

      <div className="relative z-10 flex flex-1 flex-col">
       
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}