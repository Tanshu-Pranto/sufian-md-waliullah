import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Services by Sufian Md. Waliullah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Services", subtitle: "Full-stack apps, REST APIs, Next.js front ends, databases and deploys." });
}
