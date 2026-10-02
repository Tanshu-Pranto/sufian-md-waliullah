"""Erases the "mdsufian.me" title from the hero film, so the S mark can be
built over it live in the browser (src/components/HeroHands.tsx).

    python3 scripts/clean-hero-video.py <source.mp4>

The title appears inside a round orange burst between the fingertips. Rather
than blacking out a box (which would punch a hole in the burst), every pixel
in the box is rebuilt from the burst's own radial profile, sampled from the
ring of pixels just outside the box. Works on the YUV planes directly, so no
color conversion touches the rest of the frame.

Writes public/video/hero-hands.mp4 and the last frame as
public/video/hero-hands-end.webp.
"""

import subprocess
import sys
from io import BytesIO

import numpy as np
from PIL import Image

W, H, FPS = 1920, 1080, 60
OUT = "public/video/hero-hands.mp4"
STILL = "public/video/hero-hands-end.webp"

CX, CY = 960, 538  # where the spark lands, between the fingertips
BOX = (807, 1112, 496, 584)  # x0, x1, y0, y1: the title at its largest, plus glow
REACH = 150  # sample no wider than this from the centre, to stay clear of the fingertips
FEATHER = 3
START = 180  # first frame of the burst (3.0s); the title follows a few frames later


def plane_fixer(w, h, s):
    """Precompute the geometry for one plane at scale s (1 for Y, 0.5 for U/V)."""
    cx, cy = CX * s, CY * s
    x0, x1, y0, y1 = (round(v * s) for v in BOX)
    reach = REACH * s

    ys, xs = np.mgrid[0:h, 0:w]
    # Radius binned per plane pixel: 1px for luma, 2px (full-res) for chroma.
    rb = np.hypot(xs - cx, ys - cy).astype(int)

    in_box = (xs >= x0) & (xs <= x1) & (ys >= y0) & (ys <= y1)
    pad = max(1, round(2 * s))
    near_box = (xs >= x0 - pad) & (xs <= x1 + pad) & (ys >= y0 - pad) & (ys <= y1 + pad)
    sample = (np.abs(xs - cx) <= reach) & (np.abs(ys - cy) <= 220 * s) & ~near_box

    s_idx = np.flatnonzero(sample)
    s_bin = rb.ravel()[s_idx]
    b_idx = np.flatnonzero(in_box)
    b_bin = rb.ravel()[b_idx]

    # Feather the box edge so the rebuilt patch never shows a seam.
    f = max(1, FEATHER * s)
    edge = np.minimum.reduce([xs - x0, x1 - xs, ys - y0, y1 - ys]).astype(float)
    weight = np.clip((edge.ravel()[b_idx] + 1) / f, 0, 1)

    def fix(plane):
        flat = plane.ravel()
        vals = flat[s_idx]
        # Median per radius bin: robust to the stray sparks flying around the burst.
        order = np.lexsort((vals, s_bin))
        sb, sv = s_bin[order], vals[order]
        bins, starts, counts = np.unique(sb, return_index=True, return_counts=True)
        med = sv[starts + counts // 2].astype(float)
        prof = np.interp(b_bin, bins, med)
        orig = flat[b_idx].astype(float)
        flat[b_idx] = np.round(weight * prof + (1 - weight) * orig).astype(np.uint8)

    return fix


def main(src):
    fix_y = plane_fixer(W, H, 1)
    fix_c = plane_fixer(W // 2, H // 2, 0.5)
    ysz, csz = W * H, (W // 2) * (H // 2)
    fsz = ysz + 2 * csz

    dec = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "yuv420p", "-"],
        stdout=subprocess.PIPE,
    )
    enc = subprocess.Popen(
        [
            "ffmpeg", "-v", "error", "-y",
            "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
            "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-profile:v", "high",
            "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_range", "tv",
            "-movflags", "+faststart", OUT,
        ],
        stdin=subprocess.PIPE,
    )

    i = 0
    last = None
    while True:
        buf = dec.stdout.read(fsz)
        if len(buf) < fsz:
            break
        frame = np.frombuffer(buf, np.uint8).copy()
        if i >= START:
            fix_y(frame[:ysz].reshape(H, W))
            fix_c(frame[ysz : ysz + csz].reshape(H // 2, W // 2))
            fix_c(frame[ysz + csz :].reshape(H // 2, W // 2))
        enc.stdin.write(frame.tobytes())
        last = frame
        i += 1

    enc.stdin.close()
    enc.wait()
    dec.wait()

    # The still is the same last frame, for reduced motion and blocked autoplay.
    png = subprocess.run(
        ["ffmpeg", "-v", "error", "-f", "rawvideo", "-pix_fmt", "yuv420p", "-s", f"{W}x{H}",
         "-colorspace", "bt709", "-color_range", "tv", "-i", "-",
         "-vf", "scale=out_color_matrix=bt709:in_color_matrix=bt709", "-f", "image2pipe", "-c:v", "png", "-"],
        input=last.tobytes(), capture_output=True, check=True,
    ).stdout
    Image.open(BytesIO(png)).convert("RGB").save(STILL, quality=82, method=6)
    print(f"{i} frames -> {OUT}, {STILL}")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
