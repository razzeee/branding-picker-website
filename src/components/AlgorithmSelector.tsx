import { AlgorithmInfo, Algorithm } from "@/lib/types";

interface AlgorithmSelectorProps {
  algorithms: AlgorithmInfo[];
  selected: Algorithm;
  onSelect: (algorithm: Algorithm) => void;
}

export default function AlgorithmSelector({
  algorithms,
  selected,
  onSelect,
}: AlgorithmSelectorProps) {
  return (
    <div className="space-y-3">
      {algorithms.map((algo) => (
        <button
          key={algo.id}
          onClick={() => onSelect(algo.id)}
          className={`w-full p-3 rounded-lg transition-all duration-200 text-left ${
            selected === algo.id
              ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-400"
              : "bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          <div className="flex items-start gap-3">
            <span
              className={`text-lg ${
                selected === algo.id ? "opacity-100" : "opacity-50"
              }`}
            >
              {selected === algo.id ? "●" : "○"}
            </span>
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-0.5">{algo.name}</h3>
              <p
                className={`text-xs ${
                  selected === algo.id
                    ? "text-blue-50"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {algo.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
