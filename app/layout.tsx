import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import PageTransition from "@/components/page-transition";
import { PlayerProvider } from "@/context/player-context";
import { Player } from "@/components/player";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Using a local font for Clash Display would be ideal, but for now we'll use a CDN import in globals.css or just rely on the variable if we set it up later.
// For this implementation, we will assume Clash Display is loaded via CSS or we can use a similar Google Font like 'Syne' as a temporary fallback if needed,
// but the rules say "Clash Display". We will add a class for it.

export const metadata: Metadata = {
  metadataBase: new URL("https://artist-portfolio.com"),
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
      >
        <PlayerProvider>
          {/* Navbar */}
          <header className="fixed top-0 w-full z-50 border-b border-border/10 bg-background/80 backdrop-blur-md">
            <Navbar />
          </header>

          <main className="flex-1 pt-16 pb-24">
            <PageTransition>{children}</PageTransition>
          </main>

          {/* Footer */}
          <footer className="border-t border-border/10 py-8 text-center text-muted-foreground bg-muted/20">
            <Footer />
          </footer>

          {/* Persistent Player */}
          <Player />

          <Toaster />
        </PlayerProvider>
      </body>
    </html>
  );
}
