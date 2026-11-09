'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/_core/utils/utils';
import { handleLogout } from '../core/auth.actions';
import { authBtn } from './auth-button-styles';
import { useWalletOptional } from '@/features/users_dashboard/wizard/components/WalletProvider';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(authBtn.ghost, 'border border-white/10', pending && 'cursor-wait opacity-60')}
    >
      {pending ? 'Logging out…' : 'Logout'}
    </button>
  );
}

export default function LogoutButton() {
  const wallet = useWalletOptional();

  const onLogoutAction = async () => {
    await wallet?.disconnect();

    try {
      localStorage.removeItem('wizardconnect-session');
    } catch {
    }

    await handleLogout();
  };

  return (
    <form action={onLogoutAction}>
      <SubmitButton />
    </form>
  );
}