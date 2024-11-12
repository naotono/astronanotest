import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import partytown from "@astrojs/partytown";
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: "https://naotoono.net",
  integrations: [
    mdx(), 
    sitemap(), 
    tailwind(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
