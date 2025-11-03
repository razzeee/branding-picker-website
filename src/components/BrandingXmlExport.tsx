import { Color } from "@/lib/types";

interface BrandingXmlExportProps {
  lightColor?: Color;
  darkColor?: Color;
}

export default function BrandingXmlExport({
  lightColor,
  darkColor,
}: BrandingXmlExportProps) {
  // Don't render if we don't have at least one color
  if (!lightColor && !darkColor) return null;
  const generateXml = () => {
    const lightColorHex = lightColor?.hex || darkColor?.hex || "#000000";
    const darkColorHex = darkColor?.hex || lightColor?.hex || "#000000";

    return `  <branding>
    <color type="primary" scheme_preference="light">${lightColorHex}</color>
    <color type="primary" scheme_preference="dark">${darkColorHex}</color>
  </branding>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateXml());
  };

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
          AppStream Branding XML
        </h4>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Copy XML
        </button>
      </div>
      <pre className="bg-gray-800 text-gray-100 p-3 rounded text-xs overflow-x-auto">
        <code>{generateXml()}</code>
      </pre>
      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
        Add this to your AppStream metainfo file. Learn more at{" "}
        <a
          href="https://www.freedesktop.org/software/appstream/docs/chap-Metadata.html#tag-branding"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          AppStream Documentation
        </a>
      </p>
    </div>
  );
}
