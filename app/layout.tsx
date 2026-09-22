import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    template: "%s | Nexa Studio",
  },
  description:
    "Studi konsep Nexa Studio: contoh website agency untuk layanan website, branding, dan strategi konten.",
  keywords: [
    "Nexa Studio",
    "Digital Agency Indonesia",
    "Jasa Pembuatan Website",
    "Landing Page UMKM",
    "Branding Brand Lokal",
    "Web Design Jakarta",
    "Web Development",
  ],
  authors: [{ name: "Nexa Studio", url: siteUrl }],
  creator: "Nexa Studio",
  publisher: "Nexa Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    description: "Studi konsep website agency untuk layanan website, branding, dan strategi konten.",
    url: siteUrl,
    siteName: "Nexa Studio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    description: "Studi konsep website agency untuk layanan website, branding, dan strategi konten.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nexa Studio",
  description: "Studi konsep website digital agency Nexa Studio.",
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
