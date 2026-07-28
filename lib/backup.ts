import fs from "fs"; import path from "path";
export function backupDatabase() {
  const src = path.join(process.cwd(), "prisma", "dev.db");
  if (!fs.existsSync(src)) { console.log("No DB file found"); return; }
  const dir = path.join(process.cwd(), "backup");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const dest = path.join(dir, `${today}.db`);
  fs.copyFileSync(src, dest);
  console.log(`Backup created: ${dest}`);
}
backupDatabase();
