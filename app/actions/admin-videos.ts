"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createVideo(formData: FormData) {
  const title = formData.get("title") as string;
  const video_url = formData.get("video_url") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const platform = formData.get("platform") as string;

  const stmt = db.prepare(`
    INSERT INTO videos (title, video_url, thumbnail_url, platform)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(title, video_url, thumbnail_url, platform);
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
  redirect("/admin/videos");
}

export async function deleteVideo(id: number) {
  const stmt = db.prepare("DELETE FROM videos WHERE id = ?");
  stmt.run(id);
  revalidatePath("/videos");
  revalidatePath("/admin/videos");
}
