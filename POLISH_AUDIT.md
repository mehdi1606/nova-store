# POLISH_AUDIT — Nova Cavalia

Art-direction quality pass. Audited from source (browser screenshots unavailable
this session). Goal: from "templated" to luxury maison — Awwwards bar.

---

## Systemic issues (fix once, in tokens — highest leverage)

1. **No horizontal gutter / container.** `.edge-x` only sets `border-inline`. It has
   **no padding, no max-width, no centering** → content touches viewport edges on
   every page. This is the #1 "cheap" tell. → Redefine `.edge-x` as a real editorial
   container (responsive gutter + max-width + center).
2. **No spacing rhythm.** Sections mix `py-20 / py-24 / py-28 / py-32` ad hoc.
   Desktop tops out ~128px — below the 120–200px luxury range. → One `.section-y`
   rhythm scale, applied everywhere.
3. **Label inconsistency.** `.label` is `0.7rem` but overridden to `0.54 / 0.56 /
   0.6 / 0.62rem` across files — five sizes, several sub-10px (illegible). Tracking
   `0.28em` is looser than spec. → `.label` + `.label-xs` tokens; tracking → 0.18em.
4. **Motion applied unevenly.** Good primitives exist (`Reveal`, `MaskedHeading`,
   magnetic CTA, Lenis, PiecesScroll pin) but image **clip-path reveals** and
   **hover-zoom** are missing on most editorial images; no section-level stagger
   system. Motion is "fade-only" in too many places.
5. **Centered-everything tendency.** Pull-quotes, CTAs, timeline, values, newsletter
   all center. Needs more editorial asymmetry (left/right alternation, off-axis).
6. **Off-brand token noise.** `--color-sky`, `--color-noir` exist but are off the
   navy/bone/gold story. Audit usage; remove or quarantine.

---

## Page by page

### Home (`app/page.tsx` + 11 sections)
- **Hero** — parallax + masked headline already good. Eyebrow/CTA flush-left (gutter
  bug). Scroll cue fine. Keep, re-gutter, add grain over image.
- **Manifesto** — strong type but centered marquee feels generic; tighten leading,
  widen rhythm, hairline framing.
- **Categories** — two panels, hover scale OK. Captions need stronger hierarchy +
  label/number ornament; gradient too heavy.
- **HistoireTeaser** — split layout good; stats `dl` cramped; needs hairline rules,
  bigger numerals, image clip-reveal.
- **PiecesScroll** (signature) — pin works; panels need more generous interior
  padding, larger type, a progress indicator, refined per-panel meta.
- **LookFeature** — value/price logic fine; presentation flat — stack imagery with
  asymmetry, gold hairline on the "économisez" figure only.
- **Savoirfaire** — icon trio reads templated (3 equal centered cards). Redesign as
  editorial rows with large macro imagery + numerals.
- **JournalTeaser / Communaute / Newsletter** — competent but centered & flat;
  Communaute grid needs consistent ratio + hover; Newsletter input states refine.

### Boutique (`app/boutique/page.tsx`)
- Header uses `pt-32 lg:pt-40` (OK) but no gutter. Tabs are pill buttons — fine, but
  spacing cramped. Product grid `gap-x-6 gap-y-12` thin for luxury; cards need air.

### ProductCard
- CSS hover-swap is clever. Type hierarchy weak (name/tagline/price same weight
  zone); swatch row cramped; no image reveal on scroll-in.

### Produit / PDP (`app/produit/[slug]`)
- Breadcrumb micro-label too small. Gallery + BuyBox solid logic; **gallery thumbs &
  main need consistent ratio + hover zoom**; BuyBox spacing dense, size grid cramped,
  reassurance trio generic. Story band good — enlarge, add clip-reveal on macros.

### Histoire (`app/histoire`)
- Chapters alternate (good) but **images have no hover/scroll reveal** and sit on flat
  `bg-paper-2`. Intro `max-w-3xl` flush-left (gutter bug). Timeline 4-col cramped,
  numerals too small for the drama they deserve. Values trio = templated 3-up.

### Journal (`app/journal`)
- Just built; grid + featured decent. Needs gutter, stronger date/category meta,
  consistent 4:5 ratio, hover zoom (present), reveal stagger.

### Contact (`app/contact`)
- Just built; form a11y good. Form card + info column need rhythm; left image only on
  lg — give mobile a hero crop. Subject chips spacing.

### Panier (`components/shop/CartView.tsx`)
- Functional. Summary card flat; line items cramped; empty state good. Re-gutter,
  add rhythm, refine quantity stepper + hairlines.

### Chrome
- **Header** — solid; wordmark swap good. Announcement bar `0.62rem` tiny. Nav OK.
- **Footer / CartDrawer / MenuOverlay / Preloader / Cursor** — competent; align all to
  new label/spacing tokens; Preloader keep (PNG mask can't stroke-draw — clip wipe is
  the right substitute).

---

## References studied (what makes them feel expensive)

- **Hermès / Brunello Cucinelli / Loro Piana** — vast negative space; oversized serif
  against tiny tracked caps; hairline rules; near-monochrome palette with one warm
  accent; motion is slow and sparse.
- **Jacquemus / Aimé Leon Dore** — editorial lookbook grids, **product shot paired
  with lifestyle**, asymmetric crops, warm film grain.
- **Zegna / Cartier microsites (GSAP+Lenis)** — pinned horizontal acts, clip-path
  image reveals, magnetic UI, eased ~600ms motion, restraint over flash.

**Takeaways to apply:** (1) whitespace is the luxury signal — be generous; (2) extreme
type-scale contrast; (3) image-forward, full-bleed + intentional asymmetric grids,
never a lonely product on flat bg; (4) one warm accent, used ≤10%; (5) slow eased
motion with clip-reveals + stagger, not blanket fades; (6) hairline detailing and the
horse mark as quiet ornament.
