import "@/styles/globals.css";
import "@/styles/sandpack.css";
import { Metadata } from "next";
import { clsx } from "@nextui-org/shared-utils";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProBanner } from "@/components/pro-banner";
import { Spacer } from "@nextui-org/spacer";
import { AuthState } from "@/components/auth-state/auth-state";
import { Toaster } from "react-hot-toast";
import { i18n, type Locale } from "@/i18n-config";
import { getDictionary } from "@/get-dictionary";
import manifest from "@/config/routes.json";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: "PictaMagic - AIで簡単写真編集",
    template: `%s | PictaMagic`,
  },
  description:
    "PictaMagicのAI搭載ツールで簡単に写真を変換。数回のクリックで解像度向上、背景削除、色付け、ノイズ除去、ぼかし除去が可能です。",
  keywords: ["超解像"],
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "PictaMagic - AIで簡単写真編集",
    description: "超解像、背景削除、色付けなどのAI搭載ツールで写真を編集",
    site: "@PictaMagic",
    creator: "@zhijun.wang",
  },
  openGraph: {
    type: "website",
    url: "https://pictamagic.com",
    title: "PictaMagic - AIで簡単写真編集",
    description: "PictaMagicのAI搭載ツールで簡単に写真を変換。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PictaMagic - AIで簡単写真編集",
      },
    ],
  },
  authors: [{ name: "Zhijun Wang", url: "https://pictamagic.com" }],
  creator: "Zhijun Wang",
  alternates: {
    canonical: "https://pictamagic.com",
    types: {
      "application/rss+xml": [
        {
          url: "https://pictamagic.com/feed.xml",
          title: "PictaMagic RSSフィード",
        },
      ],
    },
  },
  viewport:
    "viewport-fit=cover, width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
};

export const generateStaticParams = () =>
  i18n.locales.map((locale) => ({ lang: locale }));

export default async function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <html suppressHydrationWarning dir="ltr" lang={lang}>
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
          lang={lang}
        >
          <div className="relative flex flex-col" id="app-container">
            <ProBanner />
            <Toaster />
            <div className="animate-fadeIn animate-slideDown">
              <Navbar
                mobileRoutes={manifest.mobileRoutes}
                routes={manifest.routes}
                authState={(<AuthState />) as unknown as JSX.Element}
              />
            </div>
            {children}
            <Spacer y={24} />
            <Footer />
          </div>
        </Providers>
        <div className="hidden">
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-D17G6FZNLJ"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-D17G6FZNLJ');
            `,
            }}
          />
        </div>
      </body>
    </html>
  );
}
