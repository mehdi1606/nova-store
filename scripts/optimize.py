"""Nova Cavalia — image pipeline.
Selects the art-directed set, resizes to high-quality WebP, generates blur
placeholders, samples palette colors, and emits a manifest the content layer reads.
All source photos are portrait 4000x6000 / 2624x3936.
"""
import os, glob, json, base64, io
from PIL import Image, ImageFilter

SRC = "assets/img"
OUT = "optimized"
IMG_OUT = os.path.join(OUT, "images")

# name -> (source file, role, alt-FR)
# roles drive max long-edge + quality
SEL = {
    # ---- HERO / FULL-BLEED -------------------------------------------------
    "hero-rider-horse":      ("DSC03420.jpg", "hero", "Cavaliere et son cheval a la lumiere doree, veste de concours Nova Cavalia"),
    "hero-arena":            ("DSC03570.jpg", "hero", "Cavalier monte sur le terrain de concours au lever du jour"),
    "hero-grey-walk":        ("DSC03785.jpg", "hero", "Cavaliere menant un cheval gris devant les palmiers"),
    "hero-mounted":          ("DSC03593.jpg", "hero", "Cavalier en selle sur la carriere, palmiers en arriere-plan"),
    "stable-atmosphere":     ("DSC03950.jpg", "hero", "Atmosphere d ecurie, lumiere tamisee"),
    # ---- CAVALIER / CHEVAL category panels ---------------------------------
    "cat-cavalier":          ("DSC03425.jpg", "hero", "Cavalier face a son cheval bai, complicite"),
    "cat-cheval":            ("DSC03447.jpg", "hero", "Cheval gris harnache, tapis de selle Nova Cavalia"),
    # ---- TAPIS DE SELLE ----------------------------------------------------
    "tapis-studio":          ("DSC03910.jpg", "product", "Tapis de selle matelasse marine, passepoil corde creme"),
    "tapis-hanging":         ("DSC03924.jpg", "product", "Tapis de selle Nova Cavalia presente a l ecurie"),
    "tapis-on-horse":        ("DSC03896.jpg", "product", "Tapis de selle marine porte par un cheval bai"),
    "tapis-detail":          ("DSC03909.jpg", "macro",   "Detail du matelassage et du passepoil corde du tapis de selle"),
    "tapis-placing":         ("DSC03914.jpg", "product", "Mise en place du tapis de selle sur le dos du cheval"),
    "tapis-macro-bw":        ("DSC03767.jpg", "macro",   "Tapis de selle et etrier, noir et blanc"),
    "tapis-mounted":         ("DSC03529.jpg", "product", "Tapis de selle en situation, cheval gris monte"),
    # ---- VESTE DE CONCOURS -------------------------------------------------
    "veste-studio":          ("DSC03629.jpg", "product", "Veste de concours marine sur fond de ciel"),
    "veste-homme-studio":    ("DSC03670.jpg", "product", "Veste de concours homme, coupe ajustee Nova Cavalia"),
    "veste-homme-1":         ("DSC03503.jpg", "product", "Cavalier en veste de concours marine, profil"),
    "veste-homme-2":         ("DSC03607.jpg", "product", "Cavalier en veste de concours, lumiere naturelle"),
    "veste-femme-1":         ("DSC03844.jpg", "product", "Cavaliere en veste de concours marine devant un cheval gris"),
    "veste-femme-2":         ("DSC03852.jpg", "product", "Cavaliere en veste de concours partageant un instant avec son cheval"),
    "veste-femme-3":         ("DSC03869.jpg", "product", "Veste de concours femme, dos et coupe cintree"),
    "veste-macro-sleeve":    ("DSC03860.jpg", "macro",   "Broderie du cheval sur la manche de la veste de concours"),
    "veste-macro-buttons":   ("DSC03863.jpg", "macro",   "Detail des boutons de la veste de concours"),
    "veste-macro-cuff":      ("DSC03868.jpg", "macro",   "Detail du poignet et de la finition de la veste"),
    "veste-lifestyle":       ("DSC03412.jpg", "product", "Cavalier en veste de concours aux cotes de son cheval"),
    # ---- SWEAT -------------------------------------------------------------
    "sweat-studio":          ("DSC03929.jpg", "product", "Sweat marine Nova Cavalia, broderie script creme, a l ecurie"),
    "sweat-homme-front":     ("DSC03685.jpg", "product", "Cavalier portant le sweat marine Nova Cavalia"),
    "sweat-homme-2":         ("DSC03683.jpg", "product", "Sweat Nova Cavalia porte, plan large"),
    "sweat-back":            ("DSC03698.jpg", "product", "Dos du sweat, grande broderie cheval en corde"),
    "sweat-back-2":          ("DSC03705.jpg", "product", "Broderie dorsale du sweat Nova Cavalia"),
    "sweat-macro-back":      ("DSC03961.jpg", "macro",   "Detail de la broderie corde au dos du sweat"),
    "sweat-back-detail":     ("DSC03958.jpg", "macro",   "Gros plan sur la broderie cheval du sweat"),
    "sweat-mounted":         ("DSC03739.jpg", "product", "Cavaliere en sweat Nova Cavalia, en selle"),
    "sweat-back-mounted":    ("DSC03747.jpg", "product", "Dos du sweat en situation, cavaliere montee"),
    "sweat-lifestyle":       ("DSC03693.jpg", "product", "Sweat Nova Cavalia aux cotes du cheval"),
    # ---- EDITORIAL / LIFESTYLE --------------------------------------------
    "ed-1":                  ("DSC03418.jpg", "editorial", "Cavalier et cheval, instant editorial"),
    "ed-2":                  ("DSC03443.jpg", "editorial", "Cheval gris et cavaliere, terrain de concours"),
    "ed-3":                  ("DSC03470.jpg", "editorial", "Cavaliere et cheval gris, lumiere du matin"),
    "ed-4":                  ("DSC03481.jpg", "editorial", "Jeune cavalier concentre avant l epreuve"),
    "ed-bw-1":               ("DSC03713.jpg", "editorial", "Portrait noir et blanc d une cavaliere"),
    "ed-bw-2":               ("DSC03731.jpg", "editorial", "Cavaliere en selle, noir et blanc"),
    "ed-5":                  ("DSC03452.jpg", "editorial", "Complicite entre la cavaliere et son cheval"),
    "ed-arena":              ("DSC03537.jpg", "editorial", "Cavaliers a l echauffement sur la carriere"),
    "ed-look":               ("DSC03815.jpg", "editorial", "Silhouette complete Nova Cavalia, cheval gris"),
    "ed-stable":             ("DSC03830.jpg", "editorial", "Scene d ecurie, cavaliere et cheval"),
    "ed-look-2":             ("DSC03695.jpg", "editorial", "Le look complet Nova Cavalia en situation"),
}

ROLE_EDGE = {"hero": 2600, "product": 2000, "editorial": 2000, "macro": 1800}
ROLE_Q    = {"hero": 80,   "product": 82,   "editorial": 80,   "macro": 84}


def make_blur(im):
    b = im.copy()
    b.thumbnail((24, 24))
    b = b.filter(ImageFilter.GaussianBlur(1))
    buf = io.BytesIO()
    b.save(buf, format="WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def sample_palette(paths, k=6):
    """Average-cluster a handful of images into representative swatches."""
    from collections import Counter
    acc = Counter()
    for p in paths:
        im = Image.open(p).convert("RGB")
        im.thumbnail((80, 80))
        q = im.quantize(colors=8, method=Image.MEDIANCUT).convert("RGB")
        for cnt, col in q.getcolors(10000) or []:
            acc[col] += cnt
    top = [c for c, _ in acc.most_common(40)]
    return ["#%02X%02X%02X" % c for c in top[:k*3]]


def main():
    os.makedirs(IMG_OUT, exist_ok=True)
    manifest = {}
    missing = []
    for name, (fn, role, alt) in SEL.items():
        src = os.path.join(SRC, fn)
        if not os.path.exists(src):
            missing.append(fn); continue
        im = Image.open(src)
        # auto-orient
        im = im.convert("RGB")
        w, h = im.size
        edge = ROLE_EDGE[role]
        scale = min(1.0, edge / max(w, h))
        nw, nh = round(w*scale), round(h*scale)
        im_r = im.resize((nw, nh), Image.LANCZOS)
        out_path = os.path.join(IMG_OUT, name + ".webp")
        im_r.save(out_path, format="WEBP", quality=ROLE_Q[role], method=6)
        manifest[name] = {
            "src": f"/images/{name}.webp",
            "w": nw, "h": nh,
            "blur": make_blur(im),
            "alt": alt,
            "role": role,
            "source": fn,
        }
        print(f"  {name:22s} {nw}x{nh}  {round(os.path.getsize(out_path)/1024)}KB  <- {fn}")

    # palette from key hero + product shots
    pal_src = [os.path.join(SRC, SEL[n][0]) for n in
               ("hero-rider-horse", "veste-studio", "tapis-studio", "sweat-back", "ed-stable")
               if n in SEL and os.path.exists(os.path.join(SRC, SEL[n][0]))]
    palette = sample_palette(pal_src)

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT, "palette.json"), "w", encoding="utf-8") as f:
        json.dump(palette, f, indent=2)

    print(f"\nDONE: {len(manifest)} images. Missing: {missing}")
    print("Sampled palette:", palette)


if __name__ == "__main__":
    main()
