import { db } from "@/lib/db";
import SettingsForm from "./SettingsForm";
export default async function SettingsPage() {
  const items = await db.setting.findMany();
  const settings = Object.fromEntries(items.map(s => [s.key, s.value || ""]));
  return <div><h4 className="fw-bold mb-3">Settings</h4><SettingsForm settings={settings} /></div>;
}
