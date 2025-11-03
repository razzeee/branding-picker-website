import { Color } from "../types";
import { rgbToHex, colorDistance } from "../colorUtils";

/**
 * K-means clustering algorithm for color extraction
 */
export function kmeansColors(
  pixels: Color[],
  k: number = 6,
  maxIterations: number = 10
): Color[] {
  if (pixels.length === 0) return [];

  // Initialize centroids randomly from pixels
  const centroids: Color[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < k; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * pixels.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    centroids.push({ ...pixels[idx] });
  }

  // Iterate k-means
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to nearest centroid
    const clusters: Color[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      let minDist = Infinity;
      let clusterIdx = 0;

      for (let i = 0; i < k; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          clusterIdx = i;
        }
      }

      clusters[clusterIdx].push(pixel);
    }

    // Update centroids
    let changed = false;
    for (let i = 0; i < k; i++) {
      if (clusters[i].length === 0) continue;

      const sumR = clusters[i].reduce((sum, c) => sum + c.r, 0);
      const sumG = clusters[i].reduce((sum, c) => sum + c.g, 0);
      const sumB = clusters[i].reduce((sum, c) => sum + c.b, 0);
      const count = clusters[i].length;

      const newR = Math.round(sumR / count);
      const newG = Math.round(sumG / count);
      const newB = Math.round(sumB / count);

      if (
        newR !== centroids[i].r ||
        newG !== centroids[i].g ||
        newB !== centroids[i].b
      ) {
        changed = true;
        centroids[i] = {
          r: newR,
          g: newG,
          b: newB,
          hex: rgbToHex(newR, newG, newB),
          count,
        };
      }
    }

    if (!changed) break;
  }

  // Sort by cluster size and return
  return centroids
    .filter((c) => c.count && c.count > 0)
    .sort((a, b) => (b.count || 0) - (a.count || 0));
}
