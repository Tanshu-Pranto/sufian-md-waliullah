"""Builds the processed images the site uses from the originals in assets/source.

    python3 scripts/process-images.py

Needs Pillow and numpy. Outputs:
  public/img/sufian-cutout.webp   portrait with the backdrop removed (hero halftone)
  src/assets/sufian.webp          web-sized portrait (About section)
  public/img/hollyhock-mask.webp  ink flower: black with alpha from the photo's brightness
"""

import numpy as np
from PIL import Image, ImageFilter

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
    src.resize((800, round(800 * H / W)), Image.LANCZOS).save("src/assets/sufian.webp", quality=82)


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


if __name__ == "__main__":
    cutout()
    flower()
