import { Color } from "../types";
import { getSaturation, getLuminance } from "../colorUtils";

/**
 * Extract a balanced color palette (mix of vibrant, light, dark colors)
 */
export function paletteColors(pixels: Color[], count: number = 6): Color[] {
  if (pixels.length === 0) return [];

  // Build color frequency map
  const colorMap = new Map<
    string,
    {
      color: Color;
      count: number;
      saturation: number;
      luminance: number;
    }
  >();

  for (const pixel of pixels) {
    const key = pixel.hex;
    if (colorMap.has(key)) {
      colorMap.get(key)!.count++;
    } else {
      colorMap.set(key, {
        color: pixel,
        count: 1,
        saturation: getSaturation(pixel),
        luminance: getLuminance(pixel),
      });
    }
  }

  const colorArray = Array.from(colorMap.values());

  // Select colors from different categories
  const palette: Color[] = [];

  // 1. Most dominant color
  const dominant = colorArray.sort((a, b) => b.count - a.count)[0];
  if (dominant) palette.push({ ...dominant.color, count: dominant.count });

  // 2. Most vibrant color (high saturation)
  const vibrant = colorArray
    .filter((c) => c.saturation > 0.4)
    .sort((a, b) => b.saturation - a.saturation)[0];
  if (vibrant && !palette.some((c) => c.hex === vibrant.color.hex)) {
    palette.push({ ...vibrant.color, count: vibrant.count });
  }

  // 3. Light color (high luminance)
  const light = colorArray
    .filter((c) => c.luminance > 0.7)
    .sort((a, b) => b.count - a.count)[0];
  if (light && !palette.some((c) => c.hex === light.color.hex)) {
    palette.push({ ...light.color, count: light.count });
  }

  // 4. Dark color (low luminance)
  const dark = colorArray
    .filter((c) => c.luminance < 0.3)
    .sort((a, b) => b.count - a.count)[0];
  if (dark && !palette.some((c) => c.hex === dark.color.hex)) {
    palette.push({ ...dark.color, count: dark.count });
  }

  // 5-6. Fill remaining with most frequent colors not yet selected
  const remaining = colorArray
    .filter((c) => !palette.some((p) => p.hex === c.color.hex))
    .sort((a, b) => b.count - a.count);

  for (const item of remaining) {
    if (palette.length >= count) break;
    palette.push({ ...item.color, count: item.count });
  }

  return palette.slice(0, count);
}
