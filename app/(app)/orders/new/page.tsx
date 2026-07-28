import { db } from "@/lib/db";
import OrderForm from "../OrderForm";
export default async function NewOrderPage(){
  const [customers,services]=await Promise.all([db.customer.findMany({where:{deletedAt:null}, orderBy:{name:"asc"}}), db.service.findMany({where:{deletedAt:null,isActive:true}})]);
  return <div><h4 className="fw-bold mb-3">New Order</h4><OrderForm customers={customers} services={services}/></div>;
}
