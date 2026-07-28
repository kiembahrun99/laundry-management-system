"use client";
import { useState } from "react";
export default function ServiceForm({ service }: { service?: any }) {
  const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setError(""); setLoading(true);
    const fd=new FormData(e.currentTarget);
    const payload={ name:fd.get("name"), pricePerKg:parseFloat(fd.get("pricePerKg") as string), estimatedDays:parseInt(fd.get("estimatedDays") as string), description:fd.get("description")||null, isActive:fd.get("isActive")==="true" };
    try{
      const url=service?`/api/services/${service.id}`:"/api/services";
      const res=await fetch(url,{method:service?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json(); if(!res.ok) throw new Error(data.error||"Failed");
      window.location.href="/services";
    }catch(err:any){ setError(err.message);} finally{ setLoading(false); }
  }
  return (
    <div className="card shadow-sm border-0 rounded-4"><div className="card-body p-4">
      {error&&<div className="alert alert-danger py-2">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3"><label className="form-label">Service Name *</label><input name="name" className="form-control" required defaultValue={service?.name} /></div>
        <div className="mb-3"><label className="form-label">Price Per Kg *</label><input name="pricePerKg" type="number" step="100" className="form-control" required defaultValue={service?.pricePerKg} /></div>
        <div className="mb-3"><label className="form-label">Estimated Days *</label><input name="estimatedDays" type="number" className="form-control" required defaultValue={service?.estimatedDays||2} /></div>
        <div className="mb-3"><label className="form-label">Description</label><textarea name="description" className="form-control" rows={2} defaultValue={service?.description||""}></textarea></div>
        <div className="mb-3"><label className="form-label">Status</label><select name="isActive" className="form-select" defaultValue={String(service?.isActive??true)}><option value="true">Active</option><option value="false">Inactive</option></select></div>
        <button type="submit" disabled={loading} className="btn btn-primary">{loading?<><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>:"Save"}</button>
        <a href="/services" className="btn btn-light ms-2">Cancel</a>
      </form>
    </div></div>
  );
}
