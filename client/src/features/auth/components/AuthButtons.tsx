import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

import { getCookie } from '@/_core/utils/cookie';
import LogoutButton from './LogoutButton';
import { authBtn } from './auth-button-styles';

export default async function AuthButtons() {
  const isLoggedIn = Boolean(await getCookie('accessToken'));

  return (
    <div className="flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <Link href="/dashboard" className={`${authBtn.primary} inline-flex items-center gap-2`}>
            <LayoutDashboard className="size-4" />
            Dashboard
          </Link>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link href="/login" className={authBtn.ghost}>
            Login
          </Link>
          <Link href="/register" className={authBtn.primary}>
            Register
          </Link>
        </>
      )}
    </div>
  );
}

export function AuthButtonsSkeleton() {
  return <div className="h-9 w-44 animate-pulse rounded-lg bg-white/5" />;
}