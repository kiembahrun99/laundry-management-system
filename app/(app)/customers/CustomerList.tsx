"use client";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";

export default function CustomerList({ items, total, perPage }: { items: any[]; total: number; perPage: number }) {
  const [deleting, setDeleting] = useState<number | null>(null);
  async function handleDelete(id: number) {
    if (!confirm("Delete this customer?")) return;
    setDeleting(id);
    try { await fetch(`/api/customers/${id}`, { method: "DELETE" }); window.location.reload(); }
    catch { alert("Failed"); }
    setDeleting(null);
  }
  return (
    <div className="card shadow-sm border-0 rounded-4">
      <div className="card-body">
        <div className="mb-3" style={{ maxWidth: 300 }}><SearchInput placeholder="Search name or phone..." /></div>
        {items.length === 0 ? <EmptyState message="No customers found" /> : (
          <>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light"><tr><th>Name</th><th>Phone</th><th>Address</th><th>Actions</th></tr></thead>
                <tbody>
                  {items.map((c: any) => (
                    <tr key={c.id}><td>{c.name}</td><td>{c.phone}</td><td className="text-truncate" style={{ maxWidth: 200 }}>{c.address || "-"}</td>
                      <td><div className="d-flex gap-1">
                        <a href={`/customers/${c.id}/edit`} className="btn btn-sm btn-outline-primary"><i className="bi bi-pencil"></i></a>
                        <button className="btn btn-sm btn-outline-danger" disabled={deleting === c.id} onClick={() => handleDelete(c.id)}><i className="bi bi-trash"></i></button>
                      </div></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination total={total} perPage={perPage} />
          </>
        )}
      </div>
    </div>
  );
}
