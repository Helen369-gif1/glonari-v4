"""Sky mask for the plaza clouds (plaza.js, PLAZA.clouds).

Reads assets/plaza-6516.webp and writes the sky band (rows 0 .. BOTTOM) as
greyscale lossless WebP: white = sky, black = buildings, trees, plants.
  assets/plaza-sky-6516.webp  6516 x 1040  (computers)
  assets/plaza-sky-3258.webp  3258 x  520  (phones / small GPUs)
Run it again whenever the panorama changes:  python tools/make-sky-mask.py
Needs only Pillow and numpy.

How: the sky is a smooth blue gradient, so a low-order polynomial in (x, y)
is fitted to it; pixels close to that model and connected to the top edge
are sky (the blue screen on Glonari News, glass and the floor reflections
are not connected, so they stay out). The edge is soft (blend pixels get
partial sky) and is pulled inwards, so a cloud never touches a building.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets' / 'plaza-6516.webp'
OUT_FULL = ROOT / 'assets' / 'plaza-sky-6516.webp'
OUT_SMALL = ROOT / 'assets' / 'plaza-sky-3258.webp'

BOTTOM = 1040      # mask height in panorama pixels (lowest sky is at y ~ 1030); = PLAZA.clouds.bottom
CORE = 45          # colour distance to the sky model: below — may be sky (flood-filled from the top)
SOFT = (28, 60)    # distance range of the soft edge: <= 28 full sky, >= 60 no sky


def sky_model(img):
    """Fit sky colour = cubic polynomial of (x, y), refined on its own inliers."""
    h, w, _ = img.shape
    yy, xx = np.mgrid[0:h, 0:w]
    xn, yn = xx / w, yy / h
    feats = np.stack([np.ones_like(xn), xn, yn, xn * xn, xn * yn, yn * yn, xn ** 3, yn ** 3], -1)
    sel = (img[..., 2] > 200) & (img[..., 2] - img[..., 0] > 120)   # clearly blue to start with
    for _ in range(3):
        coef, *_ = np.linalg.lstsq(feats[sel], img[sel], rcond=None)
        dist = np.sqrt(((img - feats @ coef) ** 2).sum(-1))
        sel = dist < 20
    return dist


def connected_to_top(cand):
    """Pixels of `cand` reachable from row 0 (4-neighbour flood fill, numpy only)."""
    reached = np.zeros_like(cand)
    reached[0] = cand[0]
    while True:
        grow = reached.copy()
        grow[1:] |= reached[:-1]
        grow[:-1] |= reached[1:]
        grow[:, 1:] |= reached[:, :-1]
        grow[:, :-1] |= reached[:, 1:]
        grow &= cand
        if np.array_equal(grow, reached):
            return reached
        reached = grow


def to_image(a):
    return Image.fromarray(np.round(np.clip(a, 0, 1) * 255).astype(np.uint8), 'L')


def main():
    img = np.asarray(Image.open(SRC).convert('RGB'))[:BOTTOM].astype(np.float32)
    dist = sky_model(img)
    core = connected_to_top(dist < CORE)
    near = np.asarray(to_image(core).filter(ImageFilter.MaxFilter(5))) > 0   # the sky and 2 px around it
    soft = np.where(near, np.clip((SOFT[1] - dist) / (SOFT[1] - SOFT[0]), 0, 1), 0)
    soft_img = to_image(soft)
    # pulled in by 1 px (computers) / 2 px before halving (phones): linear filtering never spills onto a building
    soft_img.filter(ImageFilter.MinFilter(3)).save(OUT_FULL, lossless=True, method=6)
    small = soft_img.filter(ImageFilter.MinFilter(5))
    small.resize((small.width // 2, small.height // 2), Image.BOX).save(OUT_SMALL, lossless=True, method=6)
    for p in (OUT_FULL, OUT_SMALL):
        print(f'{p.relative_to(ROOT)}  {Image.open(p).size}  {p.stat().st_size // 1024} KB')
    print(f'sky: {core.mean() * 100:.1f}% of the band, lowest sky row {np.where(core.any(1))[0].max()}')


if __name__ == '__main__':
    main()
