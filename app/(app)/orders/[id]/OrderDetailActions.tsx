"use client";
import { useState } from "react";
const statuses=["RECEIVED","WASHING","DRYING","IRONING","FINISHED","PICKED_UP","CANCELLED"];
export default function OrderDetailActions({ order }: { order: any }) {
  const [loading,setLoading]=useState(false);
  const [showPay,setShowPay]=useState(false);
  const [payAmount,setPayAmount]=useState(order.total);
  const [payMethod,setPayMethod]=useState("CASH");

  async function updateStatus(s: string){
    if(!confirm(`Change status to ${s}?`)) return;
    setLoading(true);
    try{ const res=await fetch(`/api/orders/${order.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderStatus:s})}); if(!res.ok){ const d=await res.json(); throw new Error(d.error);} window.location.reload(); }catch(e:any){ alert(e.message);} finally{ setLoading(false); }
  }
  async function handlePay(e:any){
    e.preventDefault(); setLoading(true);
    try{ const res=await fetch("/api/payments",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:order.id,amount:parseFloat(payAmount),method:payMethod})}); const d=await res.json(); if(!res.ok) throw new Error(d.error); window.location.reload(); }catch(err:any){ alert(err.message);} finally{ setLoading(false); }
  }
  async function handleDelete(){
    if(!confirm("Delete this order?")) return;
    setLoading(true);
    try{ const res=await fetch(`/api/orders/${order.id}`,{method:"DELETE"}); if(!res.ok) throw new Error("Failed"); window.location.href="/orders"; }catch(e:any){ alert(e.message);} setLoading(false);
  }

  return (
    <div>
      <div className="card shadow-sm border-0 rounded-4 mb-3"><div className="card-header bg-white fw-bold">Update Status</div><div className="card-body d-flex flex-wrap gap-2">{statuses.map(s=>(<button key={s} disabled={loading||order.orderStatus===s} onClick={()=>updateStatus(s)} className={`btn btn-sm ${order.orderStatus===s?"btn-primary":"btn-outline-secondary"}`}>{s}</button>))}</div></div>
      <div className="card shadow-sm border-0 rounded-4 mb-3"><div className="card-header bg-white fw-bold d-flex justify-content-between"><span>Payment</span><button className="btn btn-sm btn-primary" onClick={()=>setShowPay(!showPay)}>{showPay?"Cancel":"Add Payment"}</button></div>
        {showPay&&<div className="card-body"><form onSubmit={handlePay}><div className="mb-2"><label className="form-label">Amount</label><input type="number" className="form-control" value={payAmount} onChange={e=>setPayAmount(e.target.value)} required /></div><div className="mb-2"><label className="form-label">Method</label><select className="form-select" value={payMethod} onChange={e=>setPayMethod(e.target.value)}><option>CASH</option><option>TRANSFER</option><option>QRIS</option></select></div><button type="submit" disabled={loading} className="btn btn-primary btn-sm w-100">{loading?<><span className="spinner-border spinner-border-sm me-1"></span>Processing...</>:"Pay"}</button></form></div>}
      </div>
      <div className="card shadow-sm border-0 rounded-4"><div className="card-body"><button className="btn btn-outline-danger btn-sm w-100" disabled={loading} onClick={handleDelete}><i className="bi bi-trash me-1"></i>Delete Order</button></div></div>
    </div>
  );
}
