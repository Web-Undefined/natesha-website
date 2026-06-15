import { config, fields, collection } from "@keystatic/core";

export default config({
  storage: { kind: "github", repo: "Web-Undefined/natesha-website" },
  ui: { brand: { name: "Natesha Website" } },
  collections: {
    events: collection({
      label: "Events",
      slugField: "title",
      path: "src/content/events/*",
      format: { contentField: "body" },
      schema: {
        title: fields.slug({ name: { label: "Event name" } }),
        date: fields.date({ label: "Date", description: "Past dates show under Performance History automatically." }),
        venue: fields.text({ label: "Venue / location", validation: { isRequired: false } }),
        link: fields.url({ label: "More-info link (optional)" }),
        body: fields.markdoc({ label: "Description" }),
      },
    }),
    gallery: collection({
      label: "Gallery items",
      slugField: "title",
      path: "src/content/gallery/*",
      schema: {
        title: fields.slug({ name: { label: "Title / caption" } }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "Suman Nayak", value: "suman-nayak" },
            { label: "Recitals", value: "recitals" },
            { label: "Productions", value: "productions" },
            { label: "Solo / Arangetram", value: "solo-arangetram" },
            { label: "Videos", value: "videos" },
          ],
          defaultValue: "recitals",
        }),
        date: fields.date({ label: "Date", validation: { isRequired: false } }),
        images: fields.array(
          fields.object({
            src: fields.image({ label: "Photo", directory: "public/gallery", publicPath: "/gallery/" }),
            alt: fields.text({ label: "Photo description (for accessibility)" }),
          }),
          { label: "Photos", itemLabel: (p) => p.fields.alt.value || "Photo" }
        ),
        videoUrl: fields.url({ label: "Video link (for Videos category)" }),
      },
    }),
  },
});
