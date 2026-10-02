import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Contact Sufian Md. Waliullah";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Contact", subtitle: "Email is the fastest way to reach me." });
}
