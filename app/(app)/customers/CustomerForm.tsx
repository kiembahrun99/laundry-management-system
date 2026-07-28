"use client";
import { useState } from "react";
export default function CustomerForm({ customer }: { customer?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = { name: fd.get("name"), phone: fd.get("phone"), address: fd.get("address") || null, notes: fd.get("notes") || null };
    try {
      const url = customer ? `/api/customers/${customer.id}` : "/api/customers";
      const res = await fetch(url, { method: customer ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      window.location.href = "/customers";
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }
  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body p-4">
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Full Name *</label><input name="name" className="form-control" required defaultValue={customer?.name} /></div>
        <div className="mb-3"><label className="form-label">Phone *</label><input name="phone" className="form-control" required defaultValue={customer?.phone} /></div>
        <div className="mb-3"><label className="form-label">Address</label><textarea name="address" className="form-control" rows={2} defaultValue={customer?.address || ""}></textarea></div>
        <div className="mb-3"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={2} defaultValue={customer?.notes || ""}></textarea></div>
        <button type="submit" disabled={loading} className="btn btn-primary">{loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : "Save"}</button>
        <a href="/customers" className="btn btn-light ms-2">Cancel</a>
      </form>
    </div></div>
  );
}
