import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  experimental: {
    // Profile completion uploads an ID document and a CV (2 MB each) in one Server Action.
    // Vercel caps function request bodies at 4.5 MB, so don't raise per-file limits past that total.
    serverActions: { bodySizeLimit: "5mb" },
  },
  partialPrefetching: true,
  // Crawlers listed here get page titles and descriptions in <head> straight away instead of streamed in later.
  // Next.js' default list plus Googlebot and the AI assistants' crawlers, which read raw HTML.
  htmlLimitedBots:
    /[\w-]+-Google|Google-[\w-]+|Googlebot|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|GPTBot|OAI-SearchBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|Claude-User|anthropic-ai|PerplexityBot|Perplexity-User|CCBot|Amazonbot|meta-externalagent|Bytespider|cohere-ai|YouBot/i,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
