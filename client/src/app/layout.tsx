import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/_core/utils/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_NAME = "BCH Blaze";
const DESCRIPTION = "Pay-per-request AI gateway powered by Bitcoin Cash.";
const FALLBACK_URL = "http://localhost:3000";

const getSiteUrl = () => {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!raw) return new URL(FALLBACK_URL);
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return new URL(FALLBACK_URL);
  }
};

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title:{
   default: SITE_NAME,
  template: `%s ${SITE_NAME}`, 
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
};

export const viewport: Viewport = {
  themeColor: "#0b0f0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>{children}</body>
    </html>
  );
}