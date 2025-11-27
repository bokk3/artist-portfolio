"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const guestbookSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function submitGuestbookEntry(formData: FormData) {
  const name = formData.get("name") as string;
  const message = formData.get("message") as string;

  const result = guestbookSchema.safeParse({ name, message });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const stmt = db.prepare(
      "INSERT INTO guestbook_entries (name, message) VALUES (?, ?)"
    );
    stmt.run(name, message);

    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit guestbook entry:", error);
    return { error: "Failed to submit entry" };
  }
}

export async function getGuestbookEntries() {
  try {
    const stmt = db.prepare(
      "SELECT * FROM guestbook_entries WHERE is_approved = 1 ORDER BY created_at DESC"
    );
    return stmt.all();
  } catch (error) {
    console.error("Failed to fetch guestbook entries:", error);
    return [];
  }
}

export async function getPendingGuestbookEntries() {
  try {
    const stmt = db.prepare(
      "SELECT * FROM guestbook_entries WHERE is_approved = 0 ORDER BY created_at DESC"
    );
    return stmt.all();
  } catch (error) {
    console.error("Failed to fetch pending guestbook entries:", error);
    return [];
  }
}

export async function approveGuestbookEntry(id: number) {
  try {
    const stmt = db.prepare(
      "UPDATE guestbook_entries SET is_approved = 1 WHERE id = ?"
    );
    stmt.run(id);
    revalidatePath("/admin/guestbook");
    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve entry:", error);
    return { error: "Failed to approve entry" };
  }
}

export async function deleteGuestbookEntry(id: number) {
  try {
    const stmt = db.prepare("DELETE FROM guestbook_entries WHERE id = ?");
    stmt.run(id);
    revalidatePath("/admin/guestbook");
    revalidatePath("/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete entry:", error);
    return { error: "Failed to delete entry" };
  }
}
