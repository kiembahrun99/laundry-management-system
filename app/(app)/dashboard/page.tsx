import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);

  const [todayOrders, processing, finished, waiting, recentOrders, todayPayments, recentPayments] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: today, lt: tomorrow }, deletedAt: null } }),
    db.order.count({ where: { orderStatus: { in: ["WASHING","DRYING","IRONING"] }, deletedAt: null } }),
    db.order.count({ where: { orderStatus: "FINISHED", deletedAt: null } }),
    db.order.count({ where: { orderStatus: "FINISHED", deletedAt: null } }),
    db.order.findMany({ where: { deletedAt: null }, include: { customer: true, service: true }, orderBy: { createdAt: "desc" }, take: 5 }),
    db.payment.aggregate({ where: { createdAt: { gte: today, lt: tomorrow } }, _sum: { amount: true } }),
    db.payment.findMany({ include: { order: { include: { customer: true } } }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const revenue = todayPayments._sum.amount || 0;

  return (
    <div>
      <h4 className="fw-bold mb-4">Dashboard</h4>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Today&apos;s Revenue</small><h4 className="fw-bold">{formatCurrency(revenue)}</h4></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Today&apos;s Orders</small><h4 className="fw-bold">{todayOrders}</h4></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Processing</small><h4 className="fw-bold">{processing}</h4></div></div></div>
        <div className="col-md-3"><div className="card shadow-sm border-0 rounded-4"><div className="card-body"><small className="text-muted">Finished</small><h4 className="fw-bold">{finished}</h4></div></div></div>
      </div>
      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white fw-bold">Recent Orders</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light"><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {recentOrders.length ? recentOrders.map(o => (
                      <tr key={o.id}><td><a href={`/orders/${o.id}`}>{o.invoiceNumber}</a></td><td>{o.customer.name}</td><td>{formatCurrency(o.total)}</td><td><span className="badge bg-secondary">{o.orderStatus}</span></td></tr>
                    )) : <tr><td colSpan={4} className="text-center text-muted py-4">No orders yet</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-header bg-white fw-bold">Recent Payments</div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm mb-0">
                  <thead className="table-light"><tr><th>Invoice</th><th>Amount</th><th>Method</th></tr></thead>
                  <tbody>
                    {recentPayments.length ? recentPayments.map(p => (
                      <tr key={p.id}><td>{p.order.invoiceNumber}</td><td>{formatCurrency(p.amount)}</td><td>{p.method}</td></tr>
                    )) : <tr><td colSpan={3} className="text-center text-muted py-4">No payments</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
