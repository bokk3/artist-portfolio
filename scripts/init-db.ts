import db from "../lib/db";
import fs from "fs";
import path from "path";

const schemaPath = path.join(process.cwd(), "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf-8");

console.log("Initializing database...");

try {
  db.exec(schema);
  console.log("Database schema applied successfully.");
} catch (error) {
  console.error("Error initializing database:", error);
  process.exit(1);
}
