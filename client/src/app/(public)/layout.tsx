import { Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { BackgroundFX } from './components/BackgroundFX';
import { Footer } from './components/Footer';
import AuthButtons, { AuthButtonsSkeleton } from '@/features/auth/components/AuthButtons';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#03070a] text-gray-100 selection:bg-emerald-400/30">
      <BackgroundFX />

      <div className="relative z-10 flex flex-1 flex-col">
        <Navbar
          authButtons={
            <Suspense fallback={<AuthButtonsSkeleton />}>
              <AuthButtons />
            </Suspense>
          }
        />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}