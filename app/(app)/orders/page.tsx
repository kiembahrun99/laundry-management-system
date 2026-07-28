import { db } from "@/lib/db";
import OrderList from "./OrderList";
export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string; status?: string }> }){
  const sp = await searchParams;
  const q=sp.q||""; const page=parseInt(sp.page||"1"); const status=sp.status||""; const perPage=10;
  const where:any={ deletedAt:null };
  if(status) where.orderStatus=status;
  if(q) where.OR=[{ invoiceNumber:{contains:q} }, { customer:{ name:{contains:q} } }, { customer:{ phone:{contains:q} } }];
  const [items,total]=await Promise.all([db.order.findMany({where, include:{customer:true,service:true}, orderBy:{createdAt:"desc"}, skip:(page-1)*perPage, take:perPage}), db.order.count({where})]);
  return <div><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Orders</h4><a href="/orders/new" className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"></i>New Order</a></div><OrderList items={items} total={total} perPage={perPage}/></div>;
}
