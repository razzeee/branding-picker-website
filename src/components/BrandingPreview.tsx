import { useState, useMemo } from "react";
import { Color, FlathubApp } from "@/lib/types";
import {
  getContrastRatio,
  getContrastRating,
  hexToRgb,
  getLuminance,
} from "@/lib/colorUtils";
import BrandingXmlExport from "./BrandingXmlExport";
import AppInfoDisplay from "./AppInfoDisplay";
import ThemePreviewCard from "./ThemePreviewCard";

interface BrandingPreviewProps {
  colors: Color[];
  iconUrl?: string;
  appName?: string;
  appData?: FlathubApp | null;
}

export function getContrastColor(hexColor: string): Color {
  const rgb = hexToRgb(hexColor);

  if (!rgb) {
    return { r: 0, g: 0, b: 0, hex: "#000000" }; // Default to black on parse failure
  }

  // http://www.w3.org/TR/AERT#color-contrast
  const brightness = Math.round(
    (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  );
  return brightness > 125
    ? { r: 0, g: 0, b: 0, hex: "#000000" }
    : { r: 255, g: 255, b: 255, hex: "#FFFFFF" };
}

export default function BrandingPreview({
  colors,
  iconUrl,
  appName = "App",
  appData,
}: BrandingPreviewProps) {
  // Automatically select best colors based on luminance AND contrast
  const { bestLightIndex, bestDarkIndex } = useMemo(() => {
    if (colors.length === 0) return { bestLightIndex: 0, bestDarkIndex: 1 };

    const whiteText = hexToRgb("#ffffff")!;
    const blackText = hexToRgb("#000000")!;

    // Filter colors by whether they have good contrast (at least 4.5:1)
    const colorsWithContrast = colors.map((color, index) => {
      const contrastWhite = getContrastRatio(color, whiteText);
      const contrastBlack = getContrastRatio(color, blackText);
      const bestContrast = Math.max(contrastWhite, contrastBlack);
      const hasGoodContrast = bestContrast >= 4.5;
      const luminance = getLuminance(color);

      return { color, index, luminance, hasGoodContrast, bestContrast };
    });

    // Try to find colors with good contrast first, fall back to any color if none exist
    const goodContrastColors = colorsWithContrast.filter(
      (c) => c.hasGoodContrast
    );
    const colorsToUse =
      goodContrastColors.length > 0 ? goodContrastColors : colorsWithContrast;

    // Sort by luminance to find lightest and darkest
    const sortedByLuminance = [...colorsToUse].sort(
      (a, b) => b.luminance - a.luminance
    );

    // Best light theme color: lighter color (higher luminance) with good contrast
    const bestLightIndex = sortedByLuminance[0].index;

    // Best dark theme color: darker color (lower luminance) with good contrast
    const bestDarkIndex = sortedByLuminance[sortedByLuminance.length - 1].index;

    return { bestLightIndex, bestDarkIndex };
  }, [colors]);

  // Track the colors array to detect when it changes
  const [prevColors, setPrevColors] = useState(colors);
  const [lightColorIndex, setLightColorIndex] = useState(bestLightIndex);
  const [darkColorIndex, setDarkColorIndex] = useState(bestDarkIndex);

  // Reset selections when colors change (e.g., algorithm change)
  if (colors !== prevColors) {
    setPrevColors(colors);
    setLightColorIndex(bestLightIndex);
    setDarkColorIndex(bestDarkIndex);
  }

  // Sort colors for each theme based on suitability
  const sortedColorsForLight = useMemo(() => {
    return [...colors]
      .map((color, originalIndex) => ({
        color,
        originalIndex,
        luminance: getLuminance(color),
      }))
      .sort((a, b) => b.luminance - a.luminance); // Lighter colors first for light theme
  }, [colors]);

  const sortedColorsForDark = useMemo(() => {
    return [...colors]
      .map((color, originalIndex) => ({
        color,
        originalIndex,
        luminance: getLuminance(color),
      }))
      .sort((a, b) => a.luminance - b.luminance); // Darker colors first for dark theme
  }, [colors]);

  const { lightTheme, darkTheme } = useMemo(() => {
    if (colors.length === 0) {
      return { lightTheme: null, darkTheme: null };
    }

    // Light theme - use selected light color
    const lightBrandColor = colors[lightColorIndex] || colors[0];
    const lightTextColor = getContrastColor(lightBrandColor.hex);
    const lightContrast = getContrastRatio(lightBrandColor, lightTextColor);
    const lightRating = getContrastRating(lightContrast);

    const lightTheme = {
      background: lightBrandColor,
      foreground: lightTextColor,
      contrast: lightContrast,
      rating: lightRating,
    };

    // Dark theme - use selected dark color (or same if only one color)
    const darkBrandColor =
      colors[darkColorIndex] || colors[Math.min(1, colors.length - 1)];
    const darkTextColor = getContrastColor(darkBrandColor.hex);
    const darkContrast = getContrastRatio(darkBrandColor, darkTextColor);
    const darkRating = getContrastRating(darkContrast);

    const darkTheme = {
      background: darkBrandColor,
      foreground: darkTextColor,
      contrast: darkContrast,
      rating: darkRating,
    };

    return { lightTheme, darkTheme };
  }, [colors, lightColorIndex, darkColorIndex]);

  // Calculate contrast warnings
  const lightContrastWarning = useMemo(() => {
    if (!lightTheme) return null;
    if (lightTheme.contrast < 4.5) {
      return "⚠️ Low contrast - May not meet WCAG AA standards";
    }
    return null;
  }, [lightTheme]);

  const darkContrastWarning = useMemo(() => {
    if (!darkTheme) return null;
    if (darkTheme.contrast < 4.5) {
      return "⚠️ Low contrast - May not meet WCAG AA standards";
    }
    return null;
  }, [darkTheme]);

  if (colors.length === 0 || !lightTheme || !darkTheme) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <svg
          className="mx-auto h-16 w-16 mb-4 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <p className="text-lg">Extract colors to see branding previews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-sm">
        <div className="flex flex-wrap gap-4 items-center justify-center text-gray-700 dark:text-gray-300">
          <span className="flex items-center gap-1.5">
            <span className="bg-blue-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              ★
            </span>
            <span className="bg-purple-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center -ml-1">
              ★
            </span>
            <span className="ml-0.5">Recommended</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="bg-yellow-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              !
            </span>
            Low contrast
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Colors sorted by suitability for each theme
          </span>
        </div>
      </div>

      {/* Color Selectors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Light Theme Brand Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedColorsForLight.map(({ color, originalIndex, luminance }) => {
              const isRecommended = originalIndex === bestLightIndex; // Match with default selection
              const whiteText = hexToRgb("#ffffff")!;
              const blackText = hexToRgb("#000000")!;
              const contrastWhite = getContrastRatio(color, whiteText);
              const contrastBlack = getContrastRatio(color, blackText);
              const bestContrast = Math.max(contrastWhite, contrastBlack);
              const hasGoodContrast = bestContrast >= 4.5;

              return (
                <div key={originalIndex} className="relative">
                  <button
                    onClick={() => setLightColorIndex(originalIndex)}
                    className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                      lightColorIndex === originalIndex
                        ? "ring-4 ring-blue-500 scale-110"
                        : "hover:scale-105"
                    } ${!hasGoodContrast ? "opacity-60" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.hex}\nLuminance: ${luminance.toFixed(
                      2
                    )}\nContrast: ${bestContrast.toFixed(2)}`}
                  />
                  {isRecommended && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      ★
                    </span>
                  )}
                  {!hasGoodContrast && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md"
                      title="Low contrast"
                    >
                      !
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Selected:{" "}
            <span className="font-mono font-semibold">
              {colors[lightColorIndex]?.hex}
            </span>
          </p>
          {lightContrastWarning && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1 font-medium">
              {lightContrastWarning}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Dark Theme Brand Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortedColorsForDark.map(({ color, originalIndex, luminance }) => {
              const isRecommended = originalIndex === bestDarkIndex; // Match with default selection
              const whiteText = hexToRgb("#ffffff")!;
              const blackText = hexToRgb("#000000")!;
              const contrastWhite = getContrastRatio(color, whiteText);
              const contrastBlack = getContrastRatio(color, blackText);
              const bestContrast = Math.max(contrastWhite, contrastBlack);
              const hasGoodContrast = bestContrast >= 4.5;

              return (
                <div key={originalIndex} className="relative">
                  <button
                    onClick={() => setDarkColorIndex(originalIndex)}
                    className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                      darkColorIndex === originalIndex
                        ? "ring-4 ring-purple-500 scale-110"
                        : "hover:scale-105"
                    } ${!hasGoodContrast ? "opacity-60" : ""}`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.hex}\nLuminance: ${luminance.toFixed(
                      2
                    )}\nContrast: ${bestContrast.toFixed(2)}`}
                  />
                  {isRecommended && (
                    <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      ★
                    </span>
                  )}
                  {!hasGoodContrast && (
                    <span
                      className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md"
                      title="Low contrast"
                    >
                      !
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Selected:{" "}
            <span className="font-mono font-semibold">
              {colors[darkColorIndex]?.hex}
            </span>
          </p>
          {darkContrastWarning && (
            <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1 font-medium">
              {darkContrastWarning}
            </p>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <ThemePreviewCard
          title="Light Theme Preview"
          backgroundColor={lightTheme.background.hex}
          foregroundColor={lightTheme.foreground.hex}
          iconUrl={iconUrl}
          appName={appName}
          contrast={lightTheme.contrast}
          rating={lightTheme.rating}
        />
        <ThemePreviewCard
          title="Dark Theme Preview"
          backgroundColor={darkTheme.background.hex}
          foregroundColor={darkTheme.foreground.hex}
          iconUrl={iconUrl}
          appName={appName}
          contrast={darkTheme.contrast}
          rating={darkTheme.rating}
        />
      </div>

      {/* AppStream XML Export */}
      {colors[lightColorIndex] && colors[darkColorIndex] && (
        <BrandingXmlExport
          lightColor={colors[lightColorIndex]}
          darkColor={colors[darkColorIndex]}
        />
      )}

      {/* App Info Display */}
      <AppInfoDisplay app={appData || null} />
    </div>
  );
}
