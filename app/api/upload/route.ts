import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // 'cover', 'audio', 'gallery', 'blog', etc.

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 25MB)" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/wave", "audio/x-wav", "audio/ogg", "audio/flac", "audio/aac", "audio/m4a"],
      video: ["video/mp4", "video/webm"],
    };

    const isImage = allowedTypes.image.includes(file.type);
    const isAudio = allowedTypes.audio.includes(file.type);
    const isVideo = allowedTypes.video.includes(file.type);
    
    // Also check by file extension for audio files (browsers sometimes send wrong MIME types)
    const ext = path.extname(file.name).toLowerCase();
    const audioExtensions = [".mp3", ".wav", ".ogg", ".flac", ".aac", ".m4a"];
    const isAudioByExt = audioExtensions.includes(ext);

    if (!isImage && !isAudio && !isVideo && !isAudioByExt) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Create upload directory based on type
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      type || "misc"
    );

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileExt = path.extname(file.name);
    const filename = `${timestamp}-${randomStr}${fileExt}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${type || "misc"}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
