import { db } from "@/lib/db";
import CustomerList from "./CustomerList";
export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q = sp.q || ""; const page = parseInt(sp.page || "1"); const perPage = 10;
  const where: any = { deletedAt: null };
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }];
  const [items, total] = await Promise.all([
    db.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    db.customer.count({ where }),
  ]);
  return (<div><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Customers</h4><a href="/customers/new" className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"></i>New Customer</a></div><CustomerList items={items} total={total} perPage={perPage} /></div>);
}
