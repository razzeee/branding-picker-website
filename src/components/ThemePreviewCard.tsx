import Image from "next/image";
import ContrastInfo from "./ContrastInfo";

interface ThemePreviewCardProps {
  title: string;
  backgroundColor: string;
  foregroundColor: string;
  iconUrl?: string;
  appName: string;
  contrast: number;
  rating: {
    aa: { normal: boolean; large: boolean };
    aaa: { normal: boolean; large: boolean };
  };
}

export default function ThemePreviewCard({
  title,
  backgroundColor,
  foregroundColor,
  iconUrl,
  appName,
  contrast,
  rating,
}: ThemePreviewCardProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div
        className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[300px] border-2 border-gray-300 dark:border-gray-600 shadow-lg"
        style={{ backgroundColor }}
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
          style={{ color: foregroundColor }}
        >
          {appName}
        </h4>
        <p className="text-center max-w-xs" style={{ color: foregroundColor }}>
          Sample text showing how content appears on the brand color
        </p>
        <button
          className="mt-6 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-shadow"
          style={{
            backgroundColor: foregroundColor,
            color: backgroundColor,
          }}
        >
          Get {appName}
        </button>
      </div>
      <ContrastInfo contrast={contrast} rating={rating} />
    </div>
  );
}
