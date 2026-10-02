import { projects } from "@/data/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Project case study by Sufian Md. Waliullah";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return ogImage({ title: p?.title ?? "Project", subtitle: p?.summary ?? "" });
}
