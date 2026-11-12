"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/components/portal";
import { endSession, startSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { safeEqual, verifyPassword } from "@/lib/passwords";
import { t } from "@/messages";

// Keeps a failed login as slow as a real password check.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(64)}`;

export async function login(_: ActionState, formData: FormData): Promise<ActionState> {
  const user = String(formData.get("user") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const failed = { error: t.portal.login.failed };
  if (!user || !password) return failed;

  if (user === "admin") {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || !safeEqual(password, adminPassword)) return failed;
    await startSession({ role: "admin" });
    redirect("/admin");
  }

  const db = await getDb();
  const [row] = await db.query<{ id: string; password_hash: string }>(
    `select u.id, u.password_hash from clinic_users u
     join clinics c on c.id = u.clinic_id
     where u.email = $1 and u.active and c.contract_status = 'active'`,
    [user],
  );
  const valid = await verifyPassword(password, row?.password_hash ?? DUMMY_HASH);
  if (!row || !valid) return failed;
  await startSession({ role: "clinic", userId: row.id });
  redirect("/rendelo");
}

export async function logout() {
  await endSession();
  redirect("/belepes");
}
