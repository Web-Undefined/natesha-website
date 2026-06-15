import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { GALLERY_CATEGORIES } from "./lib/gallery";

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: z.object({
    title: z.string(),
    date: z.string(), // YYYY-MM-DD
    venue: z.string().optional(),
    link: z.string().url().optional(),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/gallery" }),
  schema: z.object({
    title: z.string(),
    category: z.enum(GALLERY_CATEGORIES),
    date: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    videoUrl: z.string().url().optional(),
  }),
});

export const collections = { events, gallery };
