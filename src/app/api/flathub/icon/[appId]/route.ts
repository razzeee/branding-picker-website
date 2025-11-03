import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ appId: string }> }
) {
  const { appId } = await params;

  if (!appId) {
    return NextResponse.json({ error: "App ID is required" }, { status: 400 });
  }

  try {
    // Fetch the icon from Flathub
    const iconUrl = `https://flathub.org/repo/appstream/x86_64/icons/128x128/${appId}.png`;
    const response = await fetch(iconUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Icon not found for app "${appId}"` },
        { status: 404 }
      );
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error("Icon fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch app icon" },
      { status: 500 }
    );
  }
}
