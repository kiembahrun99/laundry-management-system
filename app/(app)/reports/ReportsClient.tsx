"use client";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

export default function ReportsClient() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("daily");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  async function fetchReports() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range });
      if (range === "custom" && from && to) { params.set("from", from); params.set("to", to); }
      const res = await fetch(`/api/reports?${params}`);
      const json = await res.json();
      setData(json);
    } catch { } finally { setLoading(false); }
  }
  useEffect(() => { fetchReports(); }, [range]);

  function exportCsv() {
    if (!data?.orders?.length) return;
    const headers = ["Invoice", "Customer", "Service", "Weight", "Total", "Status", "Date"];
    const rows = data.orders.map((o: any) => [o.invoiceNumber, o.customer.name, o.service.name, o.weight, o.total, o.orderStatus, new Date(o.createdAt).toISOString()]);
    const csv = [headers.join(","), ...rows.map((r: any) => r.map((v: any) => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `report-${range}.csv`; a.click();
  }

  return (
    <div>
      <div className="card shadow-sm border-0 rounded-4 mb-3"><div className="card-body">
        <div className="row g-2 align-items-end">
          <div className="col-md-3"><label className="form-label">Range</label><select className="form-select" value={range} onChange={e => setRange(e.target.value)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="custom">Custom</option></select></div>
          {range === "custom" && (<><div className="col-md-3"><label className="form-label">From</label><input type="date" className="form-control" value={from} onChange={e => setFrom(e.target.value)} /></div><div className="col-md-3"><label className="form-label">To</label><input type="date" className="form-control" value={to} onChange={e => setTo(e.target.value)} /></div><div className="col-md-2"><button className="btn btn-primary w-100" onClick={fetchReports}>Apply</button></div></>)}
          {!loading && <div className="col-md-auto ms-auto"><button className="btn btn-outline-secondary" onClick={exportCsv}><i className="bi bi-download me-1"></i>Export CSV</button></div>}
        </div>
      </div></div>

      {loading ? <div className="text-center py-5"><div className="spinner-border"></div></div> : data ? (
        <>
          <div className="row g-3 mb-3">
            <div className="col-md-4"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Revenue</small><h4>{formatCurrency(data.revenue)}</h4></div></div></div>
            <div className="col-md-4"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Orders</small><h4>{data.orderCount}</h4></div></div></div>
            <div className="col-md-4"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Avg Order</small><h4>{data.orderCount ? formatCurrency(data.revenue / data.orderCount) : "-"}</h4></div></div></div>
          </div>
          <div className="row g-3">
            <div className="col-md-6"><div className="card shadow-sm border-0 rounded-4"><div className="card-header bg-white fw-bold">Top Customers</div><div className="card-body p-0"><div className="table-responsive"><table className="table table-sm mb-0"><thead className="table-light"><tr><th>Customer</th><th>Orders</th><th>Total</th></tr></thead><tbody>{data.topCustomers?.length ? data.topCustomers.map((tc: any) => (<tr key={tc.customerId}><td>{tc.customer?.name || tc.customerId}</td><td>{tc._count._all}</td><td>{formatCurrency(tc._sum.total || 0)}</td></tr>)) : <tr><td colSpan={3} className="text-center text-muted py-3">No data</td></tr>}</tbody></table></div></div></div></div>
            <div className="col-md-6"><div className="card shadow-sm border-0 rounded-4"><div className="card-header bg-white fw-bold">Popular Services</div><div className="card-body p-0"><div className="table-responsive"><table className="table table-sm mb-0"><thead className="table-light"><tr><th>Service</th><th>Orders</th><th>Revenue</th></tr></thead><tbody>{data.popularServices?.length ? data.popularServices.map((ps: any) => (<tr key={ps.serviceId}><td>{ps.service?.name || ps.serviceId}</td><td>{ps._count._all}</td><td>{formatCurrency(ps._sum.total || 0)}</td></tr>)) : <tr><td colSpan={3} className="text-center text-muted py-3">No data</td></tr>}</tbody></table></div></div></div></div>
          </div>
        </>
      ) : <div className="text-muted text-center py-5">No data</div>}
    </div>
  );
}
