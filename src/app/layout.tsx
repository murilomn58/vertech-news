import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import ParticleBackground from "@/components/layout/ParticleBackground";
import ScanlineOverlay from "@/components/layout/ScanlineOverlay";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotificationPrompt from "@/components/ui/NotificationPrompt";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import TrackingScript from "@/components/analytics/TrackingScript";
import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "AI news",
    "Claude Code",
    "Anthropic",
    "artificial intelligence",
    "AI business",
    "Elon Musk AI",
    "tech news",
  ],
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
    siteName: SITE_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.tagline,
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} bg-void text-text-primary antialiased`}
      >
        <ParticleBackground />
        <ScanlineOverlay />
        <div className="relative z-10 min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <NotificationPrompt />
        <GoogleAnalytics />
        <TrackingScript />
      </body>
    </html>
  );
}
