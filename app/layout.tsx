import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

import { PlayerProvider } from "@/context/player-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Player } from "@/components/player";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Using a local font for Clash Display would be ideal, but for now we'll use a CDN import in globals.css or just rely on the variable if we set it up later.
// For this implementation, we will assume Clash Display is loaded via CSS or we can use a similar Google Font like 'Syne' as a temporary fallback if needed,
// but the rules say "Clash Display". We will add a class for it.

const rawSiteUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://artist-portfolio.com";

const siteUrl = rawSiteUrl.replace(/["']/g, "").trim();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Artist Portfolio - Electronic Music Producer",
    template: "%s | Artist Portfolio",
  },
  description:
    "Official music portfolio - Producer, artist, and sonic architect pushing boundaries through sound.",
  keywords: [
    "electronic music",
    "producer",
    "DJ",
    "music",
    "artist",
    "tour dates",
    "releases",
  ],
  authors: [{ name: "Artist Name" }],
  creator: "Artist Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://artist-portfolio.com",
    title: "Artist Portfolio - Electronic Music Producer",
    description:
      "Official music portfolio - Producer, artist, and sonic architect pushing boundaries through sound.",
    siteName: "Artist Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Artist Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artist Portfolio - Electronic Music Producer",
    description:
      "Official music portfolio - Producer, artist, and sonic architect pushing boundaries through sound.",
    creator: "@artisthandle",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Artist Portfolio",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1929",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${outfit.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}
        style={{ overflowX: "hidden" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          themes={["dark", "midnight", "rose"]}
        >
          <PlayerProvider>
            {/* Audio Visualizer Background - rendered in Player component */}

            <div id="app-content" className="flex flex-col min-h-screen">
              {/* Navbar */}
              <header className="fixed top-0 w-full z-50 glass-nav">
                <Navbar />
              </header>

              <main className="flex-1 pt-16 pb-20 relative z-10">
                {children}
              </main>

              {/* Footer - add bottom padding to account for player */}
              {/* Footer - add bottom padding to account for player */}
              <div className="mb-20">
                <Footer />
              </div>
            </div>

            {/* Persistent Player */}
            <Player />

            <Toaster />
          </PlayerProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "MusicGroup",
                name: "Artist Name",
                url: "https://artist-portfolio.com",
                logo: "https://artist-portfolio.com/logo.png",
                sameAs: [
                  "https://instagram.com/artisthandle",
                  "https://twitter.com/artisthandle",
                  "https://youtube.com/artisthandle",
                  "https://soundcloud.com/artisthandle",
                ],
                genre: "Electronic",
                description:
                  "Electronic Music Producer & Sound Designer pushing boundaries through sound.",
              }),
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
