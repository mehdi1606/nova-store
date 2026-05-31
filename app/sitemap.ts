import type { MetadataRoute } from "next";
import { allSlugs } from "@/content/products";

const SITE = "https://novacavalia.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    { path: "/", priority: 1, freq: "weekly" as const },
    { path: "/boutique", priority: 0.9, freq: "weekly" as const },
    { path: "/histoire", priority: 0.7, freq: "monthly" as const },
    { path: "/journal", priority: 0.6, freq: "weekly" as const },
    { path: "/contact", priority: 0.5, freq: "yearly" as const },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const productEntries: MetadataRoute.Sitemap = allSlugs.map((slug) => ({
    url: `${SITE}/produit/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
