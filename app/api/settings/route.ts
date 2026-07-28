import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(){
  const items=await db.setting.findMany();
  return NextResponse.json(Object.fromEntries(items.map(s=>[s.key,s.value])));
}
export async function POST(req:NextRequest){
  const session=await getSession(); if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const body=await req.json();
    for(const [k,v] of Object.entries(body as Record<string,string>)){
      await db.setting.upsert({ where:{key:k}, update:{value:v as string}, create:{key:k, value:v as string} });
    }
    return NextResponse.json({ok:true});
  }catch(e:any){ return NextResponse.json({error:e.message},{status:500}); }
}
