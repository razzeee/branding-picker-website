"use client";

import { useState, useEffect } from "react";
import { Color } from "@/lib/types";
import { rgbToOklch, oklchToRgb, OklchColor } from "@/lib/colorUtils";

interface OklchColorPickerProps {
  color: Color;
  onColorChange: (color: Color) => void;
  onClose: () => void;
}

export default function OklchColorPicker({
  color,
  onColorChange,
  onClose,
}: OklchColorPickerProps) {
  const [oklch, setOklch] = useState<OklchColor>(() => rgbToOklch(color));
  const [previewColor, setPreviewColor] = useState<Color>(color);

  // Update preview color when OKLCH values change
  useEffect(() => {
    const newColor = oklchToRgb(oklch);
    setPreviewColor(newColor);
  }, [oklch]);

  const handleLChange = (value: number) => {
    setOklch({ ...oklch, l: value });
  };

  const handleCChange = (value: number) => {
    setOklch({ ...oklch, c: value });
  };

  const handleHChange = (value: number) => {
    setOklch({ ...oklch, h: value });
  };

  const handleApply = () => {
    onColorChange(previewColor);
    onClose();
  };

  const handleReset = () => {
    const originalOklch = rgbToOklch(color);
    setOklch(originalOklch);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            OKLCH Color Picker
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Color Preview */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Original
              </div>
              <div
                className="w-full h-20 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: color.hex }}
              />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Preview
              </div>
              <div
                className="w-full h-20 rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: previewColor.hex }}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
              {previewColor.hex.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              RGB({previewColor.r}, {previewColor.g}, {previewColor.b})
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6 mb-6">
          {/* Lightness */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lightness (L)
              </span>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {oklch.l.toFixed(3)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              value={oklch.l}
              onChange={(e) => handleLChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-linear-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #000, #808080, #fff)`,
              }}
            />
          </div>

          {/* Chroma */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chroma (C)
              </span>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {oklch.c.toFixed(3)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="0.4"
              step="0.001"
              value={oklch.c}
              onChange={(e) => handleCChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-linear-to-r from-gray-400 to-red-500 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              0 = grayscale, higher = more saturated
            </div>
          </div>

          {/* Hue */}
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hue (H)
              </span>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {oklch.h.toFixed(1)}°
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="0.1"
              value={oklch.h}
              onChange={(e) => handleHChange(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right,
                  oklch(0.7 0.25 0deg),
                  oklch(0.7 0.25 60deg),
                  oklch(0.7 0.25 120deg),
                  oklch(0.7 0.25 180deg),
                  oklch(0.7 0.25 240deg),
                  oklch(0.7 0.25 300deg),
                  oklch(0.7 0.25 360deg))`,
              }}
            />
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              0° = red, 120° = green, 240° = blue
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply
          </button>
        </div>

        {/* Info */}
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
          OKLCH is a perceptually uniform color space
        </div>
      </div>
    </div>
  );
}
