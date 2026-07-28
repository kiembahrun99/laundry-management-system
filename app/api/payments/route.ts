import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession, logTransaction } from "@/lib/auth";
import { paymentSchema } from "@/lib/validations";

export async function GET(req:NextRequest){
  const {searchParams}=new URL(req.url);
  const q=searchParams.get("q")||"";
  const page=parseInt(searchParams.get("page")||"1");
  const perPage=10;
  const where:any={};
  if(q) where.OR=[{ order:{ invoiceNumber:{contains:q} } }, { order:{ customer:{ name:{contains:q} } } }];
  const [items,total]=await Promise.all([
    db.payment.findMany({ where, include:{ order:{ include:{customer:true} } }, orderBy:{createdAt:"desc"}, skip:(page-1)*perPage, take:perPage }),
    db.payment.count({where}),
  ]);
  return NextResponse.json({items,total,page,perPage});
}
export async function POST(req:NextRequest){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await req.json();
    const parsed=paymentSchema.safeParse(body);
    if(!parsed.success) return NextResponse.json({error:parsed.error.errors[0].message},{status:400});
    const order=await db.order.findUnique({ where:{id:parsed.data.orderId} });
    if(!order||order.deletedAt) return NextResponse.json({error:"Order not found"},{status:400});

    const payment=await db.payment.create({ data:{ orderId:parsed.data.orderId, amount:parsed.data.amount, method:parsed.data.method, notes:parsed.data.notes||null, paidById:session.id }});

    // update order payment status based on total paid
    const totalPaidAgg=await db.payment.aggregate({ where:{ orderId:parsed.data.orderId }, _sum:{ amount:true } });
    const totalPaid=totalPaidAgg._sum.amount||0;
    let newStatus: any = "UNPAID";
    if(totalPaid>=order.total) newStatus="PAID";
    else if(totalPaid>0) newStatus="DP";
    await db.order.update({ where:{id:parsed.data.orderId}, data:{ paymentStatus:newStatus }});

    await logTransaction("CREATE","payments",payment.id,`Payment ${parsed.data.amount} for order ${order.invoiceNumber}`,session.id);
    return NextResponse.json(payment);
  }catch(e:any){ return NextResponse.json({error:e.message||"Failed"},{status:500}); }
}
