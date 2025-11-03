# 🎨 Appstream Branding Color Picker

A Next.js web application that analyzes images to extract brand colors using multiple algorithms. Supports loading app icons directly from Flathub!

## Features

- **Flathub Integration:**

  - Load app icons directly from Flathub URLs or app IDs
  - Display app metadata (name, summary, links)
  - Automatic icon fetching from Flathub API
  - Support for homepage, bug tracker, donation, and other links

- **6 Color Extraction Algorithms:**

  - K-Means Clustering: Groups similar colors using k-means algorithm
  - Median Cut: Color quantization by recursive subdivision
  - Vibrant Colors: Extracts highly saturated, vibrant colors
  - Dominant Colors: Most frequently occurring colors
  - Histogram Analysis: Color distribution analysis with binning
  - Balanced Palette: Diverse palette with light, dark, and vibrant colors

- **Modern UI:**

  - Drag-and-drop image upload
  - Flathub app loader with URL/ID input
  - Real-time color extraction
  - Copy hex codes to clipboard
  - Responsive design with dark mode support
  - Beautiful gradient backgrounds

- **Performance:**
  - Client-side processing using Canvas API
  - Efficient pixel sampling for fast analysis
  - TypeScript for type safety

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** TailwindCSS v4
- **Image Processing:** Canvas API
- **API Integration:** Flathub API v2

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

### Loading from Flathub

1. Enter a Flathub URL (e.g., `https://flathub.org/en/apps/tv.kodi.Kodi`)
2. Or enter an app ID directly (e.g., `tv.kodi.Kodi`)
3. Click "Load" to fetch the app icon and metadata
4. View app details and useful links (homepage, bug tracker, etc.)

### Manual Upload

1. Select an algorithm from the available options
2. Upload an image by clicking or dragging & dropping
3. View the extracted colors with their hex codes
4. Click "Copy" to copy any color to your clipboard

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page with Flathub integration
│   └── globals.css         # Global styles
├── components/
│   ├── AlgorithmSelector.tsx  # Algorithm selection UI
│   ├── ImageUploader.tsx      # Drag-drop upload
│   ├── ColorResults.tsx       # Color display
│   ├── FlathubLoader.tsx      # Flathub URL/ID input
│   └── AppInfoDisplay.tsx     # App metadata display
└── lib/
    ├── types.ts               # TypeScript types
    ├── colorUtils.ts          # Utility functions
    ├── colorAnalyzer.ts       # Main analyzer
    ├── flathubUtils.ts        # Flathub API integration
    └── algorithms/
        ├── kmeans.ts          # K-means clustering
        ├── mediancut.ts       # Median cut algorithm
        ├── vibrant.ts         # Vibrant colors
        ├── dominant.ts        # Dominant colors
        ├── histogram.ts       # Histogram analysis
        └── palette.ts         # Balanced palette
```

## Algorithms Explained

### K-Means Clustering

Groups pixels into clusters based on color similarity, finding representative colors for each cluster.

### Median Cut

Recursively divides the color space into smaller boxes, creating a color palette through quantization.

### Vibrant Colors

Identifies highly saturated colors that stand out visually, perfect for accent colors.

### Dominant Colors

Finds the most frequently occurring colors in the image based on pixel count.

### Histogram Analysis

Analyzes color distribution by grouping similar colors into bins for a representative palette.

### Balanced Palette

Creates a diverse palette by selecting colors across different categories (vibrant, light, dark, dominant).

## License

MIT

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
