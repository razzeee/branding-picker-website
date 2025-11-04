import { FlathubApp } from "@/lib/types";
import BrandingColorsDisplay from "./BrandingColorsDisplay";

interface AppInfoDisplayProps {
  app: FlathubApp | null;
}

export default function AppInfoDisplay({ app }: AppInfoDisplayProps) {
  if (!app) return null;

  const urlEntries = app.urls
    ? Object.entries(app.urls).filter(([, url]) => url)
    : [];

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-4">
        {app.icon && (
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.icon}
              alt={`${app.name} icon`}
              className="w-16 h-16 rounded-lg"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {app.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {app.summary}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
            {app.id}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {/* Flathub link */}
            <a
              href={`https://flathub.org/apps/${app.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <span>🏪 Flathub</span>
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>

            {/* Other app URLs */}
            {urlEntries.length > 0 &&
              urlEntries.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                >
                  {key === "homepage" && "🏠"}
                  {key === "bugtracker" && "🐛"}
                  {key === "donation" && "💝"}
                  {key === "translate" && "🌐"}
                  {key === "vcs_browser" && "📦"}
                  <span className="capitalize">{key.replace("_", " ")}</span>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
          </div>
        </div>
      </div>

      {/* Display existing branding colors if available */}
      <BrandingColorsDisplay app={app} />
    </div>
  );
}
