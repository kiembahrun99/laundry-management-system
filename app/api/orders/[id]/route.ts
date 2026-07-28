import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";

export async function GET(_:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const { id: idStr } = await params; const id=parseInt(idStr);
  const order=await db.order.findUnique({ where:{id}, include:{ customer:true, service:true, payments:true, orderLogs:{ include:{ createdBy:true }, orderBy:{createdAt:"desc"} }, createdBy:true }});
  if(!order||order.deletedAt) return NextResponse.json({error:"Not found"},{status:404});
  return NextResponse.json(order);
}
export async function PUT(req:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const { id: idStr } = await params; const id=parseInt(idStr);
  try{
    const body=await req.json();
    const { weight, discount, notes, orderStatus, paymentStatus } = body;
    const data:any={};
    if(weight!=null) data.weight=parseFloat(weight);
    if(discount!=null) data.discount=parseFloat(discount);
    if(notes!==undefined) data.notes=notes||null;
    if(orderStatus) data.orderStatus=orderStatus;
    if(paymentStatus) data.paymentStatus=paymentStatus;

    const existing=await db.order.findUnique({where:{id}, include:{service:true}});
    if(!existing) return NextResponse.json({error:"Not found"},{status:404});
    if(data.weight!=null || data.discount!=null){
      const w=data.weight ?? existing.weight;
      const price=existing.service.pricePerKg * w;
      const disc=data.discount ?? existing.discount;
      data.price=price; data.total=price-disc;
    }

    const updated=await db.order.update({ where:{id}, data });
    if(orderStatus && orderStatus!==existing.orderStatus){
      await db.orderLog.create({ data:{ orderId:id, status:orderStatus, description:`Status changed from ${existing.orderStatus} to ${orderStatus}`, createdById:session.id }});
    }
    await logTransaction("UPDATE","orders",id,`Updated order ${existing.invoiceNumber}`,session.id);
    return NextResponse.json(updated);
  }catch(e:any){ return NextResponse.json({error:e.message||"Failed"},{status:500}); }
}
export async function DELETE(req:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const { id: idStr } = await params; const id=parseInt(idStr);
  const order=await db.order.findUnique({where:{id}});
  if(!order) return NextResponse.json({error:"Not found"},{status:404});
  await db.order.update({ where:{id}, data:{ deletedAt:new Date() }});
  await logTransaction("DELETE","orders",id,`Soft deleted order ${order.invoiceNumber}`,session.id);
  return NextResponse.json({ok:true});
}
