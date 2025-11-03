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
