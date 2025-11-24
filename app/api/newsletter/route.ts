import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const checkStmt = db.prepare(
      "SELECT id FROM newsletter_subscribers WHERE email = ?"
    );
    const existing = checkStmt.get(email);

    if (existing) {
      return NextResponse.json(
        { error: "Email already subscribed" },
        { status: 400 }
      );
    }

    // Insert new subscriber
    const stmt = db.prepare(
      "INSERT INTO newsletter_subscribers (email) VALUES (?)"
    );
    stmt.run(email);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
