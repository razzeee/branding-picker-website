import { Color } from "../types";
import { rgbToHex } from "../colorUtils";

/**
 * Extract colors using histogram analysis (quantized color bins)
 */
export function histogramColors(pixels: Color[], count: number = 6): Color[] {
  if (pixels.length === 0) return [];

  // Quantize colors to reduce color space (divide by 16)
  const binSize = 16;
  const histogram = new Map<
    string,
    { r: number; g: number; b: number; count: number }
  >();

  for (const pixel of pixels) {
    // Quantize to bins
    const rBin = Math.floor(pixel.r / binSize);
    const gBin = Math.floor(pixel.g / binSize);
    const bBin = Math.floor(pixel.b / binSize);
    const key = `${rBin},${gBin},${bBin}`;

    if (histogram.has(key)) {
      const bin = histogram.get(key)!;
      bin.r += pixel.r;
      bin.g += pixel.g;
      bin.b += pixel.b;
      bin.count++;
    } else {
      histogram.set(key, {
        r: pixel.r,
        g: pixel.g,
        b: pixel.b,
        count: 1,
      });
    }
  }

  // Calculate average color for each bin and sort by count
  return Array.from(histogram.values())
    .map((bin) => {
      const r = Math.round(bin.r / bin.count);
      const g = Math.round(bin.g / bin.count);
      const b = Math.round(bin.b / bin.count);
      return {
        r,
        g,
        b,
        hex: rgbToHex(r, g, b),
        count: bin.count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, count);
}
