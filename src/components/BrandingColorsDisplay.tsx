import { FlathubApp } from "@/lib/types";

interface BrandingColorsDisplayProps {
  app: FlathubApp | null;
}

export default function BrandingColorsDisplay({
  app,
}: BrandingColorsDisplayProps) {
  if (!app?.branding || app.branding.length === 0) {
    return null;
  }

  const { branding } = app;

  // Group colors by type (primary/secondary)
  const groupedColors = branding.reduce((acc, color) => {
    if (!acc[color.type]) {
      acc[color.type] = [];
    }
    acc[color.type].push(color);
    return acc;
  }, {} as Record<string, typeof branding>);

  return (
    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
        <span>🎨</span>
        Existing Branding Colors
        <span className="text-xs font-normal text-purple-600 dark:text-purple-400">
          (from Flathub)
        </span>
      </h3>
      <div className="space-y-4">
        {Object.entries(groupedColors).map(([type, colors]) => {
          const lightColor = colors.find(
            (c) => c.scheme_preference === "light"
          );
          const darkColor = colors.find((c) => c.scheme_preference === "dark");
          const noPreference = colors.find((c) => !c.scheme_preference);

          return (
            <div key={type} className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                    type === "primary"
                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                      : "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>

              <div className="grid gap-2">
                {/* Light theme color */}
                {lightColor && (
                  <ColorSwatch
                    color={lightColor}
                    label="Light theme"
                    icon="☀️"
                  />
                )}

                {/* Dark theme color */}
                {darkColor && (
                  <ColorSwatch color={darkColor} label="Dark theme" icon="🌙" />
                )}

                {/* No preference color */}
                {noPreference && (
                  <ColorSwatch color={noPreference} label="All themes" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ColorSwatchProps {
  color: { value: string };
  label: string;
  icon?: string;
}

function ColorSwatch({ color, label, icon }: ColorSwatchProps) {
  const hexColor = color.value.startsWith("#")
    ? color.value
    : `#${color.value}`;

  return (
    <div className="flex items-center gap-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
      <div
        className="w-10 h-10 rounded-lg border-2 border-gray-200 dark:border-gray-600 shrink-0 shadow-sm"
        style={{ backgroundColor: hexColor }}
        title={hexColor}
      />
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
          {icon && <span className="mr-1">{icon}</span>}
          {label}
        </div>
        <code className="text-sm font-mono text-gray-900 dark:text-gray-100 font-semibold">
          {hexColor}
        </code>
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(hexColor);
        }}
        className="shrink-0 px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        title="Copy to clipboard"
      >
        Copy
      </button>
    </div>
  );
}
