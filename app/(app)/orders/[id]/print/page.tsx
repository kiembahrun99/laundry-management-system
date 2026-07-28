import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function PrintInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  const order = await db.order.findUnique({ where: { id }, include: { customer: true, service: true, payments: true } });
  if (!order || order.deletedAt) notFound();
  const settings = await db.setting.findMany();
  const sm = Object.fromEntries(settings.map(s => [s.key, s.value || ""]));

  return (
    <div style={{ fontFamily: "monospace", padding: 20, maxWidth: 600, margin: "0 auto", background: "white" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 className="fw-bold">{sm.laundry_name || "Laundry Express"}</h2>
        <p className="small">{sm.address}<br />{sm.phone}</p>
        <hr />
        <h5>INVOICE: {order.invoiceNumber}</h5>
      </div>
      <table className="table table-sm">
        <tbody>
          <tr><td>Customer</td><td>: {order.customer.name} - {order.customer.phone}</td></tr>
          <tr><td>Service</td><td>: {order.service.name}</td></tr>
          <tr><td>Weight</td><td>: {order.weight} kg</td></tr>
          <tr><td>Price</td><td>: {formatCurrency(order.price)}</td></tr>
          <tr><td>Discount</td><td>: {formatCurrency(order.discount)}</td></tr>
          <tr><td><strong>Total</strong></td><td><strong>: {formatCurrency(order.total)}</strong></td></tr>
          <tr><td>Status</td><td>: {order.orderStatus} / {order.paymentStatus}</td></tr>
          <tr><td>Date</td><td>: {formatDateTime(order.createdAt)}</td></tr>
        </tbody>
      </table>
      {order.payments.length>0&&<div><h6>Payments</h6><table className="table table-sm"><tbody>{order.payments.map(p=>(<tr key={p.id}><td>{formatCurrency(p.amount)}</td><td>{p.method}</td><td>{formatDateTime(p.createdAt)}</td></tr>))}</tbody></table></div>}
      <hr /><p className="text-center small">{sm.footer}<br />{sm.receipt_note}</p>
      <div className="text-center mt-3">
        <button onClick={() => { if(typeof window!=="undefined") window.print(); }} className="btn btn-primary no-print">Print</button>
        <a href={`/orders/${order.id}`} className="btn btn-light ms-2">Back</a>
      </div>
      <style>{`@media print { .no-print { display:none } }`}</style>
    </div>
  );
}
