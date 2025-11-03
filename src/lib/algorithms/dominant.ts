import { Color } from "../types";

/**
 * Extract dominant colors by frequency
 */
export function dominantColors(pixels: Color[], count: number = 6): Color[] {
  if (pixels.length === 0) return [];

  // Count color occurrences
  const colorMap = new Map<string, { color: Color; count: number }>();

  for (const pixel of pixels) {
    const key = pixel.hex;
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, { color: pixel, count: 1 });
    }
  }

  // Sort by frequency and return top colors
  return Array.from(colorMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map((entry) => ({
      ...entry.color,
      count: entry.count,
    }));
}
