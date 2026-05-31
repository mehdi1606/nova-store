# Nova Cavalia — Assets Manifest

Maps every used asset → where it lives in the build. Source photos are portrait
JPEG (4000×6000 / 2624×3936); all optimised to WebP under `public/images/` with blur
placeholders (see `content/images.json`). Machine-readable manifest: `content/images.json`.

## Logos
| File | Use |
|------|-----|
| `public/logo-nova.webp` | Primary lockup (nav fallback, footer, preloader wordmark) |
| `public/logo-nova.svg`  | High-res lockup (large footer / hero contexts) |
| custom horse-mark SVG (`components/HorseMark.tsx`) | Preloader stroke-draw, favicon, dividers, faint watermarks, hover accents |

## Hero / full-bleed (focal-point cropped — portrait → any ratio)
| Key | Source | Placement |
|-----|--------|-----------|
| `hero-rider-horse` | DSC03420 | Homepage hero (priority), golden-hour rider + dark horse |
| `hero-grey-walk`   | DSC03785 | `/histoire` hero, Le Look hero |
| `hero-mounted`     | DSC03593 | Manifeste / interstitial parallax |
| `hero-arena`       | DSC03570 | `/boutique` hero, journal full-bleed |
| `stable-atmosphere`| DSC03950 | Savoir-faire background, contact side |
| `cat-cavalier`     | DSC03425 | Category panel **Le Cavalier** |
| `cat-cheval`       | DSC03447 | Category panel **Le Cheval** |

## Product — Tapis de selle (`tapis-de-selle`)
| Key | Source | Placement |
|-----|--------|-----------|
| `tapis-studio`   | DSC03910 | PDP main / homepage chapter |
| `tapis-hanging`  | DSC03924 | PDP gallery, boutique card |
| `tapis-on-horse` | DSC03896 | PDP gallery (lifestyle), card hover-swap |
| `tapis-detail`   | DSC03909 | Macro — quilting + rope piping |
| `tapis-placing`  | DSC03914 | PDP gallery (in-use) |
| `tapis-macro-bw` | DSC03767 | Savoir-faire B&W beat |
| `tapis-mounted`  | DSC03529 | PDP gallery (mounted context) |

## Product — Veste de concours (`veste-de-concours`, Femme/Homme)
| Key | Source | Placement |
|-----|--------|-----------|
| `veste-studio`        | DSC03629 | PDP main / homepage chapter |
| `veste-homme-studio`  | DSC03670 | PDP gallery (Homme), card hover |
| `veste-homme-1/2`     | DSC03503 / DSC03607 | PDP Homme on-model |
| `veste-femme-1/2/3`   | DSC03844 / DSC03852 / DSC03869 | PDP Femme on-model, boutique card |
| `veste-macro-sleeve`  | DSC03860 | Macro — sleeve embroidery (savoir-faire) |
| `veste-macro-buttons` | DSC03863 | Macro — buttons |
| `veste-macro-cuff`    | DSC03868 | Macro — cuff finish |
| `veste-lifestyle`     | DSC03412 | PDP lifestyle, Le Look |

## Product — Sweat (`sweat-nova`)
| Key | Source | Placement |
|-----|--------|-----------|
| `sweat-studio`       | DSC03929 | PDP main / homepage chapter (folded, script) |
| `sweat-homme-front`  | DSC03685 | PDP on-model front, card |
| `sweat-homme-2`      | DSC03683 | PDP gallery |
| `sweat-back`         | DSC03698 | PDP gallery — rope-knot back embroidery (hero detail) |
| `sweat-back-2`       | DSC03705 | PDP gallery, card hover-swap |
| `sweat-macro-back`   | DSC03961 | Macro — back embroidery (savoir-faire) |
| `sweat-back-detail`  | DSC03958 | Macro — embroidery close |
| `sweat-mounted`      | DSC03739 | PDP lifestyle (mounted) |
| `sweat-back-mounted` | DSC03747 | PDP gallery |
| `sweat-lifestyle`    | DSC03693 | Le Look, PDP lifestyle |

## Editorial / lifestyle (story, journal, communauté, look)
| Key | Source | Placement |
|-----|--------|-----------|
| `ed-1` | DSC03418 | Journal / communauté grid |
| `ed-2` | DSC03443 | Communauté grid |
| `ed-3` | DSC03470 | Histoire scrollytelling |
| `ed-4` | DSC03481 | Histoire scrollytelling |
| `ed-5` | DSC03452 | Communauté grid |
| `ed-bw-1` | DSC03713 | Journal (B&W spread) |
| `ed-bw-2` | DSC03731 | Histoire (B&W beat) |
| `ed-arena` | DSC03537 | Journal full-bleed |
| `ed-look` | DSC03815 | Le Look hero / lookbook |
| `ed-look-2` | DSC03695 | Le Look secondary |
| `ed-stable` | DSC03830 | Communauté / contact |

**Unused source frames** remain in `assets/img/` as a reserve for future colours/looks;
adding one = drop the file, run `scripts/optimize.py`, reference the new key.
