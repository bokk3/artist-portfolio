const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

// Ensure db directory exists with proper permissions
const dbDir = path.join(process.cwd(), "db");

console.log(`📁 Checking database directory: ${dbDir}`);

try {
  if (!fs.existsSync(dbDir)) {
    console.log("📁 Creating db directory...");
    fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
  }

  // Test write permissions
  const testFile = path.join(dbDir, ".write-test");
  fs.writeFileSync(testFile, "test");
  fs.unlinkSync(testFile);
  console.log("✅ Database directory is writable");
} catch (error) {
  console.error("❌ Error with database directory:", error.message);
  // Attempt to get directory stats only if the directory exists, otherwise statSync will throw an error
  if (fs.existsSync(dbDir)) {
    console.error("Directory permissions:", fs.statSync(dbDir));
  } else {
    console.error("Directory does not exist or could not be created.");
  }
  process.exit(1);
}

const dbPath = path.join(dbDir, "artist.db");
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

console.log("🗄️  Initializing database...");

// Create tables
db.exec(`
  -- Users table
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Releases table
  CREATE TABLE IF NOT EXISTS releases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('album', 'single', 'ep')),
    release_date TEXT,
    cover_image_url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tracks table
  CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    release_id INTEGER,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    waveform_data TEXT,
    duration INTEGER,
    bpm INTEGER,
    genre TEXT,
    track_number INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (release_id) REFERENCES releases(id) ON DELETE SET NULL
  );

  -- Posts table
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image_url TEXT,
    tags TEXT,
    published BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Events table
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    venue TEXT NOT NULL,
    city TEXT NOT NULL,
    ticket_url TEXT,
    status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'sold_out', 'cancelled', 'past')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Videos table
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    platform TEXT CHECK(platform IN ('youtube', 'vimeo', 'native')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Gallery table
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT DEFAULT 'general' CHECK(category IN ('live', 'studio', 'press', 'general')),
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Newsletter subscribers table
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Settings table
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  -- Guestbook table
  CREATE TABLE IF NOT EXISTS guestbook_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log("✅ Tables created successfully");

// Initialize default settings
db.exec(`
  INSERT OR IGNORE INTO settings (key, value) VALUES 
  ('site_title', 'Artist Portfolio'),
  ('contact_email', 'booking@artist.com'),
  ('hero_image', '');
`);
console.log("✅ Default settings initialized");

// Create default admin user if none exists
const bcrypt = require("bcryptjs");
const adminEmail = process.env.ADMIN_EMAIL || "admin@artist.com";
const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

const existingUser = db
  .prepare("SELECT * FROM users WHERE email = ?")
  .get(adminEmail);

if (!existingUser) {
  const hashedPassword = bcrypt.hashSync(adminPassword, 10);
  db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(
    adminEmail,
    hashedPassword
  );
  console.log(`✅ Admin user created: ${adminEmail}`);
  console.log(
    `⚠️  Default password: ${adminPassword} - CHANGE THIS IN PRODUCTION!`
  );
} else {
  console.log("✅ Admin user already exists");
}

db.close();
console.log("🎉 Database initialization complete!");
