import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "About Sufian Md. Waliullah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "About", subtitle: "MERN stack developer in Bangladesh: background, skills and how I work." });
}
