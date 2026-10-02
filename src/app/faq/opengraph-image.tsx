import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Frequently asked questions about Sufian Md. Waliullah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "FAQ", subtitle: "Availability, remote work, the MERN stack and choosing a database." });
}
