import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Sufian Md. Waliullah, AI engineer in Bangladesh";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Sufian Md. Waliullah", subtitle: "AI-powered web apps: LLM features, RAG and agents." });
}
