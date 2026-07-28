"use client";
import { useState } from "react";
export default function OrderForm({ customers, services }: { customers:any[]; services:any[] }) {
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  const [selectedService,setSelectedService]=useState<any>(services[0]||null);
  const [weight,setWeight]=useState(1);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setError(""); setLoading(true);
    const fd=new FormData(e.currentTarget);
    const payload={ customerId:parseInt(fd.get("customerId") as string), serviceId:parseInt(fd.get("serviceId") as string), weight:parseFloat(fd.get("weight") as string), discount:parseFloat(fd.get("discount") as string)||0, notes:fd.get("notes")||null };
    try{
      const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||"Failed");
      window.location.href=`/orders/${data.id}`;
    }catch(err:any){ setError(err.message);} finally{ setLoading(false); }
  }
  const price=selectedService? selectedService.pricePerKg * weight : 0;
  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body p-4">
      {error&&<div className="alert alert-danger py-2">{error}</div>}
      {customers.length===0&&<div className="alert alert-warning">No customers yet. <a href="/customers/new">Create one</a></div>}
      {services.length===0&&<div className="alert alert-warning">No services active</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Customer *</label><select name="customerId" className="form-select" required><option value="">Select customer</option>{customers.map((c:any)=><option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}</select></div>
        <div className="mb-3"><label className="form-label">Service *</label><select name="serviceId" className="form-select" required onChange={e=>{ const s=services.find(x=>x.id===parseInt(e.target.value)); setSelectedService(s||null); }}>{services.map((s:any)=><option key={s.id} value={s.id}>{s.name} - Rp {s.pricePerKg}/kg</option>)}</select></div>
        <div className="row g-3 mb-3"><div className="col-md-4"><label className="form-label">Weight (kg) *</label><input name="weight" type="number" step="0.1" className="form-control" required defaultValue={1} min={0.1} onChange={e=>setWeight(parseFloat(e.target.value)||0)} /></div><div className="col-md-4"><label className="form-label">Discount (Rp)</label><input name="discount" type="number" className="form-control" defaultValue={0} min={0} /></div><div className="col-md-4"><label className="form-label">Estimated Total</label><div className="form-control bg-light fw-bold">Rp {price}</div></div></div>
        <div className="mb-3"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={2}></textarea></div>
        <button type="submit" disabled={loading||customers.length===0} className="btn btn-primary">{loading?<><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>:"Create Order"}</button>
        <a href="/orders" className="btn btn-light ms-2">Cancel</a>
      </form>
    </div></div>
  );
}
