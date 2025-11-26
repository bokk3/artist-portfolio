const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const dbDir = path.join(process.cwd(), "db");
const dbPath = path.join(dbDir, "artist.db");

if (!fs.existsSync(dbPath)) {
  console.log("ℹ️  Database file not found. Will be created on first run.");
  process.exit(0);
}

console.log("🔄 Starting database migration...");
const db = new Database(dbPath);

// Enable WAL mode
db.pragma("journal_mode = WAL");

try {
  // Check if tables exist, create missing ones
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  console.log("📋 Existing tables:", tables.join(", "));

  // Create gallery table if it doesn't exist
  if (!tables.includes("gallery")) {
    console.log("➕ Creating 'gallery' table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        caption TEXT,
        category TEXT DEFAULT 'general' CHECK(category IN ('live', 'studio', 'press', 'general')),
        display_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Created 'gallery' table");
  }

  // Create newsletter_subscribers table if it doesn't exist
  if (!tables.includes("newsletter_subscribers")) {
    console.log("➕ Creating 'newsletter_subscribers' table...");
    db.exec(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Created 'newsletter_subscribers' table");
  }

  // Check if releases table exists and get its columns
  if (!tables.includes("releases")) {
    console.log("❌ 'releases' table is missing. Please run 'npm run db:init' first.");
    process.exit(1);
  }

  const tableInfo = db.prepare("PRAGMA table_info(releases)").all();
  const columns = tableInfo.map((col) => col.name);
  
  console.log("📋 Current releases table columns:", columns.join(", "));

  // Add type column if it doesn't exist
  if (!columns.includes("type")) {
    console.log("➕ Adding 'type' column to releases table...");
    db.exec(`
      ALTER TABLE releases ADD COLUMN type TEXT NOT NULL DEFAULT 'album';
      UPDATE releases SET type = 'album' WHERE type IS NULL;
    `);
    console.log("✅ Added 'type' column");
  } else {
    console.log("✅ 'type' column already exists");
  }

  // Add slug column if it doesn't exist
  if (!columns.includes("slug")) {
    console.log("➕ Adding 'slug' column to releases table...");
    db.exec(`ALTER TABLE releases ADD COLUMN slug TEXT`);
    console.log("✅ Added 'slug' column");
    
    // Generate slugs for existing releases
    console.log("🔄 Generating slugs for existing releases...");
    const releases = db.prepare("SELECT id, title FROM releases WHERE slug IS NULL OR slug = ''").all();
    let updated = 0;
    for (const release of releases) {
      const slug = release.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim();
      
      // Ensure uniqueness
      let uniqueSlug = slug;
      let counter = 1;
      while (db.prepare("SELECT id FROM releases WHERE slug = ?").get(uniqueSlug)) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      
      db.prepare("UPDATE releases SET slug = ? WHERE id = ?").run(uniqueSlug, release.id);
      updated++;
    }
    console.log(`✅ Generated slugs for ${updated} existing releases`);
    
    // Make slug NOT NULL and UNIQUE after populating
    console.log("🔒 Making slug column NOT NULL and UNIQUE...");
    // SQLite doesn't support adding UNIQUE constraint directly, so we'll note it
    console.log("⚠️  Note: SQLite doesn't support adding UNIQUE constraint via ALTER TABLE.");
    console.log("   The column has been added. For full UNIQUE enforcement, recreate the table.");
  } else {
    console.log("✅ 'slug' column already exists");
  }

  // Check tracks table
  if (!tables.includes("tracks")) {
    console.log("❌ 'tracks' table is missing. Please run 'npm run db:init' first.");
    process.exit(1);
  }

  const tracksInfo = db.prepare("PRAGMA table_info(tracks)").all();
  const tracksColumns = tracksInfo.map((col) => col.name);
  
  console.log("📋 Current tracks table columns:", tracksColumns.join(", "));

  // Add missing columns to tracks table
  if (!tracksColumns.includes("artist")) {
    console.log("➕ Adding 'artist' column to tracks table...");
    db.exec(`ALTER TABLE tracks ADD COLUMN artist TEXT`);
    console.log("✅ Added 'artist' column");
  }

  if (!tracksColumns.includes("bpm")) {
    console.log("➕ Adding 'bpm' column to tracks table...");
    db.exec(`ALTER TABLE tracks ADD COLUMN bpm INTEGER`);
    console.log("✅ Added 'bpm' column");
  }

  if (!tracksColumns.includes("genre")) {
    console.log("➕ Adding 'genre' column to tracks table...");
    db.exec(`ALTER TABLE tracks ADD COLUMN genre TEXT`);
    console.log("✅ Added 'genre' column");
  }

  // Make release_id nullable if it's currently NOT NULL
  const releaseIdColumn = tracksInfo.find((col) => col.name === "release_id");
  if (releaseIdColumn && releaseIdColumn.notnull === 1) {
    console.log("⚠️  Note: release_id is currently NOT NULL. SQLite doesn't support changing this directly.");
    console.log("   Existing data should be fine, but new schema allows NULL.");
  }

  // Make audio_url NOT NULL if it's currently nullable
  const audioUrlColumn = tracksInfo.find((col) => col.name === "audio_url");
  if (audioUrlColumn && audioUrlColumn.notnull === 0) {
    console.log("⚠️  Note: audio_url is currently nullable. SQLite doesn't support changing this directly.");
    console.log("   Consider ensuring all existing tracks have audio_url set.");
  }

  // Check events table for status CHECK constraint
  if (tables.includes("events")) {
    const eventsInfo = db.prepare("PRAGMA table_info(events)").all();
    console.log("📋 Current events table columns:", eventsInfo.map((col) => col.name).join(", "));
    console.log("ℹ️  Note: CHECK constraints are enforced by SQLite, but existing invalid data may need manual cleanup.");
  }

  // Check videos table
  if (tables.includes("videos")) {
    const videosInfo = db.prepare("PRAGMA table_info(videos)").all();
    const videosColumns = videosInfo.map((col) => col.name);
    console.log("📋 Current videos table columns:", videosColumns.join(", "));
  }

  // Check gallery table columns
  if (tables.includes("gallery")) {
    const galleryInfo = db.prepare("PRAGMA table_info(gallery)").all();
    const galleryColumns = galleryInfo.map((col) => col.name);
    console.log("📋 Current gallery table columns:", galleryColumns.join(", "));

    if (!galleryColumns.includes("display_order")) {
      console.log("➕ Adding 'display_order' column to gallery table...");
      db.exec(`ALTER TABLE gallery ADD COLUMN display_order INTEGER DEFAULT 0`);
      console.log("✅ Added 'display_order' column");
    }
  }

  console.log("✅ Migration complete!");
  console.log("\n📝 Summary:");
  console.log("   - Releases table: type column added");
  console.log("   - Tracks table: artist, bpm, genre columns added");
  console.log("   - Gallery table: display_order column added");
  console.log("\n⚠️  Note: Some constraints (NOT NULL, CHECK) cannot be changed in SQLite.");
  console.log("   If you need to enforce these, consider recreating the database.");

} catch (error) {
  console.error("❌ Migration failed:", error.message);
  process.exit(1);
} finally {
  db.close();
}

