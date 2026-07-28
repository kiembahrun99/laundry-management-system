"use client";
import SearchInput from "@/components/SearchInput";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import EmptyState from "@/components/EmptyState";

export default function OrderList({ items, total, perPage }: { items: any[]; total: number; perPage: number }) {
  const params=useSearchParams(); const router=useRouter();
  const status=params.get("status")||"";
  function setStatus(v:string){
    const sp=new URLSearchParams(params.toString());
    if(v) sp.set("status",v); else sp.delete("status");
    sp.set("page","1");
    router.push("?"+sp.toString());
  }
  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body">
      <div className="row g-2 mb-3"><div className="col-md-4"><SearchInput placeholder="Search invoice, customer, phone..." /></div>
        <div className="col-md-3"><select className="form-select" value={status} onChange={e=>setStatus(e.target.value)}><option value="">All Status</option><option>RECEIVED</option><option>WASHING</option><option>DRYING</option><option>IRONING</option><option>FINISHED</option><option>PICKED_UP</option><option>CANCELLED</option></select></div></div>
      {items.length===0?<EmptyState message="No orders"/>:(
        <>
          <div className="table-responsive"><table className="table table-hover"><thead className="table-light"><tr><th>Invoice</th><th>Customer</th><th>Service</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>{items.map((o:any)=>(<tr key={o.id}><td><a href={`/orders/${o.id}`}>{o.invoiceNumber}</a></td><td>{o.customer.name}</td><td>{o.service.name}</td><td>{formatCurrency(o.total)}</td><td><span className="badge bg-secondary">{o.orderStatus}</span></td><td><a href={`/orders/${o.id}`} className="btn btn-sm btn-outline-primary"><i className="bi bi-eye"></i></a></td></tr>))}</tbody></table></div>
          <Pagination total={total} perPage={perPage}/>
        </>
      )}
    </div></div>
  );
}
