"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/components/portal";
import { addAdmin, inviteToken, setAdminActive } from "@/lib/admin-users";
import { requireAdmin } from "@/lib/auth";
import { passwordLinkUrl } from "@/lib/base-url";
import { getDb } from "@/lib/db";
import { sendAdminPasswordLink } from "@/lib/email";
import { t } from "@/messages";

const m = t.portal.admin.team;
const newAdmin = z.object({ name: z.string().trim().min(1).max(120), email: z.email().max(200) });

async function sendInvite(adminId: string): Promise<boolean> {
  const invite = await inviteToken(await getDb(), adminId);
  if (!invite) return false;
  await sendAdminPasswordLink(invite.email, await passwordLinkUrl(invite.token), "invite");
  return true;
}

export async function addTeamMember(_: ActionState, form: FormData): Promise<ActionState> {
  const { actor } = await requireAdmin();
  const parsed = newAdmin.safeParse({
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? "").trim().toLowerCase(),
  });
  if (!parsed.success) return { error: m.invalid };
  const id = await addAdmin(await getDb(), parsed.data, actor);
  if (!id) return { error: m.exists };
  await sendInvite(id);
  revalidatePath("/admin/csapat");
  return { ok: m.added };
}

export async function resendInvite(adminId: string): Promise<ActionState> {
  await requireAdmin();
  return (await sendInvite(adminId)) ? { ok: m.resent } : { error: t.portal.failed };
}

export async function toggleTeamMember(adminId: string, active: boolean): Promise<ActionState> {
  const staff = await requireAdmin();
  if (!active && staff.adminId === adminId) return { error: m.selfDisable };
  await setAdminActive(await getDb(), adminId, active, staff.actor);
  revalidatePath("/admin/csapat");
  return {};
}
