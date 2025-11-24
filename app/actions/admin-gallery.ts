"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGalleryImage(formData: FormData) {
  const image_url = formData.get("image_url") as string;
  const caption = formData.get("caption") as string;
  const category = formData.get("category") as string;

  const stmt = db.prepare(`
    INSERT INTO gallery (image_url, caption, category)
    VALUES (?, ?, ?)
  `);

  stmt.run(image_url, caption, category);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryImage(id: number) {
  const stmt = db.prepare("DELETE FROM gallery WHERE id = ?");
  stmt.run(id);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}
