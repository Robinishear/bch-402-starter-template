import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/_core/utils/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "BCH AI Gateway",
  description: "AI Gateway Application",
};


export default function RootLayout({

  


  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <html lang="en" data-scroll-behavior="smooth" className={cn("font-sans", geist.variable)}></html>
      <body>{children}</body>
    </html>
  );
}
