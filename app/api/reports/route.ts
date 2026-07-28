import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const from=searchParams.get("from");
  const to=searchParams.get("to");
  const range=searchParams.get("range")||"daily"; // daily|weekly|monthly|custom

  let start=new Date();
  let end=new Date();
  end.setHours(23,59,59,999);

  if(from && to){ start=new Date(from); end=new Date(to); end.setHours(23,59,59,999); }
  else if(range==="daily"){ start.setHours(0,0,0,0); }
  else if(range==="weekly"){ start.setDate(start.getDate()-7); start.setHours(0,0,0,0); }
  else if(range==="monthly"){ start.setDate(1); start.setHours(0,0,0,0); }

  const where={ createdAt:{ gte:start, lte:end }, deletedAt:null } as any;

  const [revenue, orders, topCustomers, popularServices] = await Promise.all([
    db.order.aggregate({ where, _sum:{ total:true }, _count:true }),
    db.order.findMany({ where, include:{ customer:true, service:true }, orderBy:{createdAt:"desc"} }),
    db.order.groupBy({ by:["customerId"], where, _sum:{ total:true }, _count:{_all:true}, orderBy:{ _sum:{ total:"desc" } }, take:5 }),
    db.order.groupBy({ by:["serviceId"], where, _sum:{ total:true }, _count:{_all:true}, orderBy:{ _sum:{ total:"desc" } }, take:5 }),
  ]);

  const customerIds=topCustomers.map(c=>c.customerId);
  const serviceIds=popularServices.map(s=>s.serviceId);
  const [customers, services] = await Promise.all([
    customerIds.length? db.customer.findMany({ where:{ id:{ in:customerIds } } }):[],
    serviceIds.length? db.service.findMany({ where:{ id:{ in:serviceIds } } }):[],
  ]);
  const cmap=Object.fromEntries(customers.map(c=>[c.id,c]));
  const smap=Object.fromEntries(services.map(s=>[s.id,s]));

  return NextResponse.json({
    from:start, to:end,
    revenue: revenue._sum.total||0,
    orderCount: revenue._count,
    orders,
    topCustomers: topCustomers.map(tc=>({ ...tc, customer: cmap[tc.customerId] })),
    popularServices: popularServices.map(ps=>({ ...ps, service: smap[ps.serviceId] })),
  });
}
