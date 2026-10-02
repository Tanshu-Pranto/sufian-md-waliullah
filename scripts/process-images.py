"""Builds the processed images the site uses from the originals in assets/source.

    python3 scripts/process-images.py

Needs Pillow and numpy. Outputs:
  public/img/sufian-cutout.webp   portrait with the backdrop removed (hero halftone)
  src/assets/sufian.webp          web-sized portrait (About section)
  public/img/sufian-portrait.webp same portrait at a stable URL (structured data, sitemap)
  public/img/hollyhock-mask.webp  ink flower: black with alpha from the photo's brightness
  assets/og/halftone-portrait.png halftone portrait for the social share images
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

PORTRAIT = "assets/source/sufian-original.jpg"
FLOWER = "assets/source/hollyhock-unsplash-sebastian-schuster.jpg"


def cutout():
    src = Image.open(PORTRAIT).convert("RGB")
    W, H = src.size
    small = src.resize((W // 2, H // 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(2.2))
    a = np.asarray(small).astype(np.float32)
    # The studio backdrop is light and unsaturated. Flood fill it from the
    # top and sides; the blazer and neck stop the fill reaching the shirt.
    bg_like = ((a.max(2) - a.min(2)) < 22) & (a.mean(2) > 178)
    region = np.zeros_like(bg_like)
    region[0, :] = region[:, 0] = region[:, -1] = True
    region &= bg_like
    while True:
        grown = region.copy()
        grown[1:, :] |= region[:-1, :]
        grown[:-1, :] |= region[1:, :]
        grown[:, 1:] |= region[:, :-1]
        grown[:, :-1] |= region[:, 1:]
        grown &= bg_like
        if (grown == region).all():
            break
        region = grown

    mask = Image.fromarray((~region).astype(np.uint8) * 255, "L").resize((W, H), Image.LANCZOS)
    mask = mask.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(7)).filter(ImageFilter.GaussianBlur(1.6))
    out = src.copy()
    out.putalpha(mask)
    out.resize((720, round(720 * H / W)), Image.LANCZOS).save("public/img/sufian-cutout.webp", quality=86, method=6)
    web = src.resize((800, round(800 * H / W)), Image.LANCZOS)
    web.save("src/assets/sufian.webp", quality=82)
    web.save("public/img/sufian-portrait.webp", quality=82)


def flower():
    im = Image.open(FLOWER).convert("L")
    a = np.asarray(im).astype(np.float32) / 255
    # Lift the petals and drop the black backdrop to fully transparent.
    a = np.clip((a - 0.07) / 0.85, 0, 1) ** 0.9
    rgba = Image.new("RGBA", im.size, (0, 0, 0, 0))
    rgba.putalpha(Image.fromarray((a * 255).astype(np.uint8), "L"))
    rgba.resize((900, round(900 * im.height / im.width)), Image.LANCZOS).save(
        "public/img/hollyhock-mask.webp", quality=84, method=6
    )




def og_halftone(width=620, height=630, cell=5, scale=3):
    """Halftone portrait in a lit ring, the hero look, for social share cards."""
    im = Image.open("public/img/sufian-cutout.webp").convert("RGBA")
    ph = int(height * 0.9)
    pw = round(ph * im.width / im.height)
    px, py = (width - pw) // 2, height - ph
    cols, rows = -(-width // cell), -(-height // cell)
    grid = Image.new("RGBA", (cols, rows), (0, 0, 0, 0))
    grid.paste(im.resize((round(pw / cell), round(ph / cell)), Image.LANCZOS), (round(px / cell), round(py / cell)))
    a = np.asarray(grid).astype(np.float32) / 255
    S = scale
    out = Image.new("RGBA", (width * S, height * S), (10, 10, 11, 255))
    d = ImageDraw.Draw(out)
    hx, hy, R = width / 2, py + ph * 0.36, min(width, height) * 0.47
    band = R * 0.045
    for cy in range(rows):
        for cx in range(cols):
            r, g, b, al = a[cy, cx]
            x, y = cx * cell + cell / 2, cy * cell + cell / 2
            if al > 0.5:
                lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
                v = max(0.04, max(0.0, min(1.0, (lum - 0.12) / 0.83)) ** 2.2)
            else:
                dist = float(np.hypot(x - hx, y - hy))
                t = min(1.0, max(0.0, (float(np.cos(np.arctan2(y - hy, x - hx) + np.pi / 4)) + 0.55) / 1.55))
                light = t * t * (3 - 2 * t)
                inner = 0.22 * np.exp(-(((R - dist) / (R * 0.16)) ** 2)) if dist < R else 0.0
                v = min(1.0, light * (np.exp(-(((dist - R) / band) ** 2)) + inner)) * 0.9 * (1 - al)
            s = cell * 0.86 * np.sqrt(v)
            if s < 0.7:
                continue
            o = (cell - s) / 2
            x0, y0 = (cx * cell + o) * S, (cy * cell + o) * S
            d.rectangle([x0, y0, x0 + s * S - 1, y0 + s * S - 1], fill=(236, 236, 239, 255))
    out.resize((width, height), Image.LANCZOS).save("assets/og/halftone-portrait.png", optimize=True)


if __name__ == "__main__":
    cutout()
    flower()
    og_halftone()
