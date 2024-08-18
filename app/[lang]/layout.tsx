import "@/styles/globals.css";
import "@/styles/sandpack.css";
import { Metadata } from "next";
import { clsx } from "@nextui-org/shared-utils";

import { Providers } from "./providers";
import { Cmdk } from "@/components/cmdk";
import manifest from "@/config/routes.json";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProBanner } from "@/components/pro-banner";
import { Spacer } from "@nextui-org/spacer";
import { AuthState } from "@/components/auth-state/auth-state";
import { Toaster } from "react-hot-toast";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";

export const metadata: Metadata = {
  title: {
    default: "PictaMagic - AI Photo Editing Made Easy",
    template: `%s | PictaMagic`,
  },
  description:
    "Transform your photos effortlessly with PictaMagic's AI-powered tools. Enhance resolution, remove backgrounds, colorize, denoise, and deblur your images with just a few clicks.",
  keywords: [
    "AI Photo Editing",
    "Super Resolution",
    "Background Removal",
    "AI Colorization",
    "Denoising",
    "Deblurring",
    "Photo Enhancement",
    "AI Tools",
    "Image Editing",
    "Photography",
    "Photo Editor",
    "PictaMagic",
  ],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-32x32.png",
  //   apple: "/apple-touch-icon.png",
  // },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "PictaMagic - AI Photo Editing Made Easy",
    description:
      "Edit your photos with AI-powered tools for super resolution, background removal, colorization, and more.",
    site: "@PictaMagic",
    creator: "@zhijun.wang",
    // image: "/og-image.png",
  },
  openGraph: {
    type: "website",
    url: "https://pictamagic.com",
    title: "PictaMagic - AI Photo Editing Made Easy",
    description:
      "Transform your photos effortlessly with PictaMagic's AI-powered tools.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PictaMagic - AI Photo Editing Made Easy",
      },
    ],
  },
  authors: [
    {
      name: "Zhijun Wang",
      url: "https://pictamagic.com",
    },
  ],
  creator: "Zhijun Wang",
  alternates: {
    canonical: "https://pictamagic.com",
    types: {
      "application/rss+xml": [
        {
          url: "https://pictamagic.com/feed.xml",
          title: "PictaMagic RSS Feed",
        },
      ],
    },
  },
  viewport:
    "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <html suppressHydrationWarning dir="ltr" lang={params.lang}>
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers
          themeProps={{ attribute: "class", defaultTheme: "light" }}
          dictionary={dictionary}
          lang={params.lang}
        >
          <div className="relative flex flex-col" id="app-container">
            <ProBanner />
            <Toaster />
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
