import { FlathubApp } from "./types";

/**
 * Extract app ID from Flathub URL or return as-is if already an app ID
 * @param input - Flathub URL like "https://flathub.org/en/apps/tv.kodi.Kodi" or app ID like "tv.kodi.Kodi"
 */
export function parseFlathubInput(input: string): string | null {
  const trimmed = input.trim();

  // If it's a URL, extract the app ID
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const url = new URL(trimmed);
      if (url.hostname === "flathub.org") {
        // Extract from path like /en/apps/tv.kodi.Kodi or /apps/tv.kodi.Kodi
        const match = url.pathname.match(/\/apps\/([a-zA-Z0-9._-]+)/);
        if (match) {
          return match[1];
        }
      }
    } catch {
      return null;
    }
  }

  // Otherwise assume it's an app ID (format: reverse domain notation)
  // Basic validation: should contain at least two dots
  if (trimmed.includes(".") && /^[a-zA-Z0-9._-]+$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Fetch app metadata from Flathub API via our Next.js API route
 */
export async function fetchFlathubApp(appId: string): Promise<FlathubApp> {
  const response = await fetch(`/api/flathub/${appId}`);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.error || `Failed to fetch app data: ${response.statusText}`
    );
  }

  const data = await response.json();

  // Extract relevant fields from the appstream data
  const app: FlathubApp = {
    id: data.id || appId,
    name: data.name || appId,
    summary: data.summary || "",
    urls: data.urls || {},
  };

  // Construct icon URL via our proxy to avoid CORS
  if (data.icon) {
    app.icon = `/api/flathub/icon/${appId}`;
  }

  return app;
}

/**
 * Load image from URL and convert to File object
 */
export async function loadImageFromUrl(
  url: string,
  filename: string
): Promise<File> {
  const response = await fetch(url, {
    cache: "force-cache", // Use cached version if available
  });

  if (!response.ok) {
    throw new Error(`Failed to load image: ${response.statusText}`);
  }

  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || "image/png" });
}
