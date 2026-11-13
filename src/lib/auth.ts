import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveAdmin } from "./admin-users";
import { getDb } from "./db";
import { decodeSession, encodeSession, type Session } from "./session";

const COOKIE = "mk_session";
const STAFF_HOURS = 12;
const OWNER_HOURS = 30 * 24;

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET is missing or too short");
  return value;
}

export async function startSession(
  session: { role: "admin"; adminId?: string } | { role: "clinic"; userId: string } | { role: "owner"; ownerId: string },
) {
  const hours = session.role === "owner" ? OWNER_HOURS : STAFF_HOURS;
  const exp = Date.now() + hours * 3600 * 1000;
  const store = await cookies();
  store.set(COOKIE, encodeSession({ ...session, exp }, secret()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: hours * 3600,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  // Date.now() is not allowed while Next.js checks a page in the background.
  return token ? decodeSession(token, secret(), performance.timeOrigin + performance.now()) : null;
}

export type Staff =
  | { role: "admin"; actor: string; adminId: string | null; name: string }
  | { role: "clinic"; actor: string; clinicId: string; clinicName: string; userName: string };

// Checks the database on every request, so a disabled user is out at once.
export async function getStaff(): Promise<Staff | null> {
  const session = await readSession();
  if (session?.role !== "admin" && session?.role !== "clinic") return null;
  if (session.role === "admin") {
    // The shared fallback login has no account behind it.
    if (!session.adminId) return { role: "admin", actor: "admin", adminId: null, name: "admin" };
    const admin = await getActiveAdmin(await getDb(), session.adminId);
    return admin ? { role: "admin", actor: admin.email, adminId: admin.id, name: admin.name } : null;
  }
  const db = await getDb();
  const [user] = await db.query<{ email: string; name: string; clinic_id: string; clinic_name: string }>(
    `select u.email, u.name, u.clinic_id, c.name as clinic_name
     from clinic_users u join clinics c on c.id = u.clinic_id
     where u.id = $1 and u.active and c.contract_status = 'active'`,
    [session.userId],
  );
  if (!user) return null;
  return {
    role: "clinic",
    actor: user.email,
    clinicId: user.clinic_id,
    clinicName: user.clinic_name,
    userName: user.name,
  };
}

export async function requireAdmin() {
  const staff = await getStaff();
  if (staff?.role !== "admin") redirect("/belepes");
  return staff;
}

export async function requireClinic() {
  const staff = await getStaff();
  if (staff?.role !== "clinic") redirect("/belepes");
  return staff;
}

export async function getOwner() {
  const session = await readSession();
  if (session?.role !== "owner") return null;
  const db = await getDb();
  const [owner] = await db.query<{ id: string; full_name: string }>(
    "select id, full_name from owners where id = $1",
    [session.ownerId],
  );
  return owner ?? null;
}

export async function requireOwner() {
  const owner = await getOwner();
  if (!owner) redirect("/gazdi/belepes");
  return owner;
}
