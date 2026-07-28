import * as bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "laundry-super-secret-key-change-in-prod-2025");
const COOKIE_NAME = "laundry_session";

export type SessionUser = { id: number; username: string; name: string; role: string };

export async function hashPassword(pw: string) { return bcrypt.hash(pw, 10); }
export async function verifyPassword(pw: string, hash: string) { return bcrypt.compare(pw, hash); }

export async function createToken(user: SessionUser) {
  return new SignJWT({ ...user }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(JWT_SECRET);
}
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload as unknown as SessionUser; } catch { return null; }
}
export async function getSession(): Promise<SessionUser | null> {
  const c = (await cookies()).get(COOKIE_NAME)?.value;
  if (!c) return null;
  return verifyToken(c);
}
export async function setSessionCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/" });
}
export async function clearSessionCookie() {
  (await cookies()).delete(COOKIE_NAME);
}
export async function requireAuth() {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}
export async function requireAdmin() {
  const s = await requireAuth();
  if (s.role !== "ADMIN") throw new Error("FORBIDDEN");
  return s;
}

export async function logTransaction(action: string, entity: string, entityId: number | null, description: string, userId?: number) {
  try { await db.transactionLog.create({ data: { action, entity, entityId, description, userId }}); } catch {}
}
