import { db } from "@/lib/db";
import CustomerForm from "../../CustomerForm";
import { notFound } from "next/navigation";
export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await db.customer.findUnique({ where: { id: parseInt(id) } });
  if (!customer || customer.deletedAt) notFound();
  return <div><h4 className="fw-bold mb-3">Edit Customer</h4><CustomerForm customer={customer} /></div>;
}
