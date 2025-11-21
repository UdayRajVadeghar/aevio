"use client";

import { Navbar } from "@/components/navbar";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());

  const isLandingPage = pathname === "/";
  const isOnboarding = pathname?.startsWith("/onboarding");
  const shouldAddTopSpacing = !isLandingPage && !isOnboarding;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SmoothScroll>
              <Navbar />
              {shouldAddTopSpacing && <div className="h-24 sm:h-28" />}
              {children}
            </SmoothScroll>
          </ThemeProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
