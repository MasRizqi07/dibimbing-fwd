import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteUrl } from "@/lib/site-url";
import { LanguageProvider } from "@/lib/i18n/context";
import { getRequestLocale } from "@/lib/i18n/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

const metadataId: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    template: "%s | Nexa Studio",
  },
  description:
    "Nexa Studio membantu bisnis berkembang membangun website, identitas visual, dan strategi konten yang terarah.",
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
    description: "Website, identitas visual, dan strategi konten untuk bisnis berkembang.",
    url: siteUrl,
    siteName: "Nexa Studio",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexa Studio — Digital Partner untuk Bisnis Ambisius",
    description: "Website, identitas visual, dan strategi konten untuk bisnis berkembang.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  if ((await getRequestLocale()) === "ID") return metadataId;
  const title = "Nexa Studio — Digital Partner for Ambitious Businesses";
  const description = "Nexa Studio helps growing businesses build websites, visual identities, and content strategies that earn trust and support growth.";
  return {
    ...metadataId,
    title: { default: title, template: "%s | Nexa Studio" },
    description,
    openGraph: { title, description, url: siteUrl, siteName: "Nexa Studio", locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Nexa Studio",
  description: "Website, identitas visual, dan strategi konten untuk bisnis berkembang.",
  url: siteUrl,
  serviceType: ["Website Development", "Brand Identity Design", "Content Strategy"],
  priceRange: "Rp 3.500.000 - Rp 15.000.000",
  address: { "@type": "PostalAddress", addressCountry: "ID" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  return (
    <html
      lang={locale.toLowerCase()}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(locale === "ID" ? jsonLd : { ...jsonLd, description: "Digital partner for ambitious businesses. Websites, brand identity, and content strategy." }) }}
        />
      </body>
    </html>
  );
}
