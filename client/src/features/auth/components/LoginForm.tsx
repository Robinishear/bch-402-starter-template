"use client";

import { useActionState, useEffect } from "react";
import { handleLogin } from "../core/auth.actions";
import { showErrorAlert } from "../swal/swal_register";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(handleLogin, null);

  useEffect(() => {
    if (state && !state.success) {
      showErrorAlert(state.message);
    }
  }, [state]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <form action={formAction} noValidate className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input type="email" name="email" className="w-full px-3 py-2 border rounded-md" placeholder="user@example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" name="password" className="w-full px-3 py-2 border rounded-md" placeholder="********" />
        </div>

        <button type="submit" disabled={isPending} className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}