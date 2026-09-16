import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexa.studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    template: "%s | Nexa Studio",
  },
  description:
    "Nexa Studio membantu UMKM dan brand lokal membangun identitas digital yang terlihat, dipercaya, dan menghasilkan lewat landing page, branding, dan strategi konten.",
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
    description:
      "Bikin bisnis kamu terlihat dan dipilih. Kami membantu UMKM dan brand lokal membangun identitas digital yang menghasilkan.",
    url: siteUrl,
    siteName: "Nexa Studio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    description:
      "Bikin bisnis kamu terlihat dan dipilih. Kami membantu UMKM dan brand lokal membangun identitas digital yang menghasilkan.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nexa Studio",
  description:
    "Digital partner untuk bisnis ambisius. Membantu UMKM dan brand lokal membangun identitas digital yang terlihat, dipercaya, dan menghasilkan.",
  url: siteUrl,
  sameAs: [
    "https://instagram.com",
  ],
  serviceType: [
    "Website Development",
    "Brand Identity Design",
    "Content Strategy",
  ],
  priceRange: "Rp 3.500.000 - Rp 15.000.000",
  address: {
    "@type": "PostalAddress",
    addressCountry: "ID",
  },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
