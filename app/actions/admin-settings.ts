"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Ensure settings table exists
function ensureSettingsTable() {
  try {
    // Check if table exists
    const tableCheck = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='settings'"
    ).get();
    
    if (!tableCheck) {
      console.log("Creating settings table...");
      db.exec(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);
      
      // Initialize default settings
      db.exec(`
        INSERT OR IGNORE INTO settings (key, value) VALUES 
        ('site_title', 'Artist Portfolio'),
        ('contact_email', 'booking@artist.com'),
        ('hero_image', '');
      `);
      console.log("Settings table created and initialized");
    }
  } catch (error) {
    console.error("Error ensuring settings table:", error);
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    ensureSettingsTable();
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
    ensureSettingsTable();
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
    ensureSettingsTable();
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
    ensureSettingsTable();
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

