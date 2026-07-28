import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatCurrency, formatDateTime, ORDER_STATUS_LABEL } from "@/lib/utils";
import OrderDetailActions from "./OrderDetailActions";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const order = await db.order.findUnique({ where: { id }, include: { customer: true, service: true, payments: { orderBy: { createdAt: "desc" } }, orderLogs: { include: { createdBy: true }, orderBy: { createdAt: "desc" } }, createdBy: true } });
  if (!order || order.deletedAt) notFound();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">{order.invoiceNumber}</h4>
        <div className="d-flex gap-2">
          <a href={`/orders/${order.id}/print`} target="_blank" className="btn btn-outline-secondary btn-sm"><i className="bi bi-printer me-1"></i>Print</a>
          <a href="/orders" className="btn btn-light btn-sm">Back</a>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 mb-3"><div className="card-body">
            <div className="row">
              <div className="col-md-6"><p className="mb-1"><strong>Customer:</strong> {order.customer.name} ({order.customer.phone})</p><p className="mb-1"><strong>Service:</strong> {order.service.name}</p><p className="mb-1"><strong>Weight:</strong> {order.weight} kg</p><p className="mb-1"><strong>Price:</strong> {formatCurrency(order.price)}</p><p className="mb-1"><strong>Discount:</strong> {formatCurrency(order.discount)}</p><h5 className="mt-2"><strong>Total: {formatCurrency(order.total)}</strong></h5></div>
              <div className="col-md-6"><p className="mb-1"><strong>Status:</strong> <span className="badge bg-primary">{order.orderStatus}</span></p><p className="mb-1"><strong>Payment:</strong> <span className="badge bg-secondary">{order.paymentStatus}</span></p><p className="mb-1"><strong>Created:</strong> {formatDateTime(order.createdAt)}</p><p className="mb-1"><strong>By:</strong> {order.createdBy.name}</p>{order.notes && <p className="mb-1"><strong>Notes:</strong> {order.notes}</p>}</div>
            </div>
          </div></div>
          <div className="card shadow-sm border-0 rounded-4 mb-3"><div className="card-header bg-white fw-bold">Timeline</div><div className="card-body">
            {order.orderLogs.length === 0 ? <p className="text-muted">No history</p> : (
              <div className="d-flex flex-column gap-2">
                {order.orderLogs.map(log => (
                  <div key={log.id} className="d-flex gap-3 border-start border-2 ps-3 py-2" style={{ borderColor: "#dee2e6" }}>
                    <div><span className="badge bg-primary">{ORDER_STATUS_LABEL[log.status] || log.status}</span><br /><small className="text-muted">{formatDateTime(log.createdAt)} by {log.createdBy?.name || "System"}</small><div className="small">{log.description}</div></div>
                  </div>
                ))}
              </div>
            )}
          </div></div>
          <div className="card shadow-sm border-0 rounded-4"><div className="card-header bg-white fw-bold">Payments</div><div className="card-body p-0"><div className="table-responsive"><table className="table mb-0"><thead className="table-light"><tr><th>Amount</th><th>Method</th><th>Date</th></tr></thead><tbody>{order.payments.length ? order.payments.map(p => (<tr key={p.id}><td>{formatCurrency(p.amount)}</td><td>{p.method}</td><td>{formatDateTime(p.createdAt)}</td></tr>)) : <tr><td colSpan={3} className="text-center text-muted py-3">No payments</td></tr>}</tbody></table></div></div></div>
        </div>
        <div className="col-lg-4"><OrderDetailActions order={order} /></div>
      </div>
    </div>
  );
}
