import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const isForm = req.headers.get("content-type")?.includes("form") || req.headers.get("accept")?.includes("text/html") || req.headers.get("content-type") === null;
  // Always clear cookie
  const redirectUrl = new URL("/login", req.url);
  const res = isForm ? NextResponse.redirect(redirectUrl, { status: 303 }) : NextResponse.json({ ok: true });
  res.cookies.delete("laundry_session");
  return res;
}
export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.delete("laundry_session");
  return res;
}
