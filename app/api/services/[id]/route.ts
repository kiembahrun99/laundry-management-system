import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

export async function GET(_:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const { id: idStr } = await params;
  const item=await db.service.findUnique({where:{id:parseInt(idStr)}});
  if(!item||item.deletedAt) return NextResponse.json({error:"Not found"},{status:404});
  return NextResponse.json(item);
}
export async function PUT(req:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const { id: idStr } = await params; const id=parseInt(idStr);
  try{
    const body=await req.json();
    const parsed=serviceSchema.safeParse(body);
    if(!parsed.success) return NextResponse.json({error:parsed.error.errors[0].message},{status:400});
    const item=await db.service.update({where:{id}, data: parsed.data as any});
    await logTransaction("UPDATE","services",id,`Updated service ${item.name}`,session.id);
    return NextResponse.json(item);
  }catch(e:any){ return NextResponse.json({error:e.message||"Failed"},{status:500}); }
}
export async function DELETE(req:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const { id: idStr } = await params; const id=parseInt(idStr);
  const item=await db.service.update({where:{id}, data:{deletedAt:new Date()}});
  await logTransaction("DELETE","services",id,`Soft deleted service ${item.name}`,session.id);
  return NextResponse.json({ok:true});
}
