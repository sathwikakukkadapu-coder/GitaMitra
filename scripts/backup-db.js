import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dataDir, "gita.db");
const backupDir = path.join(dataDir, "backups");

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  console.error("Database not found at:", dbPath);
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDbPath = path.join(backupDir, `gita-backup-${timestamp}.db`);
const exportJsonPath = path.join(backupDir, `gita-export-${timestamp}.json`);

// 1. Copy database file
fs.copyFileSync(dbPath, backupDbPath);
console.log(`✓ SQLite database file backed up to: ${backupDbPath}`);

// 2. Export JSON snapshot of persistent user progress and bookmarks
const db = new DatabaseSync(dbPath);
const users = db.prepare("SELECT id, email, name, is_verified, created_at, updated_at FROM users").all();
const userProgress = db.prepare("SELECT * FROM user_reading_progress").all();
const userHistory = db.prepare("SELECT * FROM user_reading_history ORDER BY read_at DESC LIMIT 500").all();
const bookmarks = db.prepare("SELECT * FROM bookmarks").all();

const exportData = {
  timestamp: new Date().toISOString(),
  userCount: users.length,
  users,
  userProgress,
  userHistory,
  bookmarks
};

fs.writeFileSync(exportJsonPath, JSON.stringify(exportData, null, 2), "utf8");
console.log(`✓ User reading progress exported to: ${exportJsonPath}`);
console.log(`  Backed up ${users.length} user accounts and ${userProgress.length} reading progress records.`);
