import { db } from "@/lib/db";
import ServiceForm from "../../ServiceForm";
import { notFound } from "next/navigation";
export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  const service=await db.service.findUnique({ where:{id:parseInt(id)}});
  if(!service||service.deletedAt) notFound();
  return <div><h4 className="fw-bold mb-3">Edit Service</h4><ServiceForm service={service}/></div>;
}
