import type { MiddlewareHandler } from "astro";
// @ts-ignore
import { env } from "cloudflare:workers";

// @astrojs/cloudflare v13 defines locals.runtime as non-writable/non-configurable
// via Object.defineProperty, so we can't replace it. But locals.runtime.env is
// a getter defined in an object literal (configurable: true), so we CAN redefine it.
export const onRequest: MiddlewareHandler = (context, next) => {
  const runtime = (context.locals as any).runtime;
  if (runtime) {
    Object.defineProperty(runtime, "env", {
      value: env,
      configurable: true,
      writable: true,
    });
  }
  return next();
};
