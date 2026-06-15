import type { MiddlewareHandler } from "astro";

// @keystatic/astro@5 reads Astro.locals.runtime.env, which was removed in
// Astro v6. This shim restores it until Keystatic releases Astro v6 support.
export const onRequest: MiddlewareHandler = async (context, next) => {
  try {
    const { env } = await import("cloudflare:workers");
    const locals = context.locals as Record<string, unknown>;
    if (!locals.runtime) locals.runtime = {};
    const runtime = locals.runtime as Record<string, unknown>;
    if (!runtime.env) runtime.env = env;
  } catch {
    // Not running in Cloudflare Workers (local dev without wrangler) — skip
  }
  return next();
};
