import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// @keystatic/astro@5 reads Astro.locals.runtime.env which was removed in Astro v6.
// Patch the Keystatic API module at build time to use cloudflare:workers directly.
const patchKeystatic = {
  name: "patch-keystatic-cf-env",
  transform(code, id) {
    if (!id.includes("keystatic-astro-api")) return null;
    const patched = code.replace(
      /const envVarsForCf = [^;]+;/,
      `const { env: envVarsForCf } = await import("cloudflare:workers");`
    );
    if (patched === code) return null;
    return { code: patched, map: null };
  },
};

export default defineConfig({
  site: "https://www.nateshadance.com",
  integrations: [react(), keystatic(), sitemap()],
  adapter: cloudflare(),
  vite: {
    optimizeDeps: { exclude: ["@keystatic/astro"] },
    plugins: [patchKeystatic],
  },
});