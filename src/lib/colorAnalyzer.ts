import { Color, Algorithm, AlgorithmInfo } from "./types";
import {
  getImageData,
  samplePixels,
  isNeutralColor,
  getSaturation,
} from "./colorUtils";
import { kmeansColors } from "./algorithms/kmeans";
import { medianCutColors } from "./algorithms/mediancut";
import { vibrantColors } from "./algorithms/vibrant";
import { dominantColors } from "./algorithms/dominant";
import { histogramColors } from "./algorithms/histogram";
import { paletteColors } from "./algorithms/palette";

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
  let colors: Color[];
  switch (algorithm) {
    case "kmeans":
      colors = kmeansColors(pixels, 6);
      break;
    case "mediancut":
      colors = medianCutColors(pixels, 3); // 2^3 = 8 colors, we'll take top 6
      break;
    case "vibrant":
      colors = vibrantColors(pixels, 6);
      break;
    case "dominant":
      colors = dominantColors(pixels, 6);
      break;
    case "histogram":
      colors = histogramColors(pixels, 6);
      break;
    case "palette":
      colors = paletteColors(pixels, 6);
      break;
    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }

  // Filter out neutral colors (white, black, grays)
  const brandColors = colors.filter((color) => !isNeutralColor(color));

  // If we filtered out too many colors, return at least 2 colors
  if (brandColors.length < 2 && colors.length >= 2) {
    // Sort by saturation and return the most colorful ones
    return colors
      .sort((a, b) => {
        const satA = getSaturation(a);
        const satB = getSaturation(b);
        return satB - satA;
      })
      .slice(0, Math.max(2, colors.length));
  }

  return brandColors.length > 0 ? brandColors : colors;
}
