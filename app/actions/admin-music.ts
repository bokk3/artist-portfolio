"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- Releases ---

export async function createRelease(formData: FormData) {
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const type = formData.get("type") as string;
  const release_date = formData.get("release_date") as string;
  const cover_image_url = formData.get("cover_image_url") as string;
  const description = formData.get("description") as string;

  const stmt = db.prepare(`
    INSERT INTO releases (title, artist, type, release_date, cover_image_url, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    title,
    artist,
    type,
    release_date,
    cover_image_url,
    description
  );
  revalidatePath("/music");
  revalidatePath("/admin/music");
  redirect("/admin/music");
}

export async function deleteRelease(id: number) {
  const stmt = db.prepare("DELETE FROM releases WHERE id = ?");
  stmt.run(id);
  revalidatePath("/music");
  revalidatePath("/admin/music");
}

// --- Tracks ---

export async function addTrack(formData: FormData) {
  const release_id = formData.get("release_id") as string;
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const audio_url = formData.get("audio_url") as string;
  const durationInput = formData.get("duration") as string;
  const duration = durationInput && durationInput.trim() !== "" 
    ? parseInt(durationInput) 
    : null;
  const track_number = parseInt(formData.get("track_number") as string) || 1;
  const waveform_data = formData.get("waveform_data") as string | null;

  const stmt = db.prepare(`
    INSERT INTO tracks (release_id, title, artist, audio_url, duration, track_number, waveform_data)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(release_id, title, artist, audio_url, duration, track_number, waveform_data || null);
  revalidatePath(`/music/${release_id}`);
  revalidatePath(`/admin/music/${release_id}`);
}

export async function deleteTrack(id: number, release_id: number) {
  const stmt = db.prepare("DELETE FROM tracks WHERE id = ?");
  stmt.run(id);
  revalidatePath(`/music/${release_id}`);
  revalidatePath(`/admin/music/${release_id}`);
}
