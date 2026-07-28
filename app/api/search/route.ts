import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const q=searchParams.get("q")||"";
  if(!q) return NextResponse.json({ results:[] });
  const orders=await db.order.findMany({
    where:{ deletedAt:null, OR:[{ invoiceNumber:{contains:q} }, { customer:{ name:{contains:q} } }, { customer:{ phone:{contains:q} } }] },
    include:{ customer:true, service:true },
    take:10,
    orderBy:{ createdAt:"desc" },
  });
  return NextResponse.json({ results:orders });
}
