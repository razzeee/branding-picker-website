interface ContrastInfoProps {
  contrast: number;
  rating: {
    aa: { normal: boolean; large: boolean };
    aaa: { normal: boolean; large: boolean };
  };
}

export default function ContrastInfo({ contrast, rating }: ContrastInfoProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Contrast:
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {contrast.toFixed(2)}:1
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              rating.aaa.normal
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : rating.aa.normal
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {rating.aaa.normal ? "✓ AAA" : rating.aa.normal ? "✓ AA" : "✗ Fail"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {rating.aaa.normal
              ? "Excellent contrast"
              : rating.aa.normal
              ? "Good contrast"
              : "Poor contrast"}
          </span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={
                rating.aa.normal ? "text-green-600 dark:text-green-400" : ""
              }
            >
              {rating.aa.normal ? "✓" : "✗"} AA Normal (4.5:1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                rating.aa.large ? "text-green-600 dark:text-green-400" : ""
              }
            >
              {rating.aa.large ? "✓" : "✗"} AA Large (3:1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                rating.aaa.normal ? "text-green-600 dark:text-green-400" : ""
              }
            >
              {rating.aaa.normal ? "✓" : "✗"} AAA Normal (7:1)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={
                rating.aaa.large ? "text-green-600 dark:text-green-400" : ""
              }
            >
              {rating.aaa.large ? "✓" : "✗"} AAA Large (4.5:1)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
