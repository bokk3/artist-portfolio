import Database from "better-sqlite3";
import path from "path";

// Ensure the db directory exists
const dbPath = path.join(process.cwd(), "db", "artist.db");
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma("journal_mode = WAL");

export default db;
