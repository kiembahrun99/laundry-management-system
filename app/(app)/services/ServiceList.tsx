"use client";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { formatCurrency } from "@/lib/utils";
export default function ServiceList({ items, total, perPage }: { items: any[]; total: number; perPage: number }) {
  const [deleting, setDeleting] = useState<number | null>(null);
  async function handleDelete(id: number) {
    if (!confirm("Delete this service?")) return;
    setDeleting(id);
    try { await fetch(`/api/services/${id}`, { method: "DELETE" }); window.location.reload(); }
    catch { alert("Failed"); } setDeleting(null);
  }
  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body">
      <div className="mb-3" style={{ maxWidth: 300 }}><SearchInput placeholder="Search service..." /></div>
      {items.length === 0 ? <EmptyState message="No services" /> : (
        <>
          <div className="table-responsive"><table className="table table-hover"><thead className="table-light"><tr><th>Name</th><th>Price/Kg</th><th>Est. Days</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{items.map((s: any) => (<tr key={s.id}><td>{s.name}</td><td>{formatCurrency(s.pricePerKg)}</td><td>{s.estimatedDays} days</td><td><span className={`badge ${s.isActive ? "bg-success" : "bg-secondary"}`}>{s.isActive ? "Active" : "Inactive"}</span></td>
              <td><div className="d-flex gap-1"><a href={`/services/${s.id}/edit`} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"></i></a><button className="btn btn-sm btn-outline-danger" disabled={deleting === s.id} onClick={() => handleDelete(s.id)}><i className="bi bi-trash"></i></button></div></td></tr>))}</tbody></table></div>
          <Pagination total={total} perPage={perPage} />
        </>
      )}
    </div></div>
  );
}
