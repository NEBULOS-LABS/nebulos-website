import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NEBULOS — Software That Moves Markets",
  description:
    "We design, build, and scale revenue‑driving products—websites, SaaS platforms, mobile apps, and complex engineering systems—using elite talent, AI‑accelerated workflows, and a guarantee that puts all the risk on us.",
  keywords: [
    "software development",
    "web development",
    "SaaS",
    "mobile apps",
    "AI-accelerated",
    "elite developers",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-black min-h-screen text-white antialiased bg-mesh-gradient">
        {children}
      </body>
    </html>
  );
}
