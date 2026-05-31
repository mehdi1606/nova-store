import type { MetadataRoute } from "next";

const SITE = "https://novacavalia.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/panier"],
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
