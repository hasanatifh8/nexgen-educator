import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { getPublicCatalog } from "@/lib/catalogStore";
import { SITE_URL } from "@/lib/organization";

/** Public pages plus every course on offer — rebuilt per request so new and disabled courses show up at once. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const { courses } = await getPublicCatalog();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]) => ({ url: `${SITE_URL}${path}`, priority, changeFrequency });
  return [
    page("/", 1, "weekly"),
    page("/courses", 0.9, "weekly"),
    ...courses.map((c) => page(`/courses/${c.id}`, c.launch ? 0.6 : 0.8, "weekly")),
    page("/about", 0.6, "monthly"),
    page("/verify", 0.5, "yearly"),
    page("/register", 0.5, "yearly"),
    page("/login", 0.3, "yearly"),
  ];
}
