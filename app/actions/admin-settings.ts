"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getSetting(key: string): Promise<string | null> {
  try {
    const stmt = db.prepare("SELECT value FROM settings WHERE key = ?");
    const result = stmt.get(key) as { value: string } | undefined;
    return result?.value || null;
  } catch (error) {
    console.error("Error getting setting:", error);
    return null;
  }
}

export async function getAllSettings(): Promise<Record<string, string>> {
  try {
    const stmt = db.prepare("SELECT key, value FROM settings");
    const rows = stmt.all() as { key: string; value: string }[];
    return rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error getting all settings:", error);
    return {};
  }
}

export async function updateSetting(key: string, value: string) {
  try {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
    );
    stmt.run(key, value);
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating setting:", error);
    return { success: false, error: "Failed to update setting" };
  }
}

export async function updateSettings(settings: Record<string, string>) {
  try {
    const stmt = db.prepare(
      "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)"
    );
    const transaction = db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, value);
      }
    });
    transaction();
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}

