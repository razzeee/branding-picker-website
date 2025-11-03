import { useState } from "react";
import {
  parseFlathubInput,
  fetchFlathubApp,
  loadImageFromUrl,
} from "@/lib/flathubUtils";
import { FlathubApp } from "@/lib/types";

interface FlathubLoaderProps {
  onImageLoad: (file: File, appData: FlathubApp) => void;
}

export default function FlathubLoader({ onImageLoad }: FlathubLoaderProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!input.trim()) {
      setError("Please enter a Flathub URL or app ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse input to get app ID
      const appId = parseFlathubInput(input);
      if (!appId) {
        throw new Error("Invalid Flathub URL or app ID format");
      }

      // Fetch app metadata
      const appData = await fetchFlathubApp(appId);

      // Load icon image
      if (!appData.icon) {
        throw new Error("App icon not available");
      }

      const imageFile = await loadImageFromUrl(
        appData.icon,
        `${appId}-icon.png`
      );

      // Pass to parent
      onImageLoad(imageFile, appData);
      setInput(""); // Clear input on success
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load Flathub app"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLoad();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Flathub URL or app ID (e.g., tv.kodi.Kodi)"
          className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={handleLoad}
          disabled={loading || !input.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Loading..." : "Load"}
        </button>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Enter a Flathub URL (e.g., https://flathub.org/en/apps/tv.kodi.Kodi) or
        app ID (e.g., tv.kodi.Kodi)
      </div>
    </div>
  );
}
