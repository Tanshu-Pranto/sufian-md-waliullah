import type { Metadata, Viewport } from "next";
import { Doto, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/content";

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

export const metadata: Metadata = {
  title: `${profile.shortName} · ${profile.role}`,
  description: profile.tagline,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.tagline,
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin, profile.x],
};

// Flags that JS is running before first paint, so reveal-on-scroll styles
// only hide content when something is there to show it again.
const bootScript = `document.documentElement.classList.add('js')`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${doto.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
