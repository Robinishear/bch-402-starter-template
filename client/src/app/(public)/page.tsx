
"use client";

import { useEffect, useState } from "react";

import { BlazeBanner } from "./components/BlazeBanner";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { InitialLoader } from "./components/InitialLoader";

export default function HomePage() {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkPageReady = async () => {
      // Wait until the browser finishes its initial page loading.
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          window.addEventListener("load", () => resolve(), {
            once: true,
          });
        });
      }

      // Wait for images currently rendered on the page.
      const images = Array.from(document.images);

      await Promise.all(
        images.map(async (img) => {
          if (img.complete) {
            try {
              await img.decode();
            } catch {
              // Continue even if an image cannot be decoded.
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

      // Wait 400ms. The loader's existing 600ms fade-out
      // makes the total delay approximately 1 second.
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
    </div>
  );
}
