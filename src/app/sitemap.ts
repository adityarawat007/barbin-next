import { MetadataRoute } from "next";
import { headers } from "next/headers";

const URLS = [
  {
    url: "/",
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1.0,
  },
  {
    url: "/about",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/contact",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  },
  {
    url: "/privacy-policy",
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  },
  {
    url: "/products",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  },
  {
    url: "/categories",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  },
  {
    url: "/cart",
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.3,
  },

];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  let domain = headersList.get("host") as string;

  if (domain === "localhost:30000" || domain.endsWith(".vercel.app")) {
    domain = "www.barbinfurniture.com.au";
  }

  return URLS.map((item) => ({
    url: `https://${domain}${item.url}`,
    lastModified: item.lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
