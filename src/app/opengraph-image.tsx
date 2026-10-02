import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Sufian Md. Waliullah, MERN stack developer in Bangladesh";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({ title: "Sufian Md. Waliullah", subtitle: "Full-stack web apps with MongoDB, Express, React and Node.js." });
}
