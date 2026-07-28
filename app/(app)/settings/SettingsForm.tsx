"use client";
import { useState } from "react";
export default function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    laundry_name: settings.laundry_name || "",
    address: settings.address || "",
    phone: settings.phone || "",
    footer: settings.footer || "",
    receipt_note: settings.receipt_note || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg("");
    try {
      const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error("Failed");
      setMsg("Settings saved"); setTimeout(() => window.location.reload(), 800);
    } catch { setMsg("Failed to save"); } finally { setLoading(false); }
  }

  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body p-4">
      {msg && <div className={`alert py-2 ${msg.includes("saved") ? "alert-success" : "alert-danger"}`}>{msg}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Laundry Name</label><input className="form-control" value={form.laundry_name} onChange={e => setForm({ ...form, laundry_name: e.target.value })} required /></div>
        <div className="mb-3"><label className="form-label">Address</label><textarea className="form-control" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea></div>
        <div className="mb-3"><label className="form-label">Phone</label><input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Footer Text</label><input className="form-control" value={form.footer} onChange={e => setForm({ ...form, footer: e.target.value })} /></div>
        <div className="mb-3"><label className="form-label">Receipt Note</label><textarea className="form-control" rows={2} value={form.receipt_note} onChange={e => setForm({ ...form, receipt_note: e.target.value })}></textarea></div>
        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : "Save Settings"}</button>
        <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => { if (confirm("Backup database?")) fetch("/api/backup", { method: "POST" }).then(() => alert("Backup created in backup/ folder")); }}>Backup DB</button>
      </form>
    </div></div>
  );
}
