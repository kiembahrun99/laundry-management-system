import { db } from "@/lib/db";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = sp.q || ""; const page = parseInt(sp.page || "1"); const perPage = 10;
  const where: any = {};
  if (q) where.OR = [{ order: { invoiceNumber: { contains: q } } }, { order: { customer: { name: { contains: q } } } }];
  const [items, total] = await Promise.all([
    db.payment.findMany({ where, include: { order: { include: { customer: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    db.payment.count({ where }),
  ]);
  return (
    <div>
      <h4 className="fw-bold mb-3">Payments</h4>
      <div className="card shadow-sm border-0 rounded-4"><div className="card-body">
        <div className="table-responsive"><table className="table table-hover"><thead className="table-light"><tr><th>Invoice</th><th>Customer</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
          <tbody>{items.length ? items.map((p: any) => (<tr key={p.id}><td>{p.order.invoiceNumber}</td><td>{p.order.customer.name}</td><td>{formatCurrency(p.amount)}</td><td><span className="badge bg-secondary">{p.method}</span></td><td>{formatDateTime(p.createdAt)}</td></tr>)) : <tr><td colSpan={5} className="text-center text-muted py-4">No payments</td></tr>}</tbody>
        </table></div>
        <div className="text-muted small">Total: {total} records</div>
      </div></div>
    </div>
  );
}
