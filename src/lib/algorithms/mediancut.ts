import { Color } from "../types";
import { rgbToHex } from "../colorUtils";

interface ColorBox {
  colors: Color[];
  rMin: number;
  rMax: number;
  gMin: number;
  gMax: number;
  bMin: number;
  bMax: number;
}

/**
 * Median cut algorithm for color quantization
 */
export function medianCutColors(pixels: Color[], depth: number = 6): Color[] {
  if (pixels.length === 0) return [];

  // Create initial box with all colors
  const initialBox: ColorBox = {
    colors: pixels,
    rMin: Math.min(...pixels.map((c) => c.r)),
    rMax: Math.max(...pixels.map((c) => c.r)),
    gMin: Math.min(...pixels.map((c) => c.g)),
    gMax: Math.max(...pixels.map((c) => c.g)),
    bMin: Math.min(...pixels.map((c) => c.b)),
    bMax: Math.max(...pixels.map((c) => c.b)),
  };

  const boxes: ColorBox[] = [initialBox];

  // Split boxes until we have 2^depth boxes
  const targetBoxes = Math.pow(2, depth);

  while (boxes.length < targetBoxes) {
    // Find box with largest range
    let maxRange = 0;
    let maxRangeIdx = 0;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      const rRange = box.rMax - box.rMin;
      const gRange = box.gMax - box.gMin;
      const bRange = box.bMax - box.bMin;
      const range = Math.max(rRange, gRange, bRange);

      if (range > maxRange) {
        maxRange = range;
        maxRangeIdx = i;
      }
    }

    if (maxRange === 0) break;

    // Split the box
    const boxToSplit = boxes[maxRangeIdx];
    const [box1, box2] = splitBox(boxToSplit);

    boxes.splice(maxRangeIdx, 1, box1, box2);
  }

  // Calculate average color for each box
  return boxes
    .map((box) => {
      const sumR = box.colors.reduce((sum, c) => sum + c.r, 0);
      const sumG = box.colors.reduce((sum, c) => sum + c.g, 0);
      const sumB = box.colors.reduce((sum, c) => sum + c.b, 0);
      const count = box.colors.length;

      const r = Math.round(sumR / count);
      const g = Math.round(sumG / count);
      const b = Math.round(sumB / count);

      return {
        r,
        g,
        b,
        hex: rgbToHex(r, g, b),
        count,
      };
    })
    .sort((a, b) => (b.count || 0) - (a.count || 0));
}

function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const rRange = box.rMax - box.rMin;
  const gRange = box.gMax - box.gMin;
  const bRange = box.bMax - box.bMin;

  // Split along largest dimension
  let sortKey: "r" | "g" | "b" = "r";
  if (gRange >= rRange && gRange >= bRange) {
    sortKey = "g";
  } else if (bRange >= rRange && bRange >= gRange) {
    sortKey = "b";
  }

  const sorted = [...box.colors].sort((a, b) => a[sortKey] - b[sortKey]);
  const median = Math.floor(sorted.length / 2);

  const colors1 = sorted.slice(0, median);
  const colors2 = sorted.slice(median);

  const box1: ColorBox = {
    colors: colors1,
    rMin: Math.min(...colors1.map((c) => c.r)),
    rMax: Math.max(...colors1.map((c) => c.r)),
    gMin: Math.min(...colors1.map((c) => c.g)),
    gMax: Math.max(...colors1.map((c) => c.g)),
    bMin: Math.min(...colors1.map((c) => c.b)),
    bMax: Math.max(...colors1.map((c) => c.b)),
  };

  const box2: ColorBox = {
    colors: colors2,
    rMin: Math.min(...colors2.map((c) => c.r)),
    rMax: Math.max(...colors2.map((c) => c.r)),
    gMin: Math.min(...colors2.map((c) => c.g)),
    gMax: Math.max(...colors2.map((c) => c.g)),
    bMin: Math.min(...colors2.map((c) => c.b)),
    bMax: Math.max(...colors2.map((c) => c.b)),
  };

  return [box1, box2];
}
