import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    const { username, password } = parsed.data;
    const user = await db.user.findUnique({ where: { username } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const ok = await verifyPassword(password, user.password);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    const token = await createToken({ id: user.id, username: user.username, name: user.name, role: user.role });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("laundry_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
    return res;
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
