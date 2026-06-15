import { describe, it, expect } from "vitest";
import { isUpcoming, sortByDateDesc, splitEvents } from "../src/lib/events";

type E = { date: string; title: string };
const today = new Date("2026-06-09");

describe("events", () => {
  it("isUpcoming: today or future is upcoming", () => {
    expect(isUpcoming("2026-06-09", today)).toBe(true);
    expect(isUpcoming("2026-12-01", today)).toBe(true);
    expect(isUpcoming("2026-06-08", today)).toBe(false);
  });

  it("sortByDateDesc: newest first", () => {
    const list: E[] = [{ date: "2024-01-01", title: "a" }, { date: "2025-01-01", title: "b" }];
    expect(sortByDateDesc(list).map((e) => e.title)).toEqual(["b", "a"]);
  });

  it("splitEvents: upcoming asc, past desc", () => {
    const list: E[] = [
      { date: "2026-08-01", title: "future2" },
      { date: "2026-07-01", title: "future1" },
      { date: "2020-01-01", title: "old" },
    ];
    const { upcoming, past } = splitEvents(list, today);
    expect(upcoming.map((e) => e.title)).toEqual(["future1", "future2"]);
    expect(past.map((e) => e.title)).toEqual(["old"]);
  });
});
