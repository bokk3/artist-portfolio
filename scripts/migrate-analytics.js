const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "artist-portfolio.db");
const db = new Database(dbPath);

console.log("Running analytics migration...");

try {
  // Create track_plays table
  db.exec(`
    CREATE TABLE IF NOT EXISTS track_plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      track_id INTEGER NOT NULL,
      user_agent TEXT,
      ip_hash TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Created track_plays table");

  // Create view for stats
  db.exec(`
    CREATE VIEW IF NOT EXISTS track_stats AS
    SELECT 
      track_id, 
      COUNT(*) as play_count,
      COUNT(DISTINCT ip_hash) as unique_listeners
    FROM track_plays
    GROUP BY track_id
  `);

  console.log("✅ Created track_stats view");
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}

console.log("✅ Migration completed successfully");
db.close();
