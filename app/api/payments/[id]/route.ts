import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET(_:NextRequest,{ params }: { params: Promise<{ id: string }> }){
  const { id: idStr } = await params;
  const item=await db.payment.findUnique({ where:{id:parseInt(idStr)}, include:{ order:{ include:{customer:true, service:true} } }});
  if(!item) return NextResponse.json({error:"Not found"},{status:404});
  return NextResponse.json(item);
}
