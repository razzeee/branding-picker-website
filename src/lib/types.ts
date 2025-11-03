export interface Color {
  r: number;
  g: number;
  b: number;
  hex: string;
  count?: number;
}

export type Algorithm =
  | "kmeans"
  | "mediancut"
  | "vibrant"
  | "dominant"
  | "histogram"
  | "palette";

export interface AlgorithmInfo {
  id: Algorithm;
  name: string;
  description: string;
}

export interface FlathubApp {
  id: string;
  name: string;
  summary: string;
  icon?: string;
  urls?: {
    homepage?: string;
    bugtracker?: string;
    donation?: string;
    translate?: string;
    vcs_browser?: string;
  };
}
