import { Color } from "./types";

/**
 * Convert RGB values to hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calculate color distance using Euclidean distance
 */
export function colorDistance(c1: Color, c2: Color): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Calculate relative luminance of a color
 */
export function getLuminance(color: Color): number {
  const [r, g, b] = [color.r, color.g, color.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate saturation of a color
 */
export function getSaturation(color: Color): number {
  const r = color.r / 255;
  const g = color.g / 255;
  const b = color.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/**
 * Check if a color is neutral (white, black, or gray)
 * A color is considered neutral if:
 * - It has very low saturation (grayscale)
 * - It's very light (close to white) or very dark (close to black)
 */
export function isNeutralColor(color: Color): boolean {
  const saturation = getSaturation(color);
  const luminance = getLuminance(color);

  // Check if it's grayscale (low saturation)
  const isGray = saturation < 0.15;

  // Check if it's too light (close to white)
  const isTooLight = luminance > 0.9;

  // Check if it's too dark (close to black)
  const isTooDark = luminance < 0.1;

  return isGray || isTooLight || isTooDark;
}

/**
 * Extract pixel data from an image file
 */
export async function getImageData(file: File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Sample pixels from image data (for performance)
 */
export function samplePixels(
  imageData: ImageData,
  sampleSize: number = 10000
): Color[] {
  const pixels: Color[] = [];
  const data = imageData.data;
  const totalPixels = imageData.width * imageData.height;
  const step = Math.max(1, Math.floor(totalPixels / sampleSize));

  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent pixels
    if (a < 128) continue;

    pixels.push({ r, g, b, hex: rgbToHex(r, g, b) });
  }

  return pixels;
}

/**
 * Calculate contrast ratio between two colors (WCAG 2.0 formula)
 */
export function getContrastRatio(color1: Color, color2: Color): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get WCAG contrast rating for a contrast ratio
 */
export function getContrastRating(ratio: number): {
  aa: { normal: boolean; large: boolean };
  aaa: { normal: boolean; large: boolean };
} {
  return {
    aa: {
      normal: ratio >= 4.5,
      large: ratio >= 3.0,
    },
    aaa: {
      normal: ratio >= 7.0,
      large: ratio >= 4.5,
    },
  };
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): Color | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        hex: hex.startsWith("#") ? hex : `#${hex}`,
      }
    : null;
}

/**
 * OKLCH Color Space Conversions
 * OKLCH is a perceptually uniform color space
 * L (Lightness): 0-1
 * C (Chroma): 0-0.4 (typically)
 * H (Hue): 0-360 degrees
 */

export interface OklchColor {
  l: number; // Lightness 0-1
  c: number; // Chroma 0-0.4
  h: number; // Hue 0-360
}

/**
 * Convert RGB to linear RGB (remove gamma correction)
 */
function rgbToLinear(val: number): number {
  const v = val / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to RGB (apply gamma correction)
 */
function linearToRgb(val: number): number {
  const v =
    val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

/**
 * Convert RGB to OKLCH color space
 */
export function rgbToOklch(color: Color): OklchColor {
  // Convert to linear RGB
  const r = rgbToLinear(color.r);
  const g = rgbToLinear(color.g);
  const b = rgbToLinear(color.b);

  // Convert to OKLab
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // Convert OKLab to OKLCH
  const C = Math.sqrt(a * a + b_ * b_);
  let H = Math.atan2(b_, a) * (180 / Math.PI);
  if (H < 0) H += 360;

  return { l: L, c: C, h: H };
}

/**
 * Convert OKLCH to RGB color space
 */
export function oklchToRgb(oklch: OklchColor): Color {
  const { l: L, c: C, h: H } = oklch;

  // Convert OKLCH to OKLab
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // Convert OKLab to linear RGB
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  // Convert to RGB (with gamma correction)
  const rVal = linearToRgb(r);
  const gVal = linearToRgb(g);
  const bVal = linearToRgb(b_);

  return {
    r: rVal,
    g: gVal,
    b: bVal,
    hex: rgbToHex(rVal, gVal, bVal),
  };
}

/**
 * Calculate the average color from an image URL
 * This is useful for determining the predominant color of an icon
 */
export async function getAverageColorFromUrl(imageUrl: string): Promise<Color> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0,
        count = 0;

      // Calculate average, excluding transparent pixels
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        if (alpha > 128) {
          // Only count non-transparent pixels
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
      }

      if (count === 0) {
        reject(new Error("No opaque pixels found in image"));
        return;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      resolve({
        r,
        g,
        b,
        hex: rgbToHex(r, g, b),
      });
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = imageUrl;
  });
}
