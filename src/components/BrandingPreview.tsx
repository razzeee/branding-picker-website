import { useState, useMemo } from "react";
import Image from "next/image";
import { Color, FlathubApp } from "@/lib/types";
import {
  getContrastRatio,
  getContrastRating,
  hexToRgb,
  getLuminance,
} from "@/lib/colorUtils";
import BrandingXmlExport from "./BrandingXmlExport";
import AppInfoDisplay from "./AppInfoDisplay";

interface BrandingPreviewProps {
  colors: Color[];
  iconUrl?: string;
  appName?: string;
  appData?: FlathubApp | null;
}

export default function BrandingPreview({
  colors,
  iconUrl,
  appName = "App",
  appData,
}: BrandingPreviewProps) {
  // Automatically select best colors based on luminance
  const { bestLightIndex, bestDarkIndex } = useMemo(() => {
    if (colors.length === 0) return { bestLightIndex: 0, bestDarkIndex: 1 };

    // Sort colors by luminance to find lightest and darkest
    const sortedByLuminance = colors
      .map((color, index) => ({ color, index, luminance: getLuminance(color) }))
      .sort((a, b) => b.luminance - a.luminance);

    // Best light theme color: lighter color (higher luminance)
    const bestLightIndex = sortedByLuminance[0].index;

    // Best dark theme color: darker color (lower luminance)
    const bestDarkIndex = sortedByLuminance[sortedByLuminance.length - 1].index;

    return { bestLightIndex, bestDarkIndex };
  }, [colors]);

  const [lightColorIndex, setLightColorIndex] = useState(bestLightIndex);
  const [darkColorIndex, setDarkColorIndex] = useState(bestDarkIndex);

  const { lightTheme, darkTheme } = useMemo(() => {
    if (colors.length === 0) {
      return { lightTheme: null, darkTheme: null };
    }

    // Light theme - use selected light color
    const lightBrandColor = colors[lightColorIndex] || colors[0];
    const lightWhiteText = hexToRgb("#ffffff")!;
    const lightBlackText = hexToRgb("#000000")!;
    const lightContrastWithWhite = getContrastRatio(
      lightBrandColor,
      lightWhiteText
    );
    const lightContrastWithBlack = getContrastRatio(
      lightBrandColor,
      lightBlackText
    );
    const lightBestTextColor =
      lightContrastWithWhite > lightContrastWithBlack
        ? lightWhiteText
        : lightBlackText;
    const lightBestContrast = Math.max(
      lightContrastWithWhite,
      lightContrastWithBlack
    );
    const lightBestRating = getContrastRating(lightBestContrast);

    const lightTheme = {
      background: lightBrandColor,
      foreground: lightBestTextColor,
      contrast: lightBestContrast,
      rating: lightBestRating,
    };

    // Dark theme - use selected dark color (or same if only one color)
    const darkBrandColor =
      colors[darkColorIndex] || colors[Math.min(1, colors.length - 1)];
    const darkWhiteText = hexToRgb("#ffffff")!;
    const darkBlackText = hexToRgb("#000000")!;
    const darkContrastWithWhite = getContrastRatio(
      darkBrandColor,
      darkWhiteText
    );
    const darkContrastWithBlack = getContrastRatio(
      darkBrandColor,
      darkBlackText
    );
    const darkBestTextColor =
      darkContrastWithWhite > darkContrastWithBlack
        ? darkWhiteText
        : darkBlackText;
    const darkBestContrast = Math.max(
      darkContrastWithWhite,
      darkContrastWithBlack
    );
    const darkBestRating = getContrastRating(darkBestContrast);

    const darkTheme = {
      background: darkBrandColor,
      foreground: darkBestTextColor,
      contrast: darkBestContrast,
      rating: darkBestRating,
    };

    return { lightTheme, darkTheme };
  }, [colors, lightColorIndex, darkColorIndex]);

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
      {/* Color Selectors */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Light Theme Brand Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setLightColorIndex(index)}
                className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                  lightColorIndex === index
                    ? "ring-4 ring-blue-500 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Selected:{" "}
            <span className="font-mono font-semibold">
              {colors[lightColorIndex]?.hex}
            </span>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Dark Theme Brand Color
          </h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => setDarkColorIndex(index)}
                className={`w-12 h-12 rounded-lg shadow-md transition-all ${
                  darkColorIndex === index
                    ? "ring-4 ring-purple-500 scale-110"
                    : "hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.hex}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Selected:{" "}
            <span className="font-mono font-semibold">
              {colors[darkColorIndex]?.hex}
            </span>
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Light Theme Preview
          </h3>
          <div
            className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-gray-300 dark:border-gray-600 shadow-lg"
            style={{ backgroundColor: lightTheme.background.hex }}
          >
            {iconUrl && (
              <Image
                src={iconUrl}
                alt={`${appName} icon`}
                width={96}
                height={96}
                className="mb-4 drop-shadow-lg"
                unoptimized
              />
            )}
            <h4
              className="text-3xl font-bold mb-2 text-center"
              style={{ color: lightTheme.foreground.hex }}
            >
              {appName}
            </h4>
            <p
              className="text-center max-w-xs"
              style={{ color: lightTheme.foreground.hex }}
            >
              Sample text showing how content appears on the brand color
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: lightTheme.foreground.hex,
                color: lightTheme.background.hex,
              }}
            >
              Get {appName}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contrast:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {lightTheme.contrast.toFixed(2)}:1
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    lightTheme.rating.aaa.normal
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : lightTheme.rating.aa.normal
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {lightTheme.rating.aaa.normal
                    ? "✓ AAA"
                    : lightTheme.rating.aa.normal
                    ? "✓ AA"
                    : "✗ Fail"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {lightTheme.rating.aaa.normal
                    ? "Excellent contrast"
                    : lightTheme.rating.aa.normal
                    ? "Good contrast"
                    : "Poor contrast"}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      lightTheme.rating.aa.normal
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {lightTheme.rating.aa.normal ? "✓" : "✗"} AA Normal (4.5:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      lightTheme.rating.aa.large
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {lightTheme.rating.aa.large ? "✓" : "✗"} AA Large (3:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      lightTheme.rating.aaa.normal
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {lightTheme.rating.aaa.normal ? "✓" : "✗"} AAA Normal (7:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      lightTheme.rating.aaa.large
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {lightTheme.rating.aaa.large ? "✓" : "✗"} AAA Large (4.5:1)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dark Theme Preview
          </h3>
          <div
            className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-gray-300 dark:border-gray-600 shadow-lg"
            style={{ backgroundColor: darkTheme.background.hex }}
          >
            {iconUrl && (
              <Image
                src={iconUrl}
                alt={`${appName} icon`}
                width={96}
                height={96}
                className="mb-4 drop-shadow-lg"
                unoptimized
              />
            )}
            <h4
              className="text-3xl font-bold mb-2 text-center"
              style={{ color: darkTheme.foreground.hex }}
            >
              {appName}
            </h4>
            <p
              className="text-center max-w-xs"
              style={{ color: darkTheme.foreground.hex }}
            >
              Sample text showing how content appears on the brand color
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
              style={{
                backgroundColor: darkTheme.foreground.hex,
                color: darkTheme.background.hex,
              }}
            >
              Get {appName}
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contrast:
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {darkTheme.contrast.toFixed(2)}:1
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    darkTheme.rating.aaa.normal
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : darkTheme.rating.aa.normal
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {darkTheme.rating.aaa.normal
                    ? "✓ AAA"
                    : darkTheme.rating.aa.normal
                    ? "✓ AA"
                    : "✗ Fail"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {darkTheme.rating.aaa.normal
                    ? "Excellent contrast"
                    : darkTheme.rating.aa.normal
                    ? "Good contrast"
                    : "Poor contrast"}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={
                      darkTheme.rating.aa.normal
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {darkTheme.rating.aa.normal ? "✓" : "✗"} AA Normal (4.5:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      darkTheme.rating.aa.large
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {darkTheme.rating.aa.large ? "✓" : "✗"} AA Large (3:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      darkTheme.rating.aaa.normal
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {darkTheme.rating.aaa.normal ? "✓" : "✗"} AAA Normal (7:1)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      darkTheme.rating.aaa.large
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }
                  >
                    {darkTheme.rating.aaa.large ? "✓" : "✗"} AAA Large (4.5:1)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
