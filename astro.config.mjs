import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://www.nateshadance.com",
  integrations: [react(), keystatic(), sitemap()],
});
