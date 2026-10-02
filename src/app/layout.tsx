import type { Metadata, Viewport } from "next";
import { Doto, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { profile, site } from "@/data/content";

const doto = Doto({
  subsets: ["latin"],
  axes: ["ROND"],
  variable: "--font-doto",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

const defaultTitle = `${profile.name} | AI Engineer in ${profile.location}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${profile.name}` },
  description: profile.tagline,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: site.url }],
  creator: profile.name,
  publisher: profile.name,
  category: "technology",
  keywords: [
    profile.name,
    ...profile.alternateNames,
    "AI engineer",
    "AI engineer Bangladesh",
    "LLM app developer",
    "MERN stack developer",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "Node.js developer",
    "Express API",
    "MongoDB",
    "freelance web developer Bangladesh",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    firstName: profile.firstName,
    lastName: profile.lastName,
    siteName: profile.name,
    locale: "en_US",
    url: "/",
    title: defaultTitle,
    description: profile.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: profile.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  formatDetection: { telephone: false, address: false, email: false },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  other: {
    "geo.region": profile.countryCode,
    "geo.placename": profile.location,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  viewportFit: "cover",
};

// Flags that JS is running before first paint, so reveal-on-scroll styles
// only hide content when something is there to show it again.
const bootScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // globals.css scrolls smoothly for in-page anchors. The data attribute lets
  // Next switch that off while it resets scroll on a route change; otherwise
  // the reset animates and can land on the footer instead of the top.
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${doto.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />
      </head>
      <body>{children}</body>
    </html>
  );
}
