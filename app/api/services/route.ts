import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";
import { serviceSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page")||"1");
  const perPage=10;
  const where:any={ deletedAt:null };
  if(q) where.name={ contains: q };
  const [items,total]=await Promise.all([db.service.findMany({where, orderBy:{createdAt:"desc"}, skip:(page-1)*perPage, take:perPage}), db.service.count({where})]);
  return NextResponse.json({ items, total, page, perPage });
}
export async function POST(req: NextRequest){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await req.json();
    const parsed=serviceSchema.safeParse(body);
    if(!parsed.success) return NextResponse.json({error:parsed.error.errors[0].message},{status:400});
    const item=await db.service.create({ data: parsed.data as any });
    await logTransaction("CREATE","services",item.id,`Created service ${item.name}`,session.id);
    return NextResponse.json(item);
  }catch(e:any){ return NextResponse.json({error:e.message||"Failed"},{status:500}); }
}
