"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/components/portal";
import { after } from "next/server";
import { z } from "zod";
import { findAdminForLogin, markAdminLogin, resetToken, setPasswordWithToken } from "@/lib/admin-users";
import { endSession, startSession } from "@/lib/auth";
import { passwordLinkUrl } from "@/lib/base-url";
import { sendAdminPasswordLink } from "@/lib/email";
import { getDb } from "@/lib/db";
import { hashPassword, safeEqual, verifyPassword } from "@/lib/passwords";
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
  // An admin's own account. An invited admin without a password yet cannot log in.
  const admin = await findAdminForLogin(db, user);
  if (admin) {
    if (!(await verifyPassword(password, admin.password_hash ?? DUMMY_HASH)) || !admin.password_hash) return failed;
    await markAdminLogin(db, admin.id);
    await startSession({ role: "admin", adminId: admin.id });
    redirect("/admin");
  }
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

// "Forgot password" for admins. The answer is the same whether the address is known or not.
export async function requestPasswordReset(_: ActionState, form: FormData): Promise<ActionState> {
  const f = t.portal.password;
  const email = z.email().safeParse(String(form.get("email") ?? "").trim().toLowerCase());
  if (!email.success) return { error: f.invalidEmail };
  const token = await resetToken(await getDb(), email.data);
  if (token) {
    const url = await passwordLinkUrl(token);
    after(() => sendAdminPasswordLink(email.data, url, "reset"));
  }
  return { ok: f.sent };
}

const MIN_PASSWORD = 10;

// The page behind the emailed link: sets the password and logs the admin in.
export async function setPassword(_: ActionState, form: FormData): Promise<ActionState> {
  const f = t.portal.password;
  const password = String(form.get("password") ?? "");
  if (password.length < MIN_PASSWORD || password.length > 200) return { error: f.tooShort };
  if (password !== String(form.get("again") ?? "")) return { error: f.mismatch };
  const adminId = await setPasswordWithToken(await getDb(), String(form.get("token") ?? ""), await hashPassword(password));
  if (!adminId) return { error: f.badLink };
  await startSession({ role: "admin", adminId });
  redirect("/admin");
}
