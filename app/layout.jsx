import { Onest } from "next/font/google";
import "./globals.css";
import { BRAND, SEO_DESCRIPTION, SEO_TITLE, SITE_URL } from "../lib/site";

// Onest: сучасний гротеск із повною українською кирилицею (і, ї, є, ґ).
const headingFont = Onest({
  subsets: ["cyrillic", "latin"],
  display: "swap",
  variable: "--font-heading",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/images/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "/",
    siteName: BRAND,
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Електрощит із перемикачем мережа–інвертор, змонтований електриком Максимом у Києві",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
  other: {
    "geo.region": "UA-30",
    "geo.placename": "Київ",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131613",
};

export default function RootLayout({ children }) {
  return (
    <html className={headingFont.variable} lang="uk">
      <body>{children}</body>
    </html>
  );
}
