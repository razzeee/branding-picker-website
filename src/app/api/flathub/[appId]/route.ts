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
    const response = await fetch(
      `https://flathub.org/api/v2/appstream/${appId}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: `App "${appId}" not found on Flathub` },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: `Failed to fetch app data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Flathub API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch app data from Flathub" },
      { status: 500 }
    );
  }
}
