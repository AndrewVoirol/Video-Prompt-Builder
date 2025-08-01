import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Video Prompt Builder",
  description:
    "A fully responsive, accessible Next.js and TypeScript video prompt builder for AI video models",
  keywords: [
    "nextjs",
    "typescript",
    "ai",
    "video",
    "prompt-builder",
    "tailwindcss",
  ],
  authors: [{ name: "AndrewVoirol" }],
  creator: "AndrewVoirol",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/AndrewVoirol/Video-Prompt-Builder",
    title: "Video Prompt Builder",
    description:
      "A fully responsive, accessible Next.js and TypeScript video prompt builder for AI video models",
    siteName: "Video Prompt Builder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Prompt Builder",
    description:
      "A fully responsive, accessible Next.js and TypeScript video prompt builder for AI video models",
    creator: "@AndrewVoirol",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen bg-background text-foreground">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
