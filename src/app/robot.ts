import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  let domain = headersList.get("host") as string;

  if (domain === "localhost:30000" || domain.endsWith(".vercel.app")) {
    domain = "www.barbinfurniture.com.au";
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api/draft-mode/*"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/studio", "/api/draft-mode/*"],
      },
    ],
    sitemap: `https://${domain}/sitemap.xml`,
    host: `https://${domain}`,
  };
}
