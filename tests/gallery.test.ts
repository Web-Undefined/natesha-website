import { describe, it, expect } from "vitest";
import { GALLERY_CATEGORIES, filterByCategory } from "../src/lib/gallery";

type G = { category: string; title: string };
const items: G[] = [
  { category: "recitals", title: "r1" },
  { category: "productions", title: "p1" },
  { category: "recitals", title: "r2" },
];

describe("gallery", () => {
  it("exposes the five categories", () => {
    expect(GALLERY_CATEGORIES).toEqual(["suman-nayak", "recitals", "productions", "solo-arangetram", "videos"]);
  });
  it("filters by category", () => {
    expect(filterByCategory(items, "recitals").map((g) => g.title)).toEqual(["r1", "r2"]);
  });
  it("'all' returns everything", () => {
    expect(filterByCategory(items, "all")).toHaveLength(3);
  });
});
