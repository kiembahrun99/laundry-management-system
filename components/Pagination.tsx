"use client";
import { useRouter, useSearchParams } from "next/navigation";
export default function Pagination({ total, perPage }: { total: number; perPage: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const page = parseInt(params.get("page") || "1");
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const go = (p: number) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("page", String(p));
    router.push("?" + sp.toString());
  };
  return (
    <nav><ul className="pagination pagination-sm mb-0">
      <li className={`page-item ${page <= 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => go(page - 1)}>Prev</button></li>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(n => (
        <li key={n} className={`page-item ${page === n ? "active" : ""}`}><button className="page-link" onClick={() => go(n)}>{n}</button></li>
      ))}
      <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => go(page + 1)}>Next</button></li>
    </ul></nav>
  );
}
