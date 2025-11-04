"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Algorithm, FlathubApp, Color } from "@/lib/types";
import { ALGORITHMS } from "@/lib/colorAnalyzer";
import ImageUploader from "@/components/ImageUploader";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import ColorResults from "@/components/ColorResults";
import FlathubLoader from "@/components/FlathubLoader";
import BrandingPreview from "@/components/BrandingPreview";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialAppId = searchParams.get("app");

  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<Algorithm>("vibrant");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [appData, setAppData] = useState<FlathubApp | null>(null);
  const [extractedColors, setExtractedColors] = useState<Color[]>([]);

  const handleFlathubLoad = (file: File, app: FlathubApp) => {
    setImageFile(file);
    setAppData(app);
    // Update URL with app ID
    const params = new URLSearchParams(searchParams.toString());
    params.set("app", app.id);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleManualImageSelect = (file: File | null) => {
    setImageFile(file);
    // Clear Flathub data when manually uploading an image
    setAppData(null);
    // Remove app param from URL
    const params = new URLSearchParams(searchParams.toString());
    params.delete("app");
    const newUrl = params.toString() ? `?${params.toString()}` : "/";
    router.push(newUrl, { scroll: false });
  };

  // Create object URL for uploaded images
  const imageUrl = useMemo(() => {
    if (!imageFile) return null;
    // If we have Flathub data, use the icon URL from there
    if (appData?.icon) return appData.icon;
    // Otherwise create an object URL from the file
    return URL.createObjectURL(imageFile);
  }, [imageFile, appData?.icon]);

  // Cleanup object URL when component unmounts or imageFile changes
  useEffect(() => {
    return () => {
      if (imageUrl && !appData?.icon && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl, appData?.icon]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            🎨 Appstream Branding Color Picker
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-2">
            Extract and preview brand colors for AppStream metadata
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Load a Flathub app or upload an image to get started
          </p>
        </header>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-sm">
                  1
                </span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Upload Image
                </h2>
              </div>

              {/* Flathub Loader */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Load from Flathub
                </h3>
                <FlathubLoader
                  onImageLoad={handleFlathubLoad}
                  initialAppId={initialAppId}
                />
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                    or upload manually
                  </span>
                </div>
              </div>

              {/* Manual Upload */}
              <ImageUploader onImageSelect={handleManualImageSelect} />
            </div>

            {/* Algorithm Selection Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-sm">
                  2
                </span>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Select Algorithm
                </h2>
              </div>
              <AlgorithmSelector
                algorithms={ALGORITHMS}
                selected={selectedAlgorithm}
                onSelect={setSelectedAlgorithm}
              />
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-8">
            {/* Branding Preview Section */}
            {extractedColors.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 font-bold text-sm">
                    ✓
                  </span>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Branding Preview
                  </h2>
                </div>
                <BrandingPreview
                  colors={extractedColors}
                  iconUrl={imageUrl || undefined}
                  appName={appData?.name}
                  appData={appData}
                />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center text-gray-400 dark:text-gray-500">
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
                  <p className="text-lg font-medium">
                    Preview will appear here
                  </p>
                  <p className="text-sm mt-2">
                    Upload an image and select an algorithm
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Colors Section */}
        {imageFile && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Extracted Colors
            </h2>
            <ColorResults
              imageFile={imageFile}
              algorithm={selectedAlgorithm}
              onColorsExtracted={setExtractedColors}
              appData={appData}
            />
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 text-gray-600 dark:text-gray-400 space-y-2">
          <p className="text-sm">
            Built with Next.js, TypeScript, and TailwindCSS
          </p>
          <p className="text-xs">
            Learn more about{" "}
            <a
              href="https://www.freedesktop.org/software/appstream/docs/chap-Metadata.html#tag-branding"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              AppStream Branding Metadata
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
