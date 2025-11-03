import { Color } from "../types";
import { getSaturation } from "../colorUtils";

/**
 * Extract vibrant colors (high saturation colors)
 */
export function vibrantColors(pixels: Color[], count: number = 6): Color[] {
  if (pixels.length === 0) return [];

  // Calculate saturation for each unique color
  const colorMap = new Map<
    string,
    { color: Color; saturation: number; count: number }
  >();

  for (const pixel of pixels) {
    const key = pixel.hex;
    if (colorMap.has(key)) {
      const entry = colorMap.get(key)!;
      entry.count++;
    } else {
      const saturation = getSaturation(pixel);
      colorMap.set(key, { color: pixel, saturation, count: 1 });
    }
  }

  // Filter colors with good saturation (> 0.3) and sort by saturation * count
  const vibrantColorArray = Array.from(colorMap.values())
    .filter((entry) => entry.saturation > 0.3)
    .sort((a, b) => {
      const scoreA = a.saturation * Math.log(a.count + 1);
      const scoreB = b.saturation * Math.log(b.count + 1);
      return scoreB - scoreA;
    });

  // Return top vibrant colors
  return vibrantColorArray.slice(0, count).map((entry) => ({
    ...entry.color,
    count: entry.count,
  }));
}
