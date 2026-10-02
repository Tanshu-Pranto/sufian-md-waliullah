import type { MetadataRoute } from "next";
import { profile } from "@/data/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profile.name}, ${profile.role}`,
    short_name: profile.firstName,
    description: profile.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
