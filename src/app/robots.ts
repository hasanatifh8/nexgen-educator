import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/organization";

/** Private areas (accounts, admin, checkout, lessons, exams, certificate holders' pages) stay out of search and AI indexes. */
const PRIVATE = ["/admin", "/my-learning", "/checkout", "/onboarding", "/certifications", "/reset-password", "/forgot-password", "/verify/", "/courses/*/learn"];

/** AI assistants and answer engines we want to read the public site (they are also covered by "*"). */
const AI_CRAWLERS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Amazonbot", "meta-externalagent", "Bytespider"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
