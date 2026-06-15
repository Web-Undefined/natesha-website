export const GALLERY_CATEGORIES = ["suman-nayak", "recitals", "productions", "solo-arangetram", "videos"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "suman-nayak": "Suman Nayak",
  recitals: "Recitals",
  productions: "Productions",
  "solo-arangetram": "Solo / Arangetram",
  videos: "Videos",
};

export function filterByCategory<T extends { category: string }>(items: T[], category: string): T[] {
  return category === "all" ? items : items.filter((i) => i.category === category);
}
