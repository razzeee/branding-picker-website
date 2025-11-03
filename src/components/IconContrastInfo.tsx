import { useState, useEffect } from "react";
import {
  getAverageColorFromUrl,
  hexToRgb,
  getContrastRatio,
} from "@/lib/colorUtils";

interface IconContrastInfoProps {
  iconUrl?: string;
  backgroundColor: string;
}

export default function IconContrastInfo({
  iconUrl,
  backgroundColor,
}: IconContrastInfoProps) {
  const [iconContrast, setIconContrast] = useState<number | null>(null);
  const [iconColor, setIconColor] = useState<string | null>(null);

  useEffect(() => {
    if (!iconUrl) {
      setIconContrast(null);
      setIconColor(null);
      return;
    }

    // Calculate average color of icon and its contrast with background
    getAverageColorFromUrl(iconUrl)
      .then((avgColor) => {
        const bgColor = hexToRgb(backgroundColor);
        if (bgColor) {
          const contrast = getContrastRatio(avgColor, bgColor);
          setIconContrast(contrast);
          setIconColor(avgColor.hex);
        }
      })
      .catch((err) => {
        console.error("Failed to calculate icon contrast:", err);
        setIconContrast(null);
        setIconColor(null);
      });
  }, [iconUrl, backgroundColor]);

  if (iconContrast === null || iconColor === null) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-sm">
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 shrink-0"
          style={{ backgroundColor: iconColor }}
          title={`Icon average color: ${iconColor}`}
        />
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white mb-1">
            Icon Contrast: {iconContrast.toFixed(2)}:1
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {iconContrast >= 3.0 ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Good visibility
              </span>
            ) : (
              <span className="text-yellow-600 dark:text-yellow-400">
                ⚠️ Icon may be hard to see on this background
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
