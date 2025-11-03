import { useState, useEffect } from "react";
import { Algorithm, Color } from "@/lib/types";
import { analyzeImage } from "@/lib/colorAnalyzer";
import OklchColorPicker from "./OklchColorPicker";

interface ColorResultsProps {
  imageFile: File | null;
  algorithm: Algorithm;
  onColorsExtracted?: (colors: Color[]) => void;
}

export default function ColorResults({
  imageFile,
  algorithm,
  onColorsExtracted,
}: ColorResultsProps) {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setColors([]);
      onColorsExtracted?.([]);
      return;
    }

    const analyze = async () => {
      setLoading(true);
      setError(null);
      try {
        const extractedColors = await analyzeImage(imageFile, algorithm);
        setColors(extractedColors);
        onColorsExtracted?.(extractedColors);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to analyze image"
        );
        setColors([]);
        onColorsExtracted?.([]);
      } finally {
        setLoading(false);
      }
    };

    analyze();
  }, [imageFile, algorithm, onColorsExtracted]);

  const copyToClipboard = (hex: string, index: number) => {
    navigator.clipboard.writeText(hex);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleColorEdit = (index: number, newColor: Color) => {
    const updatedColors = [...colors];
    updatedColors[index] = newColor;
    setColors(updatedColors);
    onColorsExtracted?.(updatedColors);
  };

  if (!imageFile) {
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
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <p className="text-lg">Upload an image to extract colors</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Analyzing colors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400">
        <svg
          className="mx-auto h-16 w-16 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-lg font-semibold mb-2">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (colors.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>No colors extracted</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {colors.map((color, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-md transition-shadow"
        >
          <div
            className="w-16 h-16 rounded-lg shadow-md shrink-0 border-2 border-gray-200 dark:border-gray-600"
            style={{ backgroundColor: color.hex }}
          />
          <div className="flex-1">
            <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
              {color.hex.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              RGB({color.r}, {color.g}, {color.b})
            </div>
            {color.count && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {color.count} pixels
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingIndex(index)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              aria-label="Edit color"
            >
              <svg
                className="w-4 h-4 inline-block mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
            <button
              onClick={() => copyToClipboard(color.hex, index)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              {copiedIndex === index ? "✓ Copied!" : "Copy"}
            </button>
          </div>
        </div>
      ))}

      {/* OKLCH Color Picker Modal */}
      {editingIndex !== null && (
        <OklchColorPicker
          color={colors[editingIndex]}
          onColorChange={(newColor) => handleColorEdit(editingIndex, newColor)}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </div>
  );
}
