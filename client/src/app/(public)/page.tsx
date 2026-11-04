
"use client";

import { useEffect, useState } from "react";
import { BlazeBanner } from "./components/BlazeBanner";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { InitialLoader } from "./components/InitialLoader";
import { WalletFlow } from "./components/WalletFlow";

export default function HomePage() {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkPageReady = async () => {
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), {
            once: true,
          });
        });
      }

      const images = Array.from(document.images);

      await Promise.all(
        images.map(async (img) => {
          if (img.complete) {
            try {
              await img.decode();
            } catch {
            }
          } else {
            await new Promise<void>((resolve) => {
              img.addEventListener("load", () => resolve(), {
                once: true,
              });

              img.addEventListener("error", () => resolve(), {
                once: true,
              });
            });
          }
        })
      );

      if (cancelled) return;

    
      setTimeout(() => {
        if (!cancelled) {
          setContentReady(true);
        }
      }, 400);
    };

    checkPageReady();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <InitialLoader contentReady={contentReady} />
      <BlazeBanner />
      <Hero />
      <HowItWorks />
      <WalletFlow />

    </div>
  );
}
