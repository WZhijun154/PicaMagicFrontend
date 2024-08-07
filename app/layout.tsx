import "@/styles/globals.css";
import "@/styles/sandpack.css";
import { Metadata } from "next";
import { clsx } from "@nextui-org/shared-utils";

import { Providers } from "./providers";
import { StrictMode } from "react";
import { Cmdk } from "@/components/cmdk";
import manifest from "@/config/routes.json";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProBanner } from "@/components/pro-banner";
import { Spacer } from "@nextui-org/spacer";
import { AuthState } from "@/components/auth-state/auth-state";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "React",
    "Next.js",
    "Tailwind CSS",
    "NextUI",
    "React Aria",
    "Server Components",
    "React Components",
    "UI Components",
    "UI Kit",
    "UI Library",
    "UI Framework",
    "UI Design System",
  ],
  // themeColor: [
  //   { media: "(prefers-color-scheme: light)", color: "white" },
  //   { media: "(prefers-color-scheme: dark)", color: "black" },
  // ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  twitter: siteConfig.twitter,
  openGraph: siteConfig.openGraph,
  authors: [
    {
      name: "zhijun.wang",
      url: "https://jrgarciadev.com",
    },
  ],
  creator: "zhijun.wang",
  alternates: {
    canonical: "https://nextui.org",
    types: {
      "application/rss+xml": [
        { url: "https://nextui.org/feed.xml", title: "NextUI RSS Feed" },
      ],
    },
  },
  viewport:
    "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning dir="ltr" lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
          <div className="relative flex flex-col" id="app-container">
            {/* <ProBanner /> */}

            <Navbar
              mobileRoutes={manifest.mobileRoutes}
              routes={manifest.routes}
              authState={(<AuthState />) as unknown as JSX.Element}
            />
            {children}
            <Spacer y={24} />
            <Footer />
          </div>
          {/* <Cmdk /> */}
        </Providers>
      </body>
    </html>
  );
}
