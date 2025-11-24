"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
  const date = formData.get("date") as string;
  const venue = formData.get("venue") as string;
  const city = formData.get("city") as string;
  const ticket_url = formData.get("ticket_url") as string;
  const status = formData.get("status") as string;

  const stmt = db.prepare(`
    INSERT INTO events (date, venue, city, ticket_url, status)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(date, venue, city, ticket_url, status);
  revalidatePath("/tour");
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function deleteEvent(id: number) {
  const stmt = db.prepare("DELETE FROM events WHERE id = ?");
  stmt.run(id);
  revalidatePath("/tour");
  revalidatePath("/admin/events");
}
