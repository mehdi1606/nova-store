import numpy as np
from PIL import Image
import potrace, json

SRC = "_preview/horse_crop2.png"
im = Image.open(SRC).convert("L")
# kill any wordmark crumbs near the very bottom (keep hooves above)
arr = np.array(im).astype(np.float32)
arr[-14:, :] = 255.0
data = arr < 130  # True = dark line

bmp = potrace.Bitmap(data)
path = bmp.trace(turdsize=12, alphamax=1.0, opticurve=1, opttolerance=0.2)

pts = []
def rec(x, y): pts.append((x, y))

parts = []
for curve in path:
    s = curve.start_point
    rec(s.x, s.y)
    parts.append(f"M{s.x:.2f} {s.y:.2f}")
    for seg in curve.segments:
        if seg.is_corner:
            a, b = seg.c, seg.end_point
            rec(a.x, a.y); rec(b.x, b.y)
            parts.append(f"L{a.x:.2f} {a.y:.2f} L{b.x:.2f} {b.y:.2f}")
        else:
            a, b, c = seg.c1, seg.c2, seg.end_point
            rec(a.x, a.y); rec(b.x, b.y); rec(c.x, c.y)
            parts.append(f"C{a.x:.2f} {a.y:.2f} {b.x:.2f} {b.y:.2f} {c.x:.2f} {c.y:.2f}")
    parts.append("Z")

d = " ".join(parts)
xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
minx, miny, maxx, maxy = min(xs), min(ys), max(xs), max(ys)
pad = 6
vb = (round(minx - pad, 1), round(miny - pad, 1),
      round(maxx - minx + 2 * pad, 1), round(maxy - miny + 2 * pad, 1))
print("subpaths:", d.count("M"), "viewBox:", vb, "len(d):", len(d))

with open("_preview/horse_traced.json", "w") as f:
    json.dump({"d": d, "viewBox": vb}, f)

# render check
svg = f'''<svg viewBox="{vb[0]} {vb[1]} {vb[2]} {vb[3]}" xmlns="http://www.w3.org/2000/svg">
<rect x="{vb[0]}" y="{vb[1]}" width="{vb[2]}" height="{vb[3]}" fill="#0e1c30"/>
<path d="{d}" fill="#d8c191"/></svg>'''
import cairosvg
cairosvg.svg2png(bytestring=svg.encode(), write_to="_preview/horse_traced.png", output_width=560)
print("rendered _preview/horse_traced.png")
