import { NextRequest, NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import { createHash } from "crypto";

const dbPath = path.join(process.cwd(), "artist-portfolio.db");

export async function POST(req: NextRequest) {
  try {
    const { trackId } = await req.json();

    if (!trackId) {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    // Privacy-preserving IP hash
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const ipHash = createHash("sha256")
      .update(ip + userAgent)
      .digest("hex");

    const db = new Database(dbPath);

    const stmt = db.prepare(`
      INSERT INTO track_plays (track_id, user_agent, ip_hash)
      VALUES (?, ?, ?)
    `);

    stmt.run(trackId, userAgent, ipHash);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record play:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
