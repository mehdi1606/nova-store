# NOVA CAVALIA — Design Direction

> Curated luxury equestrian capsule. 3 products, made to feel like a maison.
> Market: Morocco · Language: French · Currency: MAD (Dhs).

---

## 1. The problem & the strategy

We have **3 products in one colour (navy)** and **~80 portrait photographs** from a
single golden-hour shoot at a Moroccan equestrian club. A bare 3-item grid would feel
empty and kill the luxury. The strategy that fixes this:

1. **Story carries the weight, not SKU count.** Editorial, heritage (est. 2026),
   savoir-faire and lookbook fill the journey; commerce is interleaved, never stacked.
2. **Every product becomes its own immersive editorial chapter** (studio + lifestyle +
   macro), not a card in a grid.
3. **Depth = catalogue.** Femme/Homme fits, sizes, the complete *Look* bundle, deep
   product pages (6 images, size guide, care, cross-sell) all add perceived breadth.
4. **Scarcity as luxury, not apology.** "Collection Capsule 2026", navy = *couleur
   signature*, future colours teased as **"Bientôt"** → turns a small catalogue into
   *anticipation*.

## 2. Asset reality (drives the layout)

- **100% portrait** (4000×6000 / 2624×3936). **Zero landscape.** → Layouts lean into
  **split-screen**, **asymmetric portrait columns**, and **full-height** panels.
  Full-bleed heroes use **focal-point cropping** (`object-position`), never distortion.
- One coherent world: deep navy garments, warm sand arenas, palms, grey & bay horses,
  Moroccan sky, soft golden light. A few fine **B&W** frames for editorial rhythm.
- A leaping **line-art horse mark** + script wordmark (image only — never re-typed).

## 3. Palette (sampled from the real photographs)

Sampled dominant tones confirmed navy + warm neutrals + Moroccan-sky blue.

| Token        | Hex        | Role |
|--------------|------------|------|
| `--ink`      | `#0E1C30`  | primary navy surface, type on light |
| `--ink-deep` | `#091422`  | deepest navy, hero overlays |
| `--paper`    | `#F3ECE0`  | warm bone — main light background |
| `--paper-2`  | `#EAE0CF`  | secondary bone, cards |
| `--or`       | `#C2A36B`  | champagne gold — hairlines, accents (used sparingly) |
| `--leather`  | `#6E4B2F`  | saddle brown — tertiary warmth |
| `--stone`    | `#9A8F7D`  | warm taupe — muted text, borders |
| `--sky`      | `#9BC1DE`  | whisper of Moroccan sky (rare cool accent) |
| `--noir`     | `#141414`  | high-contrast text |

**Discipline:** ~70% navy, ~25% bone, gold only as a whisper-thin hairline / hover.
Restraint = luxury.

## 4. Typography

- **Display / headings:** **Fraunces** (variable, optical sizing, high contrast serif).
  Big, confident, tight leading, occasional italic for editorial accents.
- **Body / UI:** **Hanken Grotesk** — warm humanist grotesque.
- **Labels:** small, **UPPERCASE**, wide letter-tracking (`0.2–0.35em`) — the
  "fashion label" look. Numbers/eyebrows set this way.
- Script logo stays an **image** only.

## 5. Motion principles

- **Smooth scroll** (Lenis) site-wide; everything eased, ~400–800ms, custom
  cubic-bezier `(0.16, 1, 0.3, 1)`. Target 60fps. Full `prefers-reduced-motion`.
- **Preloader:** horse mark draws in (SVG stroke), wordmark fades, curtain wipes up.
- **Hero:** slow parallax/scale on the image; headline in line-by-line **masked reveal**.
- **Scroll-telling:** pinned sections, clip-path / mask image reveals, staggered fades,
  reveal-on-scroll labels & numbers.
- **One horizontal-scroll act** (the capsule pieces) — the signature moment.
- **Micro-interactions:** magnetic buttons, underline-grow links, image hover-zoom with
  a stable focal point, minimal **custom cursor** (dot scales on interactive; off on touch).
- **Add-to-cart:** product image flies to the cart; drawer slides in.
- **Marquee** of the tagline: "L'HISTOIRE À PORTER — RIDING TEAM — EST. 2026".
- **Mobile:** lighten parallax, keep reveals, hold 60fps.

## 6. Reference vibes

1. **Hermès / Loro Piana digital** — vast whitespace, restraint, craft macro beats.
2. **Awwwards fashion SOTD** (kinetic type, pinned scroll-telling, broken grids).
3. **Equestrian heritage** (Dior "Gaucho", Longchamp, CWD saddlery) — leather, rope, navy.
4. **Editorial print** (Kinfolk / The Gentlewoman) — generous margins, serif + small caps.

## 7. Homepage section order (final)

1. **Hero** — cinematic rider/horse, kinetic masked headline, 1 CTA "Découvrir la collection".
2. **Manifeste** — one strong line + line-art horse motif.
3. **Notre Histoire (teaser)** — heritage since 2026, sticky scroll-telling → `/histoire`.
4. **L'Équipement & Le Cavalier** — two immersive panels: **Cheval** / **Cavalier**.
5. **Les Pièces** — horizontal-scroll act; each product an immersive editorial chapter.
6. **Le Look** — the complete outfit styled as one shoppable bundle.
7. **Savoir-faire** — craftsmanship macro beats (stitching, rope piping, embroidery).
8. **Le Journal** — editorial / lookbook teaser, full-bleed.
9. **Communauté** — UGC grid, "Taguez #NovaCavalia".
10. **Newsletter — "Rejoignez l'écurie"** — capture + "premiers informés des prochaines couleurs".
11. **Footer** — large editorial: logo, links, social, contact, shipping, the mark.

## 8. System

- **Next.js 15** (App Router) · React 19 · TypeScript · **Tailwind v4** design tokens.
- **GSAP + ScrollTrigger** (choreography) · **Lenis** (smooth scroll) · **Framer Motion**
  (component micro-interactions) · **Zustand** (cart).
- Typed local content = single source of truth (extensible to Shopify/Stripe later).
- **Film-grain + vignette** overlay echoing the warm stable photography.
- Line icons only (Lucide / custom horse-mark SVG). **No emojis.**
- Lighthouse target **≥ 95** (perf/SEO/best-practices/a11y). No CLS — blur placeholders,
  intrinsic sizes, `next/image` with `priority` on the hero only.
