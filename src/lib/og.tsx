import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile, site } from "@/data/content";

// Shared 1200 x 630 share card: dot-matrix title on the left, the halftone
// portrait on the right. Fonts are static TTFs; Satori can't read variable fonts.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Literal paths, so the bundler traces just these four files.
const [doto, plex, plexMedium, portrait] = await Promise.all([
  readFile(join(process.cwd(), "assets", "fonts", "Doto-ExtraBold.ttf")),
  readFile(join(process.cwd(), "assets", "fonts", "IBMPlexMono-Regular.ttf")),
  readFile(join(process.cwd(), "assets", "fonts", "IBMPlexMono-Medium.ttf")),
  readFile(join(process.cwd(), "assets", "og", "halftone-portrait.png")),
]);
const portraitSrc = `data:image/png;base64,${portrait.toString("base64")}`;

const GLYPH = [".#####", "##....", "##....", ".####.", "....##", "....##", "#####."];

function Mark() {
  return (
    <div style={{ display: "flex", width: 60, height: 60, borderRadius: 14, background: "#151517", alignItems: "center", justifyContent: "center" }}>
      <svg width="24" height="28" viewBox="0 0 6 7">
        {GLYPH.flatMap((row, y) =>
          [...row].map((c, x) =>
            c === "#" ? (
              <rect key={`${x}-${y}`} x={x + 0.09} y={y + 0.09} width="0.82" height="0.82" fill={x === 5 && y === 0 ? "#ff4f12" : "#ececef"} />
            ) : null,
          ),
        )}
      </svg>
    </div>
  );
}

export function ogImage({ title, subtitle }: { title: string; subtitle: string }) {
  const host = new URL(site.url).host.replace(/^www\./, "");
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0a0a0b", color: "#ececef", fontFamily: "Plex" }}>
        {/* Satori renders plain <img>; next/image doesn't apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={portraitSrc} width={620} height={630} style={{ position: "absolute", right: -40, top: 0 }} alt="" />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 64px 72px", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Mark />
            <div style={{ display: "flex", fontSize: 26, color: "#a1a1a8" }}>{host}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", fontFamily: "Doto", fontSize: 72, lineHeight: 1, letterSpacing: 1 }}>{title}</div>
            <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: "#a1a1a8", maxWidth: 540 }}>{subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "PlexMedium", fontSize: 24 }}>
            <div style={{ display: "flex", width: 18, height: 18, background: "#ff4f12" }} />
            {profile.role} · {profile.location}
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Doto", data: doto, style: "normal", weight: 800 },
        { name: "Plex", data: plex, style: "normal", weight: 400 },
        { name: "PlexMedium", data: plexMedium, style: "normal", weight: 500 },
      ],
    },
  );
}
