import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";
import { generateInvoiceNumber } from "@/lib/utils";

export async function GET(req: NextRequest){
  const {searchParams}=new URL(req.url);
  const q=searchParams.get("q")||"";
  const page=parseInt(searchParams.get("page")||"1");
  const status=searchParams.get("status")||"";
  const perPage=10;
  const where:any={ deletedAt:null };
  if(status) where.orderStatus=status;
  if(q) where.OR=[{ invoiceNumber:{contains:q} }, { customer:{ name:{contains:q} } }, { customer:{ phone:{contains:q} } }];
  const [items,total]=await Promise.all([
    db.order.findMany({ where, include:{customer:true, service:true}, orderBy:{createdAt:"desc"}, skip:(page-1)*perPage, take:perPage }),
    db.order.count({where}),
  ]);
  return NextResponse.json({ items,total,page,perPage });
}
export async function POST(req: NextRequest){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await req.json();
    const parsed=orderSchema.safeParse(body);
    if(!parsed.success) return NextResponse.json({error:parsed.error.errors[0].message},{status:400});
    const service=await db.service.findUnique({where:{id:parsed.data.serviceId}});
    if(!service||service.deletedAt) return NextResponse.json({error:"Service not found"},{status:400});
    const customer=await db.customer.findUnique({where:{id:parsed.data.customerId}});
    if(!customer||customer.deletedAt) return NextResponse.json({error:"Customer not found"},{status:400});

    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow=new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const todayCount=await db.order.count({ where:{ createdAt:{ gte:today, lt:tomorrow } }});
    const invoice=generateInvoiceNumber(new Date(), todayCount+1);

    const weight=parsed.data.weight;
    const price=service.pricePerKg * weight;
    const discount=parsed.data.discount||0;
    const total=price-discount;

    const order=await db.order.create({ data:{
      invoiceNumber:invoice,
      customerId:parsed.data.customerId,
      serviceId:parsed.data.serviceId,
      weight, price, discount, total,
      createdById:session.id,
      notes:parsed.data.notes||null,
    }});
    await db.orderLog.create({ data:{ orderId:order.id, status:"RECEIVED", description:"Order created", createdById:session.id }});
    await logTransaction("CREATE","orders",order.id,`Created order ${invoice}`,session.id);
    return NextResponse.json(order);
  }catch(e:any){ return NextResponse.json({error:e.message||"Failed"},{status:500}); }
}
