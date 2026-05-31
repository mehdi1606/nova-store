import type { ImageKey } from "@/lib/images";

export type ColorSwatch = { name: string; hex: string; available: boolean };
export type Fit = "Femme" | "Homme";
export type SizeOption = { label: string; available: boolean };
export type ProductDetail = { title: string; body: string };

export type Product = {
  slug: string;
  name: string;
  category: "cheval" | "cavalier";
  eyebrow: string;
  tagline: string;
  priceMAD: number;
  shortDesc: string;
  description: string;
  story: string;
  colors: ColorSwatch[];
  fits?: Fit[];
  sizes?: SizeOption[];
  sizesByFit?: Partial<Record<Fit, SizeOption[]>>;
  sizeType: "vetement" | "accessoire";
  sizeNote: string;
  hero: ImageKey;
  gallery: ImageKey[];
  card: ImageKey;
  cardHover: ImageKey;
  macro: ImageKey[];
  details: ProductDetail[];
  crossSell: string[];
  /** homepage editorial chapter image alignment */
  chapterAlign: "left" | "right";
};

const NAVY: ColorSwatch = { name: "Marine — Couleur signature", hex: "#16273D", available: true };
const SOON: ColorSwatch[] = [
  { name: "Vert Écurie", hex: "#2C4434", available: false },
  { name: "Bordeaux", hex: "#5A2230", available: false },
  { name: "Sable", hex: "#C9B79C", available: false },
];

const vetSizes = (labels: string[], soldOut: string[] = []): SizeOption[] =>
  labels.map((l) => ({ label: l, available: !soldOut.includes(l) }));

export const products: Product[] = [
  {
    slug: "veste-de-concours",
    name: "Veste de Concours",
    category: "cavalier",
    eyebrow: "Collection Capsule 2026",
    tagline: "L'allure du concours, l'aisance du quotidien.",
    priceMAD: 1890,
    shortDesc:
      "La pièce maîtresse du cavalier. Coupe ajustée marine, cheval brodé sur la manche.",
    description:
      "Taillée pour la piste et pensée pour durer, la Veste de Concours Nova Cavalia épouse la silhouette sans jamais l'entraver. Le marine profond, la doublure soyeuse et le cheval brodé au fil de soie sur la manche signent une élégance discrète, reconnaissable entre toutes.",
    story:
      "Sur le paddock comme à la remise des prix, elle ne se remarque pas — elle se reconnaît. Une veste qui tient la posture du cavalier et la mémoire d'une maison fondée en 2026.",
    colors: [NAVY, ...SOON],
    fits: ["Femme", "Homme"],
    sizesByFit: {
      Femme: vetSizes(["34", "36", "38", "40", "42", "44"], ["34"]),
      Homme: vetSizes(["44", "46", "48", "50", "52", "54"], ["54"]),
    },
    sizeType: "vetement",
    sizeNote: "Coupe ajustée. Si vous hésitez, prenez votre taille habituelle.",
    hero: "veste-studio",
    gallery: [
      "veste-studio",
      "veste-homme-studio",
      "veste-femme-1",
      "veste-femme-2",
      "veste-macro-sleeve",
      "veste-macro-buttons",
    ],
    card: "veste-femme-3",
    cardHover: "veste-homme-2",
    macro: ["veste-macro-sleeve", "veste-macro-cuff", "veste-macro-buttons"],
    details: [
      {
        title: "Matière & coupe",
        body: "Tissu technique stretch (88% polyester, 12% élasthanne), doublure respirante. Coupe ajustée, col montant, fermeture boutonnée. Cheval brodé fil de soie sur la manche.",
      },
      {
        title: "Entretien",
        body: "Nettoyage à sec recommandé. Lavage délicat 30°C possible, à l'envers. Ne pas sécher en machine. Repasser à basse température sur l'envers.",
      },
      {
        title: "Livraison & retours",
        body: "Livraison offerte au Maroc dès 800 Dhs (2 à 4 jours ouvrés). Retours gratuits sous 14 jours.",
      },
    ],
    crossSell: ["sweat-nova", "tapis-de-selle"],
    chapterAlign: "right",
  },
  {
    slug: "tapis-de-selle",
    name: "Tapis de Selle",
    category: "cheval",
    eyebrow: "Collection Capsule 2026",
    tagline: "Le confort du cheval, la signature de la maison.",
    priceMAD: 690,
    shortDesc:
      "Matelassé marine, passepoil corde crème, cheval brodé. Pensé pour le dos du cheval.",
    description:
      "Un tapis matelassé qui marie le maintien et la douceur. Le marine profond rehaussé d'un passepoil corde crème et du cheval brodé : une pièce qui habille la monture autant qu'elle la protège. Coutures renforcées, matière respirante, séchage rapide.",
    story:
      "Le premier regard se pose toujours sur le cheval. Le tapis Nova Cavalia l'accompagne d'une ligne nette, d'une corde crème et d'un confort pensé pour l'effort.",
    colors: [NAVY, ...SOON],
    sizes: [
      { label: "Cob", available: true },
      { label: "Full", available: true },
    ],
    sizeType: "accessoire",
    sizeNote: "Cob pour les chevaux légers et poneys ; Full pour les chevaux de selle.",
    hero: "tapis-studio",
    gallery: [
      "tapis-studio",
      "tapis-on-horse",
      "tapis-placing",
      "tapis-detail",
      "tapis-hanging",
      "tapis-mounted",
    ],
    card: "tapis-studio",
    cardHover: "tapis-on-horse",
    macro: ["tapis-detail", "tapis-macro-bw"],
    details: [
      {
        title: "Matière & confort",
        body: "Extérieur microfibre matelassée, intérieur coton respirant. Passepoil corde crème, cheval brodé. Mousse répartissant la pression, évacuation de l'humidité.",
      },
      {
        title: "Entretien",
        body: "Lavage machine 30°C, cycle délicat. Ne pas utiliser d'assouplissant. Séchage à l'air libre, à plat. Ne pas repasser la broderie.",
      },
      {
        title: "Livraison & retours",
        body: "Livraison offerte au Maroc dès 800 Dhs (2 à 4 jours ouvrés). Retours gratuits sous 14 jours.",
      },
    ],
    crossSell: ["veste-de-concours", "sweat-nova"],
    chapterAlign: "left",
  },
  {
    slug: "sweat-nova",
    name: "Sweat Nova Cavalia",
    category: "cavalier",
    eyebrow: "Collection Capsule 2026",
    tagline: "L'écurie au quotidien.",
    priceMAD: 790,
    shortDesc:
      "Marine, script crème brodé au cœur, grand cheval corde au dos. La maille du club.",
    description:
      "Le vestiaire informel de la maison. Coton gratté épais, script « Nova Cavalia » brodé crème sur le cœur et la grande signature corde du cheval au dos. À porter du box à la ville, sans jamais quitter l'écurie d'esprit.",
    story:
      "Celui qu'on enfile à l'aube, avant le premier panser. Le dos raconte la maison ; le devant, l'appartenance à l'équipe.",
    colors: [NAVY, ...SOON],
    sizes: vetSizes(["XS", "S", "M", "L", "XL"], ["XS"]),
    sizeType: "vetement",
    sizeNote: "Coupe droite, légèrement oversize. Prenez votre taille habituelle.",
    hero: "sweat-studio",
    gallery: [
      "sweat-studio",
      "sweat-homme-front",
      "sweat-back",
      "sweat-back-2",
      "sweat-macro-back",
      "sweat-mounted",
    ],
    card: "sweat-homme-front",
    cardHover: "sweat-back-2",
    macro: ["sweat-macro-back", "sweat-back-detail"],
    details: [
      {
        title: "Matière & coupe",
        body: "Coton gratté 380g/m² (80% coton, 20% polyester recyclé). Col côtelé, coupe droite légèrement oversize. Script brodé crème au cœur, cheval corde brodé au dos.",
      },
      {
        title: "Entretien",
        body: "Lavage machine 30°C sur l'envers. Ne pas sécher en machine. Repasser à l'envers en évitant les broderies.",
      },
      {
        title: "Livraison & retours",
        body: "Livraison offerte au Maroc dès 800 Dhs (2 à 4 jours ouvrés). Retours gratuits sous 14 jours.",
      },
    ],
    crossSell: ["veste-de-concours", "tapis-de-selle"],
    chapterAlign: "right",
  },
];

export type LookBundle = {
  title: string;
  eyebrow: string;
  description: string;
  hero: ImageKey;
  secondary: ImageKey;
  items: string[];
  discountRate: number; // applied to the sum
};

export const look: LookBundle = {
  title: "Le Look",
  eyebrow: "La silhouette complète",
  description:
    "Veste de concours, tapis de selle et sweat réunis : la garde-robe complète du cavalier Nova Cavalia, pensée pour s'accorder du paddock à la ville.",
  hero: "ed-look",
  secondary: "veste-lifestyle",
  items: ["veste-de-concours", "tapis-de-selle", "sweat-nova"],
  discountRate: 0.1,
};

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(cat: Product["category"]): Product[] {
  return products.filter((p) => p.category === cat);
}

export function lookTotal(): { full: number; bundled: number } {
  const full = look.items
    .map((s) => getProduct(s)?.priceMAD ?? 0)
    .reduce((a, b) => a + b, 0);
  return { full, bundled: Math.round((full * (1 - look.discountRate)) / 10) * 10 };
}

export const allSlugs = products.map((p) => p.slug);
