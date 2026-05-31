import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
});

const SITE = "https://novacavalia.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Nova Cavalia — Maison équestre marocaine",
    template: "%s · Nova Cavalia",
  },
  description:
    "Maison équestre fondée au Maroc en 2026. La collection capsule Nova Cavalia : veste de concours, tapis de selle et sweat, signés d'un cheval brodé. L'histoire à portée.",
  keywords: [
    "Nova Cavalia",
    "équitation",
    "cavalier",
    "Maroc",
    "veste de concours",
    "tapis de selle",
    "sweat équestre",
    "mode équestre",
    "luxe",
  ],
  authors: [{ name: "Nova Cavalia" }],
  creator: "Nova Cavalia",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: SITE,
    siteName: "Nova Cavalia",
    title: "Nova Cavalia — Maison équestre marocaine",
    description:
      "La collection capsule 2026 : veste de concours, tapis de selle et sweat, signés d'un cheval brodé. L'histoire à portée.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Nova Cavalia" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nova Cavalia — Maison équestre marocaine",
    description:
      "La collection capsule 2026, signée d'un cheval brodé. L'histoire à portée.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon-horse.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon-horse.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#091422",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${hanken.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="grain flex min-h-screen flex-col">
        <SmoothScroll />
        <Cursor />
        <Preloader />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
