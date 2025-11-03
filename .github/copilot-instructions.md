# Appstream Branding Color Picker - Next.js Project

This is a Next.js web application that analyzes images to extract brand colors using multiple algorithms.

## Project Details

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: TailwindCSS
- **Features**:
  - **Flathub Integration**: Load app icons from Flathub URLs or app IDs
  - Image upload via drag-and-drop
  - 6 color extraction algorithms (k-means, median-cut, vibrant, dominant, histogram, palette)
  - Canvas API for image processing
  - Modern responsive UI with dark mode

## Development Guidelines

- Use TypeScript for all source files
- Follow React best practices and hooks patterns
- Use Tailwind utility classes for styling
- Implement client-side image processing with Canvas API
- Keep algorithms modular and testable

## Flathub Integration

- Users can enter Flathub URLs (e.g., `https://flathub.org/en/apps/tv.kodi.Kodi`)
- Or enter app IDs directly (e.g., `tv.kodi.Kodi`)
- Uses Flathub API v2 (`/api/v2/appstream/{appId}`)
- Automatically loads app icons and displays metadata with links
