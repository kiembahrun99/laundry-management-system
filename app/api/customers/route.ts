import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";
import { customerSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 10;
  const where: any = { deletedAt: null };
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }, { address: { contains: q } }];
  const [items, total] = await Promise.all([
    db.customer.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page-1)*perPage, take: perPage }),
    db.customer.count({ where }),
  ]);
  return NextResponse.json({ items, total, page, perPage });
}
export async function POST(req: NextRequest) {
  const session = await getSession(); if(!session) return NextResponse.json({ error:"Unauthorized" },{status:401});
  try {
    const body = await req.json();
    const parsed = customerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    const existing = await db.customer.findUnique({ where: { phone: parsed.data.phone } });
    if (existing && !existing.deletedAt) return NextResponse.json({ error: "Phone number already exists" }, { status: 400 });
    const item = existing?.deletedAt ? await db.customer.update({ where:{id:existing.id}, data:{...parsed.data, deletedAt:null}}) : await db.customer.create({ data: parsed.data });
    await logTransaction("CREATE","customers",item.id,`Created customer ${item.name}`,session.id);
    return NextResponse.json(item);
  } catch(e:any){ return NextResponse.json({ error: e.message||"Failed" },{status:500}); }
}
