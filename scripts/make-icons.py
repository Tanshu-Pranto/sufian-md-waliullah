"""Draws the S mark into every icon file the site ships.

    python3 scripts/make-icons.py

The glyph is a 6 x 7 dot-matrix S: two-dot verticals, one-dot horizontals,
chamfered corners, and the first dot of the stroke lit in signal orange.
Keep GLYPH in sync with src/components/LogoMark.tsx.
"""

from PIL import Image, ImageDraw

GLYPH = [
    ".#####",
    "##....",
    "##....",
    ".####.",
    "....##",
    "....##",
    "#####.",
]
ACCENT = (5, 0)
INK = (10, 10, 11, 255)
DOT = (236, 236, 239, 255)
SIGNAL = (255, 79, 18, 255)
GW, GH = len(GLYPH[0]), len(GLYPH)


def cells():
    for y, row in enumerate(GLYPH):
        for x, c in enumerate(row):
            if c == "#":
                yield x, y, SIGNAL if (x, y) == ACCENT else DOT


def smooth(size, pad=0.21, gap=0.18, radius=0.23, bleed=False):
    """Anti-aliased render for large icons, drawn at 4x and scaled down."""
    s = 4
    S = size * s
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if bleed:
        d.rectangle([0, 0, S, S], fill=INK)
    else:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=round(S * radius), fill=INK)
    cell = S * (1 - 2 * pad) / GH
    ox = (S - cell * GW) / 2
    oy = (S - cell * GH) / 2
    o = cell * gap / 2
    for x, y, col in cells():
        d.rectangle([ox + x * cell + o, oy + y * cell + o, ox + (x + 1) * cell - o, oy + (y + 1) * cell - o], fill=col)
    return im.resize((size, size), Image.LANCZOS)


def pixel(size, cell, dot):
    """Pixel-snapped render for favicon sizes, so nothing lands on half pixels."""
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = max(2, round(size * 0.2))
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=INK)
    ox = (size - cell * GW) // 2
    oy = (size - cell * GH) // 2
    for x, y, col in cells():
        x0 = ox + x * cell
        y0 = oy + y * cell
        d.rectangle([x0, y0, x0 + dot - 1, y0 + dot - 1], fill=col)
    return im


def svg():
    u = 10  # one grid cell, in viewBox units
    pad_x = (96 - GW * u) / 2
    pad_y = (96 - GH * u) / 2
    rects = []
    for x, y, col in cells():
        fill = "#ff4f12" if col == SIGNAL else "#ececef"
        rects.append(f'<rect x="{pad_x + x * u + 0.9:g}" y="{pad_y + y * u + 0.9:g}" width="8.2" height="8.2" fill="{fill}"/>')
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">'
        '<rect width="96" height="96" rx="22" fill="#0a0a0b"/>' + "".join(rects) + "</svg>\n"
    )


if __name__ == "__main__":
    # Favicon: hand-snapped sizes in one .ico
    ico = [pixel(16, 2, 2), pixel(32, 4, 3), pixel(48, 6, 5)]
    ico[2].save("src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:2])
    with open("src/app/icon.svg", "w") as f:
        f.write(svg())
    # iOS rounds the corners itself and dislikes transparency: full-bleed ink.
    smooth(180, pad=0.22, bleed=True).convert("RGB").save("src/app/apple-icon.png")
    smooth(192).save("public/icons/icon-192.png")
    smooth(512).save("public/icons/icon-512.png")
    # Maskable: the OS crops to its own shape, so keep the glyph in the safe zone.
    smooth(512, pad=0.3, bleed=True).save("public/icons/icon-maskable-512.png")
