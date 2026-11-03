"use client";

import { useState } from "react";
import { socialLogin } from "../lib/auth-client";

export default function SocialButtons() {
  const [loading, setLoading] = useState<"google" | "github" | null>(null);

  const handle = async (provider: "google" | "github") => {
    setLoading(provider);
    await socialLogin(provider); 
    setLoading(null);
  };

  return (
    <div className="max-w-md mx-auto mt-4 space-y-2">
      <button
        onClick={() => handle("google")}
        disabled={loading !== null}
        className="w-full py-2 border rounded-md hover:bg-gray-50"
      >
        {loading === "google" ? "Redirecting..." : "Continue with Google"}
      </button>
      
      <button
        onClick={() => handle("github")}
        disabled={loading !== null}
        className="w-full py-2 border rounded-md hover:bg-gray-50"
      >
        {loading === "github" ? "Redirecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
}