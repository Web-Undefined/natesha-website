export function isUpcoming(date: string, now: Date = new Date()): boolean {
  return date >= now.toISOString().split("T")[0];
}

export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export function splitEvents<T extends { date: string }>(items: T[], now: Date = new Date()) {
  const upcoming = items.filter((e) => isUpcoming(e.date, now)).sort((a, b) => a.date.localeCompare(b.date));
  const past = sortByDateDesc(items.filter((e) => !isUpcoming(e.date, now)));
  return { upcoming, past };
}
