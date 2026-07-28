import { db } from "@/lib/db";
import ServiceList from "./ServiceList";
export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const sp = await searchParams;
  const q=sp.q||""; const page=parseInt(sp.page||"1"); const perPage=10;
  const where:any={ deletedAt:null }; if(q) where.name={contains:q};
  const [items,total]=await Promise.all([db.service.findMany({where,orderBy:{createdAt:"desc"},skip:(page-1)*perPage,take:perPage}), db.service.count({where})]);
  return <div><div className="d-flex justify-content-between align-items-center mb-3"><h4 className="fw-bold mb-0">Services</h4><a href="/services/new" className="btn btn-primary btn-sm"><i className="bi bi-plus-lg me-1"></i>New Service</a></div><ServiceList items={items} total={total} perPage={perPage}/></div>;
}
