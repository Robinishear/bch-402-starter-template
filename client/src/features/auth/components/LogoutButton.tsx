'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/_core/utils/utils';
import { handleLogout } from '../core/auth.actions';
import { authBtn } from './auth-button-styles';

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
  return (
    <form action={handleLogout}>
      <SubmitButton />
    </form>
  );
}