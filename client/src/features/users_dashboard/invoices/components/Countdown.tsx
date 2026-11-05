"use client";

import { useEffect, useState } from "react";

const remaining = (expiresAt: string) => Math.max(0, new Date(expiresAt).getTime() - Date.now());

export default function Countdown({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = useState(() => remaining(expiresAt));

  useEffect(() => {
    const timer = setInterval(() => setLeft(remaining(expiresAt)), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const minutes = Math.floor(left / 60000);
  const seconds = Math.floor((left % 60000) / 1000);

  return (
    <span>
      {minutes}:{String(seconds).padStart(2, "0")}
    </span>
  );
}