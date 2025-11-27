import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug parameter required" },
      { status: 400 }
    );
  }

  const stmt = db.prepare("SELECT * FROM releases WHERE slug = ?");
  const release = stmt.get(slug) as any;

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  const rawSiteUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://artist-portfolio.com";
  const siteUrl = rawSiteUrl.replace(/["']/g, "").trim();

  // Convert relative image URL to absolute
  let imageUrl: string | null = null;
  if (release.cover_image_url) {
    if (
      release.cover_image_url.startsWith("http://") ||
      release.cover_image_url.startsWith("https://")
    ) {
      imageUrl = release.cover_image_url.startsWith("https://")
        ? release.cover_image_url
        : release.cover_image_url.replace("http://", "https://");
    } else {
      const imagePath = release.cover_image_url.startsWith("/")
        ? release.cover_image_url
        : `/${release.cover_image_url}`;
      const baseUrl = siteUrl.startsWith("https://")
        ? siteUrl
        : siteUrl.replace("http://", "https://");
      imageUrl = `${baseUrl}${imagePath}`;
    }
  }

  return NextResponse.json({
    release: {
      title: release.title,
      artist: release.artist,
      slug: release.slug,
    },
    metadata: {
      siteUrl,
      releaseUrl: `${siteUrl}/music/${slug}`,
      imageUrl,
      imageUrlOriginal: release.cover_image_url,
      imageIsAbsolute: release.cover_image_url?.startsWith("http"),
      imageIsHttps: imageUrl?.startsWith("https://"),
    },
    environment: {
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    },
  });
}
