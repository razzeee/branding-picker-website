import { Color, Algorithm, AlgorithmInfo } from "./types";
import {
  getImageData,
  samplePixels,
  isNeutralColor,
  getContrastRatio,
} from "./colorUtils";
import { kmeansColors } from "./algorithms/kmeans";
import { medianCutColors } from "./algorithms/mediancut";
import { vibrantColors } from "./algorithms/vibrant";
import { dominantColors } from "./algorithms/dominant";
import { histogramColors } from "./algorithms/histogram";
import { paletteColors } from "./algorithms/palette";
import { getContrastColor } from "@/components/BrandingPreview";

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: "vibrant",
    name: "Vibrant Colors",
    description: "Extracts highly saturated, vibrant colors",
  },
  {
    id: "palette",
    name: "Balanced Palette",
    description: "Diverse palette with light, dark, and vibrant colors",
  },
  {
    id: "dominant",
    name: "Dominant Colors",
    description: "Most frequently occurring colors",
  },
  {
    id: "mediancut",
    name: "Median Cut",
    description: "Color quantization by recursive subdivision",
  },
  {
    id: "kmeans",
    name: "K-Means Clustering",
    description: "Groups similar colors using k-means algorithm",
  },
  {
    id: "histogram",
    name: "Histogram Analysis",
    description: "Color distribution analysis with binning",
  },
];

/**
 * Analyze an image file and extract colors using the specified algorithm
 */
export async function analyzeImage(
  file: File,
  algorithm: Algorithm
): Promise<Color[]> {
  // Extract image data
  const imageData = await getImageData(file);

  // Sample pixels for performance
  const pixels = samplePixels(imageData, 10000);

  // Run selected algorithm
  // Generate more colors initially since we'll filter for contrast
  let colors: Color[];
  switch (algorithm) {
    case "kmeans":
      colors = kmeansColors(pixels, 12);
      break;
    case "mediancut":
      colors = medianCutColors(pixels, 4); // 2^4 = 16 colors
      break;
    case "vibrant":
      colors = vibrantColors(pixels, 12);
      break;
    case "dominant":
      colors = dominantColors(pixels, 12);
      break;
    case "histogram":
      colors = histogramColors(pixels, 12);
      break;
    case "palette":
      colors = paletteColors(pixels, 12);
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  // Filter out neutral colors (white, black, grays)
  const nonNeutralColors = colors.filter((color) => !isNeutralColor(color));

  // A good branding color should have at least 4.5:1 contrast with our chosen text color
  const brandColors = nonNeutralColors
    .map((color) => {
      const contrastColor = getContrastColor(color.hex);
      const contrastRatio = getContrastRatio(color, contrastColor);
      return { color, contrastRatio };
    })
    .filter((item) => item.contrastRatio >= 4.5) // Require at least 4.5:1 contrast ratio (WCAG AA standard)
    .sort((a, b) => b.contrastRatio - a.contrastRatio) // Sort by best contrast first
    .slice(0, 6) // Return up to 6 best colors
    .map((item) => item.color);

  return brandColors;
}
