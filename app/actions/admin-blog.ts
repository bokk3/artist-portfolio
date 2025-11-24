"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image_url = formData.get("cover_image_url") as string;
  const tags = formData.get("tags") as string;
  const published = formData.get("published") === "true" ? 1 : 0;

  const slug = generateSlug(title);

  const stmt = db.prepare(`
    INSERT INTO posts (title, slug, content, excerpt, cover_image_url, tags, published)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(title, slug, content, excerpt, cover_image_url, tags, published);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updatePost(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image_url = formData.get("cover_image_url") as string;
  const tags = formData.get("tags") as string;
  const published = formData.get("published") === "true" ? 1 : 0;

  const slug = generateSlug(title);

  const stmt = db.prepare(`
    UPDATE posts 
    SET title = ?, slug = ?, content = ?, excerpt = ?, cover_image_url = ?, tags = ?, published = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(title, slug, content, excerpt, cover_image_url, tags, published, id);
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deletePost(id: number) {
  const stmt = db.prepare("DELETE FROM posts WHERE id = ?");
  stmt.run(id);
  revalidatePath("/blog");
  revalidatePath("/admin/blog");
}
